"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Bot,
  BellRing,
  Camera,
  Cpu,
  Database,
  FileSpreadsheet,
  Globe,
  LayoutDashboard,
  ListChecks,
  Plug,
  Radio,
  Ruler,
  ScanEye,
  SlidersHorizontal,
  Sparkles,
  Target,
  Video,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Stage = {
  label: string
  detail: string
  icon: LucideIcon
  /** The step where the AI/model does the work. */
  model?: boolean
}

type Project = {
  id: string
  name: string
  category: string
  summary: string
  stages: Stage[]
  stack: string[]
  code?: string
  live?: string
}

const projects: Project[] = [
  {
    id: "baku-property-intelligence",
    name: "Baku Property Intelligence",
    category: "AI Agent & Data Engine",
    summary:
      "A lightweight desktop application that scrapes real estate portals across Azerbaijan, deduplicates listings, executes LLM qualification on decision-makers, and exports Word and Excel dossiers.",
    stages: [
      { label: "Target Scraping", detail: "Scrapes real estate portals & agencies", icon: Globe },
      { label: "AI Qualification", detail: "LLM verifies verified decision-makers", icon: Bot, model: true },
      { label: "Lead Scoring", detail: "Filters high-intent prospects", icon: ListChecks },
      { label: "Report Generation", detail: "Exports formatted Word/Excel briefs", icon: FileSpreadsheet },
    ],
    stack: ["Streamlit", "Python", "Playwright", "LLM APIs", "Pandas"],
  },
  {
    id: "industrial-fabric-inspection",
    name: "Industrial Fabric Anomaly Detection",
    category: "Computer Vision",
    summary:
      "A high-throughput computer vision pipeline engineered to inspect woven fabric and carpet surfaces, pinpointing structural anomalies, tears, and weave inconsistencies on active production lines.",
    stages: [
      { label: "Sensor Capture", detail: "High-resolution frames of woven lines", icon: Camera },
      { label: "Defect Detection", detail: "Custom vision model classifies flaws", icon: ScanEye, model: true },
      { label: "Tolerance Check", detail: "Compares anomaly scores with QA rules", icon: Target },
      { label: "Production Alert", detail: "Dispatches instant reject signals", icon: BellRing },
    ],
    stack: ["YOLO", "OpenCV", "PyTorch", "Python", "Industrial Vision"],
  },
  {
    id: "continuous-width-monitoring",
    name: "Continuous Web Width Monitoring",
    category: "Computer Vision & Edge",
    summary:
      "Real-time edge measurement system that processes industrial camera feeds to continuously calculate edge-to-edge material width and detect deviations from required mill tolerances.",
    stages: [
      { label: "IP Stream", detail: "RTSP capture from inspection camera", icon: Video },
      { label: "Edge Calibration", detail: "Sub-pixel line and boundary detection", icon: Ruler, model: true },
      { label: "Width Analytics", detail: "Live millimetre deviation measurement", icon: SlidersHorizontal },
      { label: "Live Telemetry", detail: "Pushes live trends to plant monitor", icon: LayoutDashboard },
    ],
    stack: ["OpenCV", "RTSP", "Python", "NumPy", "Edge Computing"],
  },
  {
    id: "autonomous-mcp-agents",
    name: "Autonomous Agentic MCP Workflows",
    category: "Agentic AI",
    summary:
      "Autonomous agent architectures integrating the Model Context Protocol (MCP) to plan, execute multi-step tool calls, and orchestrate external APIs with self-correcting execution loops.",
    stages: [
      { label: "Prompt / Task", detail: "Receives raw business objective", icon: Sparkles },
      { label: "Agent Reasoning", detail: "Decomposes execution path and tools", icon: Bot, model: true },
      { label: "MCP Protocol", detail: "Invokes external APIs and databases", icon: Plug },
      { label: "Structured Output", detail: "Validates schema and confirms result", icon: Database },
    ],
    stack: ["MCP", "Claude / GPT", "LangChain", "FastAPI", "Python"],
  },
  {
    id: "dahua-surveillance-bridge",
    name: "IP Security Camera Stream Bridge",
    category: "Video Analytics",
    summary:
      "A network camera pipeline integrating Dahua hardware streams via RTSP for real-time video analytics, frame buffering, and automated event triggers without cloud reliance.",
    stages: [
      { label: "Dahua Feed", detail: "H.264/H.265 RTSP streams via LAN", icon: Video },
      { label: "Frame Ingestion", detail: "Optimized ring buffer with OpenCV", icon: Radio },
      { label: "Event Detection", detail: "Infers movement and spatial triggers", icon: ScanEye, model: true },
      { label: "Local Logging", detail: "Saves snapshots & alerts securely", icon: BellRing },
    ],
    stack: ["Dahua IPC", "RTSP", "OpenCV", "FFmpeg", "Python"],
  },
  {
    id: "adaptive-edtech-engine",
    name: "Adaptive EdTech Diagnostic Engine",
    category: "Educational AI",
    summary:
      "An intelligent assessment assistant tailored for the Cambridge Grade 7 curriculum (Mathematics, ICT, and Science), generating step-by-step concept breakdowns and automated diagnostic sheets.",
    stages: [
      { label: "Curriculum Map", detail: "Loads Cambridge syllabus concepts", icon: ListChecks },
      { label: "Pedagogical LLM", detail: "Generates tailored step-by-step aids", icon: Cpu, model: true },
      { label: "Exercise Generator", detail: "Builds structured problem sets", icon: Sparkles },
      { label: "Study Sheet", detail: "Compiles clean, exportable study sheets", icon: FileSpreadsheet },
    ],
    stack: ["LLM Agents", "FastAPI", "LaTeX", "Python", "Prompt Engineering"],
  },
]

export default function Projects() {
  const [active, setActive] = React.useState(0)
  const reduce = useReducedMotion()
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const project = projects[active]

  const move = (to: number) => {
    const next = (to + projects.length) % projects.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault()
      move(active + 1)
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault()
      move(active - 1)
    } else if (e.key === "Home") {
      e.preventDefault()
      move(0)
    } else if (e.key === "End") {
      e.preventDefault()
      move(projects.length - 1)
    }
  }

  const t = (delay = 0) => ({ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : delay })

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative w-full border-t border-slate-200 bg-[#f8fafc] py-24 font-['Outfit'] text-slate-950 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-mono uppercase tracking-wider text-slate-900">
              System Architecture Index
            </p>
            <h2
              id="projects-heading"
              className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-950"
            >
              Engineered Deployments.
              <span className="block text-slate-700">From Raw Data to Real-World Output.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-slate-600 lg:text-right">
            Selected projects across Agentic AI, Computer Vision, and Industrial Automation.
            Select any system to inspect its end-to-end processing pipeline.
          </p>
        </div>

        {/* Body */}
        <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-[320px_1fr] lg:gap-8">
          {/* Project index */}
          <div
            role="tablist"
            aria-label="Projects"
            onKeyDown={onKeyDown}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {projects.map((p, i) => {
              const selected = i === active
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${p.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={[
                    "relative shrink-0 rounded-xl px-4 py-3.5 text-left transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fafc]",
                    "max-w-[18rem] lg:max-w-none",
                    selected
                      ? "bg-white shadow-sm ring-1 ring-slate-300"
                      : "hover:bg-slate-100/80 text-slate-600",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute left-0 top-3 bottom-3 hidden w-1 rounded-r-full bg-black transition-opacity lg:block",
                      selected ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "block text-sm font-semibold leading-snug",
                      selected ? "text-black" : "text-slate-700",
                    ].join(" ")}
                  >
                    {p.name}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] text-slate-500">
                    {p.category}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Detail panel */}
          <div
            role="tabpanel"
            id={`panel-${project.id}`}
            aria-labelledby={`tab-${project.id}`}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={t()}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-black/10 bg-slate-100 px-3 py-1 font-mono text-xs font-medium text-slate-900">
                    {project.category}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    0{active + 1} / 0{projects.length}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  {project.summary}
                </p>

                {/* Pipeline */}
                <div
                  className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
                  style={{
                    backgroundImage:
                      "radial-gradient(#cbd5e1 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                >
                  <ol className="grid gap-0 md:grid-cols-4">
                    {project.stages.map((s, i) => {
                      const Icon = s.icon
                      const last = i === project.stages.length - 1
                      return (
                        <motion.li
                          key={s.label}
                          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={t(0.1 + i * 0.1)}
                          className="relative flex gap-4 pb-7 last:pb-0 md:flex-col md:items-center md:gap-3 md:pb-0 md:text-center"
                        >
                          {!last && (
                            <span
                              aria-hidden="true"
                              className="absolute left-6 top-6 h-full w-px bg-slate-300 md:left-1/2 md:h-px md:w-full"
                            />
                          )}

                          <span
                            className={[
                              "relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-transform hover:scale-105",
                              s.model
                                ? "border-black bg-black text-white shadow-md shadow-black/25"
                                : "border-slate-300 bg-white text-slate-700 shadow-sm",
                            ].join(" ")}
                          >
                            <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                          </span>

                          <span className="block pt-0.5 md:px-2 md:pt-0">
                            <span className="block text-sm font-semibold text-slate-950">
                              {s.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-slate-500 md:mx-auto md:max-w-[11rem]">
                              {s.detail}
                            </span>
                          </span>
                        </motion.li>
                      )
                    })}
                  </ol>
                </div>

                <p className="mt-3.5 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-black" aria-hidden="true" />
                  The highlighted step indicates core inference / algorithmic execution.
                </p>

                {/* Footer */}
                <div className="mt-8 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
                    {project.stack.map((s) => (
                      <li
                        key={s}
                        className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-3">
                    {project.code && (
                      <a
                        href={project.code}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                      >
                        View code <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                      >
                        Live demo <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    >
                      Discuss Project Architecture
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}