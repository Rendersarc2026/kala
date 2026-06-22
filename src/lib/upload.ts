import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseBucketName = process.env.SUPABASE_BUCKET_NAME || "kala Images";

// Initialize Supabase Client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});

/**
 * Saves a file to the Supabase Storage bucket.
 * Returns the public URL path for the file.
 */
export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Clean the file name and append timestamp for uniqueness
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${Date.now()}-${sanitizedName}`;
  const filePath = `uploads/${filename}`;

  // Upload file buffer to Supabase Storage
  const { error } = await supabase.storage
    .from(supabaseBucketName)
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage Error:", error);
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  // Get the public URL of the uploaded file
  const { data: urlData } = supabase.storage
    .from(supabaseBucketName)
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error("Failed to retrieve public URL from Supabase Storage");
  }

  return urlData.publicUrl;
}
