import type { Metadata } from "next"
import { MemberProfile } from "@/components/member-profile"

export const dynamic = "force-dynamic"
export const revalidate = 0

const profileSlugs = ["andy", "hanzi", "jindra"]
const profileNames: Record<string, string> = { andy: "Andrea Kohoutová", hanzi: "Jan Oríšek", jindra: "Jindřich Traxmandl" }

export function generateStaticParams() {
  return profileSlugs.map((slug) => ({ profile: [slug, "cz"] }))
}

export async function generateMetadata({ params }: { params: Promise<{ profile: string[] }> }): Promise<Metadata> {
  const { profile: segments } = await params
  const name = profileNames[segments[0]] ?? profileNames.andy
  return { title: `${name} — ANTEATER`, description: `${name}, official ANTEATER musician profile.` }
}

export default async function ProfilePage({ params }: { params: Promise<{ profile: string[] }> }) {
  const { profile: segments } = await params
  return <MemberProfile slug={segments[0]} locale="cz" />
}
