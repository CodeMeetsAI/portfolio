"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, ArrowUpRight, Check, Copy, Mail, MessageCircle } from "lucide-react"

/*
 * Contact page: a full animated world globe, direct contact details, a
 * validated form and the next steps, all aligned in one two-column layout.
 *
 * NO extra package needed. The globe is drawn on a canvas by this file
 * (you can run `npm uninstall cobe` if you installed it).
 *
 * 1. Fill in CONTACT below (email, WhatsApp, and optional links).
 *    LinkedIn / GitHub rows only appear when you fill in their links.
 * 2. To receive form messages, pick ONE (both are free):
 *      - Web3Forms:  NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key
 *      - Formspree:  NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxx
 *    With neither set, the form opens the visitor's email app with the
 *    message pre-filled, so it still works while you set things up.
 */

const CONTACT = {
  available: true,
  email: "umarshabbir.ai@gmail.com", // TODO: your email
  whatsapp: "+92-307252073", // TODO: number with country code, no spaces
  whatsappLabel: "+92-3072502073", // how it appears on the page
  linkedin: "", // optional: https://www.linkedin.com/in/your-name
  github: "", // optional: https://github.com/your-name
  responseTime: "within 24 hours",
  home: null as [number, number] | null, // optional: your city as [latitude, longitude]
  homeName: "Based here",
  regions: ["Europe", "Middle East", "Asia", "North America"], // TODO: time zones you overlap with
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
  endpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT,
}

const projectTypes = ["AI Agent", "Computer Vision", "Full-Stack App", "AI Automation", "Something else"]

const steps = [
  { title: "You share the idea", text: "A few lines on the problem and what success looks like." },
  { title: "I reply with a plan", text: `Questions, a rough approach and timeline, ${CONTACT.responseTime}.` },
  { title: "We scope and start", text: "Agree the details, then I build in clear, reviewable steps." },
]

type Values = { name: string; email: string; message: string; type: string; company: string }
type Status = "idle" | "sending" | "success" | "error"

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v: Values) {
  const e: Partial<Record<"name" | "email" | "message", string>> = {}
  if (!v.name.trim()) e.name = "Please enter your name."
  if (!emailRe.test(v.email.trim())) e.email = "Please enter a valid email address."
  if (v.message.trim().length < 20) e.message = "Tell me a little more (at least 20 characters)."
  return e
}

/* ------------------------------------------------------------------ */
/*  The world: a self-drawn, draggable, rotating dotted globe          */
/* ------------------------------------------------------------------ */

// Land mask: 1 bit per grid dot (rows of latitude, evenly spaced in longitude).
const MASK = "AAkAAOAPAAAA+xAgAAD6DwMIAMDHHwCEAQAAhh8AgAcAAPnhAwDhLwAAPA4/AAD9zwAceT3+AAb4/3/J/4sYPwAf3/////z/P+cDwP/v//9/+f9/DA8Dbv////8f/P+/GQ4C/v//////4f//xwUDAPf//////wPf/x84AADg/v////8zAAb/P7gAAMDz/////wcBQMD/H3wAAIb7/////wcGAAD+/+MHAMA4//////+BAwAA/v/vDwDA4v//////DxgAAED///kHAKD9//////9/EAAAAP7//z8AAOT///////8XAAAAAP7//2MAAPD///////8/AAAAAOD//28MAAD+////////HwAAAADA////AgAA8P/h+f////8AAAAAAPj//y8AAAC8fnD+////fwQAAAAA8P//HwAAAH7MA8f/////RwAAAAAA/P//AwAAAB/IO8//////QQAAAAAA8P//DwAAAHiA9n/+////FQgAAAAAAPz//wEAAAA8IPJ//v///zEMAAAAAADw//8HAAAAQHwA9f////8/xgAAAAAAAPj//wEAAADgPwD6/////z/wAAAAAAAAwP//AwAAAID/AeD//////4MBAAAAAAAA+P8/AAAAAPD/Mfj//////wMAAAAAAAAA4P8zAAAAAOD////P/////w8AAAAAAAAAAP0DBAAAAAD+////+/////8DAAAAAAAAAID+AAIAAACA////+dP/////AwAAAAAAAAAA8gMAAAAAAP7//98/gf///w8AAAAAAAAAAAA+AAAAAADg////8//g////CQAAAAAAAAAAAB+QAAAAAPD////3/0D/+38AAAAAAAAAAAAAfAwMAAAAwP///5//AfzDPwAAAAAAAAAAAADA5wAGAAAA/P////MfgD/4EwAAAAAAAAAAAADgHwAAAAAA//////kD4Af8AQYAAAAAAAAAAAAAfgAQAACA//////kBwAPwBwQAAAAAAAAAAAAA8AAAAAAA/v///+8AAA/AHzAAAAAAAAAAAAAAAAYAAAAA8P////8AAHAA9AEGAAAAAAAAAAAAAEDwAQAAAP7///+fAwAOgBwgAAAAAAAAAAAAAACQ/gcAAAD/////fwCAAyAAIAAAAAAAAAAAAAAA0P8DAACA/////x8AAAEQABgAAAAAAAAAAAAAAMD/AwAAAH/+//8PAAAAMEACAAAAAAAAAAAAAADA/z8AAAAA9P//DwAAACTgAAAAAAAAAAAAAAAAwP9/AAAAAOD//wcAAABQ8AAAAAAAAAAAAAAAAMD//wAAAADg//8HAAAA8PAjAAAAAAAAAAAAAIDA//8CAAAAwP//BwAAAIDhCwEAAAAAAAAAAAAAgP//PwAAAID//wcAAAAAzhOQIAAAAAAAAAAAAAD///8DAAAA/v8HAAAAABxkwg8AAAAAAAAAAAAA/v//HwAAAPj/BwAAAAAQoAA+AgAAAAAAAAAAAP7//x8AAAD8/wcAAAAAsAAAPwgAAAAAAAAAAAD+//8PAAAA/P8DAAAAAAAigBMAAAAAAAAAAAAA////AwAAAP//AAAAAAAAEAAIAAAAAAAAAAAAwP//PwAAAOD/vwAAAAAAAAAAAAAAAAAAAAAAAPz//wEAAAD//0EAAAAAAACPAAAAAAAAAAAAAOD//wcAAAD8/w8BAAAAAIAdBgAAAAAAAAAAAAD//x8AAAD4/48DAAAAAMB/BgABAAAAAAAAAAD+/w8AAAD8/+EAAAAAAPD/AwAQAAAAAAAAAID//wEAAAD/HxwAAAAAgP9/AAAAAAAAAAAAAPz/BwAAAPh/YAgAAACA//8DCAAAAAAAAAAA+P8HAAAA8P9wAAAAAOD//wMAAAAAAAAAAAD+fwAAAAD8PwwAAAAA/P//AAAAAAAAAAAA4P8DAAAA4H8AAAAAAOD//wcAAAAAAAAAAMD/BwAAAMD/AAAAAADg//8DAAAAAAAAAADw/wAAAADwDwAAAAAA/P9/AAAAAAAAAACA/wMAAACAPwAAAAAA+P//AAAAAAAAAACA/wEAAACADwAAAAAAfPAfAAAAAAAAAADwPwAAAAA4AAAAAADgAP4AAAAAAAAAAMAfAAAAAAAAAAAAAAAAfgAAAAAAAAAA+AcAAAAAAAAAAAAAAOADQAAAAAAAAOAHAAAAAAAAAAAAAACAAGAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAABEAAAAAAAAA8AAAAAAAAAAAAAAAAAAMAAAAAAHAAAAAAAAAAAAAAAADAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
const STEP = 1.6
const ROWS = Math.round(180 / STEP)

type Hub = { name: string; lat: number; lng: number; label?: boolean }

const HUBS: Hub[] = [
  { name: "London", lat: 51.5072, lng: -0.1276, label: true },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "New York", lat: 40.7128, lng: -74.006, label: true },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194, label: true },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, label: true },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
  { name: "Baku", lat: 40.4093, lng: 49.8671 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, label: true },
  { name: "Sydney", lat: -33.8688, lng: 151.2093, label: true },
]

const ARC_PAIRS: [string, string][] = [
  ["London", "New York"],
  ["London", "Dubai"],
  ["Dubai", "Singapore"],
  ["Singapore", "Sydney"],
  ["New York", "San Francisco"],
  ["Berlin", "Baku"],
  ["Riyadh", "Singapore"],
  ["Toronto", "London"],
]
const HOME_LINKS = ["London", "New York", "Dubai", "Singapore", "Sydney"]

type Vec = [number, number, number]
const rad = (d: number) => (d * Math.PI) / 180
const unit = (lat: number, lng: number): Vec => {
  const p = rad(lat)
  const l = rad(lng)
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)]
}

let DOTS: { lat: Float32Array; lng: Float32Array } | null = null
function getDots() {
  if (DOTS) return DOTS
  const bin = atob(MASK)
  const lat: number[] = []
  const lng: number[] = []
  let i = 0
  for (let r = 0; r < ROWS; r++) {
    const la = 90 - (r + 0.5) * STEP
    if (la > 84 || la < -58) continue
    const n = Math.max(1, Math.round((360 * Math.cos((la * Math.PI) / 180)) / STEP))
    for (let j = 0; j < n; j++, i++) {
      if (bin.charCodeAt(i >> 3) & (1 << (i & 7))) {
        lat.push(rad(la))
        lng.push(rad(-180 + ((j + 0.5) * 360) / n))
      }
    }
  }
  DOTS = { lat: Float32Array.from(lat), lng: Float32Array.from(lng) }
  return DOTS
}

/** Points along the great circle from a to b, lifted above the surface. */
function buildArc(a: Vec, b: Vec, steps = 56): Float32Array {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const w = Math.acos(dot)
  const sw = Math.sin(w) || 1
  const out = new Float32Array((steps + 1) * 3)
  for (let k = 0; k <= steps; k++) {
    const t = k / steps
    const s1 = Math.sin((1 - t) * w) / sw
    const s2 = Math.sin(t * w) / sw
    const alt = 1 + 0.1 * w * Math.sin(Math.PI * t)
    for (let c = 0; c < 3; c++) out[k * 3 + c] = (s1 * a[c] + s2 * b[c]) * alt
  }
  return out
}

const AUTO_SPIN = 0.00016 // radians per millisecond

function Globe({ reduce }: { reduce: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas ? canvas.getContext("2d") : null
    if (!canvas || !ctx) return

    const dots = getDots()
    const N = dots.lat.length
    const sinLat = new Float32Array(N)
    const cosLat = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      sinLat[i] = Math.sin(dots.lat[i])
      cosLat[i] = Math.cos(dots.lat[i])
    }
    const xs = new Float32Array(N)
    const ys = new Float32Array(N)
    const bk = new Uint8Array(N)

    const hubs = HUBS.map((h) => ({ ...h, v: unit(h.lat, h.lng) }))
    const byName = new Map(hubs.map((h) => [h.name, h]))
    const home = CONTACT.home ? { name: CONTACT.homeName, v: unit(CONTACT.home[0], CONTACT.home[1]) } : null

    const arcs: { pts: Float32Array; offset: number; speed: number }[] = []
    ARC_PAIRS.forEach(([a, b], i) => {
      const A = byName.get(a)
      const B = byName.get(b)
      if (A && B) arcs.push({ pts: buildArc(A.v, B.v), offset: i * 0.17, speed: 0.00012 + (i % 3) * 0.00003 })
    })
    if (home) {
      HOME_LINKS.forEach((n, i) => {
        const B = byName.get(n)
        if (B) arcs.push({ pts: buildArc(home.v, B.v), offset: 0.1 + i * 0.19, speed: 0.00014 })
      })
    }

    const st = {
      lam: rad(40),
      phi: 0.38,
      vLam: 0,
      visible: true,
      last: 0,
      size: 0,
      drag: null as null | { x: number; y: number; lam: number; phi: number; t: number },
    }
    let raf = 0

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const size = Math.round(r.width)
      if (!size) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      st.size = size
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    /** Rotate a unit-sphere vector into view space (x right, y up, z toward viewer). */
    const view = (v: ArrayLike<number>, o = 0): Vec => {
      const cl = Math.cos(st.lam)
      const sl = Math.sin(st.lam)
      const cp = Math.cos(st.phi)
      const sp = Math.sin(st.phi)
      const X = v[o]
      const Y = v[o + 1]
      const Z = v[o + 2]
      const x1 = X * cl - Z * sl
      const z1 = X * sl + Z * cl
      return [x1, Y * cp - z1 * sp, Y * sp + z1 * cp]
    }

    const FONT = "Outfit, ui-sans-serif, system-ui, sans-serif"
    const ALPHAS = [0.1, 0.22, 0.38, 0.56, 0.78]

    const draw = (now: number) => {
      const S = st.size
      if (!S) return
      const R = S * 0.4
      const cx = S / 2
      const cy = S / 2
      ctx.clearRect(0, 0, S, S)

      // Atmosphere
      const glow = ctx.createRadialGradient(cx, cy, R * 0.94, cx, cy, R * 1.22)
      glow.addColorStop(0, "rgba(37,99,235,0.16)")
      glow.addColorStop(1, "rgba(37,99,235,0)")
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2)
      ctx.fill()

      // Sphere
      const sg = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.42, R * 0.1, cx, cy, R)
      sg.addColorStop(0, "#ffffff")
      sg.addColorStop(1, "#e5ecfb")
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(15,23,42,0.1)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Land dots
      const cp = Math.cos(st.phi)
      const sp = Math.sin(st.phi)
      for (let i = 0; i < N; i++) {
        const dl = dots.lng[i] - st.lam
        const cd = Math.cos(dl)
        const z = sp * sinLat[i] + cp * cosLat[i] * cd
        if (z <= 0) {
          bk[i] = 255
          continue
        }
        xs[i] = cx + R * cosLat[i] * Math.sin(dl)
        ys[i] = cy - R * (cp * sinLat[i] - sp * cosLat[i] * cd)
        bk[i] = Math.min(4, Math.floor(z * 5))
      }
      const dr = Math.max(0.9, R * 0.0062)
      for (let b = 0; b < 5; b++) {
        ctx.fillStyle = "rgba(30,41,59," + ALPHAS[b] + ")"
        ctx.beginPath()
        for (let i = 0; i < N; i++) {
          if (bk[i] !== b) continue
          ctx.moveTo(xs[i] + dr, ys[i])
          ctx.arc(xs[i], ys[i], dr, 0, Math.PI * 2)
        }
        ctx.fill()
      }

      // Connection arcs with a travelling pulse
      const toScreen = (p: Vec) => [cx + R * p[0], cy - R * p[1]] as const
      const seen = (p: Vec) => p[2] > 0 || p[0] * p[0] + p[1] * p[1] > 1.03
      arcs.forEach((arc) => {
        const n = arc.pts.length / 3
        const P: Vec[] = []
        for (let k = 0; k < n; k++) P.push(view(arc.pts, k * 3))

        ctx.strokeStyle = "rgba(37,99,235,0.28)"
        ctx.lineWidth = 1.2
        ctx.beginPath()
        let pen = false
        for (let k = 0; k < n; k++) {
          if (!seen(P[k])) {
            pen = false
            continue
          }
          const [x, y] = toScreen(P[k])
          if (pen) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
          pen = true
        }
        ctx.stroke()

        const head = (reduce ? arc.offset : arc.offset + now * arc.speed) % 1
        const hi = Math.floor(head * (n - 1))
        const trail = 9
        for (let k = Math.max(1, hi - trail); k <= hi; k++) {
          if (!seen(P[k]) || !seen(P[k - 1])) continue
          const a = (k - (hi - trail)) / trail
          const [x0, y0] = toScreen(P[k - 1])
          const [x1, y1] = toScreen(P[k])
          ctx.strokeStyle = "rgba(37,99,235," + (0.25 + a * 0.7).toFixed(2) + ")"
          ctx.lineWidth = 1.6 + a * 0.8
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
        }
        if (P[hi] && seen(P[hi])) {
          const [hx, hy] = toScreen(P[hi])
          ctx.fillStyle = "#2563eb"
          ctx.beginPath()
          ctx.arc(hx, hy, 2.6, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Markers, pulses and labels
      const fs = Math.max(10, S * 0.021)
      ctx.font = "600 " + fs + "px " + FONT
      ctx.textBaseline = "middle"

      const marker = (v: Vec, name: string | null, big: boolean, idx: number) => {
        const p = view(v)
        if (p[2] <= 0.04) return
        const [px, py] = toScreen(p)
        const fade = Math.min(1, p[2] * 3)
        const color = big ? "#059669" : "#2563eb"
        const rgb = big ? "5,150,105" : "37,99,235"

        if (!reduce) {
          const ph = (now / 1900 + idx * 0.13) % 1
          ctx.strokeStyle = "rgba(" + rgb + "," + ((1 - ph) * 0.5 * fade).toFixed(3) + ")"
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.arc(px, py, 4 + ph * (big ? 20 : 15), 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.globalAlpha = fade
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(px, py, big ? 5 : 3.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 1.6
        ctx.stroke()
        ctx.globalAlpha = 1

        if (name && p[2] > 0.55) {
          const a = Math.min(1, (p[2] - 0.55) * 4)
          const w = ctx.measureText(name).width + 14
          const h = fs + 9
          const left = px > cx
          const x = left ? px - 10 - w : px + 10
          const y = py - h / 2 - 8
          ctx.fillStyle = "rgba(255,255,255," + (0.94 * a).toFixed(2) + ")"
          ctx.strokeStyle = "rgba(15,23,42," + (0.12 * a).toFixed(2) + ")"
          ctx.lineWidth = 1
          ctx.beginPath()
          const r = h / 2
          ctx.moveTo(x + r, y)
          ctx.arcTo(x + w, y, x + w, y + h, r)
          ctx.arcTo(x + w, y + h, x, y + h, r)
          ctx.arcTo(x, y + h, x, y, r)
          ctx.arcTo(x, y, x + w, y, r)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = "rgba(15,23,42," + a.toFixed(2) + ")"
          ctx.fillText(name, x + 7, y + h / 2 + 0.5)
        }
      }

      hubs.forEach((h, i) => marker(h.v, h.label ? h.name : null, false, i))
      if (home) marker(home.v, home.name, true, 99)
    }

    const frame = (now: number) => {
      raf = 0
      const dt = st.last ? Math.min(48, now - st.last) : 16
      st.last = now
      if (!st.drag) {
        st.lam += st.vLam * dt + (reduce ? 0 : AUTO_SPIN * dt)
        st.vLam *= Math.exp(-dt / 450)
      }
      draw(now)
      const moving = !reduce || st.drag || Math.abs(st.vLam) > 1e-5
      if (st.visible && moving) raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      if (!raf && st.visible) {
        st.last = 0
        raf = requestAnimationFrame(frame)
      }
    }

    // Drag to rotate, with a little inertia
    const R_PX = () => st.size * 0.4
    const onDown = (e: PointerEvent) => {
      st.drag = { x: e.clientX, y: e.clientY, lam: st.lam, phi: st.phi, t: e.timeStamp }
      st.vLam = 0
      canvas.setPointerCapture(e.pointerId)
      kick()
    }
    const onMove = (e: PointerEvent) => {
      const d = st.drag
      if (!d) return
      const next = d.lam - (e.clientX - d.x) / R_PX()
      const dtm = e.timeStamp - d.t
      if (dtm > 0) {
        const inst = (next - st.lam) / dtm
        st.vLam = Math.max(-0.004, Math.min(0.004, st.vLam * 0.6 + inst * 0.4))
      }
      d.t = e.timeStamp
      st.lam = next
      st.phi = Math.max(-0.6, Math.min(0.95, d.phi + ((e.clientY - d.y) / R_PX()) * 0.8))
      kick()
    }
    const onUp = () => {
      st.drag = null
      kick()
    }

    resize()
    kick()
    const ro = new ResizeObserver(() => {
      resize()
      kick()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      st.visible = entry.isIntersecting
      if (st.visible) kick()
    })
    io.observe(canvas)
    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive globe with connections between the regions I work with. Drag to rotate."
      style={{ touchAction: "pan-y" }}
      className="block aspect-square w-full cursor-grab select-none active:cursor-grabbing"
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Small inline brand icons (lucide no longer ships brand icons)      */
/* ------------------------------------------------------------------ */

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
)
const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  Contact section                                                    */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const reduce = !!useReducedMotion()
  const [values, setValues] = React.useState<Values>({ name: "", email: "", message: "", type: "", company: "" })
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [status, setStatus] = React.useState<Status>("idle")
  const [note, setNote] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement | null>(null)

  const errors = validate(values)
  const progress = (3 - Object.keys(errors).length) / 3

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }))
  const show = (k: "name" | "email" | "message") => (touched[k] || touched.submit) && errors[k]

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = "mailto:" + CONTACT.email
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true, submit: true })
    if (Object.keys(errors).length || values.company) return // company = honeypot

    setStatus("sending")
    setNote("")
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      project_type: values.type || "Not specified",
      message: values.message.trim(),
    }

    try {
      if (CONTACT.web3formsKey || CONTACT.endpoint) {
        const url = CONTACT.web3formsKey ? "https://api.web3forms.com/submit" : (CONTACT.endpoint as string)
        const body = CONTACT.web3formsKey
          ? { ...payload, access_key: CONTACT.web3formsKey, subject: "New portfolio message from " + payload.name }
          : payload
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Request failed")
        setNote("I will reply to " + payload.email + " " + CONTACT.responseTime + ".")
      } else {
        const subject = encodeURIComponent("Project enquiry: " + payload.project_type)
        const text = encodeURIComponent(payload.message + "\n\n" + payload.name + "\n" + payload.email)
        window.location.href = "mailto:" + CONTACT.email + "?subject=" + subject + "&body=" + text
        setNote("Your email app should open with the message ready to send.")
      }
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  const reset = () => {
    setValues({ name: "", email: "", message: "", type: "", company: "" })
    setTouched({})
    setStatus("idle")
  }

  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el || reduce) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", e.clientX - r.left + "px")
    el.style.setProperty("--my", e.clientY - r.top + "px")
  }

  const field =
    "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-950 placeholder:text-slate-400 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4"
  const ok = "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
  const bad = "border-red-400 focus:border-red-500 focus:ring-red-500/10"

  const rows = [
    {
      label: "WhatsApp",
      value: CONTACT.whatsappLabel,
      href: "https://wa.me/" + CONTACT.whatsapp.replace(/\D/g, ""),
      icon: <MessageCircle size={18} aria-hidden="true" />,
    },
    CONTACT.linkedin && {
      label: "LinkedIn",
      value: "Connect on LinkedIn",
      href: CONTACT.linkedin,
      icon: <LinkedinIcon />,
    },
    CONTACT.github && {
      label: "GitHub",
      value: "See my code",
      href: CONTACT.github,
      icon: <GithubIcon />,
    },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: React.ReactNode }[]

  const iconBox =
    "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 transition-colors group-hover:bg-slate-950 group-hover:text-white"

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate w-full overflow-hidden border-t border-slate-200 bg-[#f8fafc] py-24 font-['Outfit'] text-slate-950 sm:py-28 lg:py-32"
    >
      {/* Background: faint dot grid and two soft washes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-blue-100/70 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-violet-100/60 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div {...reveal(0)} className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {CONTACT.available && (
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-medium text-emerald-800">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for new projects
            </div>
          )}

          <h2 id="contact-heading" className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Have an idea?
            <span className="block">Let&rsquo;s build it.</span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
            Tell me about the problem you want to solve. Whether it is an AI agent, a vision system or a
            full product, I will reply {CONTACT.responseTime}.
          </p>
        </motion.div>

        {/* Two aligned columns */}
        <div className="mt-14 grid items-stretch gap-6 sm:mt-16 lg:grid-cols-2 lg:gap-8">
          {/* Left: the world + direct contact */}
          <div className="order-2 flex flex-col gap-6 lg:order-1 lg:gap-8">
            <motion.div
              {...reveal(0.05)}
              className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,.2)] sm:p-8"
            >
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Remote-first, working worldwide</h3>
                <p className="mt-1 text-sm text-slate-500">
                  I work asynchronously with clear updates and join calls when they help. Drag the globe to look around.
                </p>
              </div>

              <div className="flex flex-1 items-center justify-center py-2">
                <div className="w-full max-w-[540px]">
                  <Globe reduce={reduce} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500">Overlapping hours with</span>
                {CONTACT.regions.map((r) => (
                  <span key={r} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {r}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.ul
              {...reveal(0.1)}
              className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,.15)] sm:px-8"
            >
              <li className="flex items-center justify-between gap-4 py-4">
                <a
                  href={"mailto:" + CONTACT.email}
                  className="group flex min-w-0 items-center gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span className={iconBox}>
                    <Mail size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-slate-500">Email</span>
                    <span className="block truncate text-[15px] font-semibold">{CONTACT.email}</span>
                  </span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <span className="sr-only" aria-live="polite">{copied ? "Email copied to clipboard" : ""}</span>
              </li>

              {rows.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span className={iconBox}>{r.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-slate-500">{r.label}</span>
                        <span className="block truncate text-[15px] font-semibold">{r.value}</span>
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-950 motion-reduce:transition-none"
                    />
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right: form + next steps */}
          <div className="order-1 flex flex-col gap-6 lg:order-2 lg:gap-8">
            <motion.div {...reveal(0.1)} className="flex flex-1 flex-col">
              <div
                ref={cardRef}
                onPointerMove={onCardMove}
                className="group/card relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_60px_-30px_rgba(15,23,42,.25)]"
              >
                {/* Cursor spotlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(37,99,235,.07), transparent 45%)",
                  }}
                />

                {/* Completion bar */}
                <div className="absolute inset-x-0 top-0 h-1 bg-slate-100" aria-hidden="true">
                  <motion.div
                    className="h-full bg-blue-600"
                    animate={{ width: status === "success" ? "100%" : progress * 100 + "%" }}
                    transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
                  />
                </div>

                <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "success" ? (
                      <motion.div
                        key="done"
                        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.4 }}
                        className="flex min-h-[420px] flex-1 flex-col items-center justify-center text-center"
                        role="status"
                      >
                        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                          <motion.circle
                            cx="36" cy="36" r="32" stroke="#10b981" strokeWidth="3"
                            initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: reduce ? 0 : 0.7, ease: "easeOut" }}
                          />
                          <motion.path
                            d="M23 37l9 9 17-19" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.6, ease: "easeOut" }}
                          />
                        </svg>
                        <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                          Thanks, {values.name.trim().split(" ")[0] || "friend"}.
                        </h3>
                        <p className="mt-2 max-w-sm text-[15px] leading-7 text-slate-600">{note}</p>
                        <button
                          type="button"
                          onClick={reset}
                          className="mt-8 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          Send another message
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={onSubmit}
                        noValidate
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.3 }}
                        className="flex flex-1 flex-col gap-6"
                      >
                        <div>
                          <h3 className="text-xl font-semibold tracking-tight">Send me a message</h3>
                          <p className="mt-1 text-sm text-slate-500">All fields are required except the project type.</p>
                        </div>

                        {/* Honeypot, hidden from people */}
                        <div className="absolute -left-[9999px]" aria-hidden="true">
                          <label>
                            Company
                            <input tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
                          </label>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                            <input
                              id="c-name" name="name" autoComplete="name" placeholder="Your name"
                              value={values.name} onChange={set("name")} onBlur={blur("name")}
                              aria-invalid={!!show("name")} aria-describedby={show("name") ? "c-name-err" : undefined}
                              className={field + " " + (show("name") ? bad : ok)}
                            />
                            {show("name") && <p id="c-name-err" className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                          </div>
                          <div>
                            <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                            <input
                              id="c-email" name="email" type="email" autoComplete="email" placeholder="you@company.com"
                              value={values.email} onChange={set("email")} onBlur={blur("email")}
                              aria-invalid={!!show("email")} aria-describedby={show("email") ? "c-email-err" : undefined}
                              className={field + " " + (show("email") ? bad : ok)}
                            />
                            {show("email") && <p id="c-email-err" className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                          </div>
                        </div>

                        <fieldset>
                          <legend className="mb-2 text-sm font-medium text-slate-700">What do you need?</legend>
                          <div className="flex flex-wrap gap-2">
                            {projectTypes.map((t) => {
                              const on = values.type === t
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => setValues((v) => ({ ...v, type: on ? "" : t }))}
                                  className={[
                                    "relative rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                                    on ? "border-slate-950 text-white" : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-950",
                                  ].join(" ")}
                                >
                                  {on && (
                                    <motion.span
                                      layoutId="project-type"
                                      className="absolute inset-0 rounded-[7px] bg-slate-950"
                                      transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
                                    />
                                  )}
                                  <span className="relative">{t}</span>
                                </button>
                              )
                            })}
                          </div>
                        </fieldset>

                        <div className="flex flex-1 flex-col">
                          <div className="mb-1.5 flex items-baseline justify-between">
                            <label htmlFor="c-msg" className="text-sm font-medium text-slate-700">Message</label>
                            <span className="text-xs tabular-nums text-slate-400">{values.message.trim().length} / 20 min</span>
                          </div>
                          <textarea
                            id="c-msg" name="message" rows={5} placeholder="What are you trying to build, and what should it achieve?"
                            value={values.message} onChange={set("message")} onBlur={blur("message")}
                            aria-invalid={!!show("message")} aria-describedby={show("message") ? "c-msg-err" : undefined}
                            className={field + " min-h-[140px] flex-1 resize-y " + (show("message") ? bad : ok)}
                          />
                          {show("message") && <p id="c-msg-err" className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
                        </div>

                        {status === "error" && (
                          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Something went wrong sending your message. Please try again, or email me directly at{" "}
                            <a className="font-semibold underline" href={"mailto:" + CONTACT.email}>{CONTACT.email}</a>.
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-950 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
                        >
                          {status === "sending" ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden="true" />
                              Sending
                            </>
                          ) : (
                            <>
                              Send message
                              <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                            </>
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* What happens next */}
            <motion.div
              {...reveal(0.15)}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,.15)] sm:p-8"
            >
              <h3 className="text-base font-semibold">What happens next</h3>
              <ol className="mt-5 space-y-6">
                {steps.map((s, i) => (
                  <li key={s.title} className="relative flex gap-4">
                    {i < steps.length - 1 && (
                      <span aria-hidden="true" className="absolute left-[13px] top-8 h-[calc(100%-0.25rem)] w-px bg-slate-300" />
                    )}
                    <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold">{s.title}</span>
                      <span className="mt-0.5 block text-sm leading-6 text-slate-500">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
