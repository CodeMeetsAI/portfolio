"use client";

import * as React from "react";
import InkBackground from "@/components/ui/ink-background";

export function AboutSection() {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section id="about" className="relative w-full bg-[#070709] text-zinc-100 py-36 px-6 sm:px-12 lg:px-24 overflow-hidden border-t border-zinc-800/80">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-16 pb-6 border-b border-zinc-800/80">
          <div className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            01 // SYSTEM & ARCHITECT
          </div>
          <div className="font-mono text-[11px] text-zinc-500 tracking-wider hidden sm:block">
            LATENCY: 14ms // SECURE CONTEXT
          </div>
        </div>

        {/* InkBackground Integration with Dark Mode Sleekness */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="group relative mb-28 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 overflow-hidden shadow-2xl transition-all duration-500 hover:border-zinc-700"
        >
          {/* Dynamic Spotlight Glow on Hover */}
          <div 
            className="absolute pointer-events-none -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`
            }}
          />

          <InkBackground
            text="Engineering Intelligence."
            accent="#6366f1"
            className="min-h-[500px] sm:min-h-[580px] flex items-center justify-center bg-transparent text-zinc-100"
          >
            <div className="flex flex-col items-center gap-6 text-center px-6 max-w-xl relative z-30">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 font-mono text-[11px] tracking-widest uppercase backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                AI/ML & Forward Deployed
              </div>
              <p className="text-zinc-300 text-lg sm:text-xl leading-relaxed font-light tracking-tight">
                Architecting autonomous agentic workflows, deterministic multi-agent orchestration, and high-performance production RAG pipelines.
              </p>
              <div className="pointer-events-auto flex items-center gap-4 pt-3">
                <a
                  href="#contact"
                  className="group/btn relative inline-flex h-12 items-center gap-3 rounded-full bg-zinc-100 px-7 font-medium text-sm text-zinc-900 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 shadow-lg shadow-zinc-900/20 cursor-pointer"
                >
                  <span>Initialize Contact</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a
                  href="#work"
                  className="inline-flex h-12 items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-6 font-medium text-sm text-zinc-300 backdrop-blur-md transition-all duration-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 cursor-pointer"
                >
                  View Systems
                </a>
              </div>
            </div>
          </InkBackground>
        </div>

        {/* Asymmetric Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
          
          {/* Left Column: Core Identity & Availability */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
                    SYS.SPEC // 2026.03
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    DEPLOYABLE
                  </span>
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-white mb-4">
                  Muhammad Umar
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  Forward Deployed Engineer specializing in bridging frontier artificial intelligence models with mission-critical backend systems.
                </p>

                <div className="space-y-3 pt-6 border-t border-zinc-800/80 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">LOCATION</span>
                    <span className="text-zinc-200">Pakistan / Global Remote</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">PRIMARY STACK</span>
                    <span className="text-indigo-400">Python, FastAPI, PyTorch</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">AGENT SYSTEMS</span>
                    <span className="text-emerald-400">LangGraph, CrewAI, AutoGen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 font-light text-zinc-400 text-sm leading-relaxed italic">
              <div className="absolute top-3 left-3 text-indigo-500/40 font-serif text-3xl select-none">“</div>
              <p className="relative z-10 pl-4">
                I don't approach AI as an API wrapper. I treat it as an autonomous, engineered execution layer designed for extreme reliability and deterministic output.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-8 text-lg text-zinc-400 leading-relaxed font-light">
            <h4 className="text-2xl sm:text-3xl font-light text-white tracking-tight leading-snug">
              Transforming raw model probabilities into <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">fault-tolerant enterprise systems</span>.
            </h4>
            
            <p>
              The bottleneck of modern AI is no longer capability; it is architecture. Building reliable agentic workflows requires rigorous state management, deterministic error-handling, and robust tool orchestration. That is where my expertise as a Forward Deployed Engineer comes in.
            </p>

            <p>
              Whether engineering low-latency computer vision pipelines for real-time video analytics or orchestrating multi-agent swarms that autonomously execute complex business logic, I ensure every layer is hardened for production loads.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
              {[
                { label: "Uptime Focus", value: "99.9%" },
                { label: "Agent Latency", value: "< 200ms" },
                { label: "Code Integrity", value: "Strict TS/Py" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
                  <div className="font-mono text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="font-mono text-xs text-zinc-500 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Technical Domains (Interactive Grid with Hover Glows) */}
        <div className="mb-32">
          <div className="flex items-center justify-between mb-10">
            <div className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase">
              02 // Core Competencies & Domains
            </div>
            <span className="font-mono text-xs text-zinc-600">6 MODULES ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                title: "Agentic AI & Multi-Agent Systems",
                desc: "Autonomous workflow execution, decentralized reasoning, and dynamic tool orchestration engines.",
                tag: "CORE EXPERTISE",
              },
              {
                num: "02",
                title: "LLM Engineering & RAG",
                desc: "Advanced vector retrieval pipelines, hybrid search, context optimization, and model fine-tuning.",
                tag: "PRODUCTION READY",
              },
              {
                num: "03",
                title: "Computer Vision Systems",
                desc: "Real-time object detection, image segmentation, and high-throughput visual intelligence.",
                tag: "LOW LATENCY",
              },
              {
                num: "04",
                title: "AI Workflow Automation",
                desc: "Enterprise integrations, asynchronous task queues, and intelligent operational automation.",
                tag: "SCALABLE",
              },
              {
                num: "05",
                title: "Production Infrastructure",
                desc: "Scalable FastAPI backends, Docker containerization, cloud deployment, and system telemetry.",
                tag: "ROBUST",
              },
              {
                num: "06",
                title: "Full-Stack AI Products",
                desc: "Translating sophisticated machine learning models into intuitive, high-performance web applications.",
              },
            ].map((item) => (
              <div 
                key={item.num}
                className="group relative p-8 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/60 hover:-translate-y-1.5 shadow-lg overflow-hidden"
              >
                {/* Subtle top glow bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs font-semibold text-zinc-500 group-hover:text-indigo-400 transition-colors">
                    {item.num}
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 tracking-wider">
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-lg font-medium text-white mb-3 tracking-tight group-hover:text-indigo-200 transition-colors">
                  {item.title}
                </h4>

                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {item.desc}
                </p>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                  <span>STATUS</span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Ecosystem (Sleek Terminal Matrix) */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase">
              03 // Technology Ecosystem
            </div>
            <span className="font-mono text-xs text-zinc-600">VERIFIED STACK</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { category: "AI & LLM", tools: ["OpenAI", "Anthropic", "Gemini", "OpenRouter"] },
              { category: "Agents", tools: ["OpenAI Agents SDK", "LangGraph", "CrewAI", "AutoGen"] },
              { category: "Vector & RAG", tools: ["Qdrant", "Embeddings", "Retrieval Pipelines"] },
              { category: "Backend", tools: ["Python", "FastAPI", "Flask", "Node.js", "TypeScript"] },
              { category: "Infrastructure", tools: ["Docker", "REST APIs", "Git", "Cloud Deploy"] },
            ].map((cat) => (
              <div 
                key={cat.category} 
                className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40"
              >
                <h5 className="font-mono text-[11px] uppercase tracking-wider text-indigo-400 mb-4 pb-2 border-b border-zinc-800/80 flex items-center justify-between">
                  <span>{cat.category}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                </h5>
                <ul className="space-y-2.5 font-mono text-xs text-zinc-300">
                  {cat.tools.map((t) => (
                    <li key={t} className="flex items-center gap-2.5 group/item">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover/item:bg-indigo-400 transition-colors" />
                      <span className="group-hover/item:text-white transition-colors">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutSection;
