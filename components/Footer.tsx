
"use client"

import { useEffect, useState } from "react"
import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MessageCircle,
  Sparkles,
  Terminal,
} from "lucide-react"

const FOOTER = {
  name: "Hafiz Muhammad Umar Farooq",
  role: "AI Engineer & Full-Stack Developer",
  blurb:
    "Architecting autonomous AI agents, computer vision pipelines, and resilient production systems that bridge intelligence with practical utility.",
  available: true,
  email: "umarshabbir.ai@gmail.com",
  whatsapp: "+923072502073",
  whatsappLabel: "+92 307 2502073",
  linkedin: "https://www.linkedin.com/in/muhammad-umar-b70207338/",
  github: "https://github.com/Hafiz-Muhammad-Umar-dev",
}

const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
]

const capabilities = [
  "Agentic AI & MCP Systems",
  "Computer Vision & Edge Anomaly",
  "Multi-Hop RAG Architectures",
  "High-Throughput Full-Stack APIs",
]

const GithubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
)

const navLinkStyle =
  "group relative inline-flex items-center text-sm text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107]"

export default function Footer() {
  const reduce = !!useReducedMotion()

  // Initialize with a stable value for server prerendering.
  const [currentYear, setCurrentYear] = useState(2026)

  // Read the actual browser year after the component mounts.
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }

  const backToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    })

  const letters = FOOTER.name.toUpperCase().split("")

  // Responsive clamp for the oversized footer wordmark.
  const wordmarkLength = Math.max(letters.length, 12)
  const dynamicVw = (90 / (wordmarkLength * 0.58)).toFixed(2)
  const fontSize = `clamp(1.5rem, ${dynamicVw}vw, 7.5rem)`

  const connect = [
    {
      label: FOOTER.email,
      href: "mailto:" + FOOTER.email,
      icon: <Mail size={15} aria-hidden="true" />,
    },
    {
      label: FOOTER.whatsappLabel,
      href: "https://wa.me/" + FOOTER.whatsapp.replace(/\D/g, ""),
      icon: <MessageCircle size={15} aria-hidden="true" />,
    },
    FOOTER.linkedin && {
      label: "LinkedIn",
      href: FOOTER.linkedin,
      icon: <LinkedinIcon />,
    },
    FOOTER.github && {
      label: "GitHub",
      href: FOOTER.github,
      icon: <GithubIcon />,
    },
  ].filter(Boolean) as {
    label: string
    href: string
    icon: React.ReactNode
  }[]

  return (
    <footer className="relative isolate w-full overflow-hidden bg-[#09090b] font-['Outfit'] text-white">
      {/* Background illumination & matrix grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-x-0 top-0 h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,193,7,0.08), transparent 75%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 0%, black 25%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 0%, black 25%, transparent 80%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:pt-28">
        {/* Call to action panel */}
        <motion.div
          {...rise(0)}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-12 lg:p-16"
        >
          {/* Subtle ambient light splash in CTA */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ffc107]/10 blur-3xl"
          />

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border bg-black px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                <Sparkles size={12} />
                <span>Next Milestone</span>
              </div>

              <h2 className="max-w-2xl bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                Ready to deploy intelligent systems?
                <span className="block text-zinc-500">
                  Let&rsquo;s engineer it together.
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-xl border bg-black px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
              >
                <span>Initiate Project</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              <a
                href={"mailto:" + FOOTER.email}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107]"
              >
                Direct Message
              </a>
            </div>
          </div>
        </motion.div>

        {/* Link matrix columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.1fr_1.3fr] lg:gap-12">
          {/* Identity column */}
          <motion.div {...rise(0.05)} className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-[#ffc107]" />
              <p className="text-lg font-bold tracking-tight text-white">
                {FOOTER.name}
              </p>
            </div>

            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {FOOTER.role}
            </p>

            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              {FOOTER.blurb}
            </p>

            {FOOTER.available && (
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black px-3.5 py-1.5 text-xs font-medium text-white">
                <span
                  className="relative flex h-2 w-2"
                  aria-hidden="true"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>

                Available for Q4 Engagements
              </div>
            )}
          </motion.div>

          {/* Navigation column */}
          <motion.nav {...rise(0.1)} aria-label="Footer Navigation">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Architecture
            </h3>

            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={navLinkStyle}>
                    <span className="transition-transform duration-200 group-hover:translate-x-1.5">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Capabilities column */}
          <motion.div {...rise(0.15)}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Focus Areas
            </h3>

            <ul className="mt-5 space-y-3">
              {capabilities.map((item) => (
                <li key={item}>
                  <a href="#services" className={navLinkStyle}>
                    <span className="transition-transform duration-200 group-hover:translate-x-1.5">
                      {item}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact column */}
          <motion.div {...rise(0.2)}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Secure Channels
            </h3>

            <ul className="mt-5 space-y-2.5">
              {connect.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 pr-3.5 text-xs text-zinc-400 transition-all duration-300 hover:border-[#ffc107]/40 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#121216] text-zinc-300 transition-colors group-hover:border-[#ffc107]/40 group-hover:text-[#ffc107]">
                      {c.icon}
                    </span>

                    <span className="truncate">{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Oversized Cinematic Wordmark */}
        <div
          aria-hidden="true"
          className="select-none overflow-hidden border-t border-white/[0.06] pt-8 text-center"
        >
          <div
            className="flex justify-center whitespace-pre font-extrabold leading-[0.8] tracking-tighter"
            style={{ fontSize }}
          >
            {letters.map((ch, i) => (
              <span key={i} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  initial={reduce ? false : { y: "115%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: reduce ? 0 : i * 0.025,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block bg-gradient-to-b from-white/[0.18] via-white/[0.06] to-transparent bg-clip-text text-transparent transition-colors hover:from-white/30"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom utility bar */}
      <div className="border-t border-white/[0.08] bg-black/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8">
          <p className="text-xs text-zinc-500">
            &copy; <span>{currentYear}</span>{" "}
            {FOOTER.name}. All technical specifications reserved.
          </p>

          <button
            type="button"
            onClick={backToTop}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-zinc-400 backdrop-blur-sm transition-all duration-300 hover:border-[#ffc107]/40 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107]"
          >
            <span>Top of Page</span>
            <ArrowUp
              size={13}
              className="text-[#ffc107] transition-transform duration-300 group-hover:-translate-y-1"
            />
          </button>
        </div>
      </div>
    </footer>
  )
}
