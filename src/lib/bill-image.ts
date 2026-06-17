const MAX_IMAGE_DIMENSION = 1600;
const MAX_IMAGE_BYTES = 2_500_000;
const MAX_PDF_BYTES = 4 * 1024 * 1024;
const JPEG_QUALITY = 0.88;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export function stripDataUrlPrefix(contentBase64: string): string {
  const trimmed = contentBase64.trim();
  if (!trimmed.startsWith("data:")) return trimmed.replace(/\s/g, "");
  const comma = trimmed.indexOf(",");
  if (comma < 0) return trimmed;
  return trimmed.substring(comma + 1).replace(/\s/g, "");
}

export type PreparedBillFile = {
  fileName: string;
  mimeType: string;
  contentBase64: string;
  previewUrl: string | null;
};

export async function prepareBillFile(file: File): Promise<PreparedBillFile> {
  const mimeType = normalizeMime(file);
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error("Upload a JPG, PNG, WEBP, or PDF bill");
  }

  if (mimeType === "application/pdf") {
    if (file.size > MAX_PDF_BYTES) {
      throw new Error("PDF must be 4 MB or smaller");
    }
    const dataUrl = await readAsDataUrl(file);
    return {
      fileName: file.name,
      mimeType,
      contentBase64: dataUrl,
      previewUrl: null,
    };
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be 8 MB or smaller");
  }

  const dataUrl = await readAsDataUrl(file);
  const resized = await resizeImage(dataUrl, MAX_IMAGE_DIMENSION);
  if (resized.length > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large after compression. Try a clearer photo.");
  }

  return {
    fileName: file.name,
    mimeType: "image/jpeg",
    contentBase64: resized,
    previewUrl: resized,
  };
}

function normalizeMime(file: File): string {
  const type = file.type.toLowerCase();
  if (type === "image/jpg") return "image/jpeg";
  if (type) return type;
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process image"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => reject(new Error("Invalid image file"));
    img.src = dataUrl;
  });
}
