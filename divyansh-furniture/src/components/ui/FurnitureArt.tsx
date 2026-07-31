import { cn } from "@/lib/utils";

export type ArtKind = "sofa" | "bed" | "table" | "wardrobe" | "chair" | "shelf";

/**
 * Line drawings of the pieces, used wherever a photograph has not been
 * supplied yet.
 *
 * Deliberately drawings and not stand-in photos: a stock image of somebody
 * else's sofa presented as this workshop's work would be the one genuinely
 * dishonest thing on the page. Single-stroke catalogue drawings are an
 * ordinary idiom in furniture, so the gallery reads as intentional rather
 * than unfinished — and swapping in a real photograph is one line in
 * `src/data/site.ts`.
 */
export function FurnitureArt({
  kind,
  className,
}: {
  kind: ArtKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 150"
      className={cn("h-full w-full", className)}
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="var(--brass)"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SHAPES[kind]}
      </g>
    </svg>
  );
}

const SHAPES: Record<ArtKind, React.ReactNode> = {
  sofa: (
    <>
      <path d="M40 96V70a8 8 0 0 1 8-8h104a8 8 0 0 1 8 8v26" />
      <path d="M32 96a8 8 0 0 1 8-8h120a8 8 0 0 1 8 8v14H32z" />
      <path d="M40 88V74m40 14V74m40 14V74m40 14V74" strokeOpacity="0.3" />
      <path d="M44 110v12m112-12v12" />
      <path d="M32 96h136" strokeOpacity="0.3" />
    </>
  ),
  bed: (
    <>
      <path d="M34 108V56a6 6 0 0 1 6-6h30a6 6 0 0 1 6 6v52" />
      <path d="M34 88h132a6 6 0 0 1 6 6v14H34z" />
      <path d="M76 88V80a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v8" strokeOpacity="0.4" />
      <path d="M38 108v14m128-14v14" />
      <path d="M34 96h138" strokeOpacity="0.3" />
    </>
  ),
  table: (
    <>
      <path d="M24 62h152" />
      <path d="M24 62v6h152v-6" />
      <path d="M40 68v50m120-50v50" />
      <path d="M40 108h120" strokeOpacity="0.35" />
      <path d="M60 68v6h80v-6" strokeOpacity="0.3" />
    </>
  ),
  wardrobe: (
    <>
      <path d="M46 22h108v100H46z" />
      <path d="M100 22v100" />
      <path d="M92 68h4m8 0h4" strokeWidth="2" />
      <path d="M46 52h108M46 92h108" strokeOpacity="0.28" />
      <path d="M52 122v8m96-8v8" />
    </>
  ),
  chair: (
    <>
      <path d="M64 88V36a8 8 0 0 1 8-8h44a8 8 0 0 1 8 8v52" />
      <path d="M72 44h44m-44 12h44m-44 12h44" strokeOpacity="0.3" />
      <path d="M56 88h72a6 6 0 0 1 6 6v8H50v-8a6 6 0 0 1 6-6z" />
      <path d="M58 102l-6 26m74-26l6 26" />
      <path d="M124 88v-8" strokeOpacity="0.3" />
    </>
  ),
  shelf: (
    <>
      <path d="M40 20h120v110H40z" />
      <path d="M40 56h120M40 92h120" />
      <path d="M100 20v36M76 56v36M124 92v38" strokeOpacity="0.4" />
      <path d="M52 34h14m50 42h14" strokeOpacity="0.3" strokeWidth="2" />
    </>
  ),
};
