"use client"

import Image from "next/image"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"
import { dict, type Lang } from "./i18n"

export type LogoVariant = "new" | "legacy"
export type Theme = "dark" | "light"
export type View = "front" | "open" | "back"
export type VoucherFields = { to: string; from: string; message: string }

export type VoucherHandle = { goTo: (v: View) => void }

const ACCENT = "#927C69"
const MM = 96 / 25.4
const W = 210 * MM
const H = 148.5 * MM

const lerp = (a: number, b: number, u: number) => a + (b - a) * u
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2)
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3)

type Props = {
  lang: Lang
  logo: LogoVariant
  theme: Theme
  fields: VoucherFields
  /** zmenšená varianta do karty na /merch */
  compact?: boolean
  onView?: (v: View) => void
}

/** Přeložená A4 – otevírá se kolem skladu, dá se otočit na zadní stranu. */
const VoucherScene = forwardRef<VoucherHandle, Props>(function VoucherScene(
  { lang, logo, theme, fields, compact = false, onView },
  handleRef,
) {
  const stage = useRef<HTMLDivElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const rig = useRef<HTMLDivElement>(null)
  const ground = useRef<HTMLDivElement>(null)
  const frontLeaf = useRef<HTMLDivElement>(null)
  const shade1 = useRef<HTMLDivElement>(null)
  const shade2 = useRef<HTMLDivElement>(null)
  const shade3 = useRef<HTMLDivElement>(null)

  /** stav scény – mimo React, překresluje se v rAF */
  const s = useRef({ angle: 0, turn: 0, intro: 1, tilt: { x: 0, y: 0, tx: 0, ty: 0 } })
  const anim = useRef<Record<string, number>>({})
  const lastView = useRef<View>("front")

  const render = useCallback(() => {
    const st = stage.current
    if (!st || !rig.current) return
    const { angle, turn, intro, tilt } = s.current
    const p = angle / 180
    const sw = st.clientWidth
    const sh = st.clientHeight - (compact ? 10 : 40)
    const kc = Math.min((sw * 0.86) / W, (sh * 0.82) / H)
    const ko = Math.min((sw * 0.9) / W, (sh * 0.94) / (2 * H))
    const k = lerp(kc, ko, p)
    const y = -((H * k) / 2) * (1 - p)
    const tp = turn / 180
    const lift = Math.sin(p * Math.PI) * 26 + Math.sin(tp * Math.PI) * 40
    const rx = tilt.y + Math.sin(tp * Math.PI) * 5 + (1 - intro) * 18
    const ry = turn + tilt.x

    rig.current.style.transform = `translateY(${(y + (1 - intro) * 70).toFixed(1)}px) translateZ(${lift.toFixed(
      1,
    )}px) scale(${k.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    if (scene.current) scene.current.style.opacity = intro.toFixed(3)
    if (frontLeaf.current) frontLeaf.current.style.transform = `rotateX(${angle}deg) translateZ(1mm)`

    const sin = Math.sin((angle * Math.PI) / 180)
    if (shade1.current) shade1.current.style.opacity = (sin * 0.32).toFixed(3)
    if (shade2.current) shade2.current.style.opacity = (sin * 0.28).toFixed(3)
    if (shade3.current) shade3.current.style.opacity = ((1 - p) * 0.55).toFixed(3)

    if (ground.current) {
      ground.current.style.opacity = (Math.max(0.25, 1 - lift / 70) * intro).toFixed(2)
      ground.current.style.transform = `translateY(${(y + (H - 8 * MM) * k + (1 - intro) * 70).toFixed(
        1,
      )}px) scale(${(k * (1 + lift / 300) * (1 - 0.25 * Math.abs(Math.sin(tp * Math.PI)))).toFixed(4)}, ${(
        k *
        (1 + lift / 160)
      ).toFixed(4)})`
    }

    const v: View = turn > 90 ? "back" : angle > 90 ? "open" : "front"
    if (v !== lastView.current) {
      lastView.current = v
      onView?.(v)
    }
  }, [compact, onView])

  const tween = useCallback(
    (name: string, from: number, to: number, ms: number, set: (v: number) => void, fn = ease) => {
      cancelAnimationFrame(anim.current[name])
      const t0 = performance.now()
      const step = (now: number) => {
        const u = Math.min(1, (now - t0) / ms)
        set(from + (to - from) * fn(u))
        anim.current[name] = u < 1 ? requestAnimationFrame(step) : 0
        render()
      }
      anim.current[name] = requestAnimationFrame(step)
    },
    [render],
  )

  const openTo = useCallback((a: number) => tween("a", s.current.angle, a, 1150, (v) => (s.current.angle = v)), [tween])
  const turnTo = useCallback((tv: number) => tween("t", s.current.turn, tv, 1000, (v) => (s.current.turn = v)), [tween])

  useImperativeHandle(
    handleRef,
    () => ({
      goTo: (v: View) => {
        if (v === "front") {
          if (s.current.turn > 0) turnTo(0)
          if (s.current.angle > 0) openTo(0)
        }
        if (v === "open") {
          if (s.current.turn > 0) turnTo(0)
          openTo(180)
        }
        if (v === "back") {
          if (s.current.angle > 0) openTo(0)
          turnTo(180)
        }
      },
    }),
    [openTo, turnTo],
  )

  /* intro + resize + jemná paralaxa myší */
  useEffect(() => {
    s.current.intro = 0
    tween("i", 0, 1, 1000, (v) => (s.current.intro = v), easeOut)

    const st = stage.current
    if (!st) return
    const ro = new ResizeObserver(() => render())
    ro.observe(st)

    let raf = 0
    const tiltLoop = () => {
      cancelAnimationFrame(raf)
      const step = () => {
        const t = s.current.tilt
        t.x += (t.tx - t.x) * 0.09
        t.y += (t.ty - t.y) * 0.09
        render()
        if (Math.abs(t.tx - t.x) + Math.abs(t.ty - t.y) > 0.01) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return
      const r = st.getBoundingClientRect()
      s.current.tilt.tx = ((ev.clientX - r.left) / r.width - 0.5) * (compact ? 5 : 8)
      s.current.tilt.ty = -((ev.clientY - r.top) / r.height - 0.5) * (compact ? 4 : 6)
      tiltLoop()
    }
    const onLeave = () => {
      s.current.tilt.tx = 0
      s.current.tilt.ty = 0
      tiltLoop()
    }
    st.addEventListener("pointermove", onMove)
    st.addEventListener("pointerleave", onLeave)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      st.removeEventListener("pointermove", onMove)
      st.removeEventListener("pointerleave", onLeave)
    }
  }, [compact, render, tween])

  const t = dict[lang]
  const dark = theme === "dark"
  const paper = dark ? "#121009" : "#F7F3EC"
  const ink = dark ? "#F3EDE6" : "#17150F"
  const soft = dark ? "rgba(243,237,230,0.55)" : "rgba(23,21,15,0.55)"
  const line = dark ? "rgba(243,237,230,0.16)" : "rgba(23,21,15,0.16)"
  const panelStyle = { background: paper, color: ink }

  return (
    <div
      ref={stage}
      className={`v-stage ${compact ? "compact" : "mt-4"} ${dark ? "v-paper-dark" : ""}`}
    >
      <div ref={scene} className="v-scene">
        <div ref={ground} className="v-ground" />
        <div ref={rig} className="v-rig">
          <div
            className="v-card"
            role="button"
            tabIndex={0}
            onClick={() => (s.current.turn > 90 ? turnTo(0) : openTo(s.current.angle > 90 ? 0 : 180))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                openTo(s.current.angle > 90 ? 0 : 180)
              }
            }}
            aria-label={t.voucherOpen}
          >
            <div className="v-leaf">
              <div className="v-face inner" style={panelStyle}>
                <div className="v-crease" />
                <div ref={shade3} className="v-shade" />
                <InsideBottomPanel t={t} fields={fields} logo={logo} dark={dark} soft={soft} line={line} />
              </div>
              <div className="v-face outer" style={panelStyle}>
                <div className="v-shade" />
                <BackPanel t={t} fields={fields} logo={logo} dark={dark} soft={soft} line={line} />
              </div>
            </div>
            <div ref={frontLeaf} className="v-leaf">
              <div className="v-face front" style={panelStyle}>
                <div ref={shade1} className="v-shade" />
                <CoverPanel t={t} logo={logo} dark={dark} />
              </div>
              <div className="v-face inside" style={panelStyle}>
                <div className="v-crease" />
                <div ref={shade2} className="v-shade" />
                <InsideTopPanel t={t} soft={soft} message={fields.message} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default VoucherScene

/** Panely pro tisk – stejné jako v kartě. */
export function VoucherPrintSheets({
  lang,
  logo,
  theme,
  fields,
}: {
  lang: Lang
  logo: LogoVariant
  theme: Theme
  fields: VoucherFields
}) {
  const t = dict[lang]
  const dark = theme === "dark"
  const paper = dark ? "#121009" : "#F7F3EC"
  const ink = dark ? "#F3EDE6" : "#17150F"
  const soft = dark ? "rgba(243,237,230,0.55)" : "rgba(23,21,15,0.55)"
  const line = dark ? "rgba(243,237,230,0.16)" : "rgba(23,21,15,0.16)"
  const panelStyle = { background: paper, color: ink }

  return (
    <div className="v-print">
      <div className="v-sheet" style={panelStyle}>
        <div className="v-slot top rot">
          <BackPanel t={t} fields={fields} logo={logo} dark={dark} soft={soft} line={line} />
        </div>
        <div className="v-slot bottom">
          <CoverPanel t={t} logo={logo} dark={dark} />
        </div>
      </div>
      <div className="v-sheet" style={panelStyle}>
        <div className="v-slot top rot">
          <InsideTopPanel t={t} soft={soft} message={fields.message} />
        </div>
        <div className="v-slot bottom">
          <InsideBottomPanel t={t} fields={fields} logo={logo} dark={dark} soft={soft} line={line} />
        </div>
        <i className="v-foldmark l" />
        <i className="v-foldmark r" />
      </div>
    </div>
  )
}

/* ───────────────────────── panely ───────────────────────── */

type T = (typeof dict)["cs"]
type Fields = VoucherFields

function CoverPanel({ t, logo, dark }: { t: T; logo: LogoVariant; dark: boolean }) {
  return (
    <div className="v-panel" style={{ alignItems: "center", justifyContent: "center", gap: "8mm" }}>
      <Logo variant={logo} dark={dark} width={logo === "legacy" ? "78mm" : "52mm"} stacked />
      <span style={{ color: ACCENT, fontSize: "8pt", letterSpacing: "0.45em", textTransform: "uppercase" }}>
        {t.voucherTitle}
      </span>

    </div>
  )
}

function InsideTopPanel({ t, soft, message }: { t: T; soft: string; message: string }) {
  const text = message.trim() || t.voucherText
  return (
    <div className="v-panel" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <p
        style={{
          fontSize: text.length > 220 ? "11.5pt" : "13pt",
          lineHeight: 1.6,
          maxWidth: "150mm",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </p>
      <span
        style={{ marginTop: "8mm", fontSize: "8pt", letterSpacing: "0.3em", textTransform: "uppercase", color: soft }}
      >
        anteaterofficial.com/merch
      </span>
    </div>
  )
}

function InsideBottomPanel({
  t,
  fields,
  logo,
  dark,
  soft,
  line,
}: {
  t: T
  fields: Fields
  logo: LogoVariant
  dark: boolean
  soft: string
  line: string
}) {
  return (
    <div className="v-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10mm" }}>
        <Logo variant={logo} dark={dark} width={logo === "legacy" ? "34mm" : "32mm"} />
        <span style={{ color: ACCENT, fontSize: "7.5pt", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          {t.voucherTitle}
        </span>
      </div>

      <div style={{ fontSize: "11pt", lineHeight: 1.6 }}>
        <p style={{ color: soft, fontSize: "7.5pt", letterSpacing: "0.26em", textTransform: "uppercase" }}>
          {t.voucherHowTo}
        </p>
        <p style={{ marginTop: "3mm" }}>{t.voucherRedeem}</p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "8mm",
          borderTop: `0.2mm solid ${line}`,
          paddingTop: "3mm",
          fontSize: "9pt",
          color: soft,
        }}
      >
        <div>
          {fields.to ? (
            <p>
              <span style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>{t.voucherFor}:</span> {fields.to}
            </p>
          ) : null}
          {fields.from ? (
            <p>
              <span style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>{t.voucherFrom}:</span>{" "}
              {fields.from}
            </p>
          ) : null}
        </div>
        <div style={{ textAlign: "right" }}>
          <p>anteaterofficial.com/merch</p>
        </div>
      </div>
    </div>
  )
}

function BackPanel({
  t,
  fields,
  logo,
  dark,
  soft,
  line,
}: {
  t: T
  fields: Fields
  logo: LogoVariant
  dark: boolean
  soft: string
  line: string
}) {
  return (
    <div className="v-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10mm" }}>
        <div>
          <p style={{ color: ACCENT, fontSize: "7.5pt", letterSpacing: "0.26em", textTransform: "uppercase" }}>
            {t.voucherTitle}
          </p>
          <p style={{ marginTop: "4mm", fontSize: "15pt" }}>{t.voucherKicker}</p>
        </div>
        <Logo variant={logo} dark={dark} width={logo === "legacy" ? "34mm" : "30mm"} />
      </div>

      <div style={{ fontSize: "10pt", lineHeight: 1.7, color: soft }}>
        <p style={{ color: ACCENT, fontSize: "7.5pt", letterSpacing: "0.26em", textTransform: "uppercase" }}>
          {t.voucherHowTo}
        </p>
        <p style={{ marginTop: "3mm" }}>{t.voucherRedeem}</p>
      </div>

      <div style={{ borderTop: `0.2mm solid ${line}`, paddingTop: "3mm", fontSize: "9pt", color: soft }}>
        <p>anteaterofficial.com/merch · anteaterofficial@gmail.com</p>
      </div>
    </div>
  )
}

function Logo({
  variant,
  dark,
  width,
  stacked = false,
}: {
  variant: LogoVariant
  dark: boolean
  width: string
  stacked?: boolean
}) {
  /** Loga jsou černá – na tmavém papíře je překlopíme do bílé. */
  const filter = dark ? "brightness(0) invert(1)" : undefined

  if (variant === "legacy") {
    return (
      <Image
        src="/images/logo/anteater-logo-legacy.png"
        alt="ANTEATER"
        width={900}
        height={771}
        priority
        style={{ filter, width, height: "auto" }}
      />
    )
  }

  if (!stacked) {
    return (
      <Image
        src="/images/logo/anteater-wordmark-new.png"
        alt="ANTEATER"
        width={900}
        height={261}
        priority
        style={{ filter, width, height: "auto" }}
      />
    )
  }

  return (
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6mm" }}>
      <Image
        src="/images/logo/anteater-symbol-new.png"
        alt=""
        width={900}
        height={1096}
        priority
        style={{ filter, width: "36mm", height: "auto" }}
      />
      <Image
        src="/images/logo/anteater-wordmark-new.png"
        alt="ANTEATER"
        width={900}
        height={261}
        priority
        style={{ filter, width, height: "auto" }}
      />
    </span>
  )
}

