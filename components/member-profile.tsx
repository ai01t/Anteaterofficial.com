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
    instruments: { en: ["Fender 1995 Precision Bass PB-STD", "Ampeg V-4B Bass Head + Ampeg SVT-112AV Cabinet", "KHDK Abyss · Boss ODB-3 · TC Electronic PolyTune", "Strymon Ojai R30 · D’Addario XPND 1 pedalboard", "Shure GLXD16+ wireless · Mogami Platinum · Evidence Audio The Lyric HG · Lava Cable Tephra", "Shure SM7B · Shure Beta 58 · K&M 260/1 · Fender FA-125 NAT acoustic guitar", "K&M stands · Mono Cases Single Electric Bass · Shure SM57 · UA Audio interface · Logic Pro X · Schaller Security S-Locks Pin · tambourine", "Elixir Nanoweb Long Scale strings (.045, .065, .085, .105 nickel-plated steel)"], de: ["Fender 1995 Precision Bass PB-STD", "Ampeg V-4B Bass Head + Ampeg SVT-112AV Cabinet", "Ampeg V-4B Bass Head + Ampeg SVT-112AV Cabinet", "KHDK Abyss · Boss ODB-3 · TC Electronic PolyTune", "Strymon Ojai R30 · D’Addario XPND 1 Pedalboard", "Shure GLXD16+ · Mogami Platinum · Evidence Audio The Lyric HG · Lava Cable Tephra", "Shure SM7B · Shure Beta 58 · Fender FA-125 NAT Akustikgitarre", "K&M Ständer · Mono Cases Single Electric Bass · Shure SM57 · UA Audio Interface · Logic Pro X · Schaller Security S-Locks Pin · Tamburin", "Elixir Nanoweb Long Scale Saiten (.045, .065, .085, .105 nickelbeschichteter Stahl)"], cz: ["Fender 1995 Precision Bass PB-STD", "Celolampová hlava Ampeg V-4B Bass Head + reprobox Ampeg SVT-112AV Cabinet", "Celolampová hlava Ampeg V-4B Bass Head + reprobox Ampeg SVT-112AV Cabinet", "KHDK Abyss · Boss ODB-3 · TC Electronic PolyTune", "Strymon Ojai R30 · nastavitelný pedalboard D’Addario XPND 1", "Shure GLXD16+ · Mogami Platinum · Evidence Audio The Lyric HG · Lava Cable Tephra", "Shure SM7B · Shure Beta 58 + K&M 260/1 · Fender FA-125 NAT", "Stojany K&M · Mono Cases Single Electric Bass · Shure SM57 · UA Audio interface · Logic Pro X · Schaller Security S-Locks Pin · tamburína", "Struny Elixir Nanoweb Long Scale (.045, .065, .085, .105 niklovaná ocel)" ] },
    bio: {
      en: "Andrea is the voice and frontwoman of ANTEATER. Her performance moves between intimate, melodic passages and a raw rock edge. Alongside music, she studied archaeology at Charles University in Prague and brings a curious, story-driven perspective to the band’s work.",
      de: "Andrea ist die Stimme und Frontfrau von ANTEATER. Ihr Auftritt bewegt sich zwischen intimen, melodischen Momenten und einer rauen Rockkante. Neben der Musik studierte sie Archäologie an der Karls-Universität in Prag und bringt eine neugierige, erzählerische Perspektive in die Arbeit der Band ein.",
      cz: "Andrea – naše frontwoman, zpěvačka, basačka, skladatelka a mimo kapelu nadšenec do historie – je milovnice přírody, cvičí jógu a ráda běhá. Žije na mlýně, kde peče chléb a s láskou se stará o naši partu slepic, které mají k dispozici přes 6 tisíc metrů a kurník, co vypadá jako letní chata (Jindra často říká, že jim můžou všechny ostatní slepice jen závidět). Andrea je od dětství mimořádně kreativní člověk. Když byla malá, převlékala panenky do kostýmů Johanky z Arku :), které si sama vyráběla, ráda malovala (podílela se i na prvním merchi pro Anteater) a hodně četla o dinosaurech i o historii, což nakonec zpečetila získáním titulu Mgr. na Západočeské univerzitě.\n\nPochází z Klatov, města s hlubokou historickou tradicí, která ji provázela během studia i v pozdější práci. Několik let strávila ve Vlastivědném muzeu Dr. Hostaše v Klatovech – v prostředí, kde se pečuje o paměť míst a lidí. Práce s archivem, kronikami a historickými materiály jí dala cit pro příběhy ukryté v pozadí. Možná právě díky tomu dnes dokáže vidět hodnotu i v obyčejných věcech – ve starém mlýně, v tradičním řemesle nebo v předmětech, které by jiní považovali za nepotřebné. V neposlední řadě v Klatovech účinkovala v muzikálu Kladivo Na Pýchu, kde měla hlavní roli.\n\nJako frontwoman a baskytaristka kapely ANTEATER se pohybuje ve světě alternativního rocku a grunge s výrazným vlivem hudby devadesátých let. Její hudební cesta je bez kompromisů – děláme to, co považujeme za správné, a jdeme tou těžší cestou. Můžeme ale s čistým svědomím říct, že jsme to stále my, a ne vydavatelství, které často zasahuje do tvorby jen kvůli komerčnímu úspěchu. ANTEATER vznikli v roce 2018 a postupně si vybudovali vlastní místo na české rockové scéně. Odehráli koncerty doma i v zahraničí, vydali autorskou tvorbu a ukázali, že i kapela mimo velká centra může mít ambice překročit hranice. Andrea do hudby přináší kombinaci síly a zranitelnosti – energii rockové zpěvačky a zároveň citlivost člověka, který pozoruje svět kolem sebe.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Andrea%20Kohoutova%CC%81-MrX42xWio3DPp9kWH11wJmU0WoLzCC.jpeg",
  },
  {
    slug: "hanzi",
    name: "Jan Oríšek",
    role: { en: "Drums · Percussion", de: "Schlagzeug · Percussion", cz: "Bicí · Perkuse" },
    instruments: { en: ["Drums: Mapex Saturn V MH Exotic — maple/walnut hybrid shellpack with exotic veneer; 12\" / 14\" / 16\" toms and 22\" bass drum", "Snare: Tama S.L.P. LST148 Big Black Steel, 14\"×8\" — steel shell, black nickel hardware, 1.6 mm Mighty Hoops", "Heads: REMO Ambassador on toms and bass drum; Evans EC Reverse Dot / ONYX on snare", "Cymbals: Zildjian K Sweet Hi-Hat 14\" · Zildjian K Custom Hybrid Crash 18\" · Sabian AAX Heavy Ride 20\" · Istanbul Mehmet China 16\" · Meinl Mb8 Splash 10\"", "DW 9000 Series Air Lift seat · 5B sticks · Mapex hardware · K&M microphone stands", "Mics: Shure SM57 · Sennheiser e 906 · Shure SM7B", "Monitoring: Shure 215 live · Beyerdynamic DT-770 Pro 250 Ω studio"], de: ["Schlagzeug: Mapex Saturn V MH Exotic — Ahorn/Walnuss-Hybrid-Shellpack mit exotischem Furnier; 12\" / 14\" / 16\" Toms und 22\" Bassdrum", "Snare: Tama S.L.P. LST148 Big Black Steel, 14\"×8\" — Stahlkessel, Black-Nickel-Hardware, 1,6 mm Mighty Hoops", "Felle: REMO Ambassador auf Toms und Bassdrum; Evans EC Reverse Dot / ONYX auf der Snare", "Becken: Zildjian K Sweet Hi-Hat 14\" · Zildjian K Custom Hybrid Crash 18\" · Sabian AAX Heavy Ride 20\" · Istanbul Mehmet China 16\" · Meinl Mb8 Splash 10\"", "DW 9000 Series Air Lift Sitz · 5B-Sticks · Mapex-Hardware · K&M Mikrofonständer", "Mikrofone: Shure SM57 · Sennheiser e 906 · Shure SM7B", "Monitoring: Shure 215 live · Beyerdynamic DT-770 Pro 250 Ω Studio"], cz: ["Souprava: Mapex Saturn V MH Exotic — kotle Maple/Walnut Hybrid s exotickou dýhou, hardware Mapex pro série; tomy 12\" / 14\" / 16\" a basový buben 22\"", "Snare: Tama S.L.P. LST148 Big Black Steel, 14\"×8\" — ocelový kotel, matná černá, black nickel hardware, 1,6 mm Mighty Hoops a QuickTouch throw-off", "Blány: REMO na tomech a basovém bubnu — Ambassador (Coated/Clear); Evans na snare — EC Reverse Dot / ONYX s tlumeným středem pro přesn�� attack a kontrolovaný sustain", "Činely: Zildjian K Sweet Hi-Hat 14\" — teplý dark charakter; Zildjian K Custom Hybrid Crash 18\" — rychlá odezva; Sabian AAX Heavy Ride 20\"; Istanbul Mehmet China 16\" — trashy a agresivní; Meinl Mb8 Splash 10\"", "Sedačka: DW 9000 Series Air Lift s hydraulickým plynulým nastavením výšky · paličky 5B · hardware Mapex · stojany K&M pro mikrofony", "Snímání: Shure SM57 na snare · Sennheiser e 906 · Shure SM7B", "Odposlech: Shure 215 (LIVE) · Beyerdynamic DT-770 Pro 250 Ω (Studio)" ] },
    bio: {
      en: "Jan Oríšek is a live and session drummer known for a precise pulse, dynamic control and a powerful stage presence. His playing gives ANTEATER’s songs their physical drive while leaving space for the arrangement to breathe.",
      de: "Jan Oríšek ist Live- und Sessiondrummer, bekannt für präzises Timing, dynamische Kontrolle und eine starke Bühnenpräsenz. Sein Spiel gibt den Songs von ANTEATER den körperlichen Antrieb und lässt dem Arrangement zugleich Raum zum Atmen.",
      cz: "S Honzou nám kryje záda a abychom si byli jistí na každém koncertě, nikdy jsme nevypadli. Honza drží pevně rytmus a žádná chyba, která by ohrozila koncert, se za celou dobu existence nikdy nestala.\n\nDíky tomu, že má hudební zkušenosti i z jiných nástrojů, dokážeme improvizovat ve studiu i na koncertě. Ani když praskne struna, nezastaví nás to a jede se dál. S hudebními nástroji začínal už v šesti letech, kdy se učil hrát na housle a klavír. Dnes hraje převážně na bicí, ale také na kytaru, baskytaru a stále na klavír. Klavír nahrával i jako podklad do některých songů ANTEATER a některé části používáme dodnes naživo prostřednictvím samplů, které má na koncertech pod kontrolou právě Honza. V dětství vyrůstal většinou na rockové muzice a s věkem se jeho rozhled dál prohluboval do více stylů.\n\nPoslouchá hlavně indie a alternativní hudbu, ale často ujíždí i na elektronice – aktuálně třeba na RÜFÜS DU SOL. Hodně blízko má ke kapelám Muse a Highly Suspect. Když přijde podzim a správná nálada, nastupují Radiohead. Mezi jeho oblíbené knížky patří například Mládí v hajzlu od C. D. Paynea a 1984, z filmů Interstellar a Útěk do divočiny, ze seriálů The Office. Když zrovna nesedí za bicími, nejspíš někde blbne na kole. Nejvíc ho baví enduro, freeride, traily a obecně všechno, u čeho nechybí rychlost a trochu adrenalinu. Rád zkouší i další sporty – od snowboardu a longboardu až po boulder. K tomu vyráží do hor na treky, cestuje, objíždí festivaly a užívá si pohodu s přáteli. Aktuálně žije v Praze, odkud pravidelně vyráží za kapelou na zkoušky do mlýna a na koncerty.",
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jan%20Ori%CC%81s%CC%8Cek-RQnKevx7WuXrGXDuYekLRggoaQ8MHG.jpeg",
  },
  {
    slug: "jindra",
    name: "Jindřich Traxmandl",
    role: { en: "Guitar · Bass · Drums", de: "Gitarre · Bass · Schlagzeug", cz: "Kytara · Baskytara · Bicí" },
    instruments: { en: ["Live guitar — Fender Jaguar Kurt Cobain (2011): alder body, 24\" short scale, DiMarzio PAF 36th neck pickup and Super Distortion bridge pickup, Tune-O-Matic and Graph Tech String Saver saddles", "Live amplifier — Marshall AFD 100 into Marshall 1960 BX: two modes, AFD and #34, with four Celestion G12T-75 speakers", "Clean tone — Fender ’64 Custom Deluxe Reverb, 20W hand-wired combo with Jensen C12K", "Wireless — Shure GLXD16+, with a built-in tuner", "Cables — Mogami Platinum", "I Can Save You signal chain — Fender Jaguar Kurt Cobain → Tone Wheel (Salvation Audio) → Digitech Whammy IV → Strymon Timeline → Marshall AFD 100 → Marshall 1960 BX", "Fuel — Fender Custom Shop LTD ’67 HSS Strat AB HR → D&M Drive → Fender ’64 Custom Deluxe Reverb. Sólo: Digitech Whammy IV → Strymon Timeline → Dunlop MXR Micro Amp → Fender ’64 Custom Deluxe Reverb. Kabely: Mogami Platinum.", "Hope intro — Fender Jaguar Kurt Cobain → Fender ’64 Custom Deluxe Reverb", "Studio collection — Fender Telecaster Deluxe (1973), Fender Custom Shop Jeff Beck, Fender Duo-Sonic (1964–65), Gibson Les Paul Studio", "Studio amplifiers — Mesa Boogie Dual Rectifier, Mesa Boogie Rect-o-verb, Tone King Imperial, Ampeg Reverbrocket R212, Ampeg GVT5, Roland JC-22 and handmade Coffee Audio Classic 212", "Studio effects — Dunlop Dimebag Cry Baby, rack DCR-2SR, Gamechanger Audio Plasma Coil and Light Pedal, Dunlop Zakk Wylde Rotovibe, Strymon Flint V2, Electro-Harmonix POG2, TC Electronic Plethora X5 and EBow Plus"], de: ["Live-Gitarre — Fender Jaguar Kurt Cobain (2011): Erlenkorpus, 24\" Short Scale, DiMarzio PAF 36th am Hals und Super Distortion an der Brücke", "Live-Verstärker — Marshall AFD 100 an Marshall 1960 BX mit vier Celestion G12T-75", "Clean-Sound — Fender ’64 Custom Deluxe Reverb, 20W handverdrahteter Combo mit Jensen C12K", "Wireless — Shure GLXD16+ mit integriertem Tuner", "Kabel — Mogami Platinum", "Signalwege aus I Can Save You und Hope sowie die vollständige Studio-Sammlung werden je nach Song eingesetzt", "Studio-Gitarren — Fender Telecaster Deluxe (1973), Fender Custom Shop Jeff Beck, Fender Duo-Sonic (1964–65) und Gibson Les Paul Studio", "Studio-Verstärker — Mesa Boogie Dual Rectifier, Rect-o-verb, Tone King Imperial, Ampeg Reverbrocket R212, Ampeg GVT5, Roland JC-22 und Coffee Audio Classic 212", "Studio-Effekte — Dunlop Dimebag Cry Baby, DCR-2SR, Gamechanger Audio Plasma Coil und Light Pedal, Zakk Wylde Rotovibe, Strymon Flint V2, Electro-Harmonix POG2, TC Electronic Plethora X5 und EBow Plus"], cz: ["Živě — Kytara Fender Jaguar Kurt Cobain (2011). Olšové tělo, 24\" short scale, DiMarzio PAF 36th v krku a Super Distortion u kobylky, Tune-O-Matic a Graph Tech String Saver sedla místo originálních ocelových.", "Aparát — Marshall AFD 100 do Marshall 1960 BX. Stowattová hlava se dvěma módy (AFD a #34, Slashův upravený JCM800), 4× 12\" Celestion G12T-75 v bedně.", "Na čisté věci — Fender ’64 Custom Deluxe Reverb, 20W hand-wired combo s Jensenem C12K.", "Bezdrát — Shure GLXD16+, stejný systém jako Andrea. Vestavěný tuner, takže na desce nemusí být další krabička.", "Kabely — Mogami Platinum.", "I Can Save You — Fender Jaguar Kurt Cobain → Tone Wheel (Salvation Audio) → Digitech Whammy IV → Strymon Timeline → Marshall AFD 100 → Marshall 1960 BX. Nahráno v Golden Hive pod vedením Amáka, mix a produkce Thom Fröde.", "I Can Save You — Fender Custom Shop LTD ’67 HSS Strat AB HR → D&M Drive → Fender ’64 Custom Deluxe Reverb. Sólo: Digitech Whammy IV → Strymon Timeline → Dunlop MXR Micro Amp → Fender ’64 Custom Deluxe Reverb. Kabely: Mogami Platinum.", "Hope — intro, čistá kytara: Fender Jaguar Kurt Cobain → Fender ’64 Custom Deluxe Reverb.", "Ve studiu — zbytek sbírky zůstává v Mlýně a používá se podle toho, co skladba potřebuje.", "Kytary — Fender Telecaster Deluxe (1973) s Wide Range humbuckery, Fender Custom Shop Jeff Beck (Surf Green), Fender Duo-Sonic (1964–65), Gibson Les Paul Studio.", "Zesilovače — Mesa Boogie Dual Rectifier (3 kanály, 8 módů), Mesa Boogie Rect-o-verb v úpravě Antonína Salvy, Tone King Imperial, Ampeg Reverbrocket R212, Ampeg GVT5, Roland JC-22 a handmade Coffee Audio Classic 212 — 2× 12\" Celestion V, 140 W / 8 Ω, bříza.", "Efekty — wah přes Dunlop Dimebag Cry Baby a rackový DCR-2SR, Gamechanger Audio Plasma Coil a Light Pedal, Dunlop Zakk Wylde Rotovibe, Strymon Flint V2, Electro-Harmonix POG2, TC Electronic Plethora X5 a EBow Plus."] },
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
          <div className="bio-copy">
            {formatBio(profile.bio[locale]).map((paragraph, index) => <p key={`${profile.slug}-bio-${index}`}>{paragraph}</p>)}
          </div>
        </Disclosure>
        <Disclosure label={locale === "de" ? "GEAR / INSTRUMENTE" : locale === "cz" ? "GEAR / NA CO HRAJE" : "GEAR / WHAT THEY PLAY"} open={gearOpen} onClick={() => setGearOpen(!gearOpen)}>
          <ul className="instrument-list">{profile.instruments[locale].map((instrument) => <li key={instrument}>{instrument}{instrument.startsWith("Fuel —") && <> · <a href="https://www.youtube.com/watch?v=UkekVsnQuaM&list=RDUkekVsnQuaM&start_radio=1" target="_blank" rel="noopener noreferrer">YouTube — Fuel</a></>}{instrument.startsWith("I Can Save You") && <> · <a href="https://www.youtube.com/watch?v=DOtJ7jTPxOQ&list=RDDOtJ7jTPxOQ&start_radio=1" target="_blank" rel="noopener noreferrer">YouTube — I Can Save You</a></>}</li>)}</ul>
        </Disclosure>
      </section>

      <footer className="profile-footer">
        <div><span className="footer-label">NEXT</span><Link href={`/${displayOrder[(displayOrder.indexOf(profile.slug) + 1) % displayOrder.length]}${locale === "en" ? "" : `/${locale}`}`}>{profiles.find((item) => item.slug === displayOrder[(displayOrder.indexOf(profile.slug) + 1) % displayOrder.length])?.name}</Link></div>
        <Link href="/" className="back-link">Back to ANTEATER</Link>
      </footer>
    </main>
  )
}

function formatBio(text: string) {
  const blocks = text.split(/\n\n+/)
  if (blocks.length > 1) return blocks

  const sentences = text.split(/(?<=[.!?])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/u)
  const paragraphs: string[] = []
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "))
  }
  return paragraphs
}

function Disclosure({ label, open, onClick, children }: { label: string; open: boolean; onClick: () => void; children: React.ReactNode }) {
  return <div className={`disclosure ${open ? "is-open" : ""}`}><button type="button" onClick={onClick} aria-expanded={open}><span>{label}</span><ChevronDown aria-hidden="true" /></button>{open && <div className="disclosure-content">{children}</div>}</div>
}

export { profiles }
export type { Locale }
