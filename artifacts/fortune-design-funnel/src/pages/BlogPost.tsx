import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPost, BLOG_POSTS, type BlogPost } from "@/data/blogs";
import { getBlogImage } from "@/data/blogImages";
import NotFound from "@/pages/not-found";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const CATEGORY_COLORS: Record<string, string> = {
  SEO: "bg-primary/10 text-primary",
  "Google Ads": "bg-accent/10 text-accent",
  "Digital Marketing": "bg-emerald-100 text-emerald-700",
};

function RelatedCard({ post }: { post: BlogPost }) {
  const imgUrl = getBlogImage(post.slug, post.category, "card");
  return (
    <a
      href={`${BASE}/blog/${post.slug}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col"
    >
      <div className="relative h-32 overflow-hidden">
        <img src={imgUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 ${CATEGORY_COLORS[post.category]}`}>{post.category}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-primary transition-colors mb-3 line-clamp-2">{post.title}</h3>
        <div className="flex items-center gap-1 text-xs text-primary font-bold mt-auto group-hover:gap-2 transition-all">
          Read <ArrowRight size={12} />
        </div>
      </div>
    </a>
  );
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;

      const setMeta = (selector: string, attr: string, value: string) => {
        let tag = document.querySelector(selector);
        if (tag) {
          tag.setAttribute(attr, value);
        } else {
          tag = document.createElement("meta");
          const [, prop, key] = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/) ?? [];
          if (prop && key) { tag.setAttribute(prop, key); }
          tag.setAttribute(attr, value);
          document.head.appendChild(tag);
        }
      };

      setMeta('meta[name="description"]',         "content", post.metaDescription);
      setMeta('meta[name="keywords"]',             "content", post.keywords.join(", "));
      setMeta('meta[property="og:title"]',         "content", post.metaTitle);
      setMeta('meta[property="og:description"]',   "content", post.metaDescription);
      setMeta('meta[property="og:image"]',         "content", getBlogImage(post.slug, post.category, "hero"));
      setMeta('meta[property="og:type"]',          "content", "article");
    }
    return () => { document.title = "Indexify – Lead SEO & Google Ads Expert"; };
  }, [post]);

  if (!post) return <NotFound />;

  const heroImg = getBlogImage(post.slug, post.category, "hero");
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Meta strip */}
      <div className="pt-28 pb-0">
        <div className="max-w-3xl mx-auto px-4">
          <a href={`${BASE}/blog`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors font-medium mb-6">
            <ArrowLeft size={14} /> Back to Blog
          </a>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[post.category]}`}>{post.category}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> {post.readTime} min read</span>
            <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4"
          >
            {post.title}
          </motion.h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8">{post.excerpt}</p>
        </div>
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto px-4 mb-12"
      >
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={heroImg}
            alt={post.title}
            className="w-full h-72 md:h-[420px] object-cover"
          />
        </div>
      </motion.div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="prose prose-gray prose-lg max-w-none
            [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-7 [&_h3]:mb-3
            [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-5
            [&_ul]:space-y-2 [&_ul]:mb-5 [&_ul>li]:text-gray-600 [&_ul>li]:pl-1
            [&_ol]:space-y-2 [&_ol]:mb-5 [&_ol>li]:text-gray-600
            [&_li]:leading-relaxed
            [&_strong]:text-gray-900 [&_strong]:font-bold
            [&_a]:text-primary [&_a]:font-semibold [&_a]:no-underline [&_a:hover]:underline
            [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_table]:text-sm
            [&_th]:bg-gray-50 [&_th]:font-bold [&_th]:text-gray-700 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:border-b-2 [&_th]:border-gray-200
            [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-gray-100 [&_td]:text-gray-600
            [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:mb-5
            [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-gray-800
            [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Keywords */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-50 border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Keywords</p>
          <div className="flex flex-wrap gap-2">
            {post.keywords.map(kw => (
              <span key={kw} className="text-xs bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full">{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA card */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-2" style={{ background: "linear-gradient(90deg, #0ea5c8, #7c4dff, #e040fb)" }} />
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Ready to Put This Into Action?</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Our team applies these exact strategies for South African businesses every day. Let's talk about yours.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href={`${BASE}/audit`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
                  Get Free SEO Audit <ArrowRight size={14} />
                </a>
                <a href={`${BASE}/pricing`} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:border-primary/30 hover:text-primary transition-all">
                  View Packages
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-xl font-black text-gray-900 mb-6">More {post.category} Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(p => <RelatedCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
