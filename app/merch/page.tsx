"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import HeroStage from "./HeroStage"
import ProductCard from "./ProductCard"
import VoucherScene from "./VoucherScene"
import { ORDER_EMAIL, SHIPPING_ZONES, UNIVERSAL_SIZE, coaster, lookbook, products } from "./data"
import { cardDict } from "./i18n"
import {
  LANGS,
  LOCALE,
  SHIP_COUNTRIES,
  countryName,
  detectCountry,
  loadLang,
  saveLang,
  dict,
  tr,
  type Lang,
} from "./i18n"

type CartItem = {
  key: string
  productId: string
  name: string
  variant?: string
  size: string
  qty: number
  price: number | null
  countsAs: "tee" | "cap"
}

type Show = {
  id: string
  city: string
  country: string
  venue: string
  datetime: string
}

const CART_KEY = "anteater-merch-cart-v1"
/** Veřejný klíč Web3Forms (je určený pro použití v prohlížeči). */
const WEB3FORMS_KEY = "bf72ec55-0a4a-466c-b8ef-64a2256a4ae3"

const formatDate = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleDateString(LOCALE[lang], { day: "numeric", month: "long", year: "numeric" })

const formatPrice = (value: number) => `${value.toLocaleString("cs-CZ")} Kč`

export default function MerchPage() {
  const [lang, setLang] = useState<Lang>("cs")
  /** Země odhadnutá z prohlížeče – jen pro předvýběr a zvýraznění dopravy. */
  const [homeCountry, setHomeCountry] = useState<string | null>(null)
  const [shipCountry, setShipCountry] = useState("AT")
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [shows, setShows] = useState<Show[]>([])
  const [delivery, setDelivery] = useState<"pickup" | "ship" | null>(null)
  const [zoneId, setZoneId] = useState(SHIPPING_ZONES[0].id)
  const [zipStatus, setZipStatus] = useState<string | undefined>(undefined)
  const [cityOptions, setCityOptions] = useState<string[]>([])
  const [showId, setShowId] = useState("")
  const [wantCoasters, setWantCoasters] = useState(false)
  const [organizer, setOrganizer] = useState(false)
  const [follows, setFollows] = useState(false)
  const [copied, setCopied] = useState(false)
  const [heroText, setHeroText] = useState(0)
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [form, setForm] = useState({
    name: "",
    contact: "",
    street: "",
    city: "",
    zip: "",
    note: "",
  })

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_KEY)
      if (saved) setCart(JSON.parse(saved))
    } catch {
      /* localStorage nemusí být dostupné */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    const detected = loadLang()
    setLang(detected)
    const country = detectCountry()
    setHomeCountry(country)
    if (country === "CZ") setZoneId("cz")
    else if (country === "DE") setZoneId("de")
    else if (country) {
      setZoneId("eu")
      if (SHIP_COUNTRIES.includes(country)) setShipCountry(country)
    } else {
      setZoneId(detected === "de" ? "de" : detected === "en" ? "eu" : "cz")
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      /* ignorujeme */
    }
  }, [cart, hydrated])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/bandsintown")
        if (!res.ok) return
        const data = await res.json()
        if (!Array.isArray(data)) return
        setShows(
          data.map((e: any, i: number) => ({
            id: String(e.id ?? i),
            city: e.venue?.city ?? "",
            country: e.venue?.country ?? "",
            venue: e.venue?.name ?? "",
            datetime: e.datetime,
          })),
        )
      } catch {
        /* bez termínů jedeme dál */
      }
    }
    load()
  }, [])

  const addToCart = ({
    product,
    size,
    choiceLabel,
    qty,
  }: {
    product: (typeof products)[number]
    size: string
    choiceId?: string
    choiceLabel?: string
    qty: number
  }) => {
    const key = `${product.id}|${choiceLabel ?? ""}|${size}`
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(9, i.qty + qty) } : i))
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: tr(product.cartName ?? product.name, lang),
          variant: choiceLabel,
          size,
          qty,
          price: product.price,
          countsAs: product.countsAs,
        },
      ]
    })
  }

  const setQty = (key: string, qty: number) =>
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))))

  const t = dict[lang]
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const tees = cart.filter((i) => i.countsAs === "tee").reduce((sum, i) => sum + i.qty, 0)
  const caps = cart.filter((i) => i.countsAs === "cap").reduce((sum, i) => sum + i.qty, 0)

  /** Stačí jeden kus – tričko nebo kšiltovka – a potvrzený odběr. */
  const hasItem = tees >= 1 || caps >= 1
  const coastersFree = wantCoasters && (organizer || (hasItem && follows))
  /** Jeden podtácek ke každému tričku i kšiltovce, jeden pro pořadatele. */
  const coasterQty = coastersFree ? tees + caps + (organizer ? 1 : 0) : 0

  const coasterHint = !wantCoasters
    ? t.hintTickOrder
    : coastersFree
      ? t.hintDone(coasterQty)
      : !follows
        ? t.hintPickReason
        : t.hintAddItem

  const subtotal = cart.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0)
  const hasUnpriced = cart.some((i) => i.price === null)
  /** Pořadí dopravy podle jazyka – němčina dává Německo první, angličtina Evropu. */
  const zoneOrder: Record<Lang, string[]> = {
    cs: ["cz", "de", "eu"],
    de: ["de", "cz", "eu"],
    en: ["eu", "cz", "de"],
  }
  const zones = zoneOrder[lang]
    .map((id) => SHIPPING_ZONES.find((z) => z.id === id))
    .filter((z): z is (typeof SHIPPING_ZONES)[number] => Boolean(z))
  const cheapestShipping = Math.min(...SHIPPING_ZONES.map((z) => z.price))
  const zone = SHIPPING_ZONES.find((z) => z.id === zoneId) ?? SHIPPING_ZONES[0]
  /** Země, kam se posílá – u zóny Evropa z výběru, jinak podle zóny. */
  const destinationCode = zoneId === "cz" ? "CZ" : zoneId === "de" ? "DE" : shipCountry
  const destinationName = zoneId === "eu" ? countryName(shipCountry, lang) : tr(zone.label, lang)
  /** Zóna odhadnutá podle polohy prohlížeče – zvýrazní se v nabídce. */
  const suggestedZone = homeCountry === "CZ" ? "cz" : homeCountry === "DE" ? "de" : homeCountry ? "eu" : null
  const shipping = delivery === "ship" ? zone.price : 0
  const total = subtotal + shipping

  const selectedShow = shows.find((s) => s.id === showId)

  const message = useMemo(() => {
    if (cart.length === 0) return ""
    const lines: string[] = [t.msgHello, "", t.msgWant]
    cart.forEach((i) => {
      const parts = [i.name]
      if (i.variant) parts.push(t.printShort(i.variant))
      if (i.size !== UNIVERSAL_SIZE) parts.push(t.sizeShort(i.size))
      lines.push(`• ${parts.join(", ")} — ${i.qty}×`)
    })
    if (coasterQty > 0) lines.push(t.msgCoasters(coasterQty))

    lines.push("")

    if (delivery === "pickup") {
      lines.push(
        selectedShow
          ? t.msgPickup(
              `${selectedShow.city}, ${formatDate(selectedShow.datetime, lang)}${
                selectedShow.venue ? ` (${selectedShow.venue})` : ""
              }`,
            )
          : t.msgPickupTbd,
      )
    } else if (delivery === "ship") {
      lines.push(t.msgShip)
      lines.push(form.name || t.msgPlaceholderName)
      lines.push(form.street || t.msgPlaceholderStreet)
      lines.push(`${form.zip || t.msgPlaceholderZip} ${form.city || t.msgPlaceholderCity}`)
      lines.push(t.msgShipping(destinationName, formatPrice(zone.price)))
    }

    lines.push("")
    if (delivery !== "ship" && form.name) lines.push(`${t.msgName}: ${form.name}`)
    if (form.contact) lines.push(`${t.msgContact}: ${form.contact}`)
    if (organizer) lines.push(t.msgOrganizer)
    if (coastersFree && !organizer) lines.push(t.msgFollows)
    if (form.note) lines.push(`${t.msgNote}: ${form.note}`)
    if (!hasUnpriced) lines.push(`${t.msgTotal}: ${formatPrice(total)}`)
    lines.push("", t.msgThanks)

    return lines.join("\n")
  }, [cart, coasterQty, coastersFree, delivery, destinationName, form, hasUnpriced, lang, organizer, selectedShow, t, total, zone])

  /** Doplnění města podle PSČ – zippopotam.us, pro Česko OpenStreetMap. */
  useEffect(() => {
    if (delivery !== "ship") {
      setZipStatus(undefined)
      setCityOptions([])
      return
    }
    const zip = form.zip.replace(/\s+/g, "")
    if (zip.length < 4 || zip.length > 6 || !/^\d+$/.test(zip)) {
      setZipStatus(undefined)
      setCityOptions([])
      return
    }

    let cancelled = false
    setZipStatus(t.zipSearching)

    const timer = window.setTimeout(async () => {
      try {
        const places = await lookupZip(zip, destinationCode)
        if (cancelled) return
        if (places.length === 0) {
          setZipStatus(t.zipNotFound)
          setCityOptions([])
          return
        }
        setCityOptions(places)
        setZipStatus(t.zipFound(places[0]))
        setForm((f) => (f.city.trim() === "" ? { ...f, city: places[0] } : f))
      } catch {
        if (!cancelled) {
          setZipStatus(undefined)
          setCityOptions([])
        }
      }
    }, 600)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [delivery, destinationCode, form.zip, t])

  const mailto = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(
    message,
  )}`
  /** Záloha pro ty, co nemají nastavený poštovní program. */
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    ORDER_EMAIL,
  )}&su=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(message)}`

  /** Odeslání přes Web3Forms – přijde rovnou na ORDER_EMAIL. Při chybě záloha přes poštovní program. */
  const submitOrder = async () => {
    if (!ready || sendState === "sending") return
    setSendState("sending")
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: t.mailSubject,
          from_name: form.name || "ANTEATER merch",
          replyto: /@/.test(form.contact) ? form.contact : undefined,
          message,
          botcheck: "",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.success === false) throw new Error("send failed")
      setSendState("sent")
      setCart([])
    } catch {
      setSendState("error")
      window.location.href = mailto
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard může být blokovaný */
    }
  }

  const ready = cart.length > 0 && delivery !== null && (delivery === "pickup" || (form.street && form.city && form.zip))

  return (
    <div className="min-h-screen bg-[#0B0A09] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0A09]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 transition hover:text-white"
          >
            ← Anteater
          </Link>
          <div className="ml-auto mr-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em]">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLang(l)
                  saveLang(l)
                }}
                aria-pressed={lang === l}
                className={`rounded-full px-2 py-1 transition ${
                  lang === l ? "text-[#927C69]" : "text-white/30 hover:text-white/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <a
            key={itemCount}
            href="#objednavka"
            aria-label={itemCount > 0 ? t.cartItems(itemCount) : t.cart}
            className={
              itemCount > 0
                ? "cart-pop flex items-center gap-2 rounded-full bg-[#927C69] px-3.5 py-2 text-black shadow-[0_0_0_1px_rgba(146,124,105,0.6),0_8px_24px_-8px_rgba(146,124,105,0.9)] transition hover:bg-white"
                : "flex items-center p-2 text-white/25 transition hover:text-white/60"
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={itemCount > 0 ? 2 : 1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 4h2.2l1.5 10.2a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.6L20 7H6.2" />
              <circle cx="10" cy="20" r="1.3" />
              <circle cx="17" cy="20" r="1.3" />
            </svg>
            {itemCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black/85 px-1.5 text-[11px] font-bold text-[#E8DCCF]">
                {itemCount}
              </span>
            ) : null}
          </a>
        </div>
      </header>

      {/* Hero – fotky přes celou šířku */}
      <section className="border-b border-white/10 bg-[#0B0A09]">
        <div className="relative flex min-h-[460px] items-center overflow-hidden md:min-h-[560px]">
          <HeroStage />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/90 via-[#0B0A09]/55 to-[#0B0A09]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/70 via-transparent to-[#0B0A09]/35" />
          <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#927C69]">Anteater official</p>
            <h1 className="mt-4 text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-8xl">Merch</h1>
            <div className="mt-6 flex max-w-xl items-start gap-4">
              <p key={heroText} className="hero-text-in min-h-[7.5rem] flex-1 text-base leading-relaxed text-white/75">
                {heroText === 0 ? (
                  <>
                    <span className="mb-2 block font-semibold text-white">{t.heroPromoLead}</span>
                    {t.heroPromo}
                  </>
                ) : (
                  t.heroIntro
                )}
              </p>
              <button
                type="button"
                onClick={() => setHeroText((v) => (v + 1) % 2)}
                aria-label={heroText === 0 ? "Další text" : "Předchozí text"}
                className="mt-1 shrink-0 rounded-full border border-white/20 p-2.5 text-white/60 transition hover:border-[#927C69] hover:text-white"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform ${heroText === 1 ? "rotate-180" : ""}`}
                >
                  <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-wide md:text-4xl">{t.collection}</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              lang={lang}
              inCart={cart.filter((i) => i.productId === p.id).reduce((s, i) => s + i.qty, 0)}
              onAdd={addToCart}
            />
          ))}
        </div>
      </section>

      {/* Podtácky + dárkový poukaz – ve formátu produktových karet */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2">
          {/* Dřevěné podtácky */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <Image
                src={coaster.images[0].src}
                alt={coaster.images[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/20" />
              <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                {t.giftLabel}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-5 p-6">
              <header>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#927C69]">
                  {tr(coaster.description, lang)}
                </p>
                <h3 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">{tr(coaster.name, lang)}</h3>
                <p className="mt-1 text-sm text-white/60">
                  {t.madeBy}{" "}
                  <a
                    href="https://www.laserjelinek.cz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#927C69] hover:text-white"
                  >
                    Laser Jelínek
                  </a>
                </p>
              </header>

              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="text-[#927C69]">01</span> {t.coasterRule2}
                </li>
                <li className="flex gap-3">
                  <span className="text-[#927C69]">02</span> {t.coasterRule3}
                </li>
              </ul>

              <details className="group/detail">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[11px] text-white/35 transition hover:text-white/70">
                  <span className="underline decoration-white/20 underline-offset-4">{t.detail}</span>
                  <span className="text-[9px] transition group-open/detail:rotate-90">›</span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-white/55">
                  {t.coasterMaker("§LINK§").split("§LINK§")[0]}
                  <a
                    href="https://www.laserjelinek.cz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#927C69] underline underline-offset-4 hover:text-white"
                  >
                    Laser Jelínek
                  </a>
                  {t.coasterMaker("§LINK§").split("§LINK§")[1]}
                </p>
              </details>

              <div
                className={`mt-auto rounded-xl border px-5 py-4 text-sm transition ${
                  coastersFree
                    ? "border-[#927C69]/60 bg-[#927C69]/10 text-white"
                    : "border-white/10 bg-black/30 text-white/60"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-[0.15em]">
                  {coastersFree ? t.unlocked : t.locked}
                </span>
                <p className="mt-1">{coasterHint}</p>
              </div>
            </div>
          </article>

          {/* Dárkový poukaz */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-[#927C69]/50">
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <VoucherScene
                lang={lang}
                logo="new"
                theme="dark"
                fields={{ to: "", from: "", message: "" }}
                compact
              />
            </div>

            <div className="flex flex-1 flex-col gap-5 p-6">
              <header>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#927C69]">{t.voucherKicker}</p>
                <h3 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">{t.voucherCardTitle}</h3>
              </header>

              <p className="text-sm leading-relaxed text-white/70">{t.voucherCardText}</p>

              <Link
                href={`/merch/poukaz?lang=${lang}`}
                className="mt-auto rounded-full bg-[#927C69] px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white"
              >
                {t.voucherOpen}
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Order */}
      <section id="objednavka" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
        <h2 className="text-3xl font-bold uppercase tracking-wide md:text-4xl">{t.order}</h2>
        <p className="mt-2 text-sm text-white/55">{t.orderSub}</p>

        {/* Cart */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {cart.length === 0 && !coastersFree ? (
            <p className="py-6 text-center text-sm text-white/50">{t.cartEmpty}</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {cart.map((i) => (
                <li key={i.key} className="flex items-center justify-between gap-4 py-4 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{i.name}</p>
                    <p className="text-xs text-white/50">
                      {[i.variant ? t.printShort(i.variant) : null, t.sizeShort(i.size)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {i.price !== null ? (
                      <span className="hidden text-sm text-white/60 sm:block">{formatPrice(i.price * i.qty)}</span>
                    ) : null}
                    <div className="flex items-center rounded-full border border-white/20">
                      <button
                        type="button"
                        onClick={() => setQty(i.key, i.qty - 1)}
                        aria-label={`${cardDict[lang].less} – ${i.name}`}
                        className="px-3 py-1.5 text-white/60 transition hover:text-white"
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center text-sm font-bold">{i.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(i.key, Math.min(9, i.qty + 1))}
                        aria-label={`${cardDict[lang].more} – ${i.name}`}
                        className="px-3 py-1.5 text-white/60 transition hover:text-white"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQty(i.key, 0)}
                      aria-label={`${t.remove} – ${i.name}`}
                      className="text-white/35 transition hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
              {coastersFree ? (
                <li className="flex items-center justify-between gap-4 py-4 text-sm first:pt-0">
                  <p className="font-semibold text-[#927C69]">{t.coasters} — {coasterQty}×</p>
                  <span className="text-white/60">{t.free}</span>
                </li>
              ) : null}
            </ul>
          )}

          {/* Podtácky zdarma */}
          <div className="mt-2 border-t border-white/10 pt-4">
            <label
              className={`group relative flex w-fit items-center gap-3 text-sm font-semibold transition ${
                itemCount === 0
                  ? "cursor-not-allowed text-white/25"
                  : `cursor-pointer ${coastersFree ? "text-[#927C69]" : "text-white/80"}`
              }`}
            >
              <input
                type="checkbox"
                checked={wantCoasters}
                disabled={itemCount === 0}
                onChange={(e) => setWantCoasters(e.target.checked)}
                className="h-4 w-4 accent-[#927C69] disabled:opacity-40"
              />
              {t.wantCoasters}
              {itemCount === 0 ? (
                <span className="pointer-events-none absolute left-0 top-full z-10 mt-2 whitespace-nowrap rounded-lg border border-white/15 bg-black/90 px-3 py-2 text-xs font-normal text-white/70 opacity-0 shadow-lg transition group-hover:opacity-100">
                  {t.wantCoastersTip}
                </span>
              ) : null}
            </label>

            {wantCoasters && itemCount > 0 ? (
              <div className="mt-4 border-l border-white/10 pl-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t.because}</p>
                <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={organizer}
                    onChange={(e) => setOrganizer(e.target.checked)}
                    className="h-4 w-4 accent-[#927C69]"
                  />
                  {t.organizer}
                </label>
                <label className="mt-2 flex cursor-pointer items-center gap-3 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={follows}
                    onChange={(e) => setFollows(e.target.checked)}
                    className="h-4 w-4 accent-[#927C69]"
                  />
                  {t.follows}
                </label>
                <p className={`mt-3 text-xs ${coastersFree ? "text-[#927C69]" : "text-white/45"}`}>{coasterHint}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Delivery */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setDelivery("pickup")}
            aria-pressed={delivery === "pickup"}
            className={`rounded-2xl border p-6 text-left transition ${
              delivery === "pickup"
                ? "border-[#927C69] bg-[#927C69]/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/30"
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-[0.15em]">{t.pickup}</p>
            <p className="mt-2 text-xs text-white/55">{t.pickupNote}</p>
          </button>

          <button
            type="button"
            onClick={() => setDelivery("ship")}
            aria-pressed={delivery === "ship"}
            className={`rounded-2xl border p-6 text-left transition ${
              delivery === "ship"
                ? "border-[#927C69] bg-[#927C69]/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/30"
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-[0.15em]">
              {t.ship} <span className="text-[#927C69]">{t.shipFrom(formatPrice(cheapestShipping))}</span>
            </p>
            <p className="mt-2 text-xs text-white/55">
              {zones.map((z) => `${tr(z.label, lang)} ${z.price} Kč`).join(" · ")}
            </p>
          </button>
        </div>

        {delivery === "pickup" ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-6">
            <p className="text-sm font-semibold">{t.whichShow}</p>
            {shows.length > 0 ? (
              <div className="mt-4 space-y-2">
                {shows.map((s) => (
                  <label
                    key={s.id}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm transition ${
                      showId === s.id ? "border-[#927C69] bg-[#927C69]/10" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="show"
                        value={s.id}
                        checked={showId === s.id}
                        onChange={() => setShowId(s.id)}
                        className="accent-[#927C69]"
                      />
                      <span>
                        <span className="font-semibold">{s.city}</span>
                        {s.venue ? <span className="text-white/50"> · {s.venue}</span> : null}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-white/50">{formatDate(s.datetime, lang)}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/55">{t.noShows}</p>
            )}
          </div>
        ) : null}

        {delivery === "ship" ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-6">
            <p className="text-sm font-semibold">{t.sendTo}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                label={t.fName}
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                className="sm:col-span-2"
                autoComplete="name"
                placeholder={t.phName}
              />
              <Field
                label={t.fStreet}
                value={form.street}
                onChange={(v) => setForm((f) => ({ ...f, street: v }))}
                className="sm:col-span-2"
                autoComplete="address-line1"
                placeholder={t.phStreet}
              />
              <Field
                label={t.fZip}
                value={form.zip}
                onChange={(v) => setForm((f) => ({ ...f, zip: v }))}
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder={t.phZip}
                hint={zipStatus}
              />
              <Field
                label={t.fCity}
                value={form.city}
                onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                autoComplete="address-level2"
                placeholder={t.phCity}
                list={cityOptions.length > 0 ? "zip-cities" : undefined}
                hint={cityOptions.length > 1 ? t.zipMultiple : undefined}
              />
              {cityOptions.length > 0 ? (
                <datalist id="zip-cities">
                  {cityOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              ) : null}
            </div>
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{t.shipTo}</p>
              <div className="flex flex-wrap gap-2">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setZoneId(z.id)}
                    aria-pressed={zoneId === z.id}
                    title={suggestedZone === z.id ? t.yourLocation : undefined}
                    className={`rounded-full border px-4 py-2 text-xs transition ${
                      zoneId === z.id
                        ? "border-[#927C69] bg-[#927C69] text-black"
                        : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                    } ${suggestedZone === z.id ? "font-extrabold ring-1 ring-[#927C69]/70" : "font-semibold"}`}
                  >
                    {tr(z.label, lang)} <span className="font-normal">{z.price} Kč</span>
                  </button>
                ))}
              </div>
              {zoneId === "eu" ? (
                <label className="mt-4 block max-w-xs">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {t.fCountry}
                  </span>
                  <select
                    value={shipCountry}
                    onChange={(e) => setShipCountry(e.target.value)}
                    autoComplete="country"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#927C69]"
                  >
                    {[...SHIP_COUNTRIES]
                      .map((code) => ({ code, name: countryName(code, lang) }))
                      .sort((a, b) => a.name.localeCompare(b.name, LOCALE[lang]))
                      .map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0B0A09]">
                          {c.name}
                        </option>
                      ))}
                  </select>
                </label>
              ) : null}
              <p className="mt-3 text-xs text-white/45">
                {t.shipNote(formatPrice(zone.price))}
                {suggestedZone === zoneId ? <span className="text-white/30"> · {t.yourLocation}</span> : null}
              </p>
            </div>
          </div>
        ) : null}

        {/* Contact + perks */}
        <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2">
          {delivery !== "ship" ? (
            <Field
              label={t.fNameShort}
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              autoComplete="name"
              placeholder={t.phName}
            />
          ) : null}
          <Field
            label={t.fContact}
            value={form.contact}
            onChange={(v) => setForm((f) => ({ ...f, contact: v }))}
            autoComplete="email"
            placeholder={t.phContact}
          />
          <Field
            label={t.fNote}
            value={form.note}
            onChange={(v) => setForm((f) => ({ ...f, note: v }))}
            className="sm:col-span-2"
          />

        </div>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-[#927C69]/40 bg-[#927C69]/[0.07] p-6">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>{t.goods}</span>
            <span>{hasUnpriced ? "—" : formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-white/70">
            <span>{t.deliveryRow}</span>
            <span>{delivery === "ship" ? formatPrice(zone.price) : delivery === "pickup" ? t.free : "—"}</span>
          </div>
          {coastersFree ? (
            <div className="mt-2 flex items-center justify-between text-sm text-[#927C69]">
              <span>{t.coasters} {coasterQty}×</span>
              <span>{t.free}</span>
            </div>
          ) : null}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xl font-bold">
            <span className="uppercase tracking-wide">{t.totalRow}</span>
            <span>{hasUnpriced ? t.onRequest : formatPrice(total)}</span>
          </div>
        </div>

        {/* Generated message */}
        {cart.length > 0 && delivery ? (
          <div className="mt-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{t.messageLabel}</p>
            <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-6 text-sm leading-relaxed text-white/80">
              {message}
            </pre>
          </div>
        ) : null}

        {sendState === "sent" ? (
          <div className="mt-6 rounded-2xl border border-[#927C69]/60 bg-[#927C69]/10 p-6 text-sm text-white">
            <p className="font-bold uppercase tracking-[0.15em]">{t.sentTitle}</p>
            <p className="mt-2 text-white/70">{t.sentText}</p>
          </div>
        ) : null}
        {sendState === "error" ? <p className="mt-6 text-xs text-white/60">{t.sendError}</p> : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={submitOrder}
            disabled={!ready || sendState === "sending"}
            className={`flex-1 rounded-full px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.15em] transition ${
              ready ? "bg-[#927C69] text-black hover:bg-white" : "cursor-not-allowed bg-white/10 text-white/35"
            }`}
          >
            {sendState === "sending" ? t.sending : t.send}
          </button>

          <button
            type="button"
            onClick={copy}
            disabled={!message}
            className="rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white/80 transition hover:border-[#927C69] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
        {!ready && cart.length > 0 ? (
          <p className="mt-3 text-xs text-white/45">
            {delivery === null ? t.needDelivery : delivery === "ship" ? t.needAddress : ""}
          </p>
        ) : null}
        <p className="mt-4 text-xs text-white/40">
          {ready ? (
            <>
              <a
                href={gmailCompose}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#927C69] underline underline-offset-4 hover:text-white"
              >
                {t.openInGmail}
              </a>
              {" · "}
            </>
          ) : null}
          {t.mailNote("§MAIL§").split("§MAIL§")[0]}
          <a href={`mailto:${ORDER_EMAIL}`} className="text-[#927C69] underline underline-offset-4">
            {ORDER_EMAIL}
          </a>
          {t.mailNote("§MAIL§").split("§MAIL§")[1]}
        </p>
      </section>

      {/* Lookbook */}
      <section className="border-t border-white/10 bg-white/[0.02] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/45">{t.gallery}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {lookbook.map((img) => (
              <div key={img.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="object-cover transition duration-700 hover:scale-[1.04]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 text-center">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
        >
          {t.backHome}
        </Link>
      </footer>

      {/* Mobile sticky bar */}
      {itemCount > 0 ? (
        <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#0B0A09]/95 px-6 py-4 backdrop-blur md:hidden">
          <a
            href="#objednavka"
            className="flex items-center justify-between rounded-full bg-[#927C69] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-black"
          >
            <span>{t.pieces(itemCount)}</span>
            <span>{hasUnpriced ? t.orderCta : `${formatPrice(total)} →`}</span>
          </a>
        </div>
      ) : null}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  className = "",
  placeholder,
  autoComplete,
  inputMode,
  hint,
  list,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  autoComplete?: string
  inputMode?: "text" | "numeric" | "tel" | "email"
  hint?: string
  list?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        list={list}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#927C69]"
      />
      {hint ? <span className="mt-1.5 block text-[11px] text-white/40">{hint}</span> : null}
    </label>
  )
}

/** PSČ → město. Pro Česko OpenStreetMap, jinde zippopotam.us s fallbackem. */
async function lookupZip(zip: string, country: string): Promise<string[]> {
  const code = country.toUpperCase()
  if (code !== "CZ") {
    const places = await lookupZippopotam(zip, code)
    if (places.length > 0) return places
  }
  return lookupNominatim(zip, code)
}

async function lookupZippopotam(zip: string, country: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.zippopotam.us/${country}/${zip}`)
    if (!res.ok) return []
    const data = await res.json()
    const places: string[] = Array.isArray(data?.places)
      ? data.places.map((p: any) => p["place name"]).filter(Boolean)
      : []
    return [...new Set(places)]
  } catch {
    return []
  }
}

async function lookupNominatim(zip: string, country: string): Promise<string[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=${country}&format=json&addressdetails=1&limit=5`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    const places = data
      .map((r: any) => r.address?.city ?? r.address?.town ?? r.address?.village ?? r.address?.municipality)
      .filter(Boolean) as string[]
    return [...new Set(places)]
  } catch {
    return []
  }
}
