import { Item, Stagger } from "../components/Reveal";
import { NeonButton } from "../components/NeonButton";

export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="page">
        {/* The copy owns a left column the Core never crosses — the camera
            aims left of the origin on wide screens precisely so this space
            stays clear. Below that breakpoint the layout stacks and the
            scrim behind this block carries the contrast instead. */}
        <Stagger className="hero__copy">
          <Item as="p" className="readout hero__eyebrow">
            Spatial audio · VST3 / AU / AAX
          </Item>

          <Item>
            <h1 id="hero-title">
              Sound with a position,
              <br />
              not just a pan.
            </h1>
          </Item>

          <Item as="p" className="lede hero__lede">
            Orbital Audio renders a source at a bearing, an elevation and a
            distance, then decodes it for headphones or for the speakers you
            actually have — inside the session you are already working in.
          </Item>

          <Item className="hero__actions">
            <NeonButton href="#cta" variant="primary" size="lg">
              Start free trial
            </NeonButton>
            {/* Goes to the section where the demo will live, rather than
                opening a video that has not been made. */}
            <NeonButton href="#workflow" variant="secondary" size="lg">
              Watch demo
            </NeonButton>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
