// app/articles/[categorySlug]/[articleSlug]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import ArticleClient, { Article } from "./ArticleClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

type Params = { categorySlug: string; articleSlug: string };

async function getSiteUrlFromRequest() {
  const h = await headers(); // Next 15: await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

async function fetchArticle(base: string, categorySlug: string, articleSlug: string): Promise<Article | null> {
  const url = `${base}/api/articles/category/${encodeURIComponent(categorySlug)}/${encodeURIComponent(articleSlug)}`;
  const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  if (!json || !json.success) return null;
  return json.data as Article;
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { categorySlug, articleSlug } = await params;

  // ✅ Use env only; do NOT call headers() here.
  const publicBase =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://veloraaspa.netlify.app"; // set your real domain in env

  // Fetch article data for OG/Twitter (absolute URL built from env)
  const res = await fetch(
    `${publicBase}/api/articles/category/${encodeURIComponent(categorySlug)}/${encodeURIComponent(articleSlug)}`,
    { cache: "no-store" }
  );
  const json = res.ok ? await res.json().catch(() => null) : null;
  const article: Article | null = json?.success ? json.data : null;

  const canonical = `${publicBase}/articles/${categorySlug}/${articleSlug}`;

  if (!article) {
    return {
      title: "Article Not Found - SpaFort",
      description: "The requested article could not be found.",
      alternates: { canonical },
      openGraph: {
        title: "Article Not Found - SpaFort",
        description: "The requested article could not be found.",
        url: canonical,
        type: "article",
        images: [{ url: `${publicBase}/assets/hero-spa.jpg`, width: 1200, height: 630, alt: "SpaFort" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Article Not Found - SpaFort",
        description: "The requested article could not be found.",
        images: [`${publicBase}/assets/hero-spa.jpg`],
      },
    };
  }

  const img = article.featuredImage?.startsWith("http")
    ? article.featuredImage
    : `${publicBase}${article.featuredImage || "/assets/hero-spa.jpg"}`;

  return {
    title: `${article.title} - SpaFort`,
    description: article.excerpt || `Read ${article.title} at SpaFort.`,
    keywords: ["wellness", "spa", article.category.name, ...(article.tags ?? [])],
    alternates: { canonical },
    openGraph: {
      title: `${article.title} - SpaFort`,
      description: article.excerpt || `Read ${article.title} at SpaFort.`,
      url: canonical,
      siteName: "SpaFort",
      type: "article",
      locale: "en_US",
      publishedTime: article.publishedAt,
      images: [{ url: img, width: 1200, height: 630, alt: `Article: ${article.title} - SpaFort` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - SpaFort`,
      description: article.excerpt || `Read ${article.title} at SpaFort.`,
      images: [img],
    },
  };
} 


export default async function Page({ params }: { params: Promise<Params> }) {
  const { categorySlug, articleSlug } = await params;   // ✅ await params
  const publicBase = process.env.NEXT_PUBLIC_SITE_URL || (await getSiteUrlFromRequest());
  const article = await fetchArticle(publicBase, categorySlug, articleSlug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Article Not Found</h1>
        </div>
      </div>
    );
  }

  return <ArticleClient article={article} />;
}
