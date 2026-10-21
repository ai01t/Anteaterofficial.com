"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

type Slide = {
  src: string
  alt: string
  /** Volitelná jiná choreografie – jinak nájezd na potisk. */
  anim?: string
  /** Animace výřezu fotky (object-position). */
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
    objectPosition: "center",
    opacity: "opacity-75",
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
const AUTOPLAY_MS = 17000

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

      {/* plynulé zatmavení po stranách, ať fotka nekončí ostrou hranou */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, #0B0A09 0%, rgba(11,10,9,0.55) 7%, rgba(11,10,9,0) 20%, rgba(11,10,9,0) 80%, rgba(11,10,9,0.55) 93%, #0B0A09 100%)",
        }}
      />

      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-0.5 rounded-full border border-white/10 bg-black/40 px-1.5 py-1 backdrop-blur">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => select(i)}
            aria-label={`Fotka ${i + 1}`}
            aria-current={i === index}
            className="group flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#927C69]" : "w-1.5 bg-white/40 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  )
}
