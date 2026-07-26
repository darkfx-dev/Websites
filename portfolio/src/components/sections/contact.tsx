import { ArrowUpRight, Mail } from "lucide-react";
import { contact, isPlaceholder, profile, real } from "@/data/portfolio";
import { CopyEmail } from "@/components/contact/copy-email";
import { Reveal } from "@/components/motion/reveal";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { SafeLink, Text } from "@/components/ui/content";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Contact.
 *
 * A `mailto:` link and the real social profiles — deliberately no form.
 *
 * A contact form on a statically-hosted page needs a third-party endpoint or a
 * server route, and either one needs validation, rate limiting and spam
 * handling to be responsible. None of that is worth adding for a channel that
 * a plain email address already covers, and it would mean routing a stranger's
 * message through a service they were never told about.
 */
export function Contact() {
  const email = real(contact.email);
  const availability = real(profile.availability);
  const responseTime = real(profile.responseTime);
  const socials = contact.socials.filter((s) => !isPlaceholder(s.href));
  const pendingSocials = contact.socials.filter((s) => isPlaceholder(s.href));

  return (
    <section id="contact" className="section-y relative">
      <div className="shell">
        <SectionHeading
          eyebrow="06 / contact"
          title="Let's talk about the problem first"
          lede="Tell me what is not working and what you have already tried. That is usually enough for me to say something useful in the first reply."
          id="contact-heading"
        />

        <Reveal delay={120}>
          <LiquidGlass className="mt-14 p-7 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <p className="eyebrow">Email</p>
                {email ? (
                  <>
                    <p className="mt-3 break-all text-lg text-ink">
                      <a
                        href={`mailto:${email}`}
                        className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
                      >
                        {email}
                      </a>
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a href={`mailto:${email}`} className="btn btn-primary">
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        Send an email
                      </a>
                      <CopyEmail email={email} />
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-lg">
                    <Text value={contact.email} />
                  </p>
                )}

                {availability || responseTime ? (
                  <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
                    {availability ? (
                      <div>
                        <dt className="eyebrow">Currently</dt>
                        <dd className="mt-1.5 text-sm text-ink">{availability}</dd>
                      </div>
                    ) : null}
                    {responseTime ? (
                      <div>
                        <dt className="eyebrow">Typical reply</dt>
                        <dd className="mt-1.5 text-sm text-ink">{responseTime}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </div>

              <div>
                <p className="eyebrow">Elsewhere</p>
                <ul className="mt-4 space-y-1">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <SafeLink
                        href={s.href}
                        className="group flex min-h-[48px] items-center justify-between gap-4 border-b border-line text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        <span className="font-medium text-ink">{s.label}</span>
                        <span className="flex items-center gap-2 truncate">
                          <span className="mono truncate text-xs text-ink-faint">
                            {s.display}
                          </span>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
                            aria-hidden="true"
                          />
                        </span>
                      </SafeLink>
                    </li>
                  ))}
                  {pendingSocials.map((s) => (
                    <li
                      key={s.label}
                      className="flex min-h-[48px] flex-wrap items-center justify-between gap-3 border-b border-line text-sm"
                    >
                      <span className="font-medium text-ink">{s.label}</span>
                      <Text value={s.href} className="text-xs" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </LiquidGlass>
        </Reveal>
      </div>
    </section>
  );
}
