import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Search, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BLOG_POSTS, type BlogPost } from "@/data/blogs";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const CATEGORIES = ["All", "SEO", "Google Ads", "Digital Marketing"] as const;
type Filter = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  SEO: "bg-primary/10 text-primary",
  "Google Ads": "bg-accent/10 text-accent",
  "Digital Marketing": "bg-emerald-100 text-emerald-700",
};

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.a
      href={`${BASE}/blog/${post.slug}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.08 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      <div className="h-2 w-full" style={{ background: post.category === "SEO" ? "#0ea5c8" : post.category === "Google Ads" ? "hsl(259 100% 65%)" : "#10b981" }} />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[post.category]}`}>
            {post.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} /> {post.readTime} min read
          </span>
        </div>
        <h2 className="font-black text-gray-900 text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-1.5 mt-4 text-sm font-bold text-primary group-hover:gap-3 transition-all">
          Read Article <ArrowRight size={14} />
        </div>
      </div>
    </motion.a>
  );
}

export default function BlogPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = BLOG_POSTS.filter(p => {
    const matchesCategory = filter === "All" || p.category === filter;
    const matchesSearch = searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-sky-50/40">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
              <BookOpen size={14} /> SEO & Google Ads Insights
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
              The <span className="text-gradient">Indexify Blog</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              Expert guides on SEO and Google Ads for South African businesses. No fluff — only strategies that move the needle.
            </p>

            <div className="relative max-w-lg mx-auto mb-8">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    filter === cat
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {cat}
                  {cat !== "All" && (
                    <span className="ml-1.5 opacity-60 font-normal">
                      ({BLOG_POSTS.filter(p => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No articles found for "{searchQuery}"</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-8">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Ready to Apply What You've Learned?</h2>
          <p className="text-gray-500 mb-8">Theory is great. Results are better. Let us put these strategies to work for your business.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`${BASE}/audit`} className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
              Get Free SEO Audit <ArrowRight size={15} />
            </a>
            <a href={`${BASE}/pricing`} className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:border-primary/30 hover:text-primary transition-all">
              View Packages
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
