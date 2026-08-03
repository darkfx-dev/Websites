import { contact, isPlaceholder, profile, real } from "@/data/portfolio";
import { siteUrl } from "@/lib/site-url";

/**
 * Person + WebSite JSON-LD.
 *
 * Emitted only when the underlying facts are real. Structured data is a
 * machine-readable claim about a person; publishing `"name": "[Your Name]"`
 * would be feeding a search engine a statement that is not true, and one
 * that is much harder to retract than a line of visible copy.
 *
 * The payload is built from typed values and serialised with `JSON.stringify`,
 * so nothing user-authored is interpolated into the script as raw text.
 */
export function StructuredData() {
  const name = real(profile.name);
  const role = real(profile.role);
  const email = real(contact.email);

  if (!name || !siteUrl) return null;

  const sameAs = contact.socials
    .filter((s) => !isPlaceholder(s.href) && /^https?:/i.test(s.href))
    .map((s) => s.href);

  const person = {
    "@type": "Person",
    "@id": `${siteUrl.origin}/#person`,
    name,
    url: siteUrl.href,
    ...(role ? { jobTitle: role } : {}),
    ...(email ? { email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${siteUrl.origin}/#website`,
        url: siteUrl.href,
        name: `${name} — portfolio`,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl.origin}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised JSON only; `<` is escaped so the payload can never close
      // the script element early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
