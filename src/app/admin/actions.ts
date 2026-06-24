"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/upload";

async function getUploadedUrl(
  formData: FormData,
  fieldName: string,
  existingUrl: string,
): Promise<string> {
  const file = formData.get(fieldName);
  if (file && file instanceof File && file.size > 0) {
    return await uploadFile(file);
  }
  return existingUrl;
}

// ─── About ───────────────────────────────────────────────────────────────────

export async function saveAboutSection(formData: FormData) {
  try {
    const image1Url = await getUploadedUrl(
      formData,
      "image1",
      formData.get("existingImage1") as string,
    );
    const image2Url = await getUploadedUrl(
      formData,
      "image2",
      formData.get("existingImage2") as string,
    );

    await prisma.aboutSection.upsert({
      where: { id: "about" },
      update: {
        label: formData.get("label") as string,
        heading: formData.get("heading") as string,
        paragraph: formData.get("paragraph") as string,
        image1Url,
        image2Url,
        buttonText: formData.get("buttonText") as string,
      },
      create: {
        id: "about",
        label: formData.get("label") as string,
        heading: formData.get("heading") as string,
        paragraph: formData.get("paragraph") as string,
        image1Url,
        image2Url,
        buttonText: formData.get("buttonText") as string,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ─── Hero Slides ─────────────────────────────────────────────────────────────

export async function saveHeroSlide(formData: FormData) {
  try {
    const backgroundImageUrl = await getUploadedUrl(
      formData,
      "image",
      formData.get("existingImage") as string,
    );

    const data = {
      label: formData.get("label") as string,
      heading: formData.get("heading") as string,
      buttonText: formData.get("buttonText") as string,
      backgroundImageUrl,
      slideOrder: Number(formData.get("slideOrder")),
    };

    const id = formData.get("id");
    if (id) {
      await prisma.heroContent.update({ where: { id: id as string }, data });
    } else {
      await prisma.heroContent.create({ data });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteHeroSlide(id: string) {
  try {
    await prisma.heroContent.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ─── Services ────────────────────────────────────────────────────────────────

export async function saveService(formData: FormData) {
  try {
    const data = {
      iconName: formData.get("iconName") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      sortOrder: Number(formData.get("sortOrder")),
    };

    const id = formData.get("id");
    if (id) {
      await prisma.service.update({ where: { id: id as string }, data });
    } else {
      await prisma.service.create({ data });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function saveProject(formData: FormData) {
  try {
    const imageUrl = await getUploadedUrl(
      formData,
      "image",
      formData.get("existingImage") as string,
    );

    const data = {
      title: formData.get("title") as string,
      categoryLabel: formData.get("categoryLabel") as string,
      imageUrl,
      sortOrder: Number(formData.get("sortOrder")),
    };

    const id = formData.get("id");
    if (id) {
      await prisma.project.update({ where: { id: id as string }, data });
    } else {
      await prisma.project.create({ data });
    }

    revalidatePath("/projects", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ─── Blog Posts ──────────────────────────────────────────────────────────────

export async function saveBlogPost(formData: FormData) {
  try {
    const imageUrl = await getUploadedUrl(
      formData,
      "image",
      formData.get("existingImage") as string,
    );

    const data = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      imageUrl,
      categoryTag: formData.get("categoryTag") as string,
      sortOrder: Number(formData.get("sortOrder")),
    };

    const id = formData.get("id");
    if (id) {
      await prisma.blogPost.update({ where: { id: id as string }, data });
    } else {
      await prisma.blogPost.create({ data });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

export async function saveCtaSection(formData: FormData) {
  try {
    const backgroundImageUrl = await getUploadedUrl(
      formData,
      "image",
      formData.get("existingImage") as string,
    );

    await prisma.ctaSection.upsert({
      where: { id: "cta" },
      update: {
        heading: formData.get("heading") as string,
        subtext: formData.get("subtext") as string,
        buttonText: formData.get("buttonText") as string,
        backgroundImageUrl,
      },
      create: {
        id: "cta",
        heading: formData.get("heading") as string,
        subtext: formData.get("subtext") as string,
        buttonText: formData.get("buttonText") as string,
        backgroundImageUrl,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
