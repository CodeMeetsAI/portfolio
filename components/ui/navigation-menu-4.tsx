import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const navigationLinks = [
  { href: "#", label: "Home" },
]

export default function Component() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl rounded-full border border-border/40 bg-background/60 backdrop-blur-xl px-6 shadow-xl">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side / Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-foreground font-semibold tracking-tight hover:opacity-80 transition-opacity">
            Muhammad Umar
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-muted/50"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right side / Action & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild size="sm" className="rounded-full text-sm px-4 bg-foreground text-background hover:opacity-90">
              <a href="mailto:contact@muhammadumar.ai">Get in touch</a>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-9 md:hidden rounded-full"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2 md:hidden bg-background/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl">
              <nav className="flex flex-col gap-1">
                {navigationLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/60 px-3 py-2 text-sm font-medium rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
