import * as React from "react";

interface TechCategory {
  category: string;
  items: string[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    category: "AI & LLM",
    items: ["OpenAI", "Anthropic", "Gemini", "OpenRouter"],
  },
  {
    category: "Agent Frameworks",
    items: ["OpenAI Agents SDK", "LangGraph", "CrewAI", "AutoGen"],
  },
  {
    category: "Vector Search & RAG",
    items: ["Qdrant", "Embeddings", "Retrieval Pipelines"],
  },
  {
    category: "Backend & Engineering",
    items: ["Python", "FastAPI", "Flask", "Node.js", "TypeScript"],
  },
  {
    category: "Infrastructure",
    items: ["Docker", "REST APIs", "Git", "Cloud Deployment"],
  },
];

export function TechnologyStack() {
  return (
    <div className="w-full py-16">
      <div className="mb-12">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          04 / TECH ECOSYSTEM
        </span>
        <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Tools & Technologies.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TECH_CATEGORIES.map((cat) => (
          <div
            key={cat.category}
            className="flex flex-col justify-between p-8 rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm shadow-sm"
          >
            <div>
              <h4 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-6 pb-3 border-b border-border/40">
                {cat.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-lg border border-border/80 bg-background/60 text-xs font-medium text-foreground tracking-tight shadow-2xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
