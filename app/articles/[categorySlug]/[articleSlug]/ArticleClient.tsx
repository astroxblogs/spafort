"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { marked } from "marked";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  readTime?: number;
  category: { name: string; slug: string };
  tags?: string[];
}

export default function ArticleClient({ article }: { article: Article }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#fdfbf7] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#fffdfa] rounded-3xl border border-[#e8dcc2] shadow-[0_4px_18px_rgba(0,0,0,0.06)] py-10 px-6 md:px-12">
            <Link
              href={`/articles/${article.category.slug}`}
              className="inline-flex items-center text-[#b48c52] hover:text-black mb-8 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {article.category.name}
            </Link>

            <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <Link
                href={`/articles/${article.category.slug}`}
                className="inline-block bg-[#b48c52] text-white px-3 py-1 rounded-full text-xs font-medium mb-5"
              >
                {article.category.name}
              </Link>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-5 leading-tight">
                {article.title}
              </h1>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{article.excerpt}</p>

              <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-[#eadfcd]">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {article.readTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#b48c52] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </motion.header>

            {article.featuredImage && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-10">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl shadow-md"
                />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: marked(article.content) }}
                className="
                  text-left
                  [&_img]:rounded-xl [&_img]:shadow-md [&_img]:mx-auto [&_img]:my-8
                  [&_p]:text-gray-700 [&_p]:text-[1.05rem] [&_p]:leading-[1.75] [&_p]:mb-6
                  [&_h1]:text-[2.1rem] [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-10 [&_h1]:mb-4
                  [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-[rgba(180,140,82,0.18)]
                  [&_h2]:text-[1.65rem] [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-3
                  [&_h2]:pl-3 [&_h2]:border-l-[3px] [&_h2]:border-[rgba(180,140,82,0.28)]
                  [&_h3]:text-[1.35rem] [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-2
                  [&_h4]:text-[1.18rem] [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mt-6 [&_h4]:mb-2
                  [&_h5]:text-[1.05rem] [&_h5]:font-semibold [&_h5]:text-gray-900 [&_h5]:mt-4 [&_h5]:mb-1
                  [&_h6]:text-[0.95rem] [&_h6]:font-medium [&_h6]:text-gray-800 [&_h6]:mt-3 [&_h6]:mb-1
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#d3b37a] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700
                "
              />
            </motion.div>

            {article.tags && article.tags.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 pt-8 border-t border-[#eadfcd]">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="bg-[#f3ecdf] text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-16 pt-8 border-t border-[#eadfcd]">
              <Link
                href={`/articles/${article.category.slug}`}
                className="inline-flex items-center text-[#b48c52] hover:text-black font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                More articles in {article.category.name}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
