"use client";

import { useState } from "react";
import { saveProject, deleteProject } from "@/app/admin/actions";
import Image from "next/image";
import { Trash2, Edit2, Plus, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  categoryLabel: string;
  imageUrl: string;
  sortOrder: number;
}

export default function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
    setMessage(null);
  };

  const handleCreateNew = () => {
    setCurrentProject({
      title: "",
      categoryLabel: "INTERIOR",
      sortOrder: projects.length + 1,
      imageUrl: "",
    });
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setIsLoading(true);
    try {
      const res = await deleteProject(id);
      if (res.success) {
        setProjects(projects.filter((p) => p.id !== id));
        setMessage({ type: "success", text: "Project deleted successfully" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to delete project" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentProject) return;

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    if (currentProject.id) {
      formData.append("id", currentProject.id);
    }

    try {
      const res = await saveProject(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Project saved successfully" });
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save project" });
      }
    } catch {
      setMessage({ type: "error", text: "Error saving project" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-wide">Portfolio Grid</h1>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">Manage showcase project list and categories</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white text-black hover:bg-neutral-200 transition-colors duration-300 text-xs tracking-widest font-bold uppercase"
        >
          <Plus size={14} />
          <span>Add Project</span>
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

      {isEditing && currentProject && (
        <div className="bg-[#121212] border border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              {currentProject.id ? "Edit Project Details" : "Create New Project"}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="existingImage" value={currentProject.imageUrl || ""} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                  Category Tag
                </label>
                <input
                  type="text"
                  name="categoryLabel"
                  required
                  defaultValue={currentProject.categoryLabel || "INTERIOR"}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light uppercase tracking-wider"
                  placeholder="e.g. INTERIOR, ARCHITECTURE"
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
                  defaultValue={currentProject.sortOrder}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={currentProject.title || ""}
                className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light text-transform uppercase"
                placeholder="e.g. THE OAK RESIDENCE"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Project Showcase Image
              </label>
              {currentProject.imageUrl && (
                <div className="relative w-40 h-44 border border-white/5 bg-neutral-900 mb-2">
                  <Image
                    src={currentProject.imageUrl}
                    alt="Current image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                required={!currentProject.imageUrl}
                className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:border file:border-white/10 file:bg-transparent file:text-white file:text-xs file:tracking-wider file:uppercase hover:file:bg-white/5 cursor-pointer file:cursor-pointer"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 text-xs tracking-widest font-bold uppercase transition-colors duration-300"
              >
                {isLoading ? "SAVING PROJECT..." : "SAVE PROJECT"}
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

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#121212] border border-white/5 p-5 flex flex-col space-y-4 hover:border-white/10 transition-colors duration-300"
          >
            {/* Visual background preview */}
            <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute top-4 left-4 px-2 py-0.5 bg-black/80 text-[10px] font-mono border border-white/10 text-white">
                ORDER {project.sortOrder}
              </div>
            </div>

            {/* Info details */}
            <div>
              <span className="text-[9px] tracking-[0.25em] font-semibold text-white/40 uppercase block mb-1">
                {project.categoryLabel}
              </span>
              <h3 className="text-base font-light tracking-wide text-white uppercase line-clamp-1">
                {project.title}
              </h3>
            </div>

            {/* Panel control buttons */}
            <div className="flex space-x-2 mt-auto border-t border-white/5 pt-4">
              <button
                onClick={() => handleEdit(project)}
                className="flex items-center space-x-1.5 px-3 py-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-[10px] tracking-widest uppercase font-bold text-white transition-all duration-300"
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="flex items-center space-x-1.5 px-3 py-2 border border-red-900/30 hover:bg-red-950/20 text-[10px] tracking-widest uppercase font-bold text-red-400 transition-all duration-300 ml-auto"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
