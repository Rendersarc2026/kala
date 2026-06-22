"use server";

import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unknown error occurred";
}

// ----------------------------------------------------
// HERO SLIDES ACTIONS
// ----------------------------------------------------

export async function saveHeroSlide(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const label = formData.get("label") as string;
    const heading = formData.get("heading") as string;
    const buttonText = formData.get("buttonText") as string;
    const slideOrder = parseInt(formData.get("slideOrder") as string) || 1;
    const file = formData.get("image") as File | null;

    let backgroundImageUrl = formData.get("existingImage") as string;

    // Check if a new file is uploaded
    if (file && file.size > 0) {
      backgroundImageUrl = await uploadFile(file);
    }

    if (id) {
      // Update
      await prisma.heroContent.update({
        where: { id },
        data: { label, heading, buttonText, slideOrder, backgroundImageUrl },
      });
    } else {
      // Create
      await prisma.heroContent.create({
        data: { label, heading, buttonText, slideOrder, backgroundImageUrl },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteHeroSlide(id: string) {
  try {
    await prisma.heroContent.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete Hero slide" };
  }
}

// ----------------------------------------------------
// ABOUT SECTION ACTIONS
// ----------------------------------------------------

export async function saveAboutSection(formData: FormData) {
  try {
    const label = formData.get("label") as string;
    const heading = formData.get("heading") as string;
    const paragraph = formData.get("paragraph") as string;
    const buttonText = formData.get("buttonText") as string;

    const file1 = formData.get("image1") as File | null;
    const file2 = formData.get("image2") as File | null;

    let image1Url = formData.get("existingImage1") as string;
    let image2Url = formData.get("existingImage2") as string;

    if (file1 && file1.size > 0) {
      image1Url = await uploadFile(file1);
    }
    if (file2 && file2.size > 0) {
      image2Url = await uploadFile(file2);
    }

    await prisma.aboutSection.upsert({
      where: { id: "about" },
      update: { label, heading, paragraph, buttonText, image1Url, image2Url },
      create: { id: "about", label, heading, paragraph, buttonText, image1Url, image2Url },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ----------------------------------------------------
// SERVICES ACTIONS
// ----------------------------------------------------

export async function saveService(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const iconName = formData.get("iconName") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 1;

    if (id) {
      await prisma.service.update({
        where: { id },
        data: { iconName, title, description, sortOrder },
      });
    } else {
      await prisma.service.create({
        data: { iconName, title, description, sortOrder },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete Service card" };
  }
}

// ----------------------------------------------------
// PROJECTS SHOWCASE ACTIONS
// ----------------------------------------------------

export async function saveProject(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const title = formData.get("title") as string;
    const categoryLabel = formData.get("categoryLabel") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 1;
    const file = formData.get("image") as File | null;

    let imageUrl = formData.get("existingImage") as string;

    if (file && file.size > 0) {
      imageUrl = await uploadFile(file);
    }

    if (id) {
      await prisma.project.update({
        where: { id },
        data: { title, categoryLabel, sortOrder, imageUrl },
      });
    } else {
      await prisma.project.create({
        data: { title, categoryLabel, sortOrder, imageUrl },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete Project" };
  }
}

// ----------------------------------------------------
// BLOG ACTIONS
// ----------------------------------------------------

export async function saveBlogPost(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const categoryTag = formData.get("categoryTag") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 1;
    const file = formData.get("image") as File | null;

    let imageUrl = formData.get("existingImage") as string;

    if (file && file.size > 0) {
      imageUrl = await uploadFile(file);
    }

    if (id) {
      await prisma.blogPost.update({
        where: { id },
        data: { title, excerpt, categoryTag, sortOrder, imageUrl },
      });
    } else {
      await prisma.blogPost.create({
        data: { title, excerpt, categoryTag, sortOrder, imageUrl },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

// ----------------------------------------------------
// CTA SECTION ACTIONS
// ----------------------------------------------------

export async function saveCtaSection(formData: FormData) {
  try {
    const heading = formData.get("heading") as string;
    const subtext = formData.get("subtext") as string;
    const buttonText = formData.get("buttonText") as string;
    const file = formData.get("image") as File | null;

    let backgroundImageUrl = formData.get("existingImage") as string;

    if (file && file.size > 0) {
      backgroundImageUrl = await uploadFile(file);
    }

    await prisma.ctaSection.upsert({
      where: { id: "cta" },
      update: { heading, subtext, buttonText, backgroundImageUrl },
      create: { id: "cta", heading, subtext, buttonText, backgroundImageUrl },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
}
