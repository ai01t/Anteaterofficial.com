import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ANTEATER - Female-Fronted Rock Band | Prague | Alternative Rock",
  description:
    "Anteater - Award-winning female-fronted rock/post-grunge band from Prague (est. 2018). Winners of Strahov Open Air 2019 & 27th Múza. Spotify & Apple Music available.",
  keywords: [
    "rock band Prague",
    "female-fronted rock",
    "post-grunge band",
    "alternative rock",
    "Anteater band",
    "Czech rock",
    "Andrea Kohoutová",
    "rock concerts",
    "Strahov Open Air",
    "Múza 2019",
    "female rock singers",
    "grunge rock",
    "metal rock",
    "Guano Apes",
    "Paramore",
    "Jinjer",
    "rock band booking",
  ],
  generator: "v0.app",

  openGraph: {
    type: "website",
    title: "ANTEATER - Female-Fronted Rock Band from Prague",
    description: "Award-winning rock band with stunning live performances. Available on Spotify, Apple Music, YouTube.",
    url: "https://www.anteaterofficial.com",
    siteName: "ANTEATER Official",
    images: [
      {
        url: "/images/anteater-promo-2025.jpg",
        width: 1200,
        height: 630,
        alt: "ANTEATER Band - Prague Rock Band",
      },
    ],
    locale: "en_US",
    alternateLocale: ["cs_CZ", "de_DE"],
  },

  twitter: {
    card: "summary_large_image",
    title: "ANTEATER - Award-Winning Rock Band",
    description: "Female-fronted rock band. Winners of Strahov Open Air 2019.",
    images: ["/images/anteater-promo-2025.jpg"],
    creator: "@anteatercz1659",
  },

  alternates: {
    languages: {
      "en-US": "/en",
      "cs-CZ": "/cs",
      "de-DE": "/de",
    },
    canonical: "https://www.anteaterofficial.com",
  },

  authors: [
    {
      name: "Anteater",
      url: "https://www.anteaterofficial.com",
    },
  ],

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  verification: {
    google: "anteater-google-verification",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
