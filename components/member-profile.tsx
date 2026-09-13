"use client"

import Link from "next/link"
import type React from "react"
import { ChevronDown, ExternalLink, MapPin, Music2 } from "lucide-react"
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
      cz: "Andrea je hlasem a frontmankou ANTEATER. Její projev se pohybuje mezi intimními, melodickými pasážemi a syrovou rockovou energií. Kromě hudby studovala archeologii na Univerzitě Karlově v Praze a do tvorby kapely přináší zvídavý, příběhový pohled.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Andrea%20Kohoutova%CC%81-MrX42xWio3DPp9kWH11wJmU0WoLzCC.jpeg",
  },
  {
    slug: "hanzi",
    name: "Jan Oršíček",
    role: { en: "Drums · Percussion", de: "Schlagzeug · Percussion", cz: "Bicí · Perkuse" },
    instruments: { en: ["Drums", "Percussion", "Mapex Saturn kit"], de: ["Schlagzeug", "Percussion", "Mapex-Saturn-Set"], cz: ["Bicí", "Perkuse", "Souprava Mapex Saturn"] },
    bio: {
      en: "Jan Oršíček is a live and session drummer known for a precise pulse, dynamic control and a powerful stage presence. His playing gives ANTEATER’s songs their physical drive while leaving space for the arrangement to breathe.",
      de: "Jan Oršíček ist Live- und Sessiondrummer, bekannt für präzises Timing, dynamische Kontrolle und eine starke Bühnenpräsenz. Sein Spiel gibt den Songs von ANTEATER den körperlichen Antrieb und lässt dem Arrangement zugleich Raum zum Atmen.",
      cz: "Jan Oršíček je koncertní a studiový bubeník známý přesným pulzem, dynamikou a výraznou pódiovou energií. Jeho hra dodává skladbám ANTEATER fyzický tah a zároveň nechává aranžím prostor dýchat.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jan%20Ori%CC%81s%CC%8Cek-RQnKevx7WuXrGXDuYekLRggoaQ8MHG.jpeg",
  },
  {
    slug: "jindra",
    name: "Jindřich Traxmandl",
    role: { en: "Guitar · Bass · Drums", de: "Gitarre · Bass · Schlagzeug", cz: "Kytara · Baskytara · Bicí" },
    instruments: { en: ["Electric guitar", "Bass guitar", "Drums", "Analog studio equipment"], de: ["E-Gitarre", "Bassgitarre", "Schlagzeug", "Analoges Studio-Equipment"], cz: ["Elektrická kytara", "Baskytara", "Bicí", "Analogové studiové vybavení"] },
    bio: {
      en: "Jindřich is a multi-instrumentalist, engineer and the band’s technical mind. In 2026 he is building his own unique studio: a creative hub where new material is taking shape. Housed in a historic 17th-century property, the main studio inside the old water mill will also be open to the public. More at mlynnapile.cz.",
      de: "Jindřich ist Multiinstrumentalist, Tontechniker und der technische Kopf der Band. 2026 baut er sein eigenes, einzigartiges Studio auf – einen kreativen Ort, an dem neues Material entsteht. Das Hauptstudio befindet sich in einem historischen Gebäude aus dem 17. Jahrhundert, einer alten Wassermühle, und wird auch der Öffentlichkeit offenstehen. Mehr unter mlynnapile.cz.",
      cz: "Jindřich je multiinstrumentalista, technik a technická hlava kapely. V roce 2026 buduje vlastní unikátní studio – kreativní centrum, kde právě vzniká nový materiál. Hlavní studio sídlí v historické památce ze 17. století, ve starém vodním mlýně, a bude otevřené také veřejnosti. Více na mlynnapile.cz.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jindr%CC%8Cich%20Traxmandl-sAHyNHo50VgJDdgLfcq8Kk3fRrriyp.jpeg",
  },
]

const localeLabels: Record<Locale, string> = { en: "EN", de: "DE", cz: "CZ" }

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
        <p className="profile-index">0{profiles.findIndex((item) => item.slug === profile.slug) + 1} / 03</p>
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
        <a className="external-link" href="https://mlynnapile.cz" target="_blank" rel="noreferrer">mlynnapile.cz <ExternalLink aria-hidden="true" /></a>
      </section>

      <footer className="profile-footer">
        <div><span className="footer-label">NEXT</span><Link href={`/${profiles[(profiles.findIndex((item) => item.slug === profile.slug) + 1) % profiles.length].slug}`}>{profiles[(profiles.findIndex((item) => item.slug === profile.slug) + 1) % profiles.length].name}</Link></div>
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
