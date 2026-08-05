import type { SVGProps } from "react";

/**
 * One icon family, drawn on a 24×24 grid with a 1.75 stroke.
 *
 * Hand-drawn geometric glyphs rather than a packaged icon set: the site needs
 * a handful of icons, and inlining them avoids a dependency entirely.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.6 21A13.6 13.6 0 0 1 3 8.4 3 3 0 0 1 6 5.2h1.9a1 1 0 0 1 1 .85l.5 2.6a1 1 0 0 1-.3.92l-1.2 1.1a11 11 0 0 0 4.4 4.4l1.1-1.2a1 1 0 0 1 .92-.3l2.6.5a1 1 0 0 1 .85 1V17a3 3 0 0 1-3.2 3Z" />
    </Icon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21.2s6.6-5.6 6.6-11a6.6 6.6 0 0 0-13.2 0c0 5.4 6.6 11 6.6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5.5 9 6.5 6.5L18.5 9" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m20 20-4.4-4.4" />
    </Icon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" />
      <path d="M15.5 5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Icon>
  );
}
