"use client";

import * as React from "react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen pt-24 pb-12 px-6 flex items-center justify-center overflow-hidden bg-[#070709] text-white">
      {/* Background Soft Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full pointer-events-none blur-[100px] z-0"
        style={{ background: "radial-gradient(circle, rgba(60,44,255,0.2) 0%, transparent 70%)" }}
      />

      {/* Hero Content Block */}
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-6 relative z-10">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 font-mono text-xs tracking-wider uppercase backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3c2cff] shadow-[0_0_8px_#3c2cff]" />
          Forward Deployed Engineer
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
          I Make Intelligence <br className="hidden sm:inline" />
          Operational
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-400 max-w-md sm:max-w-xl leading-relaxed">
          Building production-ready AI systems, agentic architectures, and intelligent software applications.
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href="mailto:contact@muhammadumar.ai"
            className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-semibold text-slate-950 rounded-full bg-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(60,44,255,0.65)] active:scale-95 cursor-pointer"
          >
            {/* Primary Liquid Wave Layer */}
            <span className="absolute left-[-50%] top-[110%] w-[200%] h-[500%] rounded-[40%] bg-gradient-to-tr from-[#3c2cff] via-[#4f40ff] to-[#6355ff] transition-all duration-700 ease-out group-hover:top-[-100%] animate-wave-slow pointer-events-none" />

            {/* Secondary Liquid Wave Layer */}
            <span className="absolute left-[-50%] top-[115%] w-[200%] h-[500%] rounded-[43%] bg-[#3c2cff]/75 transition-all duration-700 delay-75 ease-out group-hover:top-[-100%] animate-wave-fast pointer-events-none" />

            {/* Button Text */}
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Get in touch
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Hero;
