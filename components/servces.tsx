"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "motion/react"
import { BrainCircuit, Cpu, Layers3, ScanEye, Workflow } from "lucide-react"
import type { LucideIcon } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

/*
 * Services: an orbit carousel. The service "orb" sits on the left; changing
 * service swings it out over the top on a wide orbit while the next one swings
 * in from the other side. The two-weight title wipes out and back in, the info
 * card cross-fades, and a pastel arc behind the scene turns and takes the
 * service's colour.
 *
 * The page scroll drives it: the stage pins and each stretch of scroll brings
 * the next service. After the last one the page scrolls on normally.
 * Arrows, thumbnails, the side pager, arrow keys and swipes jump too.
 *
 * Install once:  npm install gsap
 *
 * IMPORTANT: the pinned stage uses `position: sticky`, so no parent of this
 * component may have `overflow: hidden / auto / clip` (including your page
 * layout wrappers), or the pin will not hold.
 */

export type Service = {
  /** The thin first title line. */
  title: string
  /** The heavy second title line. */
  subtitle: string
  icon: LucideIcon
  /** Two-line label under the thumbnail. Defaults to title + subtitle. */
  label?: string
  /** Small line above the title. Defaults to "Service 0n". */
  eyebrow?: string
  /** Bold line in the info card. */
  headline: string
  /** Small grey line under the headline. */
  kicker: string
  /** Keep to ~130 characters so it fits the card. */
  description: string
  stack: string[]
  /** Orb, badge and arc colour: hex or rgb(), so the arc can morph between services. */
  accent: string
  /** Darker partner colour for the orb's shading. */
  accent2: string
}

// #region carousel
export function stepDirection(from: number, to: number): 1 | -1 {
  return to >= from ? 1 : -1
}

/** First thumbnail shown in the strip window, keeping the current one in view. */
export function stripStart(index: number, n: number, visible: number): number {
  if (n <= visible) return 0
  return Math.max(0, Math.min(index - 1, n - visible))
}

/** Title font size so a line of `chars` characters fits `width` px at `em` average glyph width. */
export function fitSize(chars: number, max: number, width: number, em: number): number {
  return Math.min(max, width / (Math.max(1, chars) * em))
}

/**
 * The pastel band: a thick stroke along the orbs' orbit circle, tapering at
 * both ends. Angles in degrees, screen space (0 = right, 90 = straight down).
 */
export function arcPath(a0: number, a1: number, cx: number, cy: number, r: number, w: number, steps = 48): string {
  const outer: string[] = []
  const inner: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45)
    const c = Math.cos(a)
    const s = Math.sin(a)
    outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1))
    inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1))
  }
  return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z"
}

/** Where the band rests for each service, as [start, end] angles along the orbit. */
export const ARC_REST = [[50, 98], [46, 124], [60, 126], [40, 100]]
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length]
}

/** The band mid-swap: it stretches to trail between the outgoing and incoming orb. */
export const ARC_SWEEP = [38, 146]
// #endregion

// The orbs' orbit: its pivot sits above the canvas (the .sv-orbit transform-origin).
const ORBIT_X = 299
const ORBIT_Y = -450
const ORBIT_R = 650
const SCROLL_PER_ITEM = 0.7 // stage heights of scroll per service
const SWING = 50 // degrees the orb travels round the orbit's pivot
const ITEM = 118 // thumbnail pitch in canvas px
const VISIBLE = 4

const FONT = "Outfit"

const CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');" +
  ".sv-trk{position:relative;width:100%}" +
  ".sv-root{--color-background:#f8fafc;--color-foreground:#0f172a;--color-muted-foreground:#64748b;--color-primary:#2563eb;" +
  "position:sticky;top:0;overflow:hidden;width:100%;background:var(--color-background);color:var(--color-foreground);" +
  "font-family:" + FONT + ",ui-sans-serif,system-ui,sans-serif;container-type:inline-size;-webkit-tap-highlight-color:transparent}" +
  ".sv-root *{box-sizing:border-box}" +
  ".sv-bg{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(#334155 1px,transparent 1px);background-size:24px 24px;opacity:.04}" +
  ".sv-blob{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none}" +
  ".sv-root:focus-visible{outline:2px solid var(--color-primary);outline-offset:-4px}" +
  ".sv-canvas{position:absolute;left:50%;top:50%;width:960px;height:520px;transform:translate(-50%,-50%) scale(var(--sv-s,1));transform-origin:50% 50%}" +
  ".sv-arc{position:absolute;left:0;top:0;width:960px;height:520px;overflow:visible;pointer-events:none}" +
  ".sv-btn{appearance:none;border:0;background:none;color:inherit;font:inherit;padding:0;margin:0;cursor:pointer;text-decoration:none}" +
  ".sv-btn:focus-visible,.sv-cta:focus-visible{outline:2px solid var(--color-primary);outline-offset:3px;border-radius:10px}" +
  ".sv-ico{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
  ".sv-count{position:absolute;left:800px;top:52px;font-size:13px;font-weight:600;letter-spacing:.08em;font-variant-numeric:tabular-nums;color:var(--color-muted-foreground)}" +
  ".sv-count b{color:var(--color-foreground);font-weight:700}" +
  ".sv-pager{position:absolute;left:76px;top:172px;display:flex;flex-direction:column;align-items:center;gap:7px}" +
  ".sv-dot{width:14px;height:10px;display:grid;place-items:center}" +
  ".sv-dot i{display:block;width:3px;height:3px;border-radius:3px;background:var(--color-foreground);opacity:.45;transition:height .45s cubic-bezier(.3,.7,.2,1),opacity .3s}" +
  ".sv-dot[aria-current] i{height:22px;opacity:.9}" +
  ".sv-dot[aria-current]{height:26px}" +
  ".sv-dot{transition:height .45s cubic-bezier(.3,.7,.2,1)}" +
  ".sv-plates{position:absolute;left:130px;top:82px;width:245px;height:245px;touch-action:pan-y}" +
  ".sv-orbit{position:absolute;inset:0;transform-origin:69% -217%;visibility:hidden;will-change:transform}" +
  // the orb: dashed outer ring, shaded disc, glass core, icon
  ".sv-orb{position:relative;display:grid;place-items:center;border-radius:50%;flex:none}" +
  ".sv-orb i{position:absolute;border-radius:50%}" +
  ".sv-orb .r1{inset:0;border:1.5px dashed color-mix(in oklab,var(--a) 60%,transparent)}" +
  ".sv-orb .r2{inset:9%;background:radial-gradient(circle at 30% 22%,color-mix(in oklab,var(--a) 65%,#fff) 0%,var(--a) 45%,var(--b) 100%);" +
  "box-shadow:inset 0 -10px 24px rgba(0,0,0,.18),inset 0 8px 18px rgba(255,255,255,.35)}" +
  ".sv-orb .r3{inset:27%;border:1px solid rgba(255,255,255,.55);background:rgba(255,255,255,.14)}" +
  ".sv-orb svg{position:relative;width:34%;height:34%;color:#fff;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))}" +
  ".sv-orbit>.sv-orb{width:245px;height:245px;filter:drop-shadow(0 16px 22px rgba(15,23,42,.22)) drop-shadow(0 3px 5px rgba(15,23,42,.12))}" +
  ".sv-head{position:absolute;left:388px;top:96px;width:330px;height:150px}" +
  ".sv-hd{position:absolute;inset:0;visibility:hidden}" +
  ".sv-eye{font-size:12.5px;font-weight:600;letter-spacing:.01em;margin:0 0 4px 2px;color:var(--color-primary)}" +
  ".sv-t1,.sv-t2{display:block;white-space:nowrap;line-height:1;text-transform:uppercase;margin:0}" +
  ".sv-t1{font-weight:200;letter-spacing:-.015em;margin-top:6px}" +
  ".sv-t2{font-weight:800;letter-spacing:-.025em;margin-top:6px;color:color-mix(in oklab,var(--color-foreground) 86%,transparent)}" +
  ".sv-acts{position:absolute;left:396px;top:280px;display:flex;gap:44px;font-size:12.5px;font-weight:500}" +
  ".sv-acts .sv-btn{display:flex;align-items:center;gap:9px;padding:4px 0}" +
  ".sv-acts .sv-ico{width:13px;height:13px}" +
  ".sv-card{position:absolute;left:722px;top:137px;width:223px;padding:18px 20px 20px;border-radius:20px;" +
  "background:color-mix(in oklab,#fff 72%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);" +
  "box-shadow:0 0 0 1px color-mix(in oklab,var(--color-foreground) 7%,transparent),0 18px 40px -24px rgba(15,23,42,.3)}" +
  ".sv-tabs{display:flex;justify-content:space-between;padding:0 6px 0 20px;font-size:12px;margin-bottom:20px}" +
  ".sv-tab{color:var(--color-muted-foreground);font-weight:500;padding:3px 0}" +
  ".sv-tab[aria-selected=true]{color:var(--color-foreground);font-weight:600}" +
  ".sv-bodies{display:grid}" +
  ".sv-body{grid-area:1/1;visibility:hidden}" +
  ".sv-rate{position:relative;height:62px;margin:0 0 14px 6px}" +
  ".sv-badge{position:absolute;left:0;top:0;width:46px;height:62px;border-radius:10px;display:grid;place-items:center;" +
  "font-size:24px;font-weight:700;letter-spacing:-.03em;color:#0f172a}" +
  ".sv-chef{font-size:17px;font-weight:600;letter-spacing:-.01em;line-height:1.15;margin:0}" +
  ".sv-kit{font-size:10.5px;color:var(--color-muted-foreground);margin:4px 0 12px;text-transform:uppercase;letter-spacing:.12em}" +
  ".sv-desc{font-size:12.5px;line-height:1.4;margin:0;min-height:52px}" +
  ".sv-ing{display:flex;flex-wrap:wrap;gap:5px;margin:0;padding:0;list-style:none;min-height:52px}" +
  ".sv-ing li{font-size:11px;padding:4px 9px;border-radius:99px;background:color-mix(in oklab,var(--color-foreground) 7%,transparent)}" +
  ".sv-cta{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:9px 15px;border-radius:99px;font-size:11.5px;font-weight:600;" +
  "background:var(--color-foreground);color:var(--color-background);text-decoration:none;transition:background .25s}" +
  ".sv-cta:hover{background:var(--color-primary)}" +
  ".sv-cta .sv-ico{width:13px;height:13px}" +
  ".sv-strip{position:absolute;left:130px;top:362px;width:550px;height:122px;display:flex;align-items:center}" +
  ".sv-arrow{width:36px;height:36px;display:grid;place-items:center;flex:none}" +
  ".sv-arrow:disabled{opacity:.3;cursor:default}" +
  ".sv-arrow svg{width:12px;height:16px;fill:currentColor}" +
  ".sv-win{position:relative;width:" + ITEM * VISIBLE + "px;height:122px;overflow:hidden;flex:none;margin:0 2px;" +
  "-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}" +
  ".sv-track{position:absolute;left:0;top:0;display:flex;transition:transform .6s cubic-bezier(.65,0,.35,1)}" +
  ".sv-th{width:" + ITEM + "px;height:122px;display:flex;justify-content:center;padding-top:3px}" +
  ".sv-th .sv-btn{width:80px;height:116px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:7px;padding-top:9px;transition:background .45s}" +
  ".sv-th .sv-btn[aria-current]{background:color-mix(in oklab,#fff 70%,transparent);box-shadow:0 10px 24px -16px rgba(15,23,42,.35)}" +
  ".sv-th .sv-orb{width:56px;height:56px;filter:drop-shadow(0 4px 6px rgba(15,23,42,.18));transition:transform .45s}" +
  ".sv-th .sv-btn[aria-current] .sv-orb{transform:scale(1.08)}" +
  ".sv-th span{font-size:10px;line-height:1.25;text-align:center;font-weight:500;color:color-mix(in oklab,var(--color-foreground) 78%,transparent);max-width:78px}" +
  ".sv-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@container (max-width:639px){" +
  ".sv-canvas{position:relative;left:auto;top:auto;width:100%;height:auto;transform:none;display:flex;flex-direction:column;align-items:center;padding:14px 16px 18px}" +
  ".sv-arc{width:200%;height:auto;left:-60%;top:-30px}" +
  ".sv-count{position:relative;left:auto;top:auto;align-self:flex-end}" +
  ".sv-pager{left:14px;top:150px}" +
  ".sv-plates{position:relative;left:auto;top:auto;width:min(52vw,32svh);height:min(52vw,32svh);margin-top:0}" +
  ".sv-orbit>.sv-orb{width:100%;height:100%}" +
  ".sv-head{position:relative;left:auto;top:auto;width:100%;height:132px;margin-top:10px}" +
  ".sv-hd{text-align:center;transform:scale(.78);transform-origin:50% 0}" +
  ".sv-acts{position:relative;left:auto;top:auto;margin-top:4px}" +
  ".sv-card{position:relative;left:auto;top:auto;width:100%;max-width:420px;margin-top:12px}" +
  // phone: the pinned stage has to fit one screen; the pager, swipes and scroll cover the strip
  ".sv-strip{display:none}" +
  "}" +
  "@media (prefers-reduced-motion:reduce){.sv-track,.sv-dot,.sv-dot i,.sv-th .sv-btn,.sv-th .sv-orb{transition:none}}"

const HIDE_1 = "inset(0% 0% 0% 100%)" // thin line: wipes in from the right
const HIDE_2 = "inset(0% 100% 0% 0%)" // heavy line: wipes in from the left
const SHOW = "inset(0% 0% 0% 0%)"

const Icon = {
  arrow: (
    <svg className="sv-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  grid: (
    <svg className="sv-ico" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </svg>
  ),
}

const pad = (v: number) => String(v).padStart(2, "0")

function Orb({ service }: { service: Service }) {
  const S = service.icon
  return (
    <div className="sv-orb" style={{ "--a": service.accent, "--b": service.accent2 } as React.CSSProperties}>
      <i className="r1" />
      <i className="r2" />
      <i className="r3" />
      <S aria-hidden="true" strokeWidth={1.5} />
    </div>
  )
}

export function ServiceOrbitCarousel({
  services,
  height = "100svh",
  onChange,
  className,
}: {
  services: Service[]
  /** Pinned stage height. A definite length: percentages collapse on a host page. */
  height?: string
  onChange?: (index: number) => void
  className?: string
}) {
  const n = services.length
  const [index, setIndex] = useState(0)
  const [tab, setTab] = useState("overview")

  const trackRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const segRef = useRef(0)
  const indexRef = useRef(0)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const orbits = useRef<(HTMLDivElement | null)[]>([])
  const heads = useRef<(HTMLDivElement | null)[]>([])
  const bodies = useRef<(HTMLDivElement | null)[]>([])
  const arcRef = useRef<SVGPathElement | null>(null)
  const arc = useRef({ a0: 0, a1: 0 })
  const shown = useRef(-1)
  const dirRef = useRef<1 | -1>(1)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const reducedRef = useRef(false)
  const swipe = useRef<{ x: number; y: number } | null>(null)

  // Fit the 960 x 520 design canvas to the root. Measured on resize only.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      el.style.setProperty("--sv-s", String(Math.min(w / 960, h / 520, 1.6)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => (reducedRef.current = mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  // The swap. Every service is in the DOM; GSAP only moves the outgoing and incoming ones.
  useLayoutEffect(() => {
    const from = shown.current
    const to = index
    const parts = (i: number) => {
      const head = heads.current[i]
      return {
        orbit: orbits.current[i],
        head,
        eye: head && head.querySelector(".sv-eye"),
        t1: head && head.querySelector(".sv-t1"),
        t2: head && head.querySelector(".sv-t2"),
        body: bodies.current[i],
      }
    }
    // Writes the band's path only; no layout is read.
    const drawArc = () => arcRef.current?.setAttribute("d", arcPath(arc.current.a0, arc.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118))
    const rest = arcRest(to)
    const tint = services[to] ? services[to].accent : "transparent"
    if (tlRef.current) tlRef.current.progress(1).kill()
    const b = parts(to)
    if (from === -1 || from === to || reducedRef.current) {
      for (let i = 0; i < n; i++) {
        if (i !== to) {
          const p = parts(i)
          gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0 })
        }
      }
      gsap.set([b.orbit, b.head, b.body, b.eye], { autoAlpha: 1, rotation: 0, y: 0 })
      gsap.set(b.t1, { clipPath: SHOW })
      gsap.set(b.t2, { clipPath: SHOW })
      arc.current.a0 = rest[0]
      arc.current.a1 = rest[1]
      drawArc()
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint })
      shown.current = to
      return
    }
    const a = parts(from)
    const d = dirRef.current
    const tl = gsap.timeline({ onComplete: () => { tlRef.current = null } })
    tlRef.current = tl
    // orb: out over the top on the orbit, the next one swings in from the far side
    tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: "power2.in" }, 0)
      .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
      .fromTo(b.orbit, { autoAlpha: 1, rotation: -SWING * d }, { rotation: 0, duration: 0.95, ease: "power3.out" }, 0.3)
    // title: thin line clips away to the right, heavy line to the left, then the next wipes in
    tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: "power2.in" }, 0)
      .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: "power2.in" }, 0.06)
      .to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0)
      .set(a.head, { autoAlpha: 0 }, 0.5)
      .set(b.head, { autoAlpha: 1 }, 0.5)
      .fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.55)
      .fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.55)
      .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.62)
    // card: cross-fade, the incoming rows rise in turn
    tl.to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" }, 0.05)
      .set(b.body, { autoAlpha: 1, y: 0 }, 0.4)
    if (b.body) tl.fromTo(b.body.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.4)
    // the band stretches along the orbit with the orbs, then settles into the next span, morphing colour
    tl.to(arc.current, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.6, ease: "power2.inOut", onUpdate: drawArc }, 0)
      .to(arc.current, { a0: rest[0], a1: rest[1], duration: 0.85, ease: "power3.out", onUpdate: drawArc }, 0.6)
    if (arcRef.current) tl.to(arcRef.current, { fill: tint, duration: 1.1, ease: "power1.inOut" }, 0.1)
    shown.current = to
  }, [index, n, services])

  useEffect(() => () => { tlRef.current?.kill() }, [])

  const select = (next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return
    dirRef.current = dir
    indexRef.current = next
    setIndex(next)
    onChangeRef.current?.(next)
  }

  // The page scroll drives the service: the stage pins, one stretch of scroll per
  // service, snapping between them. Past the last one the page scrolls on.
  const steps = Math.max(0, n - 1)
  useEffect(() => {
    const track = trackRef.current
    if (!track || steps < 1) return
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      snap: { snapTo: 1 / steps, duration: { min: 0.3, max: 0.8 }, delay: 0.08, ease: "power2.inOut" },
      onUpdate: (self) => {
        const seg = Math.round(self.progress * steps)
        if (seg === segRef.current) return
        const dir = seg > segRef.current ? 1 : -1
        segRef.current = seg
        select(seg, dir)
      },
    })
    stRef.current = trigger
    return () => {
      trigger.kill()
      stRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps])

  // Buttons, keys and swipes jump to a service and move the scroll to its stretch, so the two stay in step.
  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return
    const next = Math.min(n - 1, Math.max(0, to))
    if (next === index) return
    const st = stRef.current
    if (st) {
      const y = st.scroll()
      if (y >= st.start - 1 && y <= st.end + 1) {
        segRef.current = next
        st.scroll(st.start + ((st.end - st.start) * next) / steps)
      }
    }
    select(next, dir ?? stepDirection(index, next))
  }
  const step = (d: 1 | -1) => go(index + d, d)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1) }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) }
  }
  const onPointerDown = (e: React.PointerEvent) => { swipe.current = { x: e.clientX, y: e.clientY } }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) step(dx < 0 ? 1 : -1)
  }

  const start = stripStart(index, n, VISIBLE)
  const current = services[index]

  return (
    <div
      ref={trackRef}
      className={"sv-trk" + (className ? " " + className : "")}
      style={{ height: "calc(" + height + " * " + (1 + steps * SCROLL_PER_ITEM) + ")" }}
    >
      <div
        ref={rootRef}
        className="sv-root"
        style={{ height }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Services"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <style>{CSS}</style>
        <div className="sv-bg" />
        <div className="sv-blob" style={{ right: -160, top: 40, width: 420, height: 420, background: "rgba(221,214,254,.7)" }} />
        <div className="sv-blob" style={{ left: -160, bottom: 20, width: 420, height: 420, background: "rgba(191,219,254,.7)" }} />

        <div className="sv-canvas">
          <svg className="sv-arc" viewBox="0 0 960 520" aria-hidden="true">
            <path ref={arcRef} style={{ opacity: 0.34 }} />
          </svg>

          <div className="sv-count" aria-hidden="true">
            <b>{pad(index + 1)}</b> / {pad(n)}
          </div>

          <div className="sv-pager" role="tablist" aria-label="Choose a service">
            {services.map((s, i) => (
              <button
                key={s.title + s.subtitle}
                type="button"
                role="tab"
                className="sv-btn sv-dot"
                aria-selected={i === index}
                aria-current={i === index ? "true" : undefined}
                aria-label={s.title + " " + s.subtitle}
                onClick={() => go(i)}
              >
                <i />
              </button>
            ))}
          </div>

          <div
            className="sv-plates"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            {services.map((s, i) => (
              <div
                key={s.title + s.subtitle}
                ref={(el) => { orbits.current[i] = el }}
                className="sv-orbit"
                aria-hidden={i !== index}
              >
                <Orb service={s} />
              </div>
            ))}
          </div>

          <div className="sv-head" aria-live="polite">
            {services.map((s, i) => (
              <div
                key={s.title + s.subtitle}
                ref={(el) => { heads.current[i] = el }}
                className="sv-hd"
                aria-hidden={i !== index}
              >
                <p className="sv-eye">{s.eyebrow ?? "Service " + pad(i + 1)}</p>
                <h3 style={{ margin: 0, font: "inherit" }}>
                  <span className="sv-t1" style={{ fontSize: fitSize(s.title.length, 56, 330, 0.56) + "px" }}>{s.title}</span>
                  <span className="sv-t2" style={{ fontSize: fitSize(s.subtitle.length, 62, 320, 0.64) + "px" }}>{s.subtitle}</span>
                </h3>
              </div>
            ))}
          </div>

          <div className="sv-acts">
            <a className="sv-btn" href="#contact">{Icon.arrow}Discuss this service</a>
            <a className="sv-btn" href="#projects">{Icon.grid}See related work</a>
          </div>

          <div className="sv-card">
            <div className="sv-tabs" role="tablist" aria-label="Service details">
              {["overview", "stack"].map((t) => (
                <button key={t} type="button" role="tab" className="sv-btn sv-tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                  {t === "overview" ? "Overview" : "Tech stack"}
                </button>
              ))}
            </div>
            <div className="sv-bodies">
              {services.map((s, i) => (
                <div
                  key={s.title + s.subtitle}
                  ref={(el) => { bodies.current[i] = el }}
                  className="sv-body"
                  aria-hidden={i !== index}
                >
                  <div className="sv-rate">
                    <div className="sv-badge" style={{ background: s.accent }}>{pad(i + 1)}</div>
                  </div>
                  <p className="sv-chef">{s.headline}</p>
                  <p className="sv-kit">{s.kicker}</p>
                  {tab === "overview" ? (
                    <p className="sv-desc">{s.description}</p>
                  ) : (
                    <ul className="sv-ing">{s.stack.map((x) => <li key={x}>{x}</li>)}</ul>
                  )}
                  <a className="sv-cta" href="#contact" tabIndex={i === index ? 0 : -1}>
                    Get in touch{Icon.arrow}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="sv-strip">
            <button type="button" className="sv-btn sv-arrow" aria-label="Previous service" disabled={index === 0} onClick={() => step(-1)}>
              <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M11 0v16L0 8z" /></svg>
            </button>
            <div className="sv-win">
              <div className="sv-track" style={{ transform: "translateX(" + -start * ITEM + "px)" }}>
                {services.map((s, i) => (
                  <div key={s.title + s.subtitle} className="sv-th">
                    <button type="button" className="sv-btn" aria-current={i === index ? "true" : undefined} onClick={() => go(i)}>
                      <Orb service={s} />
                      <span>{s.label ?? s.title + " " + s.subtitle}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className="sv-btn sv-arrow" aria-label="Next service" disabled={index === n - 1} onClick={() => step(1)}>
              <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M1 0v16l11-8z" /></svg>
            </button>
          </div>
        </div>

        <p className="sv-sr" aria-live="polite">
          {current ? "Service " + (index + 1) + " of " + n + ": " + current.title + " " + current.subtitle : ""}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Services section (default export)                                  */
/* ------------------------------------------------------------------ */

// PLACEHOLDER COPY: edit titles, descriptions and stacks to match what you
// really offer. Keep each description around 130 characters.
const services: Service[] = [
  {
    title: "Agentic",
    subtitle: "AI Agents",
    label: "AI Agents",
    icon: BrainCircuit,
    headline: "Autonomous multi-agent systems",
    kicker: "Agentic AI",
    description:
      "Agents that plan, use tools and work together to finish multi-step tasks, built on LLMs with MCP and clear guardrails.",
    stack: ["LLM Agents", "MCP", "Python", "FastAPI", "LangChain"],
    accent: "#a78bfa",
    accent2: "#6d28d9",
  },
  {
    title: "Computer",
    subtitle: "Vision",
    label: "Computer Vision",
    icon: ScanEye,
    headline: "Detection & visual inspection",
    kicker: "Computer Vision",
    description:
      "Real-time detection, tracking and inspection models trained on your data and deployed to run on live camera feeds.",
    stack: ["YOLO", "OpenCV", "PyTorch", "Python"],
    accent: "#60a5fa",
    accent2: "#1d4ed8",
  },
  {
    title: "LLM",
    subtitle: "Engineering",
    label: "LLM Engineering",
    icon: Cpu,
    headline: "RAG, fine-tuning & LLM apps",
    kicker: "LLM Engineering",
    description:
      "Retrieval-augmented assistants and fine-tuned models that answer from your own data, with sources and evaluation.",
    stack: ["RAG", "Fine-tuning", "Vector DB", "FastAPI"],
    accent: "#6ee7b7",
    accent2: "#047857",
  },
  {
    title: "AI",
    subtitle: "Automation",
    label: "AI Automation",
    icon: Workflow,
    headline: "Intelligent workflow automation",
    kicker: "AI Automation",
    description:
      "Connect your APIs and tools with n8n and LLM steps to remove repetitive manual work from your daily operations.",
    stack: ["n8n", "APIs", "Webhooks", "LLMs"],
    accent: "#fdba74",
    accent2: "#c2410c",
  },
  {
    title: "Full-stack",
    subtitle: "AI Apps",
    label: "Full-stack AI Apps",
    icon: Layers3,
    headline: "From model to product",
    kicker: "Full-stack AI",
    description:
      "Production web apps around the model: clean interfaces, solid APIs and deployment, so the AI is actually usable.",
    stack: ["Next.js", "FastAPI", "Docker", "TypeScript"],
    accent: "#f9a8d4",
    accent2: "#be185d",
  },
]

export default function Services({ items = services }: { items?: Service[] }) {
  // No overflow-hidden here: the carousel pins itself with position: sticky.
  return (
    <section id="services" className="relative bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8 lg:pb-14 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"
        >
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-black" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-black">
                Services
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              How I Can
              <span className="block bg-black bg-clip-text text-transparent">
                Help You Build.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-slate-500 lg:text-right">
            From a first prototype to a production system, here is where I can
            add the most value. Scroll to move through the services.
          </p>
        </motion.div>
      </div>

      <ServiceOrbitCarousel services={items} />
    </section>
  )
}
