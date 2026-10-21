"use client"

import Image from "next/image"
import { useState } from "react"

type Slide = {
  src: string
  alt: string
  objectPosition: string
  /** Světlý závoj, aby černý text zůstal čitelný i na tmavé fotce. */
  scrim: string
  filter?: string
}

const slides: Slide[] = [
  {
    src: "/images/anteater-promo-2025.jpg",
    alt: "ANTEATER – promo fotka kapely",
    objectPosition: "center top",
    scrim: "bg-transparent",
  },
  {
    src: "/images/anteater-studio-2026.jpg",
    alt: "ANTEATER zády s novým logem na tričkách ve studiu",
    objectPosition: "center 55%",
    scrim: "bg-white/25",
    filter: "brightness(1.45) contrast(0.92) saturate(1.05)",
  },
]

export default function BackgroundStage() {
  const [index, setIndex] = useState(0)

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.objectPosition, filter: slide.filter }}
            />
            <div className={`absolute inset-0 ${slide.scrim}`} />
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Fotka ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full border border-black/40 transition-all duration-300 ${
              i === index ? "w-7 bg-black/70" : "w-2.5 bg-black/20 hover:bg-black/45"
            }`}
          />
        ))}
      </div>
    </>
  )
}
