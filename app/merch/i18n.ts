/**
 * Jazyk stránky se bere z prohlížeče (cs / de / en), fallback je angličtina.
 * Poloha se odhaduje z regionu v locale, případně z časové zóny – používá se
 * jen k předvýběru a zvýraznění dopravy.
 */

export type Lang = "cs" | "en" | "de"

export const LANGS: Lang[] = ["cs", "en", "de"]

export type Localized = { cs: string; en: string; de: string }

/** Vybere jazykovou mutaci; prostý řetězec se použije beze změny. */
export const tr = (value: Localized | string, lang: Lang): string =>
  typeof value === "string" ? value : value[lang]

export const trList = (values: (Localized | string)[], lang: Lang): string[] =>
  values.map((v) => tr(v, lang))

export const LOCALE: Record<Lang, string> = {
  cs: "cs-CZ",
  en: "en-GB",
  de: "de-DE",
}

export const LANG_KEY = "anteater-lang"

const isLang = (v: string | null): v is Lang => v === "cs" || v === "en" || v === "de"

/** Jazyk z adresy (?lang=), pak z volby uživatele, nakonec z prohlížeče. */
export function loadLang(): Lang {
  if (typeof window === "undefined") return "cs"
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang")
    if (isLang(fromUrl)) return fromUrl
    const saved = window.localStorage.getItem(LANG_KEY)
    if (isLang(saved)) return saved
  } catch {
    /* localStorage nemusí být dostupné */
  }
  return detectLang()
}

/** Zapamatuje volbu, aby se držela i na dalších stránkách. */
export function saveLang(lang: Lang) {
  try {
    window.localStorage.setItem(LANG_KEY, lang)
  } catch {
    /* ignorujeme */
  }
}

/** Měna podle jazyka – ceny v katalogu jsou v Kč, převod na celé jednotky. */
export const RATE: Record<Lang, number> = { cs: 1, en: 23, de: 25 }
export const toLocal = (czk: number, lang: Lang) => (lang === "cs" ? czk : Math.round(czk / RATE[lang]))
export const fromLocal = (amount: number, lang: Lang) => amount * RATE[lang]
export const CURRENCY_SIGN: Record<Lang, string> = { cs: "Kč", en: "USD", de: "EUR" }

export function moneyLocal(amount: number, lang: Lang): string {
  if (lang === "en") return `$${amount.toLocaleString("en-US")}`
  if (lang === "de") return `${amount.toLocaleString("de-DE")} €`
  return `${amount.toLocaleString("cs-CZ")} Kč`
}

export const money = (czk: number, lang: Lang) => moneyLocal(toLocal(czk, lang), lang)

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "cs"
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const raw of langs) {
    const code = raw.toLowerCase().split("-")[0]
    if (code === "cs" || code === "sk") return "cs"
    if (code === "de") return "de"
    if (code === "en") return "en"
  }
  return "en"
}

/** ISO kód země podle locale, případně podle časové zóny. */
export function detectCountry(): string | null {
  if (typeof navigator === "undefined") return null
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const raw of langs) {
      const region = new Intl.Locale(raw).region
      if (region) return region.toUpperCase()
    }
  } catch {
    /* starší prohlížeč */
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const byZone: Record<string, string> = {
      "Europe/Prague": "CZ",
      "Europe/Bratislava": "SK",
      "Europe/Berlin": "DE",
      "Europe/Vienna": "AT",
      "Europe/Zurich": "CH",
      "Europe/Warsaw": "PL",
      "Europe/Budapest": "HU",
      "Europe/Paris": "FR",
      "Europe/Madrid": "ES",
      "Europe/Rome": "IT",
      "Europe/Amsterdam": "NL",
      "Europe/Brussels": "BE",
      "Europe/London": "GB",
    }
    return byZone[tz] ?? null
  } catch {
    return null
  }
}

/** Země, kam posíláme – název se lokalizuje podle jazyka prohlížeče. */
export const SHIP_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "CH",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
]

export function countryName(code: string, lang: Lang): string {
  try {
    return new Intl.DisplayNames([LOCALE[lang]], { type: "region" }).of(code) ?? code
  } catch {
    return code
  }
}

type Dict = {
  cart: string
  cartItems: (n: number) => string
  heroIntro: string
  heroPromo: string
  heroPromoLead: string
  collection: string
  gallery: string
  order: string
  orderSub: string
  backHome: string
  giftLabel: string
  detail: string
  makerSpec: string
  coasterRule1: string
  coasterRule2: string
  coasterRule3: string
  unlocked: string
  locked: string
  coasterMaker: (link: string) => string
  cartEmpty: string
  sizeShort: (size: string) => string
  printShort: (variant: string) => string
  free: string
  coasters: string
  wantCoasters: string
  wantCoastersTip: string
  because: string
  organizer: string
  follows: string
  hintTickOrder: string
  hintDone: (n: number) => string
  hintPickReason: string
  hintAddItem: string
  pickup: string
  pickupNote: string
  ship: string
  shipFrom: (price: string) => string
  whichShow: string
  noShows: string
  sendTo: string
  fName: string
  fStreet: string
  fZip: string
  fCity: string
  fCountry: string
  fNameShort: string
  fContact: string
  fNote: string
  phName: string
  phStreet: string
  phZip: string
  phCity: string
  phContact: string
  remove: string
  shipTo: string
  shipNote: (price: string) => string
  yourLocation: string
  zipSearching: string
  zipNotFound: string
  zipFound: (city: string) => string
  zipMultiple: string
  goods: string
  deliveryRow: string
  totalRow: string
  onRequest: string
  messageLabel: string
  send: string
  copy: string
  copied: string
  needDelivery: string
  needAddress: string
  mailNote: (email: string) => string
  openInGmail: string
  sending: string
  sentTitle: string
  sentText: string
  sendError: string
  madeBy: string
  pieces: (n: number) => string
  orderCta: string
  voucherNav: string
  voucherTitle: string
  voucherKicker: string
  voucherKickerBand: string
  voucherOpen: string
  voucherClose: string
  voucherText: string
  voucherSign: string
  voucherStyle: string
  voucherNewLogo: string
  voucherLegacyLogo: string
  voucherDark: string
  voucherLight: string
  voucherPrint: string
  voucherFor: string
  voucherAmount: string
  voucherAddToCart: string
  voucherOrderNow: string
  voucherAdded: string
  voucherNeedAmount: string
  voucherForBand: string
  voucherForBandValue: string
  voucherBandThanks: string
  voucherBandMessage: string
  voucherCartName: string
  voucherCartNote: (to: string, from: string, msg: string) => string
  voucherCustom: string
  voucherForPh: string
  voucherFrom: string
  voucherFromPh: string
  voucherMessage: string
  voucherMessagePh: string
  voucherHint: string
  voucherCardText: string
  voucherCardTitle: string
  voucherRecordTab: string
  voucherCardBandText: string
  voucherDonorOrder: string
  voucherViewFront: string
  voucherViewInside: string
  voucherViewBack: string
  voucherHowTo: string
  voucherRedeem: string
  mailSubject: string
  msgHello: string
  msgWant: string
  msgCoasters: (n: number) => string
  msgPickup: (place: string) => string
  msgPickupTbd: string
  msgShip: string
  msgPlaceholderName: string
  msgPlaceholderStreet: string
  msgPlaceholderZip: string
  msgPlaceholderCity: string
  msgShipping: (country: string, price: string) => string
  msgName: string
  msgContact: string
  msgOrganizer: string
  msgFollows: string
  msgNote: string
  msgTotal: string
  msgThanks: string
}

export const dict: Record<Lang, Dict> = {
  cs: {
    cart: "Košík",
    cartItems: (n) => `Košík, ${n} položek`,
    heroPromoLead: "Přispěj 500,- Kč na novou desku a vyber si, co za to chceš!",
    heroPromo:
      "Máme připravenou limitovanou promo edici triček a kšiltovek. Veškeré vybrané prostředky jdou přímo na pokrytí nákladů na naše nové EP. Jako poděkování za podporu si odneseš kousek podle vlastního výběru. Pokud chceš novou tvorbu jen podpořit, můžeš si pořídit dárkový poukaz a vyměnit ho za své jméno na bookletu desky.",
    heroIntro:
      "Vše můžete vyzvednout na koncertě, přijďte za námi, vše budeme mít s sebou. A chcete-li si něco zarezervovat, neváhejte nám napsat nebo si to naklikejte zde na stránce. ;)",
    collection: "Kolekce",
    gallery: "Další fotografie",
    order: "Objednávka",
    orderSub: "Žádná registrace. Vyplň a odešli — ozveme se s potvrzením a platbou.",
    backHome: "← Zpět na anteaterofficial.com",
    giftLabel: "Dárek, neprodejné",
    detail: "Detail",
    makerSpec: "Specifikace výrobce →",
    coasterRule1: "Pořadatelům automaticky.",
    coasterRule2: "Ke každému tričku i kšiltovce jeden.",
    coasterRule3: "K tričku nebo kšiltovce a potvrzení odběru na sítích :-)",
    unlocked: "Odemčeno ✓",
    locked: "Zatím zamčeno",
    coasterMaker: (link) =>
      `Dřevěné podtácky vyrábí ${link}. Sami je používáme už několik let, na horké i studené nápoje, a vypadají prakticky stejně jako ty nové. Laser Jelínek ale nedělá jen podtácky. Podívejte se i na jejich další produkty, služby a portfolio. Rádi doporučujeme.`,
    cartEmpty: "Košík je zatím prázdný. Vyber si něco v kolekci nahoře.",
    sizeShort: (size) => `vel. ${size}`,
    printShort: (variant) => `potisk ${variant.toLowerCase()}`,
    free: "zdarma",
    coasters: "Dřevěné podtácky",
    wantCoasters: "Chci podtácky zdarma",
    wantCoastersTip: "Aktivní, až budeš mít něco v košíku.",
    because: "protože:",
    organizer: "Jsem pořadatel koncertů, kde zahraje Anteater",
    follows: "Sleduju Anteater na Facebooku, Instagramu i Spotify 😉",
    hintTickOrder: "V objednávce dole zaškrtni „Chci podtácky zdarma“.",
    hintDone: (n) => `Hotovo – přibalíme ${n} ${n === 1 ? "podtácek" : n < 5 ? "podtácky" : "podtácků"} zdarma.`,
    hintPickReason:
      "Podtácky nejsou samostatně na prodej. Dáváme je k tričku nebo kšiltovce, když potvrdíš odběr na sítích — a pořadatelům vždy. Zaškrtni, co platí.",
    hintAddItem: "Přidej tričko nebo kšiltovku a podtácek je tvůj.",
    pickup: "Vyzvednout na koncertě",
    pickupNote: "Bez poštovného. Přivezeme to s sebou.",
    ship: "Poslat",
    shipFrom: (price) => `od ${price}`,
    whichShow: "Na kterém koncertě?",
    noShows: "Termíny se zrovna načítají (nebo zatím žádné nejsou) — napiš do poznámky, kde to chceš předat.",
    sendTo: "Prosím pošlete na adresu:",
    fName: "Jméno a příjmení",
    fStreet: "Ulice a číslo",
    fZip: "PSČ",
    fCity: "Město",
    fCountry: "Země",
    fNameShort: "Jméno",
    fContact: "E-mail nebo telefon",
    fNote: "Poznámka (nepovinné)",
    phName: "Jan Novák",
    phStreet: "Dlouhá 12",
    phZip: "110 00",
    phCity: "Praha",
    phContact: "jan@email.cz",
    remove: "Odebrat",
    shipTo: "Kam posíláme",
    shipNote: (price) => `Poštovné ${price} se připočítá k celkové ceně.`,
    yourLocation: "podle tvé polohy",
    zipSearching: "Hledám město podle PSČ…",
    zipNotFound: "PSČ jsme nenašli – město vyplň ručně.",
    zipFound: (city) => `Podle PSČ: ${city}`,
    zipMultiple: "Podle PSČ je míst víc – vyber v nabídce.",
    goods: "Zboží",
    deliveryRow: "Doručení",
    totalRow: "Celkem",
    onRequest: "na dotaz",
    messageLabel: "Zpráva, která se odešle",
    send: "Odeslat objednávku",
    copy: "Zkopírovat text",
    copied: "Zkopírováno ✓",
    needDelivery: "Vyber ještě způsob doručení.",
    needAddress: "Doplň prosím adresu.",
    mailNote: (email) =>
      `Objednávka nám přijde rovnou na ${email}. Když by odeslání nešlo, otevře se ti poštovní program.`,
    openInGmail: "Otevřít v Gmailu",
    sending: "Odesílám…",
    sentTitle: "Objednávka odeslána ✓",
    sentText: "Díky! Ozveme se co nejdřív s potvrzením a platbou.",
    sendError: "Odeslání se nepovedlo, otevírám poštovní program. Případně text zkopíruj a pošli na anteaterofficial@gmail.com.",
    madeBy: "Výroba",
    pieces: (n) => `${n} ${n === 1 ? "kus" : n < 5 ? "kusy" : "kusů"}`,
    orderCta: "Objednat",
    voucherNav: "Dárkový poukaz",
    voucherTitle: "Dárkový poukaz",
    voucherKicker: "Dárek od kapely",
    voucherKickerBand: "Dárek pro kapelu Anteater",
    voucherOpen: "Otevřít",
    voucherClose: "Zavřít",
    voucherText:
      "Ahoj, tady máš od nás dárek. Můžeš si ho uplatnit na anteaterofficial.com/merch, nebo s ním zajdi za kapelou na kterémkoliv koncertě a vyber si triko nebo kšiltovku podle sebe 🙂",
    voucherSign: "ANTEATER",
    voucherStyle: "Styl",
    voucherNewLogo: "Nové logo",
    voucherLegacyLogo: "Klasické logo",
    voucherDark: "Tmavý",
    voucherLight: "Světlý",
    voucherPrint: "Vytisknout / uložit PDF",
    voucherAmount: "Hodnota poukazu",
    voucherAddToCart: "Přidat do košíku",
    voucherOrderNow: "Rovnou objednat",
    voucherAdded: "Poukaz je v košíku ✓",
    voucherNeedAmount: "Zadej prosím částku poukazu.",
    voucherForBand: "Pro Anteater na desku",
    voucherForBandValue: "Anteater – na desku",
    voucherBandMessage: "Zde můžete nechat kapele vzkaz",
    voucherBandThanks: "Děkujeme a moc si toho vážíme – vaše jméno proto chceme zvěčnit na booklet naší desky ❤",
    voucherCartName: "Dárkový poukaz",
    voucherCartNote: (to, from, msg) =>
      [to ? `pro: ${to}` : "", from ? `od: ${from}` : "", msg ? `vzkaz: ${msg}` : "vzkaz doplním později"]
        .filter(Boolean)
        .join(" · "),
    voucherCustom: "Vlastní částka",
    voucherFor: "Pro koho",
    voucherForPh: "Jméno obdarovaného",
    voucherFrom: "Od koho",
    voucherFromPh: "Tvoje jméno",
    voucherMessage: "Vzkaz",
    voucherMessagePh:
      "Martine, užij si dárek od nás – můžeš si koupit triko nebo kšiltovku. A vzhledem k tomu, že seš muzikant, můžeš ho použít i pro mlynnapile.cz – studio kapely Anteater. Mrkni na to ;)",
    voucherHint: "",
    voucherCardTitle: "Dárkový poukaz / Deska Anteater",
    voucherRecordTab: "Deska Anteater",
    voucherDonorOrder: "Jména donátorů budou na bookletu seřazena podle výše příspěvku.",
    voucherCardBandText:
      "Chceš podpořit vznik naší nové desky? Přispěj libovolnou částkou a tvoje jméno zvěčníme na bookletu. Děkujeme a moc si toho vážíme ❤",
    voucherCardText:
      "Pokud nevíte, co vybrat jako dárek, pořiďte dárkový poukaz. A pokud chcete podpořit vznik naší desky a být na bookletu, napište „chci desku“ – až bude hotová, dostanete ji ve fyzické podobě. Jména donátorů budou na bookletu seřazena podle výše příspěvku. Děkujeme.",
    voucherViewFront: "Titulka",
    voucherViewInside: "Uvnitř",
    voucherViewBack: "Zadní strana",
    voucherHowTo: "Jak poukaz uplatnit",
    voucherRedeem:
      "Napiš nám na anteaterofficial.com/merch, nebo přijď za kapelou na kterýkoliv koncert – vybereš si triko nebo kšiltovku a je to tvoje.",
    mailSubject: "Objednávka merch — ANTEATER",
    msgHello: "Ahoj,",
    msgWant: "mám zájem o:",
    msgCoasters: (n) => `• Dřevěné podtácky (zdarma) — ${n}×`,
    msgPickup: (place) => `Vyzvednu si to na koncertě — ${place}.`,
    msgPickupTbd: "Vyzvednu si to na koncertě — termín upřesním.",
    msgShip: "Prosím pošlete na adresu:",
    msgPlaceholderName: "[jméno a příjmení]",
    msgPlaceholderStreet: "[ulice a číslo]",
    msgPlaceholderZip: "[PSČ]",
    msgPlaceholderCity: "[město]",
    msgShipping: (country, price) => `${country} — poštovné ${price}`,
    msgName: "Jméno",
    msgContact: "Kontakt",
    msgOrganizer: "Jsem pořadatel.",
    msgFollows: "Sleduju vás na FB, Instagramu i Spotify 😉",
    msgNote: "Poznámka",
    msgTotal: "Celkem",
    msgThanks: "Díky!",
  },

  en: {
    cart: "Cart",
    cartItems: (n) => `Cart, ${n} items`,
    heroPromoLead: "Chip in $22 for our new record and pick what you want in return!",
    heroPromo:
      "We've prepared a limited promo edition of tees and caps. Everything we raise goes straight to covering the costs of our new EP. As a thank-you for your support, you take home a piece of your choice. If you just want to support the new music, get a gift voucher and swap it for your name in the record's booklet.",
    heroIntro:
      "You can pick everything up at a show — just come find us, we always bring the merch along. And if you want to reserve something, drop us a line or put it together right here. ;)",
    collection: "Collection",
    gallery: "More photos",
    order: "Order",
    orderSub: "No sign-up. Fill it in, send it off — we'll confirm and sort out the payment.",
    backHome: "← Back to anteaterofficial.com",
    giftLabel: "Gift, not for sale",
    detail: "Details",
    makerSpec: "Manufacturer spec →",
    coasterRule1: "Promoters get them automatically.",
    coasterRule2: "One with every tee or cap.",
    coasterRule3: "With a tee or a cap and a confirmed follow on our socials :-)",
    unlocked: "Unlocked ✓",
    locked: "Locked for now",
    coasterMaker: (link) =>
      `The wooden coasters are made by ${link}. We've been using them for years, for hot and cold drinks alike, and they still look like new. Laser Jelínek doesn't only do coasters — have a look at their other products, services and portfolio. Happy to recommend them.`,
    cartEmpty: "Your cart is empty. Pick something from the collection above.",
    sizeShort: (size) => `size ${size}`,
    printShort: (variant) => `print ${variant.toLowerCase()}`,
    free: "free",
    coasters: "Wooden coasters",
    wantCoasters: "I want the free coasters",
    wantCoastersTip: "Available once there's something in your cart.",
    because: "because:",
    organizer: "I promote shows where Anteater plays",
    follows: "I follow Anteater on Facebook, Instagram and Spotify 😉",
    hintTickOrder: "Tick “I want the free coasters” in the order below.",
    hintDone: (n) => `Done – we'll add ${n} ${n === 1 ? "coaster" : "coasters"} for free.`,
    hintPickReason:
      "Coasters aren't sold separately. We give them with a tee or a cap when you confirm you follow us — and to promoters always. Tick whatever applies.",
    hintAddItem: "Add a tee or a cap and the coaster is yours.",
    pickup: "Pick up at a show",
    pickupNote: "No shipping fee. We'll bring it with us.",
    ship: "Ship it",
    shipFrom: (price) => `from ${price}`,
    whichShow: "Which show?",
    noShows: "Dates are loading (or there are none yet) — tell us in the note where you'd like to collect it.",
    sendTo: "Please ship to:",
    fName: "Full name",
    fStreet: "Street and number",
    fZip: "Postcode",
    fCity: "City",
    fCountry: "Country",
    fNameShort: "Name",
    fContact: "Email or phone",
    fNote: "Note (optional)",
    phName: "Jane Doe",
    phStreet: "12 Long Street",
    phZip: "110 00",
    phCity: "Prague",
    phContact: "jane@email.com",
    remove: "Remove",
    shipTo: "Where we ship",
    shipNote: (price) => `Shipping ${price} will be added to the total.`,
    yourLocation: "based on your location",
    zipSearching: "Looking up the city…",
    zipNotFound: "We couldn't find that postcode – please type the city.",
    zipFound: (city) => `From the postcode: ${city}`,
    zipMultiple: "That postcode covers several places – pick one from the list.",
    goods: "Items",
    deliveryRow: "Delivery",
    totalRow: "Total",
    onRequest: "on request",
    messageLabel: "The message we'll receive",
    send: "Send the order",
    copy: "Copy the text",
    copied: "Copied ✓",
    needDelivery: "Pick a delivery option.",
    needAddress: "Please fill in the address.",
    mailNote: (email) =>
      `The order comes straight to us at ${email}. If sending fails, your mail app will open instead.`,
    openInGmail: "Open in Gmail",
    sending: "Sending…",
    sentTitle: "Order sent ✓",
    sentText: "Thanks! We'll get back to you soon with confirmation and payment details.",
    sendError: "Sending failed, opening your mail app. You can also copy the text and send it to anteaterofficial@gmail.com.",
    madeBy: "Made by",
    pieces: (n) => `${n} ${n === 1 ? "item" : "items"}`,
    orderCta: "Order",
    voucherNav: "Gift voucher",
    voucherTitle: "Gift voucher",
    voucherKicker: "A gift from the band",
    voucherKickerBand: "A gift for Anteater",
    voucherOpen: "Open",
    voucherClose: "Close",
    voucherText:
      "Hi, here's a gift from us. Redeem it at anteaterofficial.com/merch, or bring it to the band at any show and pick a tee or a cap of your choice 🙂",
    voucherSign: "ANTEATER",
    voucherStyle: "Style",
    voucherNewLogo: "New logo",
    voucherLegacyLogo: "Classic logo",
    voucherDark: "Dark",
    voucherLight: "Light",
    voucherPrint: "Print / save as PDF",
    voucherAmount: "Voucher value",
    voucherAddToCart: "Add to cart",
    voucherOrderNow: "Order now",
    voucherAdded: "Voucher added to cart ✓",
    voucherNeedAmount: "Please enter the voucher amount.",
    voucherForBand: "For Anteater's record",
    voucherForBandValue: "Anteater – for the record",
    voucherBandMessage: "Leave the band a message here",
    voucherBandThanks: "Thank you, we really appreciate it – that's why we want to immortalise your name in our record's booklet ❤",
    voucherCartName: "Gift voucher",
    voucherCartNote: (to, from, msg) =>
      [to ? `for: ${to}` : "", from ? `from: ${from}` : "", msg ? `message: ${msg}` : "message to follow"]
        .filter(Boolean)
        .join(" · "),
    voucherCustom: "Custom amount",
    voucherFor: "For",
    voucherForPh: "Recipient's name",
    voucherFrom: "From",
    voucherFromPh: "Your name",
    voucherMessage: "Message",
    voucherMessagePh:
      "Enjoy this gift from us – pick a tee or a cap. And since you're a musician, you can also use it at mlynnapile.cz – the Anteater band studio. Have a look ;)",
    voucherHint: "",
    voucherCardTitle: "Gift voucher / Anteater record",
    voucherRecordTab: "Anteater record",
    voucherDonorOrder: "Donors' names will be listed in the booklet by the size of their contribution.",
    voucherCardBandText:
      "Want to help us make our new record? Chip in any amount and we'll immortalise your name in the booklet. Thank you, it means a lot ❤",
    voucherCardText:
      "Not sure what to give? Go for a gift voucher. And if you want to support our record and be in the booklet, write “I want the record” – once it's out, you'll get a physical copy. Donors' names will be listed in the booklet by the size of their contribution. Thank you.",
    voucherViewFront: "Cover",
    voucherViewInside: "Inside",
    voucherViewBack: "Back",
    voucherHowTo: "How to redeem it",
    voucherRedeem:
      "Write to us at anteaterofficial.com/merch, or find the band at any show – pick a tee or a cap and it's yours.",
    mailSubject: "Merch order — ANTEATER",
    msgHello: "Hi,",
    msgWant: "I'd like:",
    msgCoasters: (n) => `• Wooden coasters (free) — ${n}×`,
    msgPickup: (place) => `I'll pick it up at the show — ${place}.`,
    msgPickupTbd: "I'll pick it up at a show — I'll confirm the date.",
    msgShip: "Please ship to:",
    msgPlaceholderName: "[full name]",
    msgPlaceholderStreet: "[street and number]",
    msgPlaceholderZip: "[postcode]",
    msgPlaceholderCity: "[city]",
    msgShipping: (country, price) => `${country} — shipping ${price}`,
    msgName: "Name",
    msgContact: "Contact",
    msgOrganizer: "I'm a promoter.",
    msgFollows: "I follow you on FB, Instagram and Spotify 😉",
    msgNote: "Note",
    msgTotal: "Total",
    msgThanks: "Thanks!",
  },

  de: {
    cart: "Warenkorb",
    cartItems: (n) => `Warenkorb, ${n} Artikel`,
    heroPromoLead: "Gib 20 € für unsere neue Platte und such dir aus, was du dafür willst!",
    heroPromo:
      "Wir haben eine limitierte Promo-Edition aus Shirts und Caps vorbereitet. Alle Einnahmen fließen direkt in die Kosten unserer neuen EP. Als Dankeschön für deine Unterstützung nimmst du ein Stück deiner Wahl mit. Wenn du die neue Musik einfach nur unterstützen willst, hol dir einen Geschenkgutschein und tausche ihn gegen deinen Namen im Booklet der Platte.",
    heroIntro:
      "Alles könnt ihr beim Konzert abholen – kommt einfach zu uns, wir haben den Merch immer dabei. Und wenn ihr etwas reservieren wollt, schreibt uns oder stellt es euch gleich hier zusammen. ;)",
    collection: "Kollektion",
    gallery: "Weitere Fotos",
    order: "Bestellung",
    orderSub: "Keine Registrierung. Ausfüllen, abschicken — wir melden uns mit Bestätigung und Zahlung.",
    backHome: "← Zurück zu anteaterofficial.com",
    giftLabel: "Geschenk, unverkäuflich",
    detail: "Details",
    makerSpec: "Herstellerangaben →",
    coasterRule1: "Veranstalter bekommen sie automatisch.",
    coasterRule2: "Einer zu jedem Shirt und jeder Cap.",
    coasterRule3: "Zu einem Shirt oder einer Cap plus bestätigtem Follow in den Netzwerken :-)",
    unlocked: "Freigeschaltet ✓",
    locked: "Noch gesperrt",
    coasterMaker: (link) =>
      `Die Holzuntersetzer macht ${link}. Wir benutzen sie seit Jahren, für heiße und kalte Getränke, und sie sehen praktisch aus wie neu. Laser Jelínek macht aber nicht nur Untersetzer – schaut euch auch die anderen Produkte, Leistungen und das Portfolio an. Klare Empfehlung.`,
    cartEmpty: "Der Warenkorb ist noch leer. Such dir oben etwas aus.",
    sizeShort: (size) => `Gr. ${size}`,
    printShort: (variant) => `Druck ${variant.toLowerCase()}`,
    free: "gratis",
    coasters: "Holzuntersetzer",
    wantCoasters: "Ich will die Gratis-Untersetzer",
    wantCoastersTip: "Verfügbar, sobald etwas im Warenkorb liegt.",
    because: "weil:",
    organizer: "Ich veranstalte Konzerte, bei denen Anteater spielt",
    follows: "Ich folge Anteater auf Facebook, Instagram und Spotify 😉",
    hintTickOrder: "Hak unten in der Bestellung „Ich will die Gratis-Untersetzer“ an.",
    hintDone: (n) => `Erledigt – wir legen ${n} ${n === 1 ? "Untersetzer" : "Untersetzer"} gratis dazu.`,
    hintPickReason:
      "Untersetzer verkaufen wir nicht einzeln. Es gibt sie zu einem Shirt oder einer Cap, wenn du bestätigst, dass du uns folgst — und für Veranstalter immer. Hak an, was zutrifft.",
    hintAddItem: "Leg ein Shirt oder eine Cap dazu und der Untersetzer gehört dir.",
    pickup: "Beim Konzert abholen",
    pickupNote: "Kein Versand. Wir bringen es mit.",
    ship: "Versenden",
    shipFrom: (price) => `ab ${price}`,
    whichShow: "Bei welchem Konzert?",
    noShows: "Die Termine laden gerade (oder es gibt noch keine) — schreib in die Notiz, wo du es haben willst.",
    sendTo: "Bitte schickt es an:",
    fName: "Vor- und Nachname",
    fStreet: "Straße und Nummer",
    fZip: "PLZ",
    fCity: "Stadt",
    fCountry: "Land",
    fNameShort: "Name",
    fContact: "E-Mail oder Telefon",
    fNote: "Notiz (optional)",
    phName: "Max Mustermann",
    phStreet: "Hauptstraße 12",
    phZip: "10115",
    phCity: "Berlin",
    phContact: "max@email.de",
    remove: "Entfernen",
    shipTo: "Wohin wir schicken",
    shipNote: (price) => `Versand ${price} kommt zum Gesamtpreis dazu.`,
    yourLocation: "nach deinem Standort",
    zipSearching: "Suche die Stadt zur PLZ…",
    zipNotFound: "PLZ nicht gefunden – bitte Stadt eintragen.",
    zipFound: (city) => `Laut PLZ: ${city}`,
    zipMultiple: "Zur PLZ gibt es mehrere Orte – bitte auswählen.",
    goods: "Ware",
    deliveryRow: "Lieferung",
    totalRow: "Gesamt",
    onRequest: "auf Anfrage",
    messageLabel: "Diese Nachricht geht raus",
    send: "Bestellung senden",
    copy: "Text kopieren",
    copied: "Kopiert ✓",
    needDelivery: "Wähl noch die Lieferart.",
    needAddress: "Bitte die Adresse ergänzen.",
    mailNote: (email) =>
      `Die Bestellung kommt direkt bei uns an: ${email}. Falls das Senden scheitert, öffnet sich dein Mailprogramm.`,
    openInGmail: "In Gmail öffnen",
    sending: "Wird gesendet…",
    sentTitle: "Bestellung gesendet ✓",
    sentText: "Danke! Wir melden uns bald mit Bestätigung und Zahlung.",
    sendError: "Senden fehlgeschlagen, dein Mailprogramm wird geöffnet. Du kannst den Text auch kopieren und an anteaterofficial@gmail.com schicken.",
    madeBy: "Hergestellt von",
    pieces: (n) => `${n} ${n === 1 ? "Stück" : "Stück"}`,
    orderCta: "Bestellen",
    voucherNav: "Geschenkgutschein",
    voucherTitle: "Geschenkgutschein",
    voucherKicker: "Ein Geschenk von der Band",
    voucherKickerBand: "Ein Geschenk für Anteater",
    voucherOpen: "Öffnen",
    voucherClose: "Schließen",
    voucherText:
      "Hallo, hier ist ein Geschenk von uns. Du kannst es auf anteaterofficial.com/merch einlösen oder damit bei jedem Konzert zur Band kommen und dir ein Shirt oder eine Cap aussuchen 🙂",
    voucherSign: "ANTEATER",
    voucherStyle: "Stil",
    voucherNewLogo: "Neues Logo",
    voucherLegacyLogo: "Klassisches Logo",
    voucherDark: "Dunkel",
    voucherLight: "Hell",
    voucherPrint: "Drucken / als PDF speichern",
    voucherAmount: "Gutscheinwert",
    voucherAddToCart: "In den Warenkorb",
    voucherOrderNow: "Direkt bestellen",
    voucherAdded: "Gutschein im Warenkorb ✓",
    voucherNeedAmount: "Bitte gib den Gutscheinbetrag ein.",
    voucherForBand: "Für Anteaters Platte",
    voucherForBandValue: "Anteater – für die Platte",
    voucherBandMessage: "Hier kannst du der Band eine Nachricht hinterlassen",
    voucherBandThanks: "Danke, das bedeutet uns viel – deshalb wollen wir deinen Namen im Booklet unserer Platte verewigen ❤",
    voucherCartName: "Geschenkgutschein",
    voucherCartNote: (to, from, msg) =>
      [to ? `für: ${to}` : "", from ? `von: ${from}` : "", msg ? `Nachricht: ${msg}` : "Nachricht folgt"]
        .filter(Boolean)
        .join(" · "),
    voucherCustom: "Eigener Betrag",
    voucherFor: "Für",
    voucherForPh: "Name der beschenkten Person",
    voucherFrom: "Von",
    voucherFromPh: "Dein Name",
    voucherMessage: "Nachricht",
    voucherMessagePh:
      "Viel Spaß mit dem Geschenk von uns – such dir ein Shirt oder eine Cap aus. Und weil du Musiker bist, kannst du es auch für mlynnapile.cz nutzen – das Studio der Band Anteater. Schau mal rein ;)",
    voucherHint: "",
    voucherCardTitle: "Geschenkgutschein / Anteater-Platte",
    voucherRecordTab: "Anteater-Platte",
    voucherDonorOrder: "Die Namen der Unterstützer stehen im Booklet nach Höhe des Beitrags.",
    voucherCardBandText:
      "Du willst unsere neue Platte unterstützen? Gib einen beliebigen Betrag und wir verewigen deinen Namen im Booklet. Danke, das bedeutet uns viel ❤",
    voucherCardText:
      "Du weißt nicht, was du schenken sollst? Nimm einen Geschenkgutschein. Und wenn du unsere Platte unterstützen und im Booklet stehen willst, schreib „ich will die Platte“ – sobald sie fertig ist, bekommst du sie physisch. Die Namen der Unterstützer stehen im Booklet nach Höhe des Beitrags. Danke.",
    voucherViewFront: "Titelseite",
    voucherViewInside: "Innen",
    voucherViewBack: "Rückseite",
    voucherHowTo: "So löst du ihn ein",
    voucherRedeem:
      "Schreib uns über anteaterofficial.com/merch oder komm bei einem Konzert zur Band – such dir ein Shirt oder eine Cap aus, fertig.",
    mailSubject: "Merch-Bestellung — ANTEATER",
    msgHello: "Hallo,",
    msgWant: "ich hätte gern:",
    msgCoasters: (n) => `• Holzuntersetzer (gratis) — ${n}×`,
    msgPickup: (place) => `Ich hole es beim Konzert ab — ${place}.`,
    msgPickupTbd: "Ich hole es bei einem Konzert ab — Termin sage ich noch.",
    msgShip: "Bitte schickt es an:",
    msgPlaceholderName: "[Vor- und Nachname]",
    msgPlaceholderStreet: "[Straße und Nummer]",
    msgPlaceholderZip: "[PLZ]",
    msgPlaceholderCity: "[Stadt]",
    msgShipping: (country, price) => `${country} — Versand ${price}`,
    msgName: "Name",
    msgContact: "Kontakt",
    msgOrganizer: "Ich bin Veranstalter.",
    msgFollows: "Ich folge euch auf FB, Instagram und Spotify 😉",
    msgNote: "Notiz",
    msgTotal: "Gesamt",
    msgThanks: "Danke!",
  },
}

/** Štítky v kartě produktu. */
export const cardDict: Record<Lang, Record<string, string>> = {
  cs: {
    photo: "Zobrazit fotku",
    inCart: "× v košíku",
    soldOut: "Rozdáno 🙂",
    detail: "Detail",
    makerSpec: "Specifikace výrobce →",
    priceOnRequest: "Cena na dotaz",
    less: "Ubrat kus",
    more: "Přidat kus",
    chooseSize: "Vyber velikost",
    added: "Přidáno ✓",
    add: "Přidat",
  },
  en: {
    photo: "Show photo",
    inCart: "× in cart",
    soldOut: "All given away 🙂",
    detail: "Details",
    makerSpec: "Manufacturer spec →",
    priceOnRequest: "Price on request",
    less: "Remove one",
    more: "Add one",
    chooseSize: "Choose a size",
    added: "Added ✓",
    add: "Add",
  },
  de: {
    photo: "Foto zeigen",
    inCart: "× im Warenkorb",
    soldOut: "Alle verschenkt 🙂",
    detail: "Details",
    makerSpec: "Herstellerangaben →",
    priceOnRequest: "Preis auf Anfrage",
    less: "Eins weniger",
    more: "Eins mehr",
    chooseSize: "Größe wählen",
    added: "Hinzugefügt ✓",
    add: "In den Warenkorb",
  },
}
