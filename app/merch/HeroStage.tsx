"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

type Slide = {
  src: string
  alt: string
  /** Volitelná jiná choreografie – jinak nájezd na potisk. */
  anim?: string
  /** Animace výřezu fotky (object-position) místo posunu obalu. */
  imgAnim?: string
  /** Bod, ze kterého se odjíždí – potisk na tričku. */
  origin: string
  objectPosition: string
  opacity: string
}

const slides: Slide[] = [
  {
    src: "/images/merch/cliff-front.jpg",
    alt: "Kapela ANTEATER v nových tričkách",
    origin: "56% 52%",
    objectPosition: "center 40%",
    opacity: "opacity-60",
  },
  {
    src: "/images/merch/cliff-back-3.jpg",
    alt: "Světlo nad kapelou ANTEATER ve studiu",
    origin: "50% 50%",
    objectPosition: "center top",
    opacity: "opacity-70",
    anim: "merch-hero-lamp",
    imgAnim: "merch-hero-lamp-img",
  },
  {
    src: "/images/anteater-studio-2026.jpg",
    alt: "ANTEATER zády s novým logem přes celá záda",
    origin: "50% 58%",
    objectPosition: "center 64%",
    opacity: "opacity-70",
  },
]

/** Jak dlouho jeden záběr zůstane, než se přepne sám. */
const AUTOPLAY_MS = 16000

export default function HeroStage() {
  const [index, setIndex] = useState(0)
  /** Každé přepnutí spustí choreografii znovu. */
  const [run, setRun] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length)
      setRun((r) => r + 1)
    }, AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [index, run])

  const select = (i: number) => {
    if (i === index) return
    setIndex(i)
    setRun((r) => r + 1)
  }

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== index}
          >
            {/* nájezd na potisk → oddálení → pomalý plynulý posun */}
            <div
              key={`${i}-${run}`}
              className={`${slide.anim ?? "merch-hero-zoom"} absolute inset-0`}
              style={{ transformOrigin: slide.origin }}
            >
              <div className="merch-hero-drift absolute inset-0">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className={`object-cover ${slide.opacity} ${slide.imgAnim ?? ""}`}
                  style={slide.imgAnim ? undefined : { objectPosition: slide.objectPosition }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => select(i)}
            aria-label={`Fotka ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-7 bg-[#927C69]" : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </>
  )
}
