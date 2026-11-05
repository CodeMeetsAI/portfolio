"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  useInView,
} from "motion/react";

import {
  BrainCircuit,
  RotateCw,
  ArrowLeft,
  ArrowUpRight,
  Globe,
  Zap,
  Network,
  MapPin,
  Mail,
} from "lucide-react";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";

interface Stat {
  value: string;
  label: string;
}

interface AIEngineerIDCardProps {
  profileImage?: string;
  name?: string;
  roles?: string[];
  about?: string;
  location?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  stats?: Stat[];
}

const skills = [
  "Python",
  "PyTorch",
  "OpenCV",
  "YOLO",
  "LangChain",
  "RAG",
  "FastAPI",
  "Next.js",
];

// const highlights = [
//   { icon: BrainCircuit, title: "Intelligent Systems", description: "AI agents that reason, interact and execute tasks." },
//   { icon: Zap, title: "Real-World AI", description: "Turning machine learning into practical industry solutions." },
//   { icon: Network, title: "Connected Technology", description: "Integrating models, APIs and modern software systems." },
// ];

const RAD = 180 / Math.PI;
const GRAVITY = 26;
const DAMPING = 0.9;
const CARD_K = 70;
const CARD_C = 5;
const CARD_COUPLING = 0.55;
const MAX_ANGLE = 1.3;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const RIPPLE_MASK =
  "radial-gradient(circle closest-side, transparent 42%, #000 64%, transparent 86%)";

function Ripple({
  x,
  y,
  onDone,
}: {
  x: number;
  y: number;
  onDone: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.12, opacity: 0.95 }}
      animate={{ scale: 1, opacity: 0 }}
      transition={{
        scale: { duration: 1.7, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 1.7, ease: "easeIn" },
      }}
      onAnimationComplete={onDone}
      className="absolute rounded-full"
      style={{
        left: x - 450,
        top: y - 450,
        width: 900,
        height: 900,
        backgroundImage:
          "radial-gradient(circle, rgba(51,65,85,0.75) 1.2px, transparent 1.7px)",
        backgroundSize: "7px 7px",
        WebkitMaskImage: RIPPLE_MASK,
        maskImage: RIPPLE_MASK,
      }}
    />
  );
}

export default function AIEngineerIDCard({
  profileImage = "/logo.jpg",
  name = "Hafiz Muhammad Umar",
  roles = [
    "AI / ML Engineer",
    "Agentic AI Engineer",
    "Full-Stack AI Engineer",
    "AI Automation Engineer",
  ],
  about = "I design and build AI that does real work: machine learning and computer vision models, autonomous agents that plan and act on their own, full-stack AI apps, and automation workflows that remove repetitive tasks. I take ideas from prototype to production-ready deployment.",
  location = "Pakistan",
  email = "hello@example.com",
  linkedin = "https://linkedin.com/in/muhammad-umar-u786/",
  github = "https://github.com/",
  website = "#contact",
  stats = [
    { value: "10+", label: "Projects Built" },
    { value: "4", label: "AI Domains" },
    { value: "3+", label: "Years Learning" },
    { value: "24/7", label: "Curiosity" },
  ],
}: AIEngineerIDCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const bgRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const dragMoved = useRef(false);
  const inView = useInView(columnRef, { once: true, amount: 0.3 });

  const lanyardRotate = useMotionValue(0);
  const cardRotate = useMotionValue(0);
  const sim = useRef({
    a: 0,
    w: 0,
    p: 0,
    pw: 0,
    acc: 0,
    target: 0,
    dragging: false,
    raf: 0,
    last: 0,
  });
  const drag = useRef<{
    id: number;
    x0: number;
    y0: number;
    t0: number;
    moved: boolean;
    px: number;
    py: number;
    off: number;
  } | null>(null);

  const startLoop = () => {
    const s = sim.current;
    if (s.raf) return;
    s.last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;

      if (dt > 0) {
        const prevW = s.w;

        if (s.dragging) {
          const next = s.a + (s.target - s.a) * Math.min(1, dt * 22);
          s.w = (next - s.a) / dt;
          s.a = next;
        } else {
          const acc = -GRAVITY * Math.sin(s.a) - DAMPING * s.w;
          s.w += acc * dt;
          s.a += s.w * dt;
        }

        const raw = clamp((s.w - prevW) / dt, -80, 80);
        s.acc += (raw - s.acc) * Math.min(1, dt * 18);
        const pAcc = -CARD_K * s.p - CARD_C * s.pw - CARD_COUPLING * s.acc;
        s.pw += pAcc * dt;
        s.p = clamp(s.p + s.pw * dt, -0.9, 0.9);
      }

      lanyardRotate.set(-s.a * RAD);
      cardRotate.set(-s.p * RAD);

      const still =
        !s.dragging &&
        Math.abs(s.a) < 0.0008 &&
        Math.abs(s.w) < 0.004 &&
        Math.abs(s.p) < 0.0008 &&
        Math.abs(s.pw) < 0.004;

      if (still) {
        s.a = s.w = s.p = s.pw = s.acc = 0;
        lanyardRotate.set(0);
        cardRotate.set(0);
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(step);
    };

    s.raf = requestAnimationFrame(step);
  };

  const push = (v: number) => {
    sim.current.w += v;
    startLoop();
  };

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => push(2.8), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const s = sim.current;
    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, []);

  const addRipple = (clientX: number, clientY: number) => {
    const bg = bgRef.current?.getBoundingClientRect();
    if (!bg) return;
    setRipples((r) => [
      ...r.slice(-3),
      { id: ++rippleId.current, x: clientX - bg.left, y: clientY - bg.top },
    ]);
  };

  const onCardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("a,button")) return;
    const pivot = pivotRef.current?.getBoundingClientRect();
    if (!pivot) return;

    dragMoved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    const s = sim.current;
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      t0: performance.now(),
      moved: false,
      px: pivot.left,
      py: pivot.top,
      off:
        Math.atan2(e.clientX - pivot.left, e.clientY - pivot.top) - s.a,
    };
    s.dragging = true;
    s.target = s.a;
    startLoop();
  };

  const onCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 6) {
      d.moved = true;
    }
    const ang = Math.atan2(e.clientX - d.px, e.clientY - d.py) - d.off;
    sim.current.target = clamp(ang, -MAX_ANGLE, MAX_ANGLE);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    sim.current.dragging = false;

    const isClick =
      !cancelled && !d.moved && performance.now() - d.t0 < 400;

    if (isClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      const side = e.clientX - (rect.left + rect.width / 2) >= 0 ? -1 : 1;
      push(side * 2.2);
      setFlipped((f) => !f);
    }
    dragMoved.current = d.moved;
    startLoop();
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 22, stiffness: 120, mass: 0.7 };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineBg = useTransform(
    shineX,
    (x) => `linear-gradient(115deg, transparent ${x}, rgba(59,130,246,0.10), transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="about"
      onClick={(e) => {
        if (dragMoved.current) {
          dragMoved.current = false;
          return;
        }
        addRipple(e.clientX, e.clientY);
      }}
      className="relative overflow-hidden bg-[#f8fafc] px-5 pb-24 pt-28 text-slate-900 sm:px-8 lg:pb-32 lg:pt-32"
    >
      <div ref={bgRef} className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-100/70 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-100/70 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {ripples.map((r) => (
          <Ripple
            key={r.id}
            x={r.x}
            y={r.y}
            onDone={() =>
              setRipples((list) => list.filter((i) => i.id !== r.id))
            }
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-black" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-black">
                About Me
                </span>
              </div>

              <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Engineering
                <span className="block bg-black bg-clip-text text-transparent">
                  Intelligence into Reality.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-10"
            >
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-white px-4 py-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-slate-600">
                  Open to AI engineering opportunities
                </span>
              </div>

              <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                Hi, I&apos;m <span className="text-blACK">{name}.</span>
              </h3>
              <p className="mt-2 text-base font-semibold text-slate-500">
                {roles.join(" · ")}
              </p>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                I build intelligent systems that connect artificial intelligence
                with real-world applications  autonomous AI agents Full-Stack
                AI Native Apps Computer vision solutions LLM Powered products and
                automated workflows.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                From model engineering to production ready deployment I enjoy
                turning challenging ideas into practical scalable technology.
              </p>

              {/* <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                  >
                    <p className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-2xl font-extrabold text-transparent">
                      {s.value}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div> */}

              <div className="mt-11 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-1 hover:bg-blue-600"
                >
                  Let&apos;s Connect
                  <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600"
                >
                  <FaLinkedinIn size={15} />
                  LinkedIn Profile
                </a>
              </div>
            </motion.div>
          </div>

          <div
            ref={columnRef}
            className="order-1 -mt-28 flex flex-col items-center lg:order-2 lg:-mt-32 lg:justify-self-end"
          >
            <motion.div
              initial={{ y: -700, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: -700, opacity: 0 }}
              transition={{
                y: { type: "spring", stiffness: 60, damping: 15, mass: 1.1 },
                opacity: { duration: 0.3 },
              }}
              className="relative flex w-full flex-col items-center"
            >
              <div
                ref={pivotRef}
                className="pointer-events-none absolute left-1/2 top-0 h-0 w-0"
              />

              <motion.div
                style={{ rotate: lanyardRotate, transformOrigin: "50% 0%" }}
                className="relative flex w-full flex-col items-center"
              >
                <div className="absolute left-1/2 top-52 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-400/20 blur-[90px]" />

                <div className="relative z-20 flex flex-col items-center">
                  <div className="relative h-[140px] w-10 overflow-hidden border-x border-white/70 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 shadow-md">
                    <div className="absolute inset-x-2 top-0 h-full border-x border-dashed border-white/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </div>
                  <div className="h-4 w-7 rounded-t-md border border-slate-300 bg-gradient-to-b from-white to-slate-400 shadow-sm" />
                  <div className="h-6 w-4 rounded-b-lg border border-slate-400 bg-gradient-to-b from-slate-300 to-slate-500 shadow-md" />
                  <div className="relative -mt-1 h-4 w-6 rounded-full border-[3px] border-slate-400" />
                </div>

                <motion.div
                  onPointerDown={onCardPointerDown}
                  onPointerMove={onCardPointerMove}
                  onPointerUp={(e) => endDrag(e)}
                  onPointerCancel={(e) => endDrag(e, true)}
                  style={{
                    rotate: cardRotate,
                    transformOrigin: "50% 0%",
                    perspective: 1600,
                    touchAction: "pan-y",
                  }}
                  className="relative z-10 -mt-2 w-[min(380px,90vw)] cursor-grab select-none active:cursor-grabbing"
                >
                  <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={resetTilt}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  >
                    <motion.div
                      animate={{ rotateY: flipped ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 110, damping: 15, mass: 0.9 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="relative h-[540px] w-full"
                    >
                      {/* FRONT */}
                      <div
                        className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border-[5px] border-slate-900 bg-white shadow-[0_35px_80px_rgba(15,23,42,0.35)]"
                        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                      >
                        <div className="relative h-[300px] shrink-0 overflow-hidden bg-slate-900">
                          <img
                            src={profileImage}
                            alt={name}
                            draggable={false}
                            className="h-full w-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                          <div className="absolute bottom-5 left-6 right-6">
                            <h3 className="text-2xl font-bold tracking-tight text-white">
                              {name}
                            </h3>
                            <p className="mt-0.5 text-sm font-medium text-white/80">{roles[0]}</p>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-center gap-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            {roles.map((r) => (
                              <span
                                key={r}
                                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700"
                              >
                                {r}
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                            <span className="flex items-center gap-3">
                              <MapPin size={16} className="text-blue-600" /> {location}
                            </span>
                            <span className="flex items-center gap-3">
                              <Mail size={16} className="text-blue-600" /> {email}
                            </span>
                          </div>
                        </div>

                        <motion.div
                          style={{ background: shineBg }}
                          className="pointer-events-none absolute inset-0 z-20"
                        />
                      </div>

                      {/* BACK */}
                      <div
                        className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border-[5px] border-slate-900 bg-white shadow-[0_35px_80px_rgba(15,23,42,0.35)]"
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        <div className="bg-slate-900 px-6 py-5">
                          <h3 className="text-xl font-bold text-white">{name}</h3>
                          <p className="mt-1 text-xs leading-5 text-slate-300">
                            {roles.join(" · ")}
                          </p>
                        </div>

                        <div className="flex-1 px-6 py-5">
                          <p className="text-xs font-semibold text-slate-400">What I do</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{about}</p>

                          <p className="mt-5 text-xs font-semibold text-slate-400">Skills</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {skills.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
                          <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-700 transition hover:border-blue-500 hover:bg-blue-50">
                            <FaLinkedinIn size={15} />
                          </a>
                          <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-slate-500 hover:bg-slate-100">
                            <FaGithub size={15} />
                          </a>
                          <a href={website} aria-label="Website"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-slate-500 hover:bg-slate-100">
                            <Globe size={15} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* <div className="mt-8 flex flex-col items-center">
              <motion.button
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setFlipped((f) => !f);
                  push(1.4);
                }}
                className="relative z-20 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-md shadow-slate-900/5 transition hover:border-blue-300 hover:text-blue-600"
              >
                {flipped ? <ArrowLeft size={14} /> : <RotateCw size={14} />}
                {flipped ? "VIEW FRONT SIDE" : "EXPLORE BACK SIDE"}
              </motion.button>

              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Drag to swing · Click to flip
              </p>
            </div> */}
          </div>
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid gap-5 border-t border-slate-200 pt-10 sm:grid-cols-3"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-900/[0.04]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="mt-2 text-xs leading-6 text-slate-500">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div> */}
      </div>
    </section>
  );
}
