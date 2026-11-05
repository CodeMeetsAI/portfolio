import * as React from "react";

interface Domain {
  number: string;
  title: string;
  description: string;
}

const DOMAINS: Domain[] = [
  {
    number: "01",
    title: "Agentic AI",
    description: "Multi-agent systems, autonomous workflows, tool orchestration, and intelligent execution engines.",
  },
  {
    number: "02",
    title: "LLM Engineering",
    description: "Production LLM applications, RAG pipelines, context management, prompt architecture, and model integrations.",
  },
  {
    number: "03",
    title: "Computer Vision",
    description: "Real-world visual intelligence, object detection, segmentation, and high-performance image processing.",
  },
  {
    number: "04",
    title: "AI Automation",
    description: "Enterprise workflow automation, intelligent API integrations, and measurable operational efficiency.",
  },
  {
    number: "05",
    title: "AI Infrastructure",
    description: "Scalable backend architecture, robust API design, system observability, and production deployment.",
  },
  {
    number: "06",
    title: "Product Engineering",
    description: "Translating sophisticated concepts into functional, highly polished, production-grade software products.",
  },
];

export function EngineeringDomains() {
  return (
    <div className="w-full py-16">
      <div className="mb-12">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          02 / DOMAINS OF EXPERTISE
        </span>
        <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Where I Engineer.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOMAINS.map((domain) => (
          <div
            key={domain.number}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-foreground/25 hover:bg-card/80 hover:-translate-y-1 shadow-sm"
          >
            <div className="absolute top-0 right-0 p-6 pointer-events-none">
              <span className="font-mono text-sm font-medium text-muted-foreground/40 group-hover:text-foreground/80 transition-colors">
                {domain.number}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-semibold tracking-tight text-foreground mb-3 pr-8">
                {domain.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {domain.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>SYSTEM MODULE</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/80 group-hover:scale-125 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
