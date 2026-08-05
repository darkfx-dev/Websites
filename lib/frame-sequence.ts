import manifest from "@/data/hero-frames.json";

export type FrameVariant = "desktop" | "mobile";

export const frameManifest = manifest;

export function framePath(variant: FrameVariant, index: number): string {
  const pattern = manifest.variants[variant].pattern;
  return pattern.replace("{i}", String(index + 1).padStart(4, "0"));
}

export function frameCount(variant: FrameVariant): number {
  return manifest.variants[variant].count;
}

type LoaderEvents = { onFirstReady: () => void };

/**
 * Loads a frame sequence in coarse-to-fine passes.
 *
 * A scrub sequence is unusable until *something* is decoded, but it does not
 * need every frame to be useful: loading every 8th frame first makes the hero
 * scrubbable after ~15 requests, and the gaps fill in behind the user. Until a
 * given index arrives, `nearest()` returns the closest frame already decoded,
 * so scrubbing degrades in resolution rather than stalling.
 *
 * `createImageBitmap` is preferred where available — decoding off the main
 * thread keeps the scroll frame budget clear.
 */
export class FrameSequence {
  readonly count: number;
  private readonly variant: FrameVariant;
  private readonly frames: (ImageBitmap | HTMLImageElement | undefined)[];
  private readonly requested: boolean[];
  private loadedCount = 0;
  private firstReadyFired = false;
  private aborted = false;

  constructor(variant: FrameVariant, private readonly events: LoaderEvents) {
    this.variant = variant;
    this.count = frameCount(variant);
    this.frames = new Array(this.count).fill(undefined);
    this.requested = new Array(this.count).fill(false);
  }

  get progress(): number {
    return this.count === 0 ? 1 : this.loadedCount / this.count;
  }

  /** Coarse pass first, then progressively denser passes. */
  start(): void {
    const passes = [8, 4, 2, 1];
    let pass = 0;

    const runPass = () => {
      if (this.aborted || pass >= passes.length) return;
      const step = passes[pass];
      pass += 1;

      const jobs: Promise<void>[] = [];
      for (let index = 0; index < this.count; index += step) {
        jobs.push(this.load(index));
      }

      Promise.allSettled(jobs).then(() => {
        if (this.aborted) return;
        // Yield to the browser between passes so decoding never competes
        // with the user's first scroll.
        if ("requestIdleCallback" in window) {
          (window as Window & { requestIdleCallback: (cb: () => void) => void })
            .requestIdleCallback(runPass);
        } else {
          setTimeout(runPass, 120);
        }
      });
    };

    runPass();
  }

  private async load(index: number): Promise<void> {
    if (this.requested[index] || this.aborted) return;
    this.requested[index] = true;

    try {
      const response = await fetch(framePath(this.variant, index), { cache: "force-cache" });
      if (!response.ok) throw new Error(`frame ${index}: ${response.status}`);
      const blob = await response.blob();
      if (this.aborted) return;

      const bitmap =
        typeof createImageBitmap === "function"
          ? await createImageBitmap(blob)
          : await this.decodeViaImage(blob);

      if (this.aborted) {
        if (bitmap instanceof ImageBitmap) bitmap.close();
        return;
      }

      this.frames[index] = bitmap;
      this.loadedCount += 1;

      if (!this.firstReadyFired) {
        this.firstReadyFired = true;
        this.events.onFirstReady();
      }
    } catch {
      // A dropped frame is survivable: `nearest()` falls back to a neighbour.
      this.requested[index] = false;
    }
  }

  private decodeViaImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("decode failed"));
      };
      image.src = url;
    });
  }

  /** The closest decoded frame to `index`, or undefined if none exist yet. */
  nearest(index: number): { frame: ImageBitmap | HTMLImageElement; index: number } | undefined {
    const clamped = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    const direct = this.frames[clamped];
    if (direct) return { frame: direct, index: clamped };

    for (let offset = 1; offset < this.count; offset += 1) {
      const before = this.frames[clamped - offset];
      if (before) return { frame: before, index: clamped - offset };
      const after = this.frames[clamped + offset];
      if (after) return { frame: after, index: clamped + offset };
    }
    return undefined;
  }

  destroy(): void {
    this.aborted = true;
    for (const frame of this.frames) {
      if (frame instanceof ImageBitmap) frame.close();
    }
    this.frames.fill(undefined);
  }
}
