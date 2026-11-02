"use client"

import { useLayoutEffect, useRef, useState } from "react"

type Item = { href: string; label: string; badge?: string; priority: number }

// priority: čím nižší, tím déle zůstane v řádku (Merch je nový, ten schovat až skoro poslední)
const ITEMS: Item[] = [
  { href: "#shows", label: "Shows", priority: 0 },
  { href: "#about", label: "About", priority: 3 },
  { href: "#booking", label: "Booking", priority: 2 },
  { href: "#press", label: "Press", priority: 5 },
  { href: "#members", label: "Members", priority: 4 },
  { href: "/merch", label: "Merch", badge: "New", priority: 1 },
]

const GAP = 24
const BURGER = 40

function NavLink({ item, onClick }: { item: Item; onClick?: () => void }) {
  return (
    <>
      <a href={item.href} onClick={onClick} className="hover:opacity-60 transition">
        {item.label}
      </a>
      {item.badge ? (
        <span className="pointer-events-none absolute -bottom-3 left-0 right-0 text-center">
          <span className="new-flag inline-block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#927C69]">
            {item.badge}
          </span>
        </span>
      ) : null}
    </>
  )
}

// co se vejde vedle sebe, je v řádku; zbytek v hamburgeru
export default function TopNav() {
  const nav = useRef<HTMLElement>(null)
  const measure = useRef<HTMLUListElement>(null)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    const fit = () => {
      if (!nav.current || !measure.current) return
      const avail = nav.current.clientWidth
      const widths = new Map<string, number>()
      Array.from(measure.current.children).forEach((li, i) =>
        widths.set(ITEMS[i].href, (li as HTMLElement).offsetWidth),
      )
      const total = (items: Item[]) =>
        items.reduce((s, it) => s + (widths.get(it.href) ?? 0), 0) + GAP * (items.length - 1)
      let shown = [...ITEMS]
      const out = new Set<string>()
      if (total(shown) > avail) {
        const byPriority = [...ITEMS].sort((a, b) => b.priority - a.priority)
        for (const it of byPriority) {
          if (total(shown) + GAP + BURGER <= avail) break
          shown = shown.filter((s) => s !== it)
          out.add(it.href)
        }
      }
      setHidden(out)
      if (out.size === 0) setOpen(false)
    }
    fit()
    window.addEventListener("resize", fit)
    document.fonts?.ready.then(fit)
    return () => window.removeEventListener("resize", fit)
  }, [])

  const textCls = "text-xs sm:text-sm font-semibold text-black uppercase tracking-wider"
  const overflow = ITEMS.filter((it) => hidden.has(it.href))

  return (
    <nav ref={nav} className="relative max-w-7xl mx-auto mb-3">
      {/* neviditelná kopie jen pro změření šířek */}
      <ul ref={measure} aria-hidden className={`invisible absolute flex whitespace-nowrap ${textCls}`}>
        {ITEMS.map((it) => (
          <li key={it.href}>{it.label}</li>
        ))}
      </ul>

      <ul className={`flex justify-center items-center gap-x-6 whitespace-nowrap ${textCls}`}>
        {ITEMS.filter((it) => !hidden.has(it.href)).map((it) => (
          <li key={it.href} className="relative">
            <NavLink item={it} />
          </li>
        ))}
        {overflow.length > 0 ? (
          <li className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
              className="flex h-6 w-6 flex-col items-center justify-center gap-[4px]"
            >
              <span className={`block h-[2px] w-5 bg-black transition ${open ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`block h-[2px] w-5 bg-black transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`block h-[2px] w-5 bg-black transition ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </button>
            {open ? (
              <ul
                className={`absolute right-0 top-9 z-10 flex flex-col items-center gap-4 rounded-2xl bg-[#c9c3bc]/90 px-8 py-5 shadow-xl backdrop-blur ${textCls}`}
              >
                {overflow.map((it) => (
                  <li key={it.href} className="relative">
                    <NavLink item={it} onClick={() => setOpen(false)} />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
