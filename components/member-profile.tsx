"use client"

import Link from "next/link"
import type React from "react"
import { ChevronDown } from "lucide-react"
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
    instruments: { en: ["Fender 1995 Precision Bass PB-STD", "Elixir Nanoweb Long Scale strings (.045, .065, .085, .105)", "Ampeg V-4B Bass Head + Ampeg SVT-112AV Cabinet", "KHDK Abyss · Boss ODB-3 · TC Electronic PolyTune", "Strymon Ojai R30 · D’Addario XPND 1 pedalboard", "Shure GLXD16+ wireless · Mogami Platinum · Evidence Audio The Lyric HG · Lava Cable Tephra", "Shure SM7B · Shure Beta 58 · K&M 260/1 · Fender FA-125 NAT acoustic guitar", "K&M stands · Mono Cases Single Electric Bass · Shure SM57 · UA Audio interface · Logic Pro X · Schaller Security S-Locks Pin · tambourine"], de: ["Fender 1995 Precision Bass PB-STD", "Elixir Nanoweb Long Scale Saiten", "Ampeg V-4B Bass Head + Ampeg SVT-112AV Cabinet", "KHDK Abyss · Boss ODB-3 · TC Electronic PolyTune", "Strymon Ojai R30 · D’Addario XPND 1 Pedalboard", "Shure GLXD16+ · Mogami Platinum · Evidence Audio The Lyric HG · Lava Cable Tephra", "Shure SM7B · Shure Beta 58 · Fender FA-125 NAT Akustikgitarre", "K&M Ständer · Mono Cases Single Electric Bass · Shure SM57 · UA Audio Interface · Logic Pro X · Schaller Security S-Locks Pin · Tamburin"], cz: ["Fender 1995 Precision Bass PB-STD", "Struny Elixir Nanoweb Long Scale (.045, .065, .085, .105 niklovaná ocel)", "Celolampová hlava Ampeg V-4B Bass Head + reprobox Ampeg SVT-112AV Cabinet", "KHDK Abyss · Boss ODB-3 · TC Electronic PolyTune", "Strymon Ojai R30 · nastavitelný pedalboard D’Addario XPND 1", "Shure GLXD16+ · Mogami Platinum · Evidence Audio The Lyric HG · Lava Cable Tephra", "Shure SM7B · Shure Beta 58 + K&M 260/1 · Fender FA-125 NAT", "Stojany K&M · Mono Cases Single Electric Bass · Shure SM57 · UA Audio interface · Logic Pro X · Schaller Security S-Locks Pin · tamburína" ] },
    bio: {
      en: "Andrea is the voice and frontwoman of ANTEATER. Her performance moves between intimate, melodic passages and a raw rock edge. Alongside music, she studied archaeology at Charles University in Prague and brings a curious, story-driven perspective to the band’s work.",
      de: "Andrea ist die Stimme und Frontfrau von ANTEATER. Ihr Auftritt bewegt sich zwischen intimen, melodischen Momenten und einer rauen Rockkante. Neben der Musik studierte sie Archäologie an der Karls-Universität in Prag und bringt eine neugierige, erzählerische Perspektive in die Arbeit der Band ein.",
      cz: "Andrea – naše frontwoman, zpěvačka, basačka, skladatelka a mimo kapelu nadšenec do historie – je milovnice přírody, cvičí jógu a ráda běhá. Žije na mlýně, kde peče chléb a s láskou se stará o naši partu slepic, které mají k dispozici přes 6 tisíc metrů a kurník, co vypadá jako letní chata (Jindra často říká, že jim můžou všechny ostatní slepice jen závidět). Andrea je od dětství mimořádně kreativní člověk. Když byla malá, převlékala panenky do kostýmů Johanky z Arku :), které si sama vyráběla, ráda malovala (podílela se i na prvním merchi pro Anteater) a hodně četla o dinosaurech i o historii, což nakonec zpečetila získáním titulu Mgr. na Západočeské univerzitě. Pochází z Klatov, města s hlubokou historickou tradicí, která ji provázela během studia i v pozdější práci. Několik let strávila ve Vlastivědném muzeu Dr. Hostaše v Klatovech – v prostředí, kde se pečuje o paměť míst a lidí. Práce s archivem, kronikami a historickými materiály jí dala cit pro příběhy ukryté v pozadí. Možná právě díky tomu dnes dokáže vidět hodnotu i v obyčejných věcech – ve starém mlýně, v tradičním řemesle nebo v předmětech, které by jiní považovali za nepotřebné. V neposlední řadě v Klatovech účinkovala v muzikálu Kladivo Na Pýchu, kde měla hlavní roli. Jako frontwoman a baskytaristka kapely ANTEATER se pohybuje ve světě alternativního rocku a grunge s výrazným vlivem hudby devadesátých let. Její hudební cesta je bez kompromisů – děláme to, co považujeme za správné, a jdeme tou těžší cestou. Můžeme ale s čistým svědomím říct, že jsme to stále my, a ne vydavatelství, které často zasahuje do tvorby jen kvůli komerčnímu úspěchu. ANTEATER vznikli v roce 2018 a postupně si vybudovali vlastní místo na české rockové scéně. Odehráli koncerty doma i v zahraničí, vydali autorskou tvorbu a ukázali, že i kapela mimo velká centra může mít ambice překročit hranice. Andrea do hudby přináší kombinaci síly a zranitelnosti – energii rockové zpěvačky a zároveň citlivost člověka, který pozoruje svět kolem sebe.",
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
      cz: "S Honzou nám kryje záda a díky němu si můžeme být jistí na každém koncertě. Honza drží pevně rytmus a za celou dobu existence kapely se nestala chyba, která by ohrozila koncert. Díky zkušenostem z dalších nástrojů dokážeme improvizovat ve studiu i na koncertě, i když praskne struna. S nástroji začínal v šesti letech na housle a klavír. Dnes hraje převážně na bicí, ale také na kytaru, baskytaru a stále na klavír. Ovládá samply používané živě. Když zrovna nesedí za bicími, věnuje se enduru, freeridu, trailům, snowboardu, longboardu, boulderingu, horám, trekování, cestování a festivalům. Aktuálně žije v Praze, odkud vyráží za kapelou na zkoušky do mlýna a na koncerty.",
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
        <h1 id="profile-name">{profile.name}</h1>
      </section>

      <section className="profile-content" aria-label={`${profile.name} profile details`}>
        <Disclosure label={locale === "de" ? "BIOGRAFIE" : locale === "cz" ? "BIO" : "BIOGRAPHY"} open={bioOpen} onClick={() => setBioOpen(!bioOpen)}>
          <p>{profile.bio[locale]}</p>
        </Disclosure>
        <Disclosure label={locale === "de" ? "GEAR / INSTRUMENTE" : locale === "cz" ? "GEAR / NA CO HRAJE" : "GEAR / WHAT THEY PLAY"} open={gearOpen} onClick={() => setGearOpen(!gearOpen)}>
          <ul className="instrument-list">{profile.instruments[locale].map((instrument) => <li key={instrument}>{instrument}</li>)}</ul>
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
