import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

type Settings = {
  gallery_page_hero_image?: string;
  gallery_page_hero_title?: string;
  gallery_page_hero_subtitle?: string;
};

async function fetchSettings(): Promise<Settings> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002'}/api/settings`, { cache: "no-store" });
  if (!res.ok) return {};
  const json = await res.json().catch(() => null);
  return (json?.data as Settings) ?? {};
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const publicBase = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const title = (settings.gallery_page_hero_title || "Gallery").trim();
  const description =
    (settings.gallery_page_hero_subtitle ||
      "Explore our ambience, rooms, and wellness experience.").trim();

  const heroUrl = settings.gallery_page_hero_image
    ? (settings.gallery_page_hero_image.startsWith("http")
        ? settings.gallery_page_hero_image
        : `${publicBase}${settings.gallery_page_hero_image}`)
    : `${publicBase}/assets/hero-spa.jpg`;

  const canonical = `${publicBase}/gallery`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "SpaFort",
      type: "website",
      images: [{ url: heroUrl, width: 1200, height: 630, alt: `SpaFort Gallery - ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroUrl],
    },
  };
}

export default async function Page() {
  const settings = await fetchSettings();

  const initialTitle = (settings.gallery_page_hero_title || "Gallery").trim();
  const initialSubtitle =
    (settings.gallery_page_hero_subtitle ||
      "Explore our ambience, rooms, and wellness experience.").trim();
  const initialHeroUrl = settings.gallery_page_hero_image ?? null;

  return (
    <GalleryClient
      initialTitle={initialTitle}
      initialSubtitle={initialSubtitle}
      initialHeroUrl={initialHeroUrl}
    />
  );
}
