"use client";

import { useState } from "react";
import { saveBlogPost, deleteBlogPost } from "@/app/admin/actions";
import Image from "next/image";
import { Trash2, Edit2, Plus, X } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  categoryTag: string;
  publishedDate: Date;
  sortOrder: number;
}

export default function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setMessage(null);
  };

  const handleCreateNew = () => {
    setCurrentPost({
      title: "",
      excerpt: "",
      categoryTag: "DESIGN",
      sortOrder: posts.length + 1,
      imageUrl: "",
    });
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journal post?")) return;
    setIsLoading(true);
    try {
      const res = await deleteBlogPost(id);
      if (res.success) {
        setPosts(posts.filter((p) => p.id !== id));
        setMessage({ type: "success", text: "Journal post deleted successfully" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to delete post" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPost) return;

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    if (currentPost.id) {
      formData.append("id", currentPost.id);
    }

    try {
      const res = await saveBlogPost(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Journal post saved successfully" });
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save post" });
      }
    } catch {
      setMessage({ type: "error", text: "Error saving journal post" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-wide">Journal Posts</h1>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">Manage studio diary logs and categories</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white text-black hover:bg-neutral-200 transition-colors duration-300 text-xs tracking-widest font-bold uppercase"
        >
          <Plus size={14} />
          <span>Add Dispatch</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 text-xs tracking-wider uppercase font-semibold border ${
            message.type === "success"
              ? "bg-green-950/30 border-green-800/40 text-green-300"
              : "bg-red-950/30 border-red-800/40 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {isEditing && currentPost && (
        <div className="bg-[#121212] border border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              {currentPost.id ? "Edit Journal Post" : "Create New Post"}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="existingImage" value={currentPost.imageUrl || ""} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                  Category Tag
                </label>
                <input
                  type="text"
                  name="categoryTag"
                  required
                  defaultValue={currentPost.categoryTag || "DESIGN"}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light uppercase tracking-wider"
                  placeholder="e.g. DESIGN, MATERIALS, STUDIO"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  required
                  defaultValue={currentPost.sortOrder}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Post Title
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={currentPost.title || ""}
                className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light uppercase"
                placeholder="e.g. Sourcing Organic Textures"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Post Excerpt
              </label>
              <textarea
                name="excerpt"
                required
                rows={4}
                defaultValue={currentPost.excerpt || ""}
                className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light leading-relaxed resize-none"
                placeholder="Write summary description..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Journal Visual Image
              </label>
              {currentPost.imageUrl && (
                <div className="relative w-40 h-24 border border-white/5 bg-neutral-900 mb-2">
                  <Image
                    src={currentPost.imageUrl}
                    alt="Current post image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                required={!currentPost.imageUrl}
                className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:border file:border-white/10 file:bg-transparent file:text-white file:text-xs file:tracking-wider file:uppercase hover:file:bg-white/5 cursor-pointer file:cursor-pointer"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 text-xs tracking-widest font-bold uppercase transition-colors duration-300"
              >
                {isLoading ? "SAVING POST..." : "SAVE POST"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-white/10 hover:border-white/20 text-xs tracking-widest font-medium uppercase transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List layout */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#121212] border border-white/5 p-4 flex flex-col md:flex-row items-center gap-6 hover:border-white/10 transition-colors duration-300"
          >
            {/* Thumbnail */}
            <div className="relative w-full md:w-36 h-24 bg-neutral-900 overflow-hidden shrink-0">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover opacity-80"
              />
            </div>

            {/* Post info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2 py-0.5 bg-white/[0.04] border border-white/5 text-[9px] tracking-wider font-bold text-white/70 uppercase">
                  {post.categoryTag}
                </span>
                <span className="text-[10px] text-white/30">{formatDate(post.publishedDate)}</span>
                <span className="text-[10px] text-white/30 font-mono">ORDER {post.sortOrder}</span>
              </div>
              <h3 className="text-base font-light tracking-wide text-white uppercase line-clamp-1">
                {post.title}
              </h3>
              <p className="text-xs text-white/40 font-light leading-relaxed line-clamp-1">
                {post.excerpt}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2 w-full md:w-auto shrink-0 md:items-end">
              <button
                onClick={() => handleEdit(post)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-[10px] tracking-widest uppercase font-bold text-white transition-all duration-300 w-1/2 md:w-auto"
              >
                <Edit2 size={11} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-red-900/30 hover:bg-red-950/20 text-[10px] tracking-widest uppercase font-bold text-red-400 transition-all duration-300 w-1/2 md:w-auto"
              >
                <Trash2 size={11} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
