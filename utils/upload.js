import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Uploads a file to the specified directory.
 * @param {File} file - The file object from request.formData()
 * @param {string} folderName - The subfolder within the base directory
 * @param {object} options - Validation options (maxSizeMB, allowedTypes)
 * @returns {Promise<string>} - The path to the uploaded file (relative to public for assets, or absolute/relative for private)
 */
export async function uploadImage(
  file,
  folderName,
  baseDir = "public/assets",
  options = {},
) {
  if (!file) return null;

  const {
    maxSizeMB = 10,
    allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ],
  } = options;

  // Validate File Size
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size exceeds the ${maxSizeMB}MB limit.`);
  }

  // Validate File Type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes
        .map((t) => t.split("/")[1] || t)
        .join(", ")}`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Sanitize filename: remove special characters, keep extension
  const extension = path.extname(file.name);
  const baseName = path.basename(file.name, extension)
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  
  const filename = `${Date.now()}_${baseName}${extension}`;

  // Ensure the directory exists
  const uploadDir = path.join(process.cwd(), baseDir, folderName);
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  // Return path suited for public access if in public/assets
  if (baseDir.startsWith("public/")) {
    // Remove "public" from the start to make it a URL path
    return `/${baseDir.replace("public/", "")}/${folderName}/${filename}`;
  }

  // For private files, return the relative path from root (or simple identifier)
  return `${baseDir}/${folderName}/${filename}`;
}
