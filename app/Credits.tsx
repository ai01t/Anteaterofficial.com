/** Podpis úplně dole – objeví se až po dalším, důraznějším scrollu. */
export default function Credits({ dark = true }: { dark?: boolean }) {
  return (
    <div className={`pt-[45vh] pb-10 text-center ${dark ? "bg-[#0B0A09]" : "bg-black/90"}`}>
      <p className="text-[10px] tracking-[0.2em] text-white/30">
        © 2026 | Design &amp; Development: Ing. Jindřich Traxmandl
      </p>
    </div>
  )
}
