"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import VoucherScene, {
  VoucherPrintSheets,
  type LogoVariant,
  type Theme,
  type View,
  type VoucherHandle,
} from "../VoucherScene"
import { CURRENCY_SIGN, LANGS, dict, fromLocal, loadLang, moneyLocal, saveLang, type Lang } from "../i18n"

/** Výchozí hodnota poukazu v měně jazyka. */
const VOUCHER_DEFAULT: Record<Lang, number> = { cs: 1000, en: 45, de: 40 }

export default function VoucherPage() {
  const [lang, setLang] = useState<Lang>("cs")
  const [logo, setLogo] = useState<LogoVariant>("new")
  const [theme, setTheme] = useState<Theme>("dark")
  const [view, setView] = useState<View>("front")
  const [fields, setFields] = useState({ to: "", from: "", message: "" })
  const [amountMode, setAmountMode] = useState<"1000" | "custom">("1000")
  const [customAmount, setCustomAmount] = useState("")
  const amount = amountMode === "1000" ? VOUCHER_DEFAULT[lang] : Number(customAmount.replace(/\D/g, "")) || undefined
  const voucherFields = { ...fields, amount }
  const router = useRouter()
  const [cartState, setCartState] = useState<"idle" | "added" | "need-amount">("idle")
  const [forBand, setForBand] = useState(false)

  /** Uloží poukaz do stejného košíku jako merch. */
  const addVoucherToCart = () => {
    if (!amount) {
      setCartState("need-amount")
      return false
    }
    const note = t.voucherCartNote(fields.to.trim(), fields.from.trim(), fields.message.trim())
    const item = {
      key: `voucher|${amount}|${Date.now()}`,
      productId: "voucher",
      name: `${t.voucherCartName} ${moneyLocal(amount, lang)}`,
      size: "Univerzální",
      qty: 1,
      price: fromLocal(amount, lang),
      countsAs: "voucher",
      note,
    }
    try {
      const raw = window.localStorage.getItem("anteater-merch-cart-v1")
      const cart = raw ? JSON.parse(raw) : []
      window.localStorage.setItem("anteater-merch-cart-v1", JSON.stringify([...cart, item]))
    } catch {
      /* localStorage nemusí být dostupné */
    }
    setCartState("added")
    return true
  }
  const sceneRef = useRef<VoucherHandle>(null)

  useEffect(() => {
    setLang(loadLang())
  }, [])

  const t = dict[lang]

  const views: { id: View; label: string }[] = [
    { id: "front", label: t.voucherViewFront },
    { id: "open", label: t.voucherViewInside },
    { id: "back", label: t.voucherViewBack },
  ]

  return (
    <div className="min-h-screen bg-[#0B0A09] text-white">
      <div className="v-screen">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0A09]/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
            <Link
              href={`/merch?lang=${lang}`}
              className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 transition hover:text-white"
            >
              ← Merch
            </Link>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em]">
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
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#927C69]">{t.voucherKicker}</p>
          <h1 className="mt-3 text-4xl font-bold uppercase tracking-tight md:text-6xl">{t.voucherTitle}</h1>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="inline-flex gap-1 rounded-full border border-white/15 p-1">
              {views.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => sceneRef.current?.goTo(v.id)}
                  aria-pressed={view === v.id}
                  className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                    view === v.id ? "bg-[#927C69]/20 text-[#927C69]" : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <VoucherScene ref={sceneRef} lang={lang} logo={logo} theme={theme} fields={voucherFields} onView={setView} />

          {/* ovládání */}
          <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{t.voucherStyle}</p>
              <div className="flex flex-wrap gap-2">
                <Pill active={logo === "new"} onClick={() => setLogo("new")}>
                  {t.voucherNewLogo}
                </Pill>
                <Pill active={logo === "legacy"} onClick={() => setLogo("legacy")}>
                  {t.voucherLegacyLogo}
                </Pill>
                <span className="w-full sm:w-4" />
                <Pill active={theme === "dark"} onClick={() => setTheme("dark")}>
                  {t.voucherDark}
                </Pill>
                <Pill active={theme === "light"} onClick={() => setTheme("light")}>
                  {t.voucherLight}
                </Pill>
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{t.voucherAmount}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Pill active={amountMode === "1000"} onClick={() => setAmountMode("1000")}>
                  {moneyLocal(VOUCHER_DEFAULT[lang], lang)}
                </Pill>
                <Pill active={amountMode === "custom"} onClick={() => setAmountMode("custom")}>
                  {t.voucherCustom}
                </Pill>
                {amountMode === "custom" ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value.replace(/[^\d\s]/g, ""))}
                      placeholder="např. 1500"
                      autoFocus
                      className="w-32 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white outline-none focus:border-[#927C69]"
                    />
                    <span className="text-sm text-white/60">{CURRENCY_SIGN[lang]}</span>
                  </label>
                ) : null}
              </div>
            </div>

            <div className="flex items-end gap-2 sm:col-span-2">
              <VField
                label={t.voucherFor}
                placeholder={t.voucherForPh}
                value={fields.to}
                onChange={(v) => {
                  setForBand(false)
                  setFields((f) => ({ ...f, to: v }))
                }}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  const on = !forBand
                  setForBand(on)
                  setFields((f) => ({ ...f, to: on ? t.voucherForBandValue : "" }))
                }}
                aria-pressed={forBand}
                className={`shrink-0 rounded-xl border px-4 py-3 text-xs font-semibold transition ${
                  forBand
                    ? "border-[#927C69] bg-[#927C69] text-black"
                    : "border-white/20 text-white/70 hover:border-[#927C69] hover:text-white"
                }`}
              >
                {t.voucherForBand} ❤
              </button>
            </div>
            <VField
              className="sm:col-span-2"
              label={t.voucherFrom}
              placeholder={t.voucherFromPh}
              value={fields.from}
              onChange={(v) => setFields((f) => ({ ...f, from: v }))}
            />
            <VArea
              label={forBand ? t.voucherBandMessage : t.voucherMessage}
              placeholder={forBand ? t.voucherBandMessage : t.voucherMessagePh}
              value={fields.message}
              onChange={(v) => setFields((f) => ({ ...f, message: v }))}
              className="sm:col-span-2"
            />

            {forBand ? (
              <p className="rounded-2xl border border-[#927C69]/50 bg-[#927C69]/10 p-4 text-sm text-white sm:col-span-2">
                {t.voucherBandThanks}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button
                type="button"
                onClick={addVoucherToCart}
                className="flex-1 rounded-full border border-[#927C69] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#927C69] hover:text-black"
              >
                {t.voucherAddToCart}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (addVoucherToCart()) router.push(`/merch?lang=${lang}#objednavka`)
                }}
                className="flex-1 rounded-full bg-[#927C69] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white"
              >
                {t.voucherOrderNow}
              </button>
            </div>
            {cartState === "added" ? (
              <p className="text-sm text-[#927C69] sm:col-span-2">
                {t.voucherAdded}{" "}
                <Link href={`/merch?lang=${lang}#objednavka`} className="underline underline-offset-4 hover:text-white">
                  {t.voucherOrderNow} →
                </Link>
              </p>
            ) : null}
            {cartState === "need-amount" ? (
              <p className="text-sm text-white/60 sm:col-span-2">{t.voucherNeedAmount}</p>
            ) : null}

            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs text-white/40 underline underline-offset-4 transition hover:text-white sm:col-span-2"
            >
              {t.voucherPrint}
            </button>
          </div>
        </main>
      </div>

      {/* tisk – 2 × A4, přeložit napůl */}
      <VoucherPrintSheets lang={lang} logo={logo} theme={theme} fields={voucherFields} />
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? "border-[#927C69] bg-[#927C69] text-black"
          : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}

function VField({
  label,
  value,
  placeholder,
  onChange,
  className = "",
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#927C69]"
      />
    </label>
  )
}

function VArea({
  label,
  value,
  placeholder,
  onChange,
  className = "",
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</span>
      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/30 focus:border-[#927C69]"
      />
    </label>
  )
}
