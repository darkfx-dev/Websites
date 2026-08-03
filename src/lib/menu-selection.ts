import type { MenuHighlight } from "@/data/business";
import { menuItems, type MenuItem } from "@/data/menu";
import { scrollToElement } from "@/lib/scroll";

/**
 * One-way channel from the 3D highlight ring to the menu explorer.
 *
 * A DOM CustomEvent rather than shared React state or context: the two sections
 * are siblings rendered by a Server Component several levels apart, and lifting
 * state up would force the whole page tree client-side to connect them. The
 * event keeps both components independently mountable — the explorer still
 * works with no ring on the page, and the ring's static fallback grid uses the
 * exact same call.
 */
export const MENU_SELECTION_EVENT = "mpb:menu-selection";

/** Anchor id of the menu explorer section — the ring's scroll destination. */
export const MENU_EXPLORER_ID = "menu-explorer";

export type MenuSelection = {
  /** Human label for the group, shown as a removable chip in the explorer. */
  label: string;
  /** Category slugs this group draws from. */
  slugs: string[];
  /** Optional name-keyword narrowing within those categories. */
  keywords?: string[];
};

export function selectionFromHighlight(highlight: MenuHighlight): MenuSelection {
  return {
    label: highlight.title,
    slugs: highlight.slugs,
    keywords: highlight.keywords,
  };
}

/** Does a dish belong to the given selection? `null` selection means "all". */
export function matchesSelection(
  item: MenuItem,
  selection: MenuSelection | null
): boolean {
  if (!selection) return true;
  if (!selection.slugs.includes(item.categorySlug)) return false;
  if (!selection.keywords?.length) return true;
  const name = item.name.toLowerCase();
  return selection.keywords.some((keyword) => name.includes(keyword));
}

/** How many named dishes a selection resolves to — used for its ring caption. */
export function countForSelection(selection: MenuSelection): number {
  return menuItems.filter((item) => matchesSelection(item, selection)).length;
}

/**
 * Apply a selection: tell the explorer to filter, and bring it into view.
 *
 * Order matters — the event fires first so the explorer has re-rendered its
 * filtered list by the time the scroll lands on it.
 */
export function selectMenuGroup(selection: MenuSelection) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<MenuSelection>(MENU_SELECTION_EVENT, { detail: selection })
  );

  const target = document.getElementById(MENU_EXPLORER_ID);
  if (target) scrollToElement(target, { duration: 1 });
}

/** Subscribe to selections. Returns an unsubscribe function. */
export function subscribeToMenuSelection(
  handler: (selection: MenuSelection) => void
): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<MenuSelection>).detail);
  };
  window.addEventListener(MENU_SELECTION_EVENT, listener);
  return () => window.removeEventListener(MENU_SELECTION_EVENT, listener);
}
