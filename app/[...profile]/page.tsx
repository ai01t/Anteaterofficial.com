import type { Metadata } from "next"
import { MemberProfile, type Locale } from "@/components/member-profile"

const profileSlugs = ["andy", "hanzi", "jindra"]
const profileNames: Record<string, string> = { andy: "Andrea Kohoutová", hanzi: "Jan Oríšek", jindra: "Jindřich Traxmandl" }

export function generateStaticParams() {
  return profileSlugs.flatMap((slug) => [slug, `${slug}/de`, `${slug}/cz`].map((path) => ({ profile: path.split("/") })))
}

export async function generateMetadata({ params }: { params: Promise<{ profile: string[] }> }): Promise<Metadata> {
  const { profile: segments } = await params
  const name = profileNames[segments[0]] ?? profileNames.andy
  return { title: `${name} — ANTEATER`, description: `${name}, official ANTEATER musician profile.` }
}

export default async function ProfilePage({ params }: { params: Promise<{ profile: string[] }> }) {
  const { profile: segments } = await params
  const locale = (segments[1] === "de" || segments[1] === "cz" ? segments[1] : "en") as Locale
  return <MemberProfile slug={segments[0]} locale={locale} />
}
