import Image from "next/image";
import {
  Globe,
  Camera,
  MessageCircle,
  Play,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const columns = [
  {
    title: "League",
    links: ["About KPL", "Teams", "Mega Auction", "Fixtures", "Standings"],
  },
  {
    title: "Explore",
    links: ["Players", "News", "Gallery", "Sponsors", "Road to KPL"],
  },
  {
    title: "Connect",
    links: ["Contact", "Careers", "Media Centre", "Partnerships", "FAQ"],
  },
];

const socials = [
  { icon: Globe, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: MessageCircle, label: "Twitter" },
  { icon: Play, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-navy/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr_1.3fr]">
          {/* Brand */}
          <div>
            <Image
              src="/kpl-logo.png"
              alt="Kinniya Premier League"
              width={1599}
              height={984}
              className="h-16 w-auto"
            />
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/40">
              Season 1 · 2026
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              208 Players • 8 Teams • One Dream • One Champion. The biggest
              cricket spectacle Kinniya has ever seen.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:text-gold"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/55 transition-colors hover:text-gold"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h4>
            <ul className="mt-4 space-y-3.5 text-sm text-white/55">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                Kinniya, Trincomalee, Sri Lanka
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-gold" />
                info@kplcricket.lk
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-gold" />
                +94 00 000 0000
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row">
          <p>© 2026 Kinniya Premier League. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
