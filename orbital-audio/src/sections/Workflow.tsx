import { Item, Stagger } from "../components/Reveal";

/**
 * The one place on the page that is numbered.
 *
 * These are steps in an order that matters — you cannot check a decode you
 * have not made, or decode a source you have not placed — so the numbering
 * carries information rather than decoration. They are labelled as channels
 * because that is what a producer would call them.
 */
const STEPS = [
  {
    n: "01",
    title: "Place",
    body: "Drop Orbital on a track and put the source where it belongs: a bearing around the listener, an elevation above or below them, and a distance.",
  },
  {
    n: "02",
    title: "Decode",
    body: "Orbital renders that position for the format you are working in — binaural for headphones, ambisonic for whatever speaker layout you described.",
  },
  {
    n: "03",
    title: "Check",
    body: "Switch between the two without re-rendering, so you can hear what a headphone listener gets and what the room gets before you commit.",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="section" aria-labelledby="workflow-title">
      <div className="page">
        <Stagger className="section__head">
          <Item as="p" className="readout">
            How it works
          </Item>
          <Item>
            <h2 id="workflow-title">Place, decode, check</h2>
          </Item>
          <Item as="p" className="lede">
            Three steps, in the order they have to happen. Behind this section
            the field organises itself into the decode ring.
          </Item>
        </Stagger>

        <Stagger as="ol" className="steps">
          {STEPS.map((step) => (
            <Item as="li" key={step.n} className="step">
              <p className="readout step__n">
                <span aria-hidden="true">CH </span>
                {step.n}
              </p>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </Item>
          ))}
        </Stagger>

        {/* Where "Watch demo" lands. Marked rather than mocked up: a fake
            still frame presented as a product recording would be exactly the
            invented evidence this build is not allowed to produce. */}
        <Stagger className="demo">
          <Item className="demo__slot">
            <p className="readout">[Placeholder]</p>
            <p className="demo__title">Demo recording</p>
            <p className="demo__body">
              A screen capture of the plugin in a session goes here. It has not
              been produced, so nothing stands in for it.
            </p>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
