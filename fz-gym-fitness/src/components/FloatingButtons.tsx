import { MapPin, Instagram } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { generalWhatsappUrl } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
  );
}

type FloatBtn = {
  href: string;
  label: string;
  icon: React.ReactNode;
  ring: string;
  glow: string;
  delay: string;
};

export function FloatingButtons() {
  const buttons: FloatBtn[] = [
    {
      href: siteConfig.links.googleMaps,
      label: "Get directions on Google Maps",
      icon: <MapPin className="h-6 w-6" aria-hidden="true" />,
      ring: "border-cyan/60 text-cyan bg-base/80",
      glow: "hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] hover:border-redx",
      delay: "0s",
    },
    {
      href: siteConfig.links.instagram,
      label: "Visit our Instagram profile",
      icon: <Instagram className="h-6 w-6" aria-hidden="true" />,
      ring: "border-[#E1306C]/60 text-[#E1306C] bg-base/80",
      glow: "hover:shadow-[0_0_22px_rgba(225,48,108,0.65)]",
      delay: "0.4s",
    },
    {
      href: generalWhatsappUrl(),
      label: "Message us on WhatsApp",
      icon: <WhatsAppIcon className="h-6 w-6" />,
      ring: "border-[#25D366]/70 text-[#25D366] bg-base/80",
      glow: "hover:shadow-[0_0_22px_rgba(37,211,102,0.7)]",
      delay: "0.8s",
    },
  ];

  return (
    <div className="safe-bottom safe-right fixed z-40 flex flex-col items-center gap-3">
      {buttons.map((b) => (
        <a
          key={b.label}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={b.label}
          className={`group relative inline-flex h-13 w-13 items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 motion-safe:animate-float motion-reduce:hover:scale-100 ${b.ring} ${b.glow}`}
          style={{
            animationDelay: b.delay,
            height: "3.25rem",
            width: "3.25rem",
          }}
        >
          {b.icon}
          {/* Desktop hover label */}
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-white/10 bg-base/90 px-3 py-1.5 text-xs font-medium text-ink opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block">
            {b.label}
          </span>
        </a>
      ))}
    </div>
  );
}
