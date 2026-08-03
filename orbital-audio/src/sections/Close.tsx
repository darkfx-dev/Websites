import { useState } from "react";
import { Item, Stagger } from "../components/Reveal";
import { NeonButton } from "../components/NeonButton";

/**
 * The closing call to action. The only centred composition on the page.
 *
 * Every other "Start free trial" on the page is a link to this section. This
 * one is the end of that road, so it is a button rather than a link to
 * itself, and it says plainly that the signup flow is not part of this build
 * instead of pretending to start one.
 */
export function FinalCta() {
  const [asked, setAsked] = useState(false);

  return (
    <section id="cta" className="section cta" aria-labelledby="cta-title">
      <div className="page cta__inner">
        <Stagger>
          <Item as="p" className="readout">
            Free trial
          </Item>
          <Item>
            <h2 id="cta-title">Hear it in your own session</h2>
          </Item>
          <Item as="p" className="lede cta__lede">
            Install it, put a source behind the listener, and decide from
            there.
          </Item>
          <Item className="cta__action">
            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => setAsked(true)}
            >
              Start free trial
            </NeonButton>
          </Item>
          <Item as="p" className="cta__note">
            <span role="status">
              {asked
                ? "Signup is not connected in this build — there is no account system behind this button."
                : "Trial length: [Placeholder] — not yet decided."}
            </span>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}

/**
 * Footer.
 *
 * Items that lead to a real part of this page are links. Items for pages that
 * do not exist are marked text, not links — a nav full of anchors that go
 * nowhere is the quietest way to make a site feel fake.
 */
const COLUMNS = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "#product" },
      { label: "How it works", href: "#workflow" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Docs", href: null },
      { label: "System requirements", href: null },
      { label: "Changelog", href: null },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: null },
      { label: "Contact", href: null },
      { label: "Privacy", href: null },
    ],
  },
];

export function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="page">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="wordmark">
              Orbital<em>Audio</em>
              <span aria-hidden="true" />
            </p>
            <p className="footer__blurb">
              Spatial audio rendering and decoding for people who already have a
              session open.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="readout footer__heading">{column.title}</h2>
              <ul className="footer__list">
                {column.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href}>{item.label}</a>
                    ) : (
                      <span className="footer__pending">
                        {item.label}
                        <span className="sr-only"> — page not yet written</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="hairline footer__rule" />

        <div className="footer__base">
          <p className="footer__legal">
            © {new Date().getFullYear()} Orbital Audio
          </p>
          <p className="footer__legal">
            Orbital Audio is a fictional product built as a design exercise. No
            figure, quotation or customer on this page is real.
          </p>
        </div>
      </div>
    </footer>
  );
}
