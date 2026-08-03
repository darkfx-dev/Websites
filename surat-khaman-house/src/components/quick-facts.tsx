import { MessageCircle, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ActionLink } from "@/components/ui/action-link";
import { business } from "@/data/business";
import { menuItemCount } from "@/data/menu";
import { telHref, whatsappHref } from "@/lib/links";

/**
 * Compact orientation strip. Mentions no area, road, landmark or directions —
 * the only contact affordances here are the phone and WhatsApp actions.
 */
export function QuickFacts() {
  const facts = [
    "Vegetarian Surti breakfast and farsan",
    `${menuItemCount} listed menu items`,
    "Reference menu-board prices",
    "Open daily—call to confirm",
  ];

  return (
    <section
      aria-label="At a glance"
      className="border-b border-[rgba(10,10,10,0.12)] bg-surface-muted"
    >
      <Reveal className="container-page flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {facts.map((fact) => (
            <li
              key={fact}
              className="flex items-center gap-2 text-sm text-ink-soft"
            >
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-khaman" />
              {fact}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3 lg:shrink-0">
          <ActionLink href={telHref} variant="secondary">
            <Phone className="h-4 w-4" aria-hidden />
            {business.telephone.display}
          </ActionLink>
          <ActionLink href={whatsappHref} external>
            <MessageCircle className="h-4 w-4" aria-hidden />
            Ask on WhatsApp
          </ActionLink>
        </div>
      </Reveal>
    </section>
  );
}
