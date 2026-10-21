"use client"

import Image from "next/image"
import { useState } from "react"
import type { Product } from "./data"
import { cardDict, tr, type Lang } from "./i18n"

type Props = {
  product: Product
  lang: Lang
  inCart: number
  onAdd: (args: { product: Product; size: string; choiceId?: string; choiceLabel?: string; qty: number }) => void
}

export default function ProductCard({ product, lang, inCart, onAdd }: Props) {
  const c = cardDict[lang]
  const [active, setActive] = useState(0)
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "")
  const [choice, setChoice] = useState(product.option ? product.option.choices[product.option.choices.length - 1].id : "")
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)

  const soldOut = product.soldOut === true
  const needsSize = !size
  const selectedChoice = product.option?.choices.find((ch) => ch.id === choice)

  const handleAdd = () => {
    if (needsSize || soldOut) return
    onAdd({
      product,
      size,
      choiceId: choice || undefined,
      choiceLabel: selectedChoice ? tr(selectedChoice.label, lang) : undefined,
      qty,
    })
    setJustAdded(true)
    setQty(1)
    window.setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-[#927C69]/50">
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <Image
          src={product.images[active].src}
          alt={product.images[active].alt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className={`object-cover transition duration-700 group-hover:scale-[1.03] ${
            soldOut ? "opacity-55 grayscale" : ""
          }`}
          style={{ objectPosition: product.images[active].position }}
          priority={product.id === "cliff"}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/20" />

        {soldOut ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            {c.soldOut}
          </span>
        ) : product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#927C69] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black">
            {tr(product.badge, lang)}
          </span>
        ) : null}

        {inCart > 0 ? (
          <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
            {inCart}
            {c.inCart}
          </span>
        ) : null}

        {product.images.length > 1 ? (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${c.photo} ${i + 1}`}
                aria-current={i === active}
                className={`h-12 w-12 overflow-hidden rounded-lg border transition ${
                  i === active ? "border-[#927C69]" : "border-white/25 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt="" width={96} height={96} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <header>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#927C69]">{product.line}</p>
          <h3 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">{tr(product.name, lang)}</h3>
          {product.tagline ? <p className="mt-1 text-sm text-white/60">{tr(product.tagline, lang)}</p> : null}
        </header>

        <p className="text-sm leading-relaxed text-white/70">{tr(product.description, lang)}</p>

        {product.option ? (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
              {tr(product.option.label, lang)}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.option.choices.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChoice(ch.id)}
                  aria-pressed={choice === ch.id}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    choice === ch.id
                      ? "border-[#927C69] bg-[#927C69] text-black"
                      : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {tr(ch.label, lang)}
                </button>
              ))}
            </div>
            {selectedChoice?.note ? (
              <p className="mt-2 text-xs text-white/45">{tr(selectedChoice.note, lang)}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
            {tr(product.sizeLabel, lang)}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s)
                  setSizeOpen(false)
                }}
                aria-pressed={size === s}
                className={`min-w-12 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  size === s
                    ? "border-[#927C69] bg-[#927C69] text-black"
                    : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <details className="group/detail">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[11px] text-white/35 transition hover:text-white/70">
            <span className="underline decoration-white/20 underline-offset-4">{c.detail}</span>
            <span className="text-[9px] transition group-open/detail:rotate-90">›</span>
          </summary>
          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-white/55">
            {product.specs.map((s) => (
              <li key={tr(s, lang)} className="flex gap-2">
                <span className="text-[#927C69]">—</span>
                <span>{tr(s, lang)}</span>
              </li>
            ))}
          </ul>
          {product.id === "cliff" ? (
            <a
              href="https://www.cottonclassics.cz/sol-s-cliff.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-semibold text-[#927C69] underline underline-offset-4 hover:text-white"
            >
              {c.makerSpec}
            </a>
          ) : null}
        </details>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div>
            {product.price !== null ? (
              <p className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">
                  {product.price.toLocaleString("cs-CZ")} <span className="text-sm font-normal text-white/50">Kč</span>
                </span>
                {product.compareAtPrice ? (
                  <span className="text-sm text-white/35 line-through">
                    {product.compareAtPrice.toLocaleString("cs-CZ")} Kč
                  </span>
                ) : null}
              </p>
            ) : soldOut ? null : (
              <p className="text-sm text-white/50">{c.priceOnRequest}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center rounded-full border border-white/20 ${soldOut ? "hidden" : ""}`}>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={c.less}
                className="px-3 py-2 text-white/60 transition hover:text-white"
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm font-bold text-white">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                aria-label={c.more}
                className="px-3 py-2 text-white/60 transition hover:text-white"
              >
                +
              </button>
            </div>

            <div className="relative">
              {sizeOpen && needsSize && !soldOut ? (
                <div className="absolute bottom-full right-0 z-20 mb-2 flex gap-1.5 rounded-full border border-white/15 bg-black/95 p-1.5 shadow-xl backdrop-blur">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s)
                        setSizeOpen(false)
                      }}
                      className="min-w-10 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/75 transition hover:bg-[#927C69] hover:text-black"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => (needsSize ? setSizeOpen((o) => !o) : handleAdd())}
                disabled={soldOut}
                aria-expanded={needsSize ? sizeOpen : undefined}
                className={`rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition ${
                  soldOut
                    ? "cursor-not-allowed bg-white/10 text-white/35"
                    : needsSize
                      ? "border border-white/20 text-white/70 hover:border-[#927C69] hover:text-white"
                      : justAdded
                        ? "bg-white text-black"
                        : "bg-[#927C69] text-black hover:bg-white"
                }`}
              >
                {soldOut ? c.soldOut : needsSize ? c.chooseSize : justAdded ? c.added : c.add}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
