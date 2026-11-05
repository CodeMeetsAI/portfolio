"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "motion/react"
import { ArrowUpRight, ChevronDown, Download } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Content: edit these                                                */
/* ------------------------------------------------------------------ */

type Role = {
  role: string
  company: string
  start: number
  /** A year, or "Present" for a current role. */
  end: number | "Present"
  /** Short summary shown when the card is expanded. */
  summary: string
  /** 2-4 achievements. Numbers and outcomes read best. */
  highlights: string[]
  tags: string[]
  /** Optional company logo in /public, e.g. "/companies/codevance.png". */
  logo?: string
}

// Role, company and years are yours. The summary, highlights and tags below
// are PLACEHOLDERS written from the job titles: replace them with what you
// really did (real projects, numbers, results) before publishing.
const roles: Role[] = [
  {
    role: "Forward Deployed Engineer",
    company: "Codevance.ae",
    start: 2026,
    end: "Present",
    summary:
      "Embedded with client teams to turn their problems into working software in production.",
    highlights: [
      "Work directly with clients to scope, build and deploy AI-powered solutions.",
      "Own delivery end to end: requirements, implementation, rollout and support.",
    ],
    tags: ["AI Solutions", "Python", "FastAPI", "Client Delivery"],
  },
  {
    role: "AI/ML & VI Engineer",
    company: "Industronic Eng",
    start: 2025,
    end: "Present",
    summary:
      "Building vision systems for industrial use cases, from model to deployment.",
    highlights: [
      "Develop detection and inspection models for real-time camera feeds.",
      "Take models from experiments to reliable, deployed pipelines.",
    ],
    tags: ["YOLO", "OpenCV", "PyTorch", "Python"],
  },
  {
    role: "Full-Stack Engineer",
    company: "Gapsoe Digital",
    start: 2022,
    end: 2024,
    summary:
      "Designed and shipped web applications across the frontend and backend.",
    highlights: [
      "Built and maintained full-stack features from database to interface.",
      "Worked with designers and product to ship production releases.",
    ],
    tags: ["React", "Next.js", "Node.js", "APIs"],
  },
  {
    role: "Frontend Engineer",
    company: "BrandSob Solutions",
    start: 2021,
    end: 2022,
    summary:
      "Delivered responsive, component-based interfaces for client projects.",
    highlights: [
      "Turned designs into fast, accessible and responsive interfaces.",
      "Built reusable components and kept the codebase consistent.",
    ],
    tags: ["React", "JavaScript", "Tailwind CSS", "Responsive UI"],
  },
  {
    role: "Frontend Developer Internship",
    company: "Softonic Solutions",
    start: 2020,
    end: 2020,
    summary:
      "First professional role: learned how production frontend teams work.",
    highlights: [
      "Contributed to real projects under senior developers.",
      "Learned version control, code review and team workflows.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Git"],
  },
]

// Optional: set a real file in /public (e.g. "/resume.pdf") to show a download button.
const RESUME_HREF: string | undefined = undefined

/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const

const GRADIENTS = [
  "from-slate-950 to-slate-700",
  "from-slate-900 to-slate-600",
  "from-slate-800 to-slate-500",
  "from-slate-950 to-slate-600",
  "from-slate-700 to-slate-500",
]

const initials = (name: string) =>
  name
    .replace(/\.[a-z]+$/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")

const period = (r: Role) => {
  const end = r.end === "Present" ? "Present" : String(r.end)
  return r.end === r.start ? String(r.start) : `${r.start} — ${end}`
}

function Logo({ role, index }: { role: Role; index: number }) {
  if (role.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={role.logo}
        alt=""
        className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1.5"
      />
    )
  }
  return (
    <div
      aria-hidden
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} text-xs font-bold tracking-wide text-white shadow-md shadow-slate-900/20`}
    >
      {initials(role.company)}
    </div>
  )
}

function Node({ current }: { current: boolean }) {
  return (
    <motion.span
      initial="off"
      whileInView="on"
      viewport={{ margin: "0px 0px -45% 0px" }}
      className="absolute -left-8 top-6 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-200 bg-[#f8fafc] sm:-left-10"
      variants={{
        off: { borderColor: "#e2e8f0", scale: 0.9 },
        on: { borderColor: "#0f172a", scale: 1 },
      }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.span
        className="h-2.5 w-2.5 rounded-full bg-slate-950"
        variants={{ off: { scale: 0 }, on: { scale: 1 } }}
        transition={{ duration: 0.4, ease: EASE }}
      />
      {current && (
        <span className="absolute inset-0 animate-ping rounded-full bg-slate-900/20" />
      )}
    </motion.span>
  )
}

function RoleCard({
  role,
  index,
  open,
  onToggle,
}: {
  role: Role
  index: number
  open: boolean
  onToggle: () => void
}) {
  const current = role.end === "Present"
  const panelId = `exp-panel-${index}`

  return (
    <li className="relative pb-6 last:pb-0">
      <Node current={current} />

      <motion.article
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`group rounded-2xl border bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/[0.06] ${
          open ? "border-slate-900" : "border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start gap-4 rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 sm:p-6"
        >
          <Logo role={role} index={index} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {period(role)}
              </span>
              {current && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-950 bg-slate-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  Current
                </span>
              )}
            </div>

            <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              {role.role}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-slate-500">
              {role.company}
            </p>
          </div>

          <span
            aria-hidden
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-hover:border-slate-900 group-hover:text-slate-950"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              role="region"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 px-5 pb-6 pt-5 sm:px-6">
                <p className="text-sm leading-7 text-slate-600">{role.summary}</p>

                <ul className="mt-4 space-y-2.5">
                  {role.highlights.map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: EASE }}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950" />
                      {h}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {role.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </li>
  )
}

export default function Experience({ items = roles }: { items?: Role[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)
  const listRef = React.useRef<HTMLOListElement>(null)

  // The coloured line fills as you scroll down the timeline.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 55%"],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })

  const current = items.filter((r) => r.end === "Present")
  const since = Math.min(...items.map((r) => r.start))
  const stats = [
    { value: String(since), label: "Career started" },
    { value: String(items.length), label: "Roles" },
    { value: String(current.length), label: "Current" },
  ]

  return (
    // No overflow-hidden here: the intro column is position: sticky.
    <section id="experience" className="relative bg-[#f8fafc] px-5 py-24 text-slate-900 sm:px-8 lg:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-slate-200/70 blur-[120px]" />
        <div className="absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-slate-300/40 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[400px_1fr] lg:gap-20">
        {/* Intro (sticky on desktop) */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-950" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-950">
                Experience
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Where I&apos;ve
              <span className="block bg-gradient-to-r from-slate-950 via-slate-700 to-slate-400 bg-clip-text text-transparent">
                Worked &amp; Grown.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-500">
              From frontend interfaces to full-stack products, and now
              computer vision and AI delivery. Each role added a layer to how
              I build intelligent systems.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm"
                >
                  <p className="bg-gradient-to-r from-slate-950 to-slate-600 bg-clip-text text-2xl font-extrabold text-transparent">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Currently */}
            {current.length > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-950" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-950">
                    Currently
                  </span>
                </div>
                <ul className="space-y-3">
                  {current.map((r) => (
                    <li key={r.company + r.role}>
                      <p className="text-sm font-bold text-slate-900">{r.role}</p>
                      <p className="text-xs text-slate-500">{r.company}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-1 hover:bg-slate-700"
              >
                Work with me
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              {RESUME_HREF && (
                <a
                  href={RESUME_HREF}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-900 hover:text-slate-950"
                >
                  <Download size={15} />
                  Résumé
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <div>
          <ol ref={listRef} className="relative pl-8 sm:pl-10">
            {/* track */}
            <span
              aria-hidden
              className="absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-slate-200 sm:left-[19px]"
            />
            {/* progress */}
            <motion.span
              aria-hidden
              style={{ scaleY: fill, transformOrigin: "50% 0%" }}
              className="absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-gradient-to-b from-slate-950 via-slate-800 to-slate-500 sm:left-[19px]"
            />

            {items.map((r, i) => (
              <RoleCard
                key={r.company + r.role}
                role={r}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex((o) => (o === i ? null : i))}
              />
            ))}
          </ol>

          <p className="mt-8 pl-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:pl-10">
            Click a role to see details
          </p>
        </div>
      </div>
    </section>
  )
}
