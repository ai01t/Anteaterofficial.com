import type { Metadata } from "next"
import type React from "react"
import { Rock_Salt } from "next/font/google"

const rockSalt = Rock_Salt({ weight: "400", subsets: ["latin"], variable: "--font-brush", display: "swap" })

export const metadata: Metadata = {
  title: "Dárkový poukaz | ANTEATER",
  description:
    "Dárkový poukaz ANTEATER na triko nebo kšiltovku – uplatníš ho na anteaterofficial.com/merch nebo přímo na koncertě.",
  robots: { index: false, follow: false },
}

export default function VoucherLayout({ children }: { children: React.ReactNode }) {
  return <div className={rockSalt.variable}>{children}</div>
}
