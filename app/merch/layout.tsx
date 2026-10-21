import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Merch | ANTEATER",
  description:
    "Oficiální merch kapely ANTEATER — vintage trička s novým logem, Legacy trička s dlouhým rukávem, kšiltovka a dřevěné podtácky. Vyzvednutí na koncertě nebo poštou.",
  openGraph: {
    type: "website",
    title: "Merch | ANTEATER",
    description:
      "Vintage trička s novým logem, Legacy longsleeve, kšiltovka a dřevěné podtácky. Vyzvedni si merch na koncertě nebo ti ho pošleme.",
    url: "https://www.anteaterofficial.com/merch",
    siteName: "ANTEATER Official",
    locale: "cs_CZ",
    images: [{ url: "/images/merch/cliff-back.jpg", width: 1200, height: 1600, alt: "ANTEATER merch" }],
  },
  alternates: {
    canonical: "https://www.anteaterofficial.com/merch",
  },
}

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return children
}
