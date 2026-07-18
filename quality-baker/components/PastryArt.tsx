/**
 * Hand-drawn pastry illustrations — caramel line work on espresso.
 *
 * ⚠ These are deliberate PLACEHOLDERS for photographs of the shop's real
 * cakes. The outbound network policy of this build environment blocks stock
 * photo CDNs, so instead of shipping broken images the gallery ships as an
 * illustrated menu plate. When the owner's photos arrive, replace each
 * <PastryArt> in Gallery.tsx with a next/image of the real cake.
 */

type PastryArtProps = {
  variant: "layer" | "tiered" | "cupcake" | "croissant" | "candles" | "slice";
  className?: string;
  style?: React.CSSProperties;
};

const stroke = "#d4a054";
const soft = "rgb(212 160 84 / 0.35)";
const fill = "rgb(139 78 59 / 0.18)";

export function PastryArt({ variant, className, style }: PastryArtProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-hidden="true"
      className={className}
      style={style}
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {variant === "layer" && (
        <g>
          <path d="M50 150h100" strokeWidth="2.5" />
          <path d="M58 150v-28c0-4 3-7 7-7h70c4 0 7 3 7 7v28" fill={fill} />
          <path d="M58 132c8 6 16 6 24 0s16-6 24 0 16 6 24 0 12-4 12-4" stroke={soft} />
          <path d="M66 115V93c0-4 3-7 7-7h54c4 0 7 3 7 7v22" fill={fill} />
          <path d="M66 100c7 5 14 5 21 0s14-5 21 0 14 5 21 0" stroke={soft} />
          <path d="M100 86V70" />
          <circle cx="100" cy="63" r="5" fill={fill} />
        </g>
      )}
      {variant === "tiered" && (
        <g>
          <path d="M40 158h120" strokeWidth="2.5" />
          <path d="M52 158v-24c0-3 2-6 6-6h84c4 0 6 3 6 6v24" fill={fill} />
          <path d="M70 128v-22c0-3 2-6 6-6h48c4 0 6 3 6 6v22" fill={fill} />
          <path d="M84 100V82c0-3 2-6 6-6h20c4 0 6 3 6 6v18" fill={fill} />
          <path d="M52 142h96M70 114h60M84 90h32" stroke={soft} />
          <path d="M100 76v-14" />
          <circle cx="100" cy="56" r="5" fill={fill} />
        </g>
      )}
      {variant === "cupcake" && (
        <g>
          <path d="M68 118l10 44h44l10-44" fill={fill} />
          <path d="M72 130h56M76 144h48" stroke={soft} />
          <path d="M64 118h72" strokeWidth="2.5" />
          <path d="M68 118c-6-26 10-36 16-24 2-16 30-16 32 0 6-12 22-2 16 24" fill={fill} />
          <circle cx="100" cy="80" r="4" fill={fill} />
        </g>
      )}
      {variant === "croissant" && (
        <g>
          <path
            d="M45 120c8-22 34-38 55-38s47 16 55 38c3 9-4 14-12 11-14-6-28-9-43-9s-29 3-43 9c-8 3-15-2-12-11z"
            fill={fill}
          />
          <path d="M78 88l-8 34M100 83v38M122 88l8 34" stroke={soft} />
        </g>
      )}
      {variant === "candles" && (
        <g>
          <path d="M46 156h108" strokeWidth="2.5" />
          <path d="M56 156v-30c0-4 3-8 8-8h72c5 0 8 4 8 8v30" fill={fill} />
          <path d="M56 136c9 7 18 7 27 0s18-7 27 0 18 7 27 0" stroke={soft} />
          <path d="M76 118v-22M100 118v-28M124 118v-22" />
          <path d="M76 88c-3-5 3-9 0-13M100 82c-3-5 3-9 0-13M124 88c-3-5 3-9 0-13" stroke={soft} />
        </g>
      )}
      {variant === "slice" && (
        <g>
          <path d="M58 148L130 66c6 8 12 22 14 34L74 158c-8 2-18-4-16-10z" fill={fill} />
          <path d="M84 118l38-42M100 134l40-40" stroke={soft} />
          <circle cx="134" cy="60" r="5" fill={fill} />
          <path d="M52 162h96" strokeWidth="2.5" />
        </g>
      )}
    </svg>
  );
}
