"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import VoucherScene, {
  VoucherPrintSheets,
  type LogoVariant,
  type Theme,
  type View,
  type VoucherHandle,
} from "../VoucherScene"
import { LANGS, dict, loadLang, saveLang, type Lang } from "../i18n"

export default function VoucherPage() {
  const [lang, setLang] = useState<Lang>("cs")
  const [logo, setLogo] = useState<LogoVariant>("new")
  const [theme, setTheme] = useState<Theme>("dark")
  const [view, setView] = useState<View>("front")
  const [fields, setFields] = useState({ to: "", from: "", message: "" })
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

          <VoucherScene ref={sceneRef} lang={lang} logo={logo} theme={theme} fields={fields} onView={setView} />

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

            <VField
              label={t.voucherFor}
              placeholder={t.voucherForPh}
              value={fields.to}
              onChange={(v) => setFields((f) => ({ ...f, to: v }))}
            />
            <VField
              label={t.voucherFrom}
              placeholder={t.voucherFromPh}
              value={fields.from}
              onChange={(v) => setFields((f) => ({ ...f, from: v }))}
            />
            <VArea
              label={t.voucherMessage}
              placeholder={t.voucherMessagePh}
              value={fields.message}
              onChange={(v) => setFields((f) => ({ ...f, message: v }))}
              className="sm:col-span-2"
            />

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-[#927C69] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white sm:col-span-2"
            >
              {t.voucherPrint}
            </button>
          </div>
        </main>
      </div>

      {/* tisk – 2 × A4, přeložit napůl */}
      <VoucherPrintSheets lang={lang} logo={logo} theme={theme} fields={fields} />
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
