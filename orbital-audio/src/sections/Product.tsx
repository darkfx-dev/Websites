import { Item, Stagger } from "../components/Reveal";

const FEATURES = [
  {
    label: "Binaural",
    title: "Rendered for headphones",
    body: "A head-related transfer function places a source at a bearing and a distance, so it is heard behind or above the listener rather than just quieter on one side.",
  },
  {
    label: "Ambisonics",
    title: "Decoded for your room",
    body: "First- and third-order B-format in, your layout out. Set a stereo pair, a quad rig or 7.1.4 and the decode follows the layout you describe.",
  },
  {
    label: "Integration",
    title: "Runs where you work",
    body: "VST3, AU and AAX. Azimuth, elevation and distance are automation lanes, so a move is something you write into the arrangement rather than print.",
  },
  {
    label: "Monitoring",
    title: "Audible in the same pass",
    body: "The renderer runs on the audio thread at your existing buffer size, so there is no second engine to bounce through before a change can be heard.",
    note: "Round-trip latency: [PLACEHOLDER] — not yet measured on reference hardware.",
  },
];

export function Product() {
  return (
    <section id="product" className="section" aria-labelledby="product-title">
      <div className="page">
        <Stagger className="section__head">
          <Item as="p" className="readout">
            Product
          </Item>
          <Item>
            <h2 id="product-title">Position is a parameter</h2>
          </Item>
          <Item as="p" className="lede">
            What the plugin does. Where a measured figure belongs you will find
            a placeholder rather than an estimate.
          </Item>
        </Stagger>

        <Stagger as="ul" className="features">
          {FEATURES.map((feature) => (
            <Item as="li" key={feature.label} className="feature">
              <p className="readout feature__label">{feature.label}</p>
              <h3 className="feature__title">{feature.title}</h3>
              <p className="feature__body">{feature.body}</p>
              {feature.note ? (
                <p className="feature__note">{feature.note}</p>
              ) : null}
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
