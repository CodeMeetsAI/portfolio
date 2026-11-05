"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react"

/*
 * Testimonials: a featured quote that types itself in word by word and rotates
 * on its own (with a progress bar), a client rail to jump between quotes, and
 * two marquee rows of short praise moving in opposite directions.
 *
 * !! PLACEHOLDER CONTENT !!
 * Every name, company and quote below is a sample. Replace them with real
 * client feedback (with permission) before publishing. Never publish made-up
 * testimonials.
 *
 * Autoplay pauses on hover or focus, when the section is off screen, and
 * when the visitor presses Pause. It is off for reduced-motion users.
 * Needs only what you already use: motion, lucide-react.
 */

type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  /** What you built for them. */
  project: string
  /** Optional outcome chip. */
  result?: string
  /** One-line version for the marquee. */
  short: string
  rating?: number
  /** Optional photo URL. Initials are used when empty. */
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I came with a rough idea for an AI agent to qualify property leads. Within a few weeks there was a working system, a clean dashboard and clear documentation. Communication was excellent the whole way.",
    name: "Ayesha Khan",
    role: "Founder",
    company: "Rreal estate agency in Baku Azerbaijan",
    project: "AI agent for lead qualification",
    result: "Working system in 3 weeks",
    short: "Went from a rough idea to a working AI agent in a few weeks.",
  },
  {
    quote:
      "The inspection model flagged defects our team used to miss, and it ran on our existing cameras. What stood out was how clearly each step was explained, from data collection to deployment.",
    name: "Daniel Reyes",
    role: "Operations Manager",
    company: "Manufacturing firm",
    project: "Computer vision inspection",
    result: "Runs on existing cameras",
    short: "It caught defects our team used to miss.",
  },
  {
    quote:
      "Not just the model but the entire product. The interface is fast, the API is solid and everything was deployed with monitoring. I never had to chase for updates.",
    name: "Sara Malik",
    role: "Product Lead",
    company: "SaaS startup",
    project: "Full-stack AI application",
    result: "Shipped to production",
    short: "Delivered the whole product, not only the model.",
  },
 {
  quote:
    "Our manual reporting process used to take hours every week. With the new Calling Agent workflow, automation handles repetitive tasks efficiently, allowing our team to focus on more important work. The solution was delivered on time and with clear documentation.",
  name: "Paulo Cardoso Santos",
  role: "Head of Operations",
  company: "Services Company",
  project: "AI Calling Agent",
  result: "Hours saved every week",
  short: "Hours of manual work replaced with intelligent automation.",
},
  {
    quote:
      "The multi-agent workflow handled tasks I assumed would need a person. Clear milestones, honest estimates and a calm approach when our requirements changed midway.",
    name: "Elena Petrova",
    role: "CTO",
    company: "Tech consultancy",
    project: "Multi-agent workflow",
    result: "Milestones met on schedule",
    short: "Honest estimates, and calm when requirements changed.",
  },
]

const INTERVAL = 8000 // ms each quote stays on screen

const tints = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-700",
]

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

function Avatar({ t, i, size = 44 }: { t: Testimonial; i: number; size?: number }) {
  if (t.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={t.avatar}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={"grid shrink-0 place-items-center rounded-full text-sm font-semibold " + tints[i % tints.length]}
    >
      {initials(t.name)}
    </span>
  )
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span role="img" aria-label={n + " out of 5 stars"} className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, k) => (
        <Star key={k} size={15} aria-hidden="true" className={k < n ? "fill-current" : "text-slate-200"} />
      ))}
    </span>
  )
}

function MarqueeRow({ reverse = false, items }: { reverse?: boolean; items: { t: Testimonial; i: number }[] }) {
  const loop = [...items, ...items]
  return (
    <div
      className="tm-row group relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <ul className={"tm-track flex w-max gap-4 " + (reverse ? "tm-reverse" : "")}>
        {loop.map(({ t, i }, k) => (
          <li
            key={k}
            aria-hidden={k >= items.length}
            className="flex w-[320px] shrink-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <Stars n={t.rating ?? 5} />
            <p className="text-[15px] font-medium leading-6 text-slate-800">{t.short}</p>
            <div className="mt-auto flex items-center gap-3">
              <Avatar t={t} i={i} size={34} />
              <span className="min-w-0 text-xs leading-4">
                <span className="block truncate font-semibold text-slate-900">{t.name}</span>
                <span className="block truncate text-slate-500">{t.company}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Testimonials() {
  const reduce = !!useReducedMotion()
  const n = testimonials.length

  const [index, setIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(true)
  const [hover, setHover] = React.useState(false)
  const [visible, setVisible] = React.useState(true)

  const sectionRef = React.useRef<HTMLElement | null>(null)
  const barsRef = React.useRef<HTMLDivElement | null>(null)
  const elapsed = React.useRef(0)

  const running = playing && !hover && visible && !reduce

  // Only run while the section is on screen
  React.useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const setProgress = (p: number) => barsRef.current?.style.setProperty("--p", String(p))

  // Autoplay clock. It writes a CSS variable instead of state, so no re-render per frame.
  React.useEffect(() => {
    if (!running) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(100, now - last)
      last = now
      elapsed.current += dt
      const p = Math.min(1, elapsed.current / INTERVAL)
      setProgress(p)
      if (p >= 1) {
        elapsed.current = 0
        setProgress(0)
        setIndex((i) => (i + 1) % n)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, n])

  const go = (i: number) => {
    elapsed.current = 0
    setProgress(0)
    setIndex(((i % n) + n) % n)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      go(index + 1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      go(index - 1)
    }
  }

  const t = testimonials[index]
  const words = t.quote.split(" ")
  const rowItems = testimonials.map((x, i) => ({ t: x, i }))

  const ctl =
    "grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative isolate w-full overflow-hidden border-t border-slate-200 bg-white py-24 font-['Outfit'] text-slate-950 sm:py-28 lg:py-32"
    >
      <style>{`
        @keyframes tm-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .tm-track { animation: tm-scroll 55s linear infinite }
        .tm-reverse { animation-direction: reverse }
        .tm-row:hover .tm-track { animation-play-state: paused }
        @media (prefers-reduced-motion: reduce) { .tm-track { animation: none } .tm-row { overflow-x: auto } }
      `}</style>

      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"
        >
          <div>
            <p className="text-sm font-medium text-slate-500">Testimonials</p>
            <h2
              id="testimonials-heading"
              className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              What Clients Say About Working With Me.
            </h2>
          </div>

          <div className="flex items-center gap-3" role="group" aria-label="Testimonial controls">
            <span className="mr-2 text-sm font-medium tabular-nums text-slate-500" aria-hidden="true">
              <span className="text-slate-950">{String(index + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
            </span>
            <button type="button" className={ctl} aria-label="Previous testimonial" onClick={() => go(index - 1)}>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className={ctl} aria-label="Next testimonial" onClick={() => go(index + 1)}>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            {!reduce && (
              <button
                type="button"
                className={ctl}
                aria-label={playing ? "Pause automatic rotation" : "Resume automatic rotation"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              </button>
            )}
          </div>
        </motion.div>

        {/* Featured quote + client rail */}
        <div
          ref={barsRef}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onKeyDown={onKeyDown}
          className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-[1fr_330px] lg:gap-8"
        >
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative m-0 flex min-h-[440px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_60px_-30px_rgba(15,23,42,.25)] lg:min-h-[470px]"
          >
            {/* Decorative quote mark */}
            <svg
              aria-hidden="true"
              viewBox="0 0 64 64"
              className="pointer-events-none absolute -right-2 -top-2 h-40 w-40 text-slate-100"
              fill="currentColor"
            >
              <path d="M14 38c0-9 5-17 14-21l2 4c-5 3-8 7-8 12h6v14H14V38Zm24 0c0-9 5-17 14-21l2 4c-5 3-8 7-8 12h6v14H38V38Z" />
            </svg>

            <div className="relative flex flex-1 flex-col p-7 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  className="flex flex-1 flex-col"
                  exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars n={t.rating ?? 5} />
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {t.project}
                    </span>
                  </div>

                  <blockquote
                    className="mt-7 max-w-3xl text-[22px] font-medium leading-[1.45] tracking-tight text-slate-900 sm:text-[28px] sm:leading-[1.4]"
                    aria-live={running ? "off" : "polite"}
                  >
                    <span className="sr-only">{t.quote}</span>
                    <span aria-hidden="true">
                      {words.map((w, k) => (
                        <motion.span
                          key={k}
                          initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.45, delay: reduce ? 0 : 0.08 + k * 0.022, ease: "easeOut" }}
                          className="mr-[0.26em] inline-block"
                        >
                          {w}
                        </motion.span>
                      ))}
                    </span>
                  </blockquote>

                  <motion.figcaption
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: reduce ? 0 : 0.5 + words.length * 0.022 }}
                    className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10"
                  >
                    <span className="flex items-center gap-4">
                      <Avatar t={t} i={index} size={52} />
                      <span>
                        <span className="block text-base font-semibold">{t.name}</span>
                        <span className="block text-sm text-slate-500">
                          {t.role}, {t.company}
                        </span>
                      </span>
                    </span>

                    {t.result && (
                      <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        {t.result}
                      </span>
                    )}
                  </motion.figcaption>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Autoplay progress */}
            {!reduce && (
              <div className="h-1 w-full bg-slate-100" aria-hidden="true">
                <div
                  className="h-full origin-left bg-blue-600"
                  style={{ transform: "scaleX(var(--p, 0))" }}
                />
              </div>
            )}
          </motion.figure>

          {/* Client rail */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            role="tablist"
            aria-label="Choose a testimonial"
            className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:justify-between lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {testimonials.map((x, i) => {
              const on = i === index
              return (
                <button
                  key={x.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  className={[
                    "relative flex min-w-[240px] flex-1 items-center gap-3.5 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 lg:min-w-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                    on
                      ? "border-slate-200 bg-white shadow-[0_18px_36px_-22px_rgba(15,23,42,.35)]"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <Avatar t={x} i={i} size={42} />
                  <span className="min-w-0">
                    <span className={"block truncate text-[15px] font-semibold " + (on ? "text-slate-950" : "text-slate-700")}>
                      {x.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {x.role}, {x.company}
                    </span>
                  </span>
                  {on && !reduce && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-100">
                      <span className="block h-full origin-left bg-blue-600" style={{ transform: "scaleX(var(--p, 0))" }} />
                    </span>
                  )}
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Marquee: short praise, two rows in opposite directions */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 space-y-4 sm:mt-20"
      >
        <MarqueeRow items={rowItems} />
        <MarqueeRow items={[...rowItems].reverse()} reverse />
      </motion.div>
    </section>
  )
}
