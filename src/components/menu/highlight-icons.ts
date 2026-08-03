import {
  CookingPot,
  Leaf,
  Utensils,
  Flame,
  Soup,
  Pizza,
  Cookie,
  Boxes,
  type LucideIcon,
} from "lucide-react";

/**
 * Decorative icons paired to the verified highlight groups, keyed by title.
 * Shared so the 3D ring and its static fallback grid can't drift apart.
 */
export const highlightIcons: Record<string, LucideIcon> = {
  "Classic Pav Bhaji": CookingPot,
  "Jain & Paneer Bhaji": Leaf,
  "South Indian Dosa": Utensils,
  "Indo-Chinese": Flame,
  "Rice & Noodles": Soup,
  "Pizza & Sandwiches": Pizza,
  "Chaats & Snacks": Cookie,
  Combos: Boxes,
};

export function highlightIcon(title: string): LucideIcon {
  return highlightIcons[title] ?? Utensils;
}
