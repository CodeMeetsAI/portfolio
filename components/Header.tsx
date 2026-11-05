'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Content: edit these                                                */
/* ------------------------------------------------------------------ */

const BRAND_NAME = 'Muhammad Umar';
const BRAND_ROLE = 'AI / ML Engineer';
const LOGO_SRC = '/logo.jpg';

interface NavItem {
  label: string;
  href: string;
}

// Order = the order of the sections on your page. Items whose section id
// does not exist are simply never highlighted.
const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

/** White button that fills with a liquid wave on hover (self-contained keyframes). */
/** White button that fills with a liquid wave on hover (self-contained keyframes). */
function WaveCTA({
  href,
  onClick,
  className = '',
  children,
}: {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95 ${className}`}
    >
      {/* Primary Black Liquid Wave */}
      <span className="hdr-wave-a pointer-events-none absolute left-[-50%] top-[110%] h-[500%] w-[200%] rounded-[40%] bg-slate-950 transition-all duration-700 ease-out group-hover:top-[-100%]" />
      {/* Secondary Dark Overlay Wave for depth */}
      <span className="hdr-wave-b pointer-events-none absolute left-[-50%] top-[115%] h-[500%] w-[200%] rounded-[43%] bg-slate-900/80 transition-all delay-75 duration-700 ease-out group-hover:top-[-100%]" />
      <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </Link>
  );
}

/** Wraps a child so it leans slightly toward the cursor. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function Burger({ open }: { open: boolean }) {
  const line = 'absolute left-0 h-[1.5px] w-5 rounded-full bg-current';
  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <motion.span
        className={line}
        initial={false}
        animate={open ? { top: 7.25, rotate: 45 } : { top: 2, rotate: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
      <motion.span
        className={line}
        style={{ top: 7.25 }}
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className={line}
        initial={false}
        animate={open ? { top: 7.25, rotate: -45 } : { top: 12.5, rotate: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

export default function Header() {
  const reduce = useReducedMotion();

  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const lastY = useRef(0);

  // Scroll progress bar along the bottom of the nav.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  // Morph into a floating pill, and hide when scrolling down / show when scrolling up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setIsScrolled(y > 50);
    const delta = y - lastY.current;
    if (y < 120) {
      setHidden(false);
    } else if (delta > 8 && !mobileOpen) {
      setHidden(true);
    } else if (delta < -4) {
      setHidden(false);
    }
    lastY.current = y;
  });

  // Which section is under the reading line.
  useEffect(() => {
    const ids = navItems.map((i) => i.href.slice(1));
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = '';
      let last = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        last = id;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = id;
      }
      // Short last section at the very bottom of the page.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = last || current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Mobile menu: lock page scroll, close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  // Close the mobile menu if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => mq.matches && setMobileOpen(false);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const goTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      setMobileOpen(false);
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    },
    [reduce]
  );

  const highlight = hovered ?? active;

  return (
    <>
      <style>{`
        @keyframes hdr-wave-a { to { transform: rotate(360deg); } }
        @keyframes hdr-wave-b { to { transform: rotate(-360deg); } }
        .hdr-wave-a { animation: hdr-wave-a 7s linear infinite; }
        .hdr-wave-b { animation: hdr-wave-b 5s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hdr-wave-a, .hdr-wave-b { animation: none; }
        }
      `}</style>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -130 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center"
      >
        <motion.nav
          aria-label="Main"
          initial={false}
          animate={
            isScrolled
              ? {
                  width: '92%',
                  maxWidth: 960,
                  marginTop: 14,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 9999,
                  backgroundColor: 'rgba(2, 6, 23, 0.72)',
                  boxShadow: '0 12px 40px rgba(2, 6, 23, 0.45)',
                }
              : {
                  width: '100%',
                  maxWidth: 2400,
                  marginTop: 0,
                  paddingTop: 18,
                  paddingBottom: 18,
                  borderRadius: 0,
                  backgroundColor: 'rgba(2, 6, 23, 0.35)',
                  boxShadow: '0 0 0 rgba(2, 6, 23, 0)',
                }
          }
          transition={{ duration: 0.6, ease: EASE }}
          className="pointer-events-auto relative flex items-center justify-between border border-white/10 px-5 backdrop-blur-xl sm:px-7"
        >
          {/* Brand */}
          <Link
            href="/"
            aria-label={`${BRAND_NAME}, home`}
            className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/15 shadow-md shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
              <Image src={LOGO_SRC} alt="" fill sizes="40px" className="object-cover" priority />
            </div>
            <span className="hidden flex-col leading-tight lg:flex">
              <span className="text-sm font-semibold tracking-tight text-white">{BRAND_NAME}</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                {BRAND_ROLE}
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul
            className="hidden items-center gap-0.5 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navItems.map((item, i) => {
              const id = item.href.slice(1);
              const isActive = active === id;
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.06, ease: EASE }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    onClick={(e) => goTo(e, item.href)}
                    onMouseEnter={() => setHovered(id)}
                    onFocus={() => setHovered(id)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative z-10 block rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 lg:px-4 ${
                      highlight === id || isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </Link>

                  {/* Sliding hover / active pill */}
                  {highlight === id && (
                    <motion.span
                      layoutId="hdr-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-white/10"
                    />
                  )}

                  {/* Active dot */}
                  {isActive && (
                    <motion.span
                      layoutId="hdr-dot"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]"
                    />
                  )}
                </motion.li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="hidden md:block"
          >
            <Magnetic>
              <WaveCTA href="#contact" onClick={(e) => goTo(e, '#contact')}>
                Let&apos;s Talk
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </WaveCTA>
            </Magnetic>
          </motion.div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:hidden"
          >
            <Burger open={mobileOpen} />
          </button>

          {/* Scroll progress */}
          <motion.span
            aria-hidden
            style={{ scaleX: progress, transformOrigin: '0% 50%' }}
            className="pointer-events-none absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500"
          />
        </motion.nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 cursor-default bg-slate-950/50 backdrop-blur-sm md:hidden"
            />

            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="fixed left-4 right-4 top-[84px] z-50 origin-top rounded-3xl border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <ul className="flex flex-col">
                {navItems.map((item, i) => {
                  const isActive = active === item.href.slice(1);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: EASE }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => goTo(e, item.href)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <span className="font-mono text-[11px] text-slate-500">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + navItems.length * 0.05, ease: EASE }}
                className="mt-3 border-t border-white/10 pt-3"
              >
                <WaveCTA
                  href="#contact"
                  onClick={(e) => goTo(e, '#contact')}
                  className="w-full !rounded-2xl !py-3"
                >
                  Let&apos;s Talk
                  <ArrowUpRight size={15} />
                </WaveCTA>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}