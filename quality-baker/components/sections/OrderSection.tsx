"use client";

import { AnimatePresence, m } from "framer-motion";
import { useRef, useState } from "react";
import { CursorSwirl } from "@/components/CursorSwirl";
import { PastryArt } from "@/components/PastryArt";
import { Price } from "@/components/Price";
import { Reveal } from "@/components/Reveal";
import { products, type Product } from "@/data/menu";
import { useCart, type OrderSelection } from "@/lib/cart";
import { EASE_OUT_STRONG } from "@/lib/motion";
import { whatsappHref } from "@/lib/site";

/**
 * The ordering flow. First click on a tile expands it in place (shared
 * layout animation) with full detail + customisation. Second click — the
 * "Order on WhatsApp" button inside — compiles the selections into a
 * pre-filled WhatsApp message. "Add to order" batches multiple items into
 * one message via the floating pill (see Fabs.tsx). No backend, no payment
 * gateway: WhatsApp is how this shop actually takes orders.
 */
export function OrderSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("Everything");
  const sectionRef = useRef<HTMLElement>(null);

  const filters = [
    "Everything",
    ...Array.from(new Set(products.map((p) => p.category))),
    "Eggless Options",
  ];
  const shown = products.filter((p) =>
    category === "Everything"
      ? true
      : category === "Eggless Options"
        ? p.eggless
        : p.category === category
  );

  return (
    <section id="menu" ref={sectionRef} className="bg-noir text-cream">
      <CursorSwirl areaRef={sectionRef} />
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <div className="max-w-2xl">
            <p className="font-display text-lg italic text-caramel">
              Tap anything to start an order
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1.06] tracking-[-0.015em] text-porcelain">
              The menu
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream/70">
              Pick, customise, and send — your order arrives as a WhatsApp
              message we answer ourselves. Prices are starting points; custom
              work is confirmed once we&rsquo;ve talked it through.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div
            role="group"
            aria-label="Filter the menu"
            className="mt-10 flex flex-wrap gap-2"
          >
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setCategory(f);
                  setOpenId(null);
                }}
                aria-pressed={category === f}
                className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  category === f
                    ? "border-caramel bg-caramel text-noir"
                    : "border-cream/25 text-cream/75 hover:border-caramel/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {shown.length === 0 ? (
          <p className="mt-14 text-cream/70">
            Nothing in this category yet — ask us on WhatsApp, we probably
            bake it anyway.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                open={openId === product.id}
                onToggle={() =>
                  setOpenId((cur) => (cur === product.id ? null : product.id))
                }
              />
            ))}
          </div>
        )}

        <Reveal delay={0.08}>
          <p className="mt-12 max-w-[52ch] text-cream/60">
            Something not listed? Custom design is what we&rsquo;re best at —
            message us any idea and we&rsquo;ll sketch it with you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ProductTile({
  product,
  open,
  onToggle,
}: {
  product: Product;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <m.article
      layout
      transition={{ layout: { duration: 0.4, ease: EASE_OUT_STRONG } }}
      className={`overflow-hidden rounded-2xl border ${
        open
          ? "border-caramel/50 bg-ink/60 sm:col-span-2 lg:col-span-3"
          : `border-caramel/15 bg-ink/30 ${product.featured ? "sm:col-span-2" : ""}`
      }`}
    >
      <m.button
        layout="position"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`frame flex w-full items-center gap-5 px-5 py-5 text-left sm:px-6 ${
          open ? "" : "cursor-pointer"
        }`}
      >
        <PastryArt
          variant={product.art}
          className={`shrink-0 transition-[width] ${open ? "w-16" : "w-16 sm:w-20"}`}
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-lg font-medium leading-snug text-cream sm:text-xl">
              {product.name}
            </span>
            {product.eggless && (
              <span className="whitespace-nowrap rounded-full border border-caramel/40 px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide text-caramel">
                eggless
              </span>
            )}
          </span>
          <span className="mt-1 block text-sm text-cream/60">
            {product.category}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <Price
            value={product.price}
            qualifier={product.priceQualifier}
            className="font-display text-base text-caramel sm:text-lg"
          />
          <span
            aria-hidden
            className={`mt-1 block text-xs text-cream/50 transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            ✚
          </span>
        </span>
      </m.button>

      <AnimatePresence initial={false}>
        {open && <ExpandedDetail product={product} onClose={onToggle} />}
      </AnimatePresence>
    </m.article>
  );
}

function ExpandedDetail({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes?.[0]);
  const [flavor, setFlavor] = useState(product.flavors?.[0]);
  const [cakeMessage, setCakeMessage] = useState("");
  const [added, setAdded] = useState(false);

  const selection: OrderSelection = {
    size,
    flavor,
    cakeMessage: cakeMessage.trim() || undefined,
  };

  const singleOrderHref = whatsappHref(
    [
      `Hi Modi Bakers, I'd like to order: ${product.name}`,
      size && `Size: ${size}`,
      flavor && `Flavour: ${flavor}`,
      selection.cakeMessage && `Message on cake: "${selection.cakeMessage}"`,
      "Please confirm availability and price. Thank you!",
    ]
      .filter(Boolean)
      .join("\n")
  );

  return (
    <m.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.34, ease: EASE_OUT_STRONG }}
      className="overflow-hidden"
    >
      <div className="border-t border-caramel/15 px-5 pb-6 pt-5 sm:px-6">
        <p className="max-w-[62ch] leading-relaxed text-cream/75">
          {product.description}
        </p>

        {product.customizable && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {product.sizes && (
              <OptionGroup
                label="Size"
                options={product.sizes}
                value={size}
                onChange={setSize}
              />
            )}
            {product.flavors && (
              <OptionGroup
                label="Flavour"
                options={product.flavors}
                value={flavor}
                onChange={setFlavor}
              />
            )}
            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-cream/80">
                Message on the cake{" "}
                <span className="font-normal text-cream/50">(optional)</span>
              </span>
              <input
                type="text"
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                maxLength={60}
                placeholder="Happy Birthday Aarav!"
                className="mt-2 w-full rounded-xl border border-caramel/25 bg-noir/60 px-4 py-3 text-cream placeholder:text-cream/45 focus:border-caramel focus:outline-none"
              />
            </label>
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={singleOrderHref}
            target="_blank"
            rel="noopener"
            className="glow-btn inline-flex min-h-12 items-center rounded-full bg-caramel px-6 py-3 text-[0.95rem] font-semibold text-noir"
          >
            <span aria-hidden className="icing-swipe" />
            Order this on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              addItem(product, selection);
              setAdded(true);
              setTimeout(onClose, 650);
            }}
            className="glow-btn inline-flex min-h-12 cursor-pointer items-center rounded-full border border-cream/30 px-6 py-3 text-[0.95rem] font-semibold text-cream"
          >
            <span aria-hidden className="icing-swipe" />
            {added ? "Added ✓" : "Add to order"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 cursor-pointer px-3 text-sm text-cream/60 transition-colors duration-150 hover:text-cream"
          >
            Close
          </button>
        </div>
      </div>
    </m.div>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-cream/80">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={selected}
              className={`min-h-10 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                selected
                  ? "border-caramel bg-caramel text-noir"
                  : "border-cream/25 text-cream/80 hover:border-caramel/60"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
