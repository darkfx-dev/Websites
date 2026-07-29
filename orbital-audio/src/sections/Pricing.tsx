import { Item, Stagger } from "../components/Reveal";
import { NeonButton } from "../components/NeonButton";

const TIERS = [
  {
    name: "Studio",
    seats: "One seat",
    features: [
      "Binaural and ambisonic rendering",
      "Stereo, quad and 5.1 decodes",
      "VST3, AU and AAX",
      "Updates for the current major version",
    ],
    featured: false,
  },
  {
    name: "Suite",
    seats: "Five seats",
    features: [
      "Everything in Studio",
      "Third-order ambisonics",
      "7.1.4 and custom speaker layouts",
      "Shared decode presets across seats",
    ],
    featured: true,
  },
  {
    name: "Site",
    seats: "One facility",
    features: [
      "Everything in Suite",
      "Offline activation",
      "Named technical contact",
      "[PLACEHOLDER] — support terms not yet written",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title">
      <div className="page">
        <Stagger className="section__head">
          <Item as="p" className="readout">
            Pricing
          </Item>
          <Item>
            <h2 id="pricing-title">Three ways to license it</h2>
          </Item>
          <Item as="p" className="lede">
            Amounts have not been set. Every figure below is a placeholder and
            is labelled as one — none of them is a price you should plan
            around.
          </Item>
        </Stagger>

        <Stagger as="ul" className="tiers">
          {TIERS.map((tier) => (
            <Item
              as="li"
              key={tier.name}
              className={tier.featured ? "tier tier--featured" : "tier"}
            >
              <h3 className="tier__name">{tier.name}</h3>
              <p className="readout tier__seats">{tier.seats}</p>

              <p className="tier__price">[Placeholder price]</p>

              <ul className="tier__features">
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <span className="tier__tick" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="tier__action">
                <NeonButton
                  href="#cta"
                  variant={tier.featured ? "primary" : "secondary"}
                >
                  Start free trial
                </NeonButton>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
