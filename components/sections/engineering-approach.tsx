import * as React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Understand",
    description: "Deeply analyze the actual business problem, technical constraints, and operational requirements.",
  },
  {
    number: "02",
    title: "Architect",
    description: "Design robust AI architectures, intelligent agent workflows, and seamless system integrations.",
  },
  {
    number: "03",
    title: "Engineer",
    description: "Build, rigorously test, optimize performance, and weave the components into a cohesive system.",
  },
  {
    number: "04",
    title: "Deploy",
    description: "Deliver production-ready solutions engineered for reliability, scalability, and measurable outcomes.",
  },
];

export function EngineeringApproach() {
  return (
    <div className="w-full py-16">
      <div className="mb-12">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          03 / EXECUTION PIPELINE
        </span>
        <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          From Problem to Production.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {STEPS.map((step, idx) => (
          <div
            key={step.number}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-foreground/25 hover:bg-card/70 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full border border-border/80 bg-background/50 text-foreground">
                  STAGE {step.number}
                </span>
                <span className="font-mono text-xs text-muted-foreground/50">
                  0{idx + 1} / 04
                </span>
              </div>

              <h4 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {step.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>PHASE STATUS</span>
              <span className="text-foreground font-medium">READY</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
