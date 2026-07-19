"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/menu";
import { site } from "@/lib/site";

/**
 * The "order basket". No backend, no payment gateway — deliberately. Items
 * collect here and get compiled into one clean pre-filled WhatsApp message,
 * which is how this shop actually takes orders.
 */
export type OrderSelection = {
  size?: string;
  flavor?: string;
  cakeMessage?: string;
};

export type OrderItem = {
  key: string;
  product: Product;
  selection: OrderSelection;
};

type CartContextValue = {
  items: OrderItem[];
  addItem: (product: Product, selection: OrderSelection) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  whatsappOrderHref: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function formatItem(item: OrderItem, index: number): string {
  const parts = [`${index + 1}. ${item.product.name}`];
  if (item.selection.size) parts.push(`Size: ${item.selection.size}`);
  if (item.selection.flavor) parts.push(`Flavour: ${item.selection.flavor}`);
  if (item.selection.cakeMessage)
    parts.push(`Message on cake: "${item.selection.cakeMessage}"`);
  return parts.join(" · ");
}

export function buildOrderMessage(items: OrderItem[]): string {
  const lines = [
    "Hi Modi Bakers, I'd like to order:",
    ...items.map(formatItem),
    "Please confirm availability and price. Thank you!",
  ];
  return lines.join("\n");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = useCallback((product: Product, selection: OrderSelection) => {
    setItems((prev) => [
      ...prev,
      { key: `${product.id}-${Date.now()}`, product, selection },
    ]);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const whatsappOrderHref = useMemo(
    () =>
      `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
        buildOrderMessage(items)
      )}`,
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, whatsappOrderHref }),
    [items, addItem, removeItem, clear, whatsappOrderHref]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
