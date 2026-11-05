"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

/*
 * Skills (grid version): eight discipline cards on a white background.
 * Cards tilt in 3D toward the cursor with a coloured spotlight, tools float
 * slightly forward, and the filter chips dim everything outside one group.
 *
 * This is a second option. It uses id="skills" like the floating-tiles
 * version, so use only one of them on a page.
 * Needs: motion (already used on your site).
 */

type Group = "web" | "ai" | "applied"

const groups: { id: Group; label: string; color: string }[] = [
  { id: "web", label: "Web", color: "#2563eb" },
  { id: "ai", label: "AI & ML", color: "#7c3aed" },
  { id: "applied", label: "Applied AI", color: "#059669" },
]
const colorOf = (g: Group) => groups.find((x) => x.id === g)!.color
const labelOf = (g: Group) => groups.find((x) => x.id === g)!.label

type Skill = { title: string; blurb: string; tools: string[]; group: Group }

const skills: Skill[] = [
  {
    title: "Frontend",
    blurb: "Fast, accessible interfaces that feel effortless to use.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Motion"],
    group: "web",
  },
  {
    title: "Backend",
    blurb: "Reliable APIs and data layers that hold up under load.",
    tools: ["FastAPI", "Node.js", "PostgreSQL", "REST APIs", "Docker"],
    group: "web",
  },
  {
    title: "Full-Stack",
    blurb: "Whole products, from the database to the deployed interface.",
    tools: ["Next.js", "MERN Stack", "Authentication", "Deployment", "Testing"],
    group: "web",
  },
  {
    title: "AI / ML",
    blurb: "Models that are trained, evaluated and shipped to production.",
    tools: ["Python", "PyTorch", "TensorFlow", "scikit-learn", "Hugging Face"],
    group: "ai",
  },
  {
    title: "Computer Vision",
    blurb: "Systems that detect, track and inspect from images and video.",
    tools: ["OpenCV", "YOLO", "Object Tracking", "RTSP Streams", "Anomaly Detection"],
    group: "ai",
  },
  {
    title: "Agentic AI",
    blurb: "Agents that plan, use tools and finish multi-step work.",
    tools: ["LangChain", "MCP", "Tool Use", "Multi-agent", "Memory and RAG"],
    group: "applied",
  },
  {
    title: "AI Automation",
    blurb: "Workflows that remove repetitive work from end to end.",
    tools: ["n8n", "LLM APIs", "Webhooks", "Playwright", "Scheduling"],
    group: "applied",
  },
  {
    title: "FDE",
    blurb: "Forward deployed engineering: working with clients to turn AI into solutions that run in their business.",
    tools: ["Discovery", "Rapid Prototyping", "Integration", "Handover and Training", "Support"],
    group: "applied",
  },
]

function Card({
  skill,
  index,
  dimmed,
  reduce,
}: {
  skill: Skill
  index: number
  dimmed: boolean
  reduce: boolean
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 220, damping: 22, mass: 0.5 }
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), spring)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), spring)

  const color = colorOf(skill.group)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    mx.set(px - 0.5)
    my.set(py - 0.5)
    el.style.setProperty("--sx", px * 100 + "%")
    el.style.setProperty("--sy", py * 100 + "%")
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: reduce ? 0 : (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        animate={{ opacity: dimmed ? 0.22 : 1, scale: dimmed ? 0.97 : 1 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }}
        className="h-full"
      >
        <motion.div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_48px_-28px_rgba(15,23,42,.28)] transition-shadow duration-300 hover:shadow-[0_34px_60px_-28px_rgba(15,23,42,.38)]"
        >
          {/* Spotlight that follows the cursor */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(260px circle at var(--sx, 50%) var(--sy, 0%), " + color + "1f, transparent 60%)",
            }}
          />
          {/* Accent line that grows on hover */}
          <span
            aria-hidden="true"
            className="absolute left-6 top-0 h-[3px] w-10 rounded-b-full transition-all duration-500 group-hover:w-[calc(100%-3rem)]"
            style={{ background: color }}
          />

          <div className="relative flex flex-1 flex-col" style={{ transform: reduce ? undefined : "translateZ(26px)" }}>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
              {labelOf(skill.group)}
            </span>

            <h3 className="mt-4 text-[22px] font-semibold tracking-tight text-slate-950">{skill.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{skill.blurb}</p>

            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={skill.title + " tools"}>
              {skill.tools.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors duration-300 group-hover:bg-slate-950 group-hover:text-white"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </motion.li>
  )
}

export default function SkillsGrid() {
  const reduce = !!useReducedMotion()
  const [active, setActive] = React.useState<Group | "all">("all")

  const count = (g: Group) => skills.filter((s) => s.group === g).length
  const chips: { id: Group | "all"; label: string; color?: string; n: number }[] = [
    { id: "all", label: "All", n: skills.length },
    ...groups.map((g) => ({ id: g.id, label: g.label, color: g.color, n: count(g.id) })),
  ]

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative isolate w-full overflow-hidden border-t border-slate-200 bg-white py-24 font-['Outfit'] text-slate-950 sm:py-28 lg:py-32"
    >
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-100/60 blur-[130px]" />
        <div className="absolute -right-40 bottom-10 h-[460px] w-[460px] rounded-full bg-violet-100/50 blur-[140px]" />
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
            <p className="text-sm font-medium text-slate-500">Skills</p>
            <h2
              id="skills-heading"
              className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              From Interface to Intelligence.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Eight areas I work in, from the screen a user sees to the models and agents behind it.
            </p>
          </div>

          <div role="group" aria-label="Filter skills by group" className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const on = active === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(c.id)}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                    on
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950",
                  ].join(" ")}
                >
                  {c.color && <span className="h-2 w-2 rounded-full" style={{ background: c.color }} aria-hidden="true" />}
                  {c.label}
                  <span className="text-xs tabular-nums text-slate-400">{c.n}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Grid */}
        <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s, i) => (
            <Card
              key={s.title}
              skill={s}
              index={i}
              reduce={reduce}
              dimmed={active !== "all" && s.group !== active}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
