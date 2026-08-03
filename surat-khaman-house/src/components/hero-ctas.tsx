import { MessageCircle, Phone } from "lucide-react";

import { ActionLink } from "@/components/ui/action-link";
import { telHref, whatsappHref } from "@/lib/links";

/**
 * The hero's three actions. They stack on narrow screens so the labels never
 * get cramped, and the primary action stays first in both DOM and reading
 * order so it is the one reached first by keyboard and screen reader.
 */
export function HeroEntranceCTAs() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <ActionLink href="#menu" size="lg">
        View the Menu
      </ActionLink>
      <ActionLink href={whatsappHref} external variant="secondary" size="lg">
        <MessageCircle className="h-4 w-4" aria-hidden />
        Ask on WhatsApp
      </ActionLink>
      <ActionLink href={telHref} variant="quiet" size="lg">
        <Phone className="h-4 w-4" aria-hidden />
        Call the Outlet
      </ActionLink>
    </div>
  );
}
