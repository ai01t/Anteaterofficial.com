/**
 * Katalog merche. Texty jsou ve třech jazycích (cs / en / de) – viz i18n.ts.
 *
 * CENY jsou zatím orientační placeholdery – uprav `price` (v Kč).
 * `price: null` schová cenu i celkový součet u dané položky.
 */

import type { Localized } from "./i18n"

export type ShippingZone = { id: string; label: Localized; price: number }

/** Poštovné podle destinace. První je výchozí. */
export const SHIPPING_ZONES: ShippingZone[] = [
  { id: "cz", label: { cs: "Česko", en: "Czechia", de: "Tschechien" }, price: 90 },
  { id: "de", label: { cs: "Německo", en: "Germany", de: "Deutschland" }, price: 150 },
  { id: "eu", label: { cs: "Evropa", en: "Europe", de: "Europa" }, price: 200 },
]

export const SHIPPING_PRICE = SHIPPING_ZONES[0].price
export const ORDER_EMAIL = "anteaterofficial@gmail.com"
export const PRINT_COLOR = "#927C69"

export type Choice = {
  id: string
  label: Localized
  note?: Localized
}

export type Product = {
  id: string
  name: string | Localized
  /** Název použitý v košíku a v objednávkové zprávě. */
  cartName?: Localized
  line: string
  tagline: Localized | ""
  price: number | null
  /** Původní cena – zobrazí se přeškrtnutá vedle aktuální. */
  compareAtPrice?: number
  images: { src: string; alt: string; position?: string }[]
  description: Localized
  specs: Localized[]
  sizes: string[]
  sizeLabel: Localized
  option?: { label: Localized; choices: Choice[] }
  /** Vyprodáno – nejde přidat do košíku. */
  soldOut?: boolean
  /** Pro počítání nároku na podtácky zdarma. */
  countsAs: "tee" | "cap"
  badge?: Localized
}

const SIZE_LABEL: Localized = { cs: "Velikost", en: "Size", de: "Größe" }

/** Velikost, která se v objednávce nevypisuje. */
export const UNIVERSAL_SIZE = "Univerzální"

export const products: Product[] = [  {
    id: "cliff",
    name: "Cliff Vintage Tee",
    line: "New logo",
    tagline: { cs: "Těžká bavlna, nové logo", en: "Heavy cotton, new logo", de: "Schwere Baumwolle, neues Logo" },
    price: 500,
    badge: { cs: "Novinka 2026", en: "New for 2026", de: "Neu 2026" },
    images: [
      { src: "/images/merch/cliff-front.jpg", alt: "Cliff Vintage Tee – potisk vepředu" },
      { src: "/images/merch/cliff-back.jpg", alt: "Cliff Vintage Tee – potisk vzadu" },
    ],
    description: {
      cs: "Nové logo ve dvou verzích: nápis vepředu a velký symbol přes celá záda.",
      en: "The new logo in two versions: the wordmark on the chest and a large symbol across the back.",
      de: "Das neue Logo in zwei Varianten: Schriftzug vorn und ein großes Symbol über den ganzen Rücken.",
    },
    specs: [
      {
        cs: "SOL'S Cliff – unisex vintage střih",
        en: "SOL'S Cliff – unisex vintage cut",
        de: "SOL'S Cliff – Unisex Vintage-Schnitt",
      },
      {
        cs: "200 g/m², 100% bavlna, single jersey",
        en: "200 gsm, 100% cotton, single jersey",
        de: "200 g/m², 100 % Baumwolle, Single Jersey",
      },
      {
        cs: "Přesahující ramena, široký žebrovaný výstřih",
        en: "Dropped shoulders, wide ribbed neckline",
        de: "Überschnittene Schultern, breiter Rippenkragen",
      },
      {
        cs: "Tear Away štítek – dá se vytrhnout bez stopy",
        en: "Tear Away label – removes without a trace",
        de: "Tear-Away-Label – rückstandslos entfernbar",
      },
      { cs: `Barva potisku ${PRINT_COLOR}`, en: `Print colour ${PRINT_COLOR}`, de: `Druckfarbe ${PRINT_COLOR}` },
    ],
    sizes: ["S", "M", "L", "XL"],
    sizeLabel: SIZE_LABEL,
    option: {
      label: { cs: "Potisk", en: "Print", de: "Druck" },
      choices: [
        {
          id: "front",
          label: { cs: "Vepředu", en: "Front", de: "Vorne" },
          note: { cs: "nápis na hrudi", en: "wordmark on the chest", de: "Schriftzug auf der Brust" },
        },
        {
          id: "both",
          label: { cs: "Vepředu i vzadu", en: "Front and back", de: "Vorne und hinten" },
          note: {
            cs: "obě verze loga – jako na fotkách",
            en: "both logo versions – as in the photos",
            de: "beide Logo-Varianten – wie auf den Fotos",
          },
        },
      ],
    },
    countsAs: "tee",
  },  {
    id: "legacy-tee",
    name: "Legacy Tee",
    cartName: { cs: "Legacy Tee černé", en: "Legacy Tee black", de: "Legacy Tee schwarz" },
    line: "Legacy",
    tagline: {
      cs: "Černé tričko s krátkým rukávem, klasické logo",
      en: "Black short-sleeve tee, classic logo",
      de: "Schwarzes T-Shirt, klassisches Logo",
    },
    price: 500,
    images: [
      { src: "/images/merch/legacy-tee.jpg", alt: "Černé Legacy tričko ANTEATER u graffiti zdi" },
      { src: "/images/merch/legacy-tee-sunset.jpg", alt: "Černé Legacy tričko ANTEATER za soumraku" },
    ],
    description: {
      cs: "Klasické logo ANTEATER na černé. Potisk jen vepředu.",
      en: "The classic ANTEATER logo on black. Front print only.",
      de: "Das klassische ANTEATER-Logo auf Schwarz. Druck nur vorne.",
    },
    specs: [
      { cs: "Krátký rukáv, unisex střih", en: "Short sleeve, unisex cut", de: "Kurzarm, Unisex-Schnitt" },
      { cs: "Potisk pouze vepředu", en: "Front print only", de: "Druck nur vorne" },
      { cs: "Černá", en: "Black", de: "Schwarz" },
    ],
    sizes: ["S", "M", "L", "XL"],
    sizeLabel: SIZE_LABEL,
    countsAs: "tee",
  },  {
    id: "legacy-ls-white",
    name: "Legacy Longsleeve",
    cartName: { cs: "Legacy Longsleeve bílá", en: "Legacy Longsleeve white", de: "Legacy Longsleeve weiß" },
    line: "Legacy",
    tagline: {
      cs: "Bílé tričko s dlouhým rukávem, klasické logo",
      en: "White long-sleeve tee, classic logo",
      de: "Weißes Langarmshirt, klassisches Logo",
    },
    price: 500,
    images: [{ src: "/images/merch/ls-white.jpg", alt: "Bílé Legacy tričko s dlouhým rukávem" }],
    description: {
      cs: "Baseballový střih s kontrastními rukávy a klasickým logem ANTEATER. Potisk jen vepředu.",
      en: "Baseball cut with contrast sleeves and the classic ANTEATER logo. Front print only.",
      de: "Baseball-Schnitt mit Kontrastärmeln und dem klassischen ANTEATER-Logo. Druck nur vorne.",
    },
    specs: [
      { cs: "Dlouhý rukáv, raglánový střih", en: "Long sleeve, raglan cut", de: "Langarm, Raglan-Schnitt" },
      { cs: "Potisk pouze vepředu", en: "Front print only", de: "Druck nur vorne" },
      { cs: "Bílé tělo, černé rukávy", en: "White body, black sleeves", de: "Weißer Körper, schwarze Ärmel" },
    ],
    sizes: ["S", "M", "L", "XL"],
    sizeLabel: SIZE_LABEL,
    countsAs: "tee",
  },  {
    id: "legacy-ls-grey",
    name: "Legacy Longsleeve",
    cartName: { cs: "Legacy Longsleeve šedá", en: "Legacy Longsleeve grey", de: "Legacy Longsleeve grau" },
    line: "Legacy",
    tagline: {
      cs: "Šedé tričko s dlouhým rukávem, klasické logo",
      en: "Grey long-sleeve tee, classic logo",
      de: "Graues Langarmshirt, klassisches Logo",
    },
    price: 500,
    images: [
      { src: "/images/merch/ls-grey.jpg", alt: "Šedé Legacy tričko s dlouhým rukávem" },
      { src: "/images/merch/ls-grey-2.jpg", alt: "Šedé Legacy tričko – detail potisku" },
    ],
    description: {
      cs: "Stejný střih v šedém melíru. Logo vepředu v černé – univerzální kus.",
      en: "The same cut in grey marl. Logo on the chest in black – an everyday piece.",
      de: "Der gleiche Schnitt in Graumeliert. Logo vorne in Schwarz – ein Allrounder.",
    },
    specs: [
      { cs: "Dlouhý rukáv, raglánový střih", en: "Long sleeve, raglan cut", de: "Langarm, Raglan-Schnitt" },
      { cs: "Potisk pouze vepředu", en: "Front print only", de: "Druck nur vorne" },
      { cs: "Šedý melír, černé rukávy", en: "Grey marl, black sleeves", de: "Graumeliert, schwarze Ärmel" },
    ],
    sizes: ["S", "M", "L", "XL"],
    sizeLabel: SIZE_LABEL,
    countsAs: "tee",
  },  {
    id: "cap",
    name: { cs: "Kšiltovka ANTEATER", en: "ANTEATER Cap", de: "ANTEATER Cap" },
    cartName: { cs: "Kšiltovka ANTEATER", en: "ANTEATER cap", de: "ANTEATER Cap" },
    line: "Legacy",
    tagline: "",
    price: 550,
    images: [
      { src: "/images/merch/cap.jpg", alt: "Černá kšiltovka ANTEATER na hlavě", position: "92% 50%" },
      { src: "/images/merch/cap-front.jpg", alt: "Černá kšiltovka ANTEATER – přední panel s logem" },
      { src: "/images/merch/cap-inside.jpg", alt: "Vnitřek kšiltovky – snapback a síťovina" },
    ],
    description: {
      cs: "Černá kšiltovka s klasickým logem vepředu. Nastavitelná vzadu.",
      en: "Black cap with the classic logo on the front. Adjustable at the back.",
      de: "Schwarze Cap mit dem klassischen Logo vorne. Hinten verstellbar.",
    },
    specs: [
      {
        cs: "Yupoong The Classics – Classic Trucker 6006, snapback",
        en: "Yupoong The Classics – Classic Trucker 6006, snapback",
        de: "Yupoong The Classics – Classic Trucker 6006, Snapback",
      },
      {
        cs: "Přední panel 60% bavlna / 40% polyester, síťovina 100% polyester",
        en: "Front panel 60% cotton / 40% polyester, mesh 100% polyester",
        de: "Vorderpanel 60 % Baumwolle / 40 % Polyester, Mesh 100 % Polyester",
      },
      { cs: "Rovný kšilt, mesh zadní díl", en: "Flat brim, mesh back", de: "Gerader Schirm, Mesh-Rückseite" },
      {
        cs: "Univerzální velikost, nastavitelné zapínání vzadu",
        en: "One size, adjustable snapback",
        de: "Einheitsgröße, verstellbarer Snapback",
      },
      {
        cs: "Neprat, nebělit, nesušit v sušičce, nežehlit, nečistit chemicky",
        en: "Do not wash, bleach, tumble dry, iron or dry clean",
        de: "Nicht waschen, bleichen, trocknen, bügeln oder chemisch reinigen",
      },
    ],
    sizes: [UNIVERSAL_SIZE],
    sizeLabel: SIZE_LABEL,
    countsAs: "cap",
  },  {
    id: "cap-kids",
    name: { cs: "Kšiltovka pro děti", en: "Kids Cap", de: "Kinder-Cap" },
    cartName: { cs: "Kšiltovka pro děti", en: "Kids cap", de: "Kinder-Cap" },
    line: "Legacy",
    tagline: { cs: "Momentálně vyprodáno", en: "Currently sold out", de: "Derzeit ausverkauft" },
    price: null,
    soldOut: true,
    images: [{ src: "/images/merch/cap-kids.jpg", alt: "Dětská kšiltovka ANTEATER" }],
    description: {
      cs: "Menší střih s klasickým logem.",
      en: "Smaller cut with the classic logo.",
      de: "Kleinerer Schnitt mit dem klassischen Logo.",
    },
    specs: [],
    sizes: [UNIVERSAL_SIZE],
    sizeLabel: SIZE_LABEL,
    countsAs: "cap",
  },
]

export const coaster = {
  id: "coasters",
  name: { cs: "Dřevěné podtácky", en: "Wooden coasters", de: "Holzuntersetzer" } as Localized,
  images: [
    { src: "/images/merch/coasters.jpg", alt: "Dřevěné podtácky ANTEATER – sada čtyř kusů" },
    { src: "/images/merch/coasters-2.jpg", alt: "Dřevěné podtácky ANTEATER na dřevěném stole" },
  ],
  description: { cs: "Čtyři motivy", en: "Four designs", de: "Vier Motive" } as Localized,
}

export const lookbook = [
  { src: "/images/merch/look-table.jpg", alt: "Kapela ANTEATER u stolu ve studiu" },
  { src: "/images/merch/look-dusk.jpg", alt: "Nová trička ANTEATER za soumraku" },
  { src: "/images/merch/ls-grey-2.jpg", alt: "Šedé Legacy tričko s dlouhým rukávem" },
]
