"use client"

import Link from "next/link"
import type React from "react"
import { ChevronDown, MapPin, Music2 } from "lucide-react"
import { useState } from "react"

type Locale = "en" | "de" | "cz"

type Profile = {
  slug: string
  name: string
  role: Record<Locale, string>
  instruments: Record<Locale, string[]>
  bio: Record<Locale, string>
  image: string
}

const profiles: Profile[] = [
  {
    slug: "andy",
    name: "Andrea Kohoutová",
    role: { en: "Vocals · Bass · Guitar", de: "Gesang · Bass · Gitarre", cz: "Zpěv · Baskytara · Kytara" },
    instruments: { en: ["Lead vocals", "Bass guitar", "Electric guitar"], de: ["Leadgesang", "Bassgitarre", "E-Gitarre"], cz: ["Hlavní zpěv", "Baskytara", "Elektrická kytara"] },
    bio: {
      en: "Andrea is the voice and frontwoman of ANTEATER. Her performance moves between intimate, melodic passages and a raw rock edge. Alongside music, she studied archaeology at Charles University in Prague and brings a curious, story-driven perspective to the band’s work.",
      de: "Andrea ist die Stimme und Frontfrau von ANTEATER. Ihr Auftritt bewegt sich zwischen intimen, melodischen Momenten und einer rauen Rockkante. Neben der Musik studierte sie Archäologie an der Karls-Universität in Prag und bringt eine neugierige, erzählerische Perspektive in die Arbeit der Band ein.",
      cz: "Andrea je frontwoman, zpěvačka, baskytaristka a skladatelka. Miluje přírodu, jógu, běh a historii. Pochází z Klatov, vystudovala historii a působila ve Vlastivědném muzeu Dr. Hostaše. Účinkovala také v muzikálu Kladivo na Pýchu. Do alternativního rocku a grunge přináší sílu, zranitelnost a vlastní tvůrčí cestu.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Andrea%20Kohoutova%CC%81-MrX42xWio3DPp9kWH11wJmU0WoLzCC.jpeg",
  },
  {
    slug: "hanzi",
    name: "Jan Oríšek",
    role: { en: "Drums · Percussion", de: "Schlagzeug · Percussion", cz: "Bicí · Perkuse" },
    instruments: { en: ["Mapex Saturn V MH Exotic — maple/walnut shellpack", "Tama S.L.P. Big Black Steel 14×8 snare", "Zildjian K Sweet, K Custom Hybrid and Sabian AAX cymbals", "REMO and Evans heads · 5B sticks", "Shure SM57 · Sennheiser e 906 · Shure 215 live monitoring"], de: ["Mapex Saturn V MH Exotic — Ahorn/Walnuss", "Tama S.L.P. Big Black Steel 14×8 Snare", "Zildjian- und Sabian-Becken", "REMO- und Evans-Felle · 5B-Sticks", "Shure SM57 · Sennheiser e 906 · Shure 215 Monitoring"], cz: ["Mapex Saturn V MH Exotic — javor/ořech", "Tama S.L.P. Big Black Steel 14×8", "Činely Zildjian K Sweet, K Custom Hybrid a Sabian AAX", "Blány REMO a Evans · paličky 5B", "Shure SM57 · Sennheiser e 906 · Shure 215 pro odposlech"] },
    bio: {
      en: "Jan Oríšek is a live and session drummer known for a precise pulse, dynamic control and a powerful stage presence. His playing gives ANTEATER’s songs their physical drive while leaving space for the arrangement to breathe.",
      de: "Jan Oríšek ist Live- und Sessiondrummer, bekannt für präzises Timing, dynamische Kontrolle und eine starke Bühnenpräsenz. Sein Spiel gibt den Songs von ANTEATER den körperlichen Antrieb und lässt dem Arrangement zugleich Raum zum Atmen.",
      cz: "Jan Oríšek kryje kapele záda pevným rytmem a jistotou na každém koncertě. Na housle a klavír začal hrát v šesti letech, dnes hraje především na bicí, ale také na kytaru, baskytaru a klavír. Ovládá i samply používané živě. Když zrovna nesedí za bicími, věnuje se enduru, freeridu, trailům, snowboardu, boulderingu, horám a cestování.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jan%20Ori%CC%81s%CC%8Cek-RQnKevx7WuXrGXDuYekLRggoaQ8MHG.jpeg",
  },
  {
    slug: "jindra",
    name: "Jindřich Traxmandl",
    role: { en: "Guitar · Bass · Drums", de: "Gitarre · Bass · Schlagzeug", cz: "Kytara · Baskytara · Bicí" },
    instruments: { en: ["Fender Jaguar Kurt Cobain (2011)", "Marshall AFD 100 into Marshall 1960 BX", "Fender ’64 Custom Deluxe Reverb", "Shure GLXD16+ wireless · Mogami Platinum cables", "Digitech Whammy IV · Strymon Timeline · extensive studio collection"], de: ["Fender Jaguar Kurt Cobain (2011)", "Marshall AFD 100 an Marshall 1960 BX", "Fender ’64 Custom Deluxe Reverb", "Shure GLXD16+ · Mogami Platinum Kabel", "Digitech Whammy IV · Strymon Timeline · umfangreiche Studiosammlung"], cz: ["Fender Jaguar Kurt Cobain (2011)", "Marshall AFD 100 do Marshall 1960 BX", "Fender ’64 Custom Deluxe Reverb", "Bezdrát Shure GLXD16+ · kabely Mogami Platinum", "Digitech Whammy IV · Strymon Timeline · rozsáhlá studiová sbírka"] },
    bio: {
      en: "Jindřich is a multi-instrumentalist, engineer and the band’s technical mind. In 2026 he is building his own unique studio: a creative hub where new material is taking shape. Housed in a historic 17th-century property, the main studio inside the old water mill will also be open to the public. More information is available from the band.",
      de: "Jindřich ist Multiinstrumentalist, Tontechniker und der technische Kopf der Band. 2026 baut er sein eigenes, einzigartiges Studio auf – einen kreativen Ort, an dem neues Material entsteht. Das Hauptstudio befindet sich in einem historischen Gebäude aus dem 17. Jahrhundert, einer alten Wassermühle, und wird auch der Öffentlichkeit offenstehen. Weitere Informationen gibt die Band bekannt.",
      cz: "Jindřich Traxmandl je multiinstrumentalista, technik a technická hlava kapely. Naživo hraje na kytaru a používá precizně sestavený aparát Fender, Marshall a další studiovou techniku. Ve studiu pracuje s rozsáhlou sbírkou kytar, zesilovačů a efektů podle potřeb skladby. V roce 2026 buduje vlastní kreativní studio, kde vzniká nový materiál.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jindr%CC%8Cich%20Traxmandl-sAHyNHo50VgJDdgLfcq8Kk3fRrriyp.jpeg",
  },
]

const localeLabels: Record<Locale, string> = { en: "EN", de: "DE", cz: "CZ" }
const displayOrder = ["andy", "jindra", "hanzi"]

export function MemberProfile({ slug, locale }: { slug: string; locale: Locale }) {
  const profile = profiles.find((item) => item.slug === slug) ?? profiles[0]
  const [bioOpen, setBioOpen] = useState(false)
  const [gearOpen, setGearOpen] = useState(false)

  return (
    <main className="profile-page" style={{ "--profile-image": `url(${profile.image})` } as React.CSSProperties}>
      <div className="profile-overlay" />
      <nav className="profile-nav" aria-label="Profile navigation">
        <Link href="/" className="wordmark">ANTEATER<span> / PROFILE</span></Link>
        <div className="language-switcher" aria-label="Language switcher">
          {(Object.keys(localeLabels) as Locale[]).map((item) => (
            <Link key={item} href={`/${profile.slug}${item === "en" ? "" : `/${item}`}`} className={item === locale ? "active" : ""}>{localeLabels[item]}</Link>
          ))}
        </div>
      </nav>

      <section className="profile-hero" aria-labelledby="profile-name">
        <p className="eyebrow"><span className="eyebrow-line" /> ANTEATER / MUSICIAN</p>
        <p className="profile-index">0{displayOrder.indexOf(profile.slug) + 1} / 03</p>
        <h1 id="profile-name">{profile.name}</h1>
        <p className="profile-role">{profile.role[locale]}</p>
      </section>

      <section className="profile-content" aria-label={`${profile.name} profile details`}>
        <div className="profile-intro"><MapPin aria-hidden="true" /> Prague, Czech Republic <span>·</span> Est. 2018</div>
        <Disclosure label={locale === "de" ? "BIOGRAFIE" : locale === "cz" ? "BIO" : "BIOGRAPHY"} open={bioOpen} onClick={() => setBioOpen(!bioOpen)}>
          <p>{profile.bio[locale]}</p>
        </Disclosure>
        <Disclosure label={locale === "de" ? "INSTRUMENTE" : locale === "cz" ? "NA CO HRAJE" : "PLAYS"} open={gearOpen} onClick={() => setGearOpen(!gearOpen)}>
          <ul className="instrument-list">{profile.instruments[locale].map((instrument) => <li key={instrument}><Music2 aria-hidden="true" /> {instrument}</li>)}</ul>
        </Disclosure>
      </section>

      <footer className="profile-footer">
        <div><span className="footer-label">NEXT</span><Link href={`/${displayOrder[(displayOrder.indexOf(profile.slug) + 1) % displayOrder.length]}`}>{profiles.find((item) => item.slug === displayOrder[(displayOrder.indexOf(profile.slug) + 1) % displayOrder.length])?.name}</Link></div>
        <Link href="/" className="back-link">Back to ANTEATER</Link>
      </footer>
    </main>
  )
}

function Disclosure({ label, open, onClick, children }: { label: string; open: boolean; onClick: () => void; children: React.ReactNode }) {
  return <div className={`disclosure ${open ? "is-open" : ""}`}><button type="button" onClick={onClick} aria-expanded={open}><span>{label}</span><ChevronDown aria-hidden="true" /></button>{open && <div className="disclosure-content">{children}</div>}</div>
}

export { profiles }
export type { Locale }
