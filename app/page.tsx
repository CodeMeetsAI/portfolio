"use client";

import * as React from "react";
import { DotField } from "@/components/ui/dot-field";
import Header from "@/components/Header";
import AboutSection from "@/components/about";
import Projects from "@/components/project";
import Services from "@/components/servces";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Experience from "@/components/Experience";

function useGeist() {
  React.useEffect(() => {
    const id = "geist-font";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}

const pill =
  "inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium tracking-[-0.02em] outline-none transition-transform active:scale-[.97] focus-visible:ring-2 focus-visible:ring-ring cursor-pointer";

export default function Home() {
  useGeist();

  return (
    <div className="w-full bg-background text-foreground min-h-screen flex flex-col">
      <Header/>
      <DotField
        headline="I Make Intelligence Operational"
        description="Building production-ready AI systems, agentic architectures, and intelligent software applications."
        scrollScatter={false}
        actions={
          <>
            <a
              href="mailto:contact@muhammadumar.ai"
              className={`${pill} bg-foreground text-background hover:opacity-95`}
            >
              Get in touch
            </a>
          </>
        }
      />
      <AboutSection/>
      <Services/>
      <Projects/>
        <Skills />
        <Experience />
        <Contact/>
        <Testimonials />
        <Footer/>

    </div>
  );
}
