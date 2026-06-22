"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  categoryTag: string;
  publishedDate: Date;
  sortOrder: number;
}

interface BlogProps {
  posts: BlogPostData[];
}

export default function Blog({ posts }: BlogProps) {
  // Sort posts by sortOrder
  const sortedPosts = [...posts].sort((a, b) => a.sortOrder - b.sortOrder);

  // Helper to format dates dynamically
  const formatDate = (dateInput: Date) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section id="journal" className="py-24 md:py-36 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-8 h-[1px] bg-black/40" />
              <span className="text-xs tracking-widest font-semibold text-black/60 uppercase">
                STUDIO DIARY
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-black uppercase">
              JOURNAL & DISPATCHES
            </h2>
          </div>
          <span className="text-xs tracking-widest text-black/50 font-medium">
            UPDATES ON PROJECTS, PROCESS, AND REFLECTIONS
          </span>
        </div>

        {/* 3-Column Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16"
        >
          {sortedPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="flex flex-col h-full group"
            >
              {/* Image Frame */}
              <div className="relative h-[260px] overflow-hidden bg-zinc-100 mb-6">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Tag & Date */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-[10px] tracking-[0.2em] font-bold text-black/50 uppercase">
                  {post.categoryTag}
                </span>
                <span className="text-[10px] tracking-[0.1em] font-light text-black/40">
                  {formatDate(post.publishedDate)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-light tracking-wide text-black mb-4 uppercase hover:text-neutral-600 transition-colors duration-300">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-black/60 font-light leading-relaxed mb-6">
                {post.excerpt}
              </p>

              {/* Read Link */}
              <span className="text-xs tracking-widest font-semibold border-b border-black w-fit pb-1 mt-auto hover:text-black/50 hover:border-black/50 transition-all duration-300 cursor-pointer">
                READ ARTICLE
              </span>
            </motion.article>
          ))}
        </motion.div>

        {/* View More CTA */}
        <div className="text-center">
          <button className="px-10 py-4 border border-black text-xs tracking-widest text-black hover:bg-black hover:text-white transition-colors duration-500 font-medium">
            VIEW MORE DIARIES
          </button>
        </div>

      </div>
    </section>
  );
}
