"use client"

import { useEffect, useRef } from "react"

// leží na fotce pod černou patičkou – vykoukne, když patičku na konci stránky „gumově" povytáhneš
export default function HiddenCredits() {
  const text = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const footer = document.querySelector("footer")
    const credits = text.current
    if (!footer || !credits) return
    const MAX = 36
    let pull = 0
    let release = 0
    let touchY: number | null = null
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

    const apply = (animate: boolean) => {
      footer.style.transition = animate ? "transform 260ms cubic-bezier(0.25, 0.8, 0.3, 1)" : "transform 60ms linear"
      footer.style.transform = pull ? `translateY(${-pull}px)` : ""
      credits.style.opacity = pull > 8 ? "1" : "0"
    }
    const springBack = (delay: number) => {
      window.clearTimeout(release)
      release = window.setTimeout(() => {
        pull = 0
        apply(true)
      }, delay)
    }
    // čím víc vytaženo, tím větší odpor
    const add = (delta: number) => {
      pull = Math.min(MAX, pull + delta * (1 - pull / MAX) * 0.25)
      apply(false)
    }

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && atBottom()) {
        add(e.deltaY)
        springBack(220)
      }
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return
      const y = e.touches[0].clientY
      const d = touchY - y
      touchY = y
      if (d > 0 && atBottom()) add(d)
    }
    const onTouchEnd = () => {
      touchY = null
      springBack(0)
    }

    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onTouchEnd)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.clearTimeout(release)
    }
  }, [])

  return (
    <p
      ref={text}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-3 text-center text-[10px] tracking-[0.15em] text-white/70 opacity-0 transition-opacity duration-200"
      style={{ zIndex: -5, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
    >
      © 2026 | Design &amp; Development: Ing. Jindřich Traxmandl
    </p>
  )
}
