import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Search, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { BLOG_POSTS, type BlogPost } from "@/data/blogs";
import { getBlogImage } from "@/data/blogImages";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const CATEGORIES = ["All", "SEO", "Google Ads", "Digital Marketing"] as const;
type Filter = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  SEO: "bg-primary/10 text-primary",
  "Google Ads": "bg-accent/10 text-accent",
  "Digital Marketing": "bg-emerald-100 text-emerald-700",
};

const CATEGORY_BAR: Record<string, string> = {
  SEO: "#0ea5c8",
  "Google Ads": "hsl(259 100% 65%)",
  "Digital Marketing": "#10b981",
};

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const imgUrl = getBlogImage(post.slug, post.category, "card");

  return (
    <motion.a
      href={`${BASE}/blog/${post.slug}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.08 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Feature Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgUrl}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge overlaid on image */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm bg-white/90 border border-white/60 shadow-sm ${CATEGORY_COLORS[post.category]}`}>
            {post.category}
          </span>
        </div>
        {/* Colour accent bar at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: CATEGORY_BAR[post.category] }} />
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} /> {post.readTime} min read
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">
            {new Date(post.date).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })}
          </span>
        </div>
        <h2 className="font-black text-gray-900 text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-1.5 mt-5 text-sm font-bold text-primary group-hover:gap-3 transition-all">
          Read Article <ArrowRight size={14} />
        </div>
      </div>
    </motion.a>
  );
}

export default function BlogPage() {
  useSEO({
    title: "SEO & Google Ads Blog – SA Guides | Indexify",
    description: "Expert articles on SEO, Google Ads and digital marketing for SA businesses. Practical guides with no fluff — strategies that actually move the needle.",
    keywords: ["SEO blog South Africa", "Google Ads tips South Africa", "digital marketing South Africa", "SEO guides for businesses", "online marketing South Africa"],
    canonical: "https://indexify.co.za/blog/",
  });

  const [filter, setFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = BLOG_POSTS.filter(p => {
    const matchesCategory = filter === "All" || p.category === filter;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
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

            {/* Search */}
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

            {/* Category filters */}
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

      {/* Featured post (first one) */}
      {filter === "All" && searchQuery === "" && (
        <section className="py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Featured Article</p>
            <motion.a
              href={`${BASE}/blog/${BLOG_POSTS[0].slug}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img
                  src={getBlogImage(BLOG_POSTS[0].slug, BLOG_POSTS[0].category, "hero")}
                  alt={BLOG_POSTS[0].title}
                  loading="eager"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
              </div>
              <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
                <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 ${CATEGORY_COLORS[BLOG_POSTS[0].category]}`}>
                  {BLOG_POSTS[0].category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 group-hover:text-primary transition-colors">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">{BLOG_POSTS[0].excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={14} />
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} /> {BLOG_POSTS[0].readTime} min read
                  </span>
                </div>
              </div>
            </motion.a>
          </div>
        </section>
      )}

      {/* Grid */}
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

      {/* CTA */}
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
