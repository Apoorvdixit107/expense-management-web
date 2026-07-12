const MAX_IMAGE_DIMENSION = 1600;
const MAX_IMAGE_BYTES = 2_500_000;
const MAX_PDF_BYTES = 4 * 1024 * 1024;
const JPEG_QUALITY = 0.88;
const MAX_SAFE_NAME = 80;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
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
  const mimeType = resolveAllowedMime(file);
  if (!mimeType) {
    throw new Error("Upload a JPG, PNG, WEBP, or PDF bill");
  }

  const header = await readFileHeader(file, 8);
  if (mimeType === "application/pdf") {
    if (file.size > MAX_PDF_BYTES) {
      throw new Error("PDF must be 4 MB or smaller");
    }
    if (!looksLikePdf(header)) {
      throw new Error("That file does not look like a valid PDF.");
    }
    const dataUrl = await readAsDataUrl(file);
    return {
      fileName: sanitizeFileName(file.name, "receipt.pdf"),
      mimeType,
      contentBase64: dataUrl,
      previewUrl: null,
    };
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be 8 MB or smaller");
  }
  if (!looksLikeImage(header, mimeType)) {
    throw new Error("That file does not look like a valid image.");
  }

  const dataUrl = await readAsDataUrl(file);
  const resized = await resizeImage(dataUrl, MAX_IMAGE_DIMENSION);
  if (resized.length > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large after compression. Try a clearer photo.");
  }

  return {
    fileName: sanitizeFileName(file.name, "receipt.jpg"),
    mimeType: "image/jpeg",
    contentBase64: resized,
    previewUrl: resized,
  };
}

/** Never default unknown types to JPEG — reject instead. */
function resolveAllowedMime(file: File): string | null {
  const type = file.type.toLowerCase();
  if (type === "image/jpg") return "image/jpeg";
  if (ALLOWED_TYPES.has(type)) return type;

  const lower = file.name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return null;
}

function sanitizeFileName(name: string, fallback: string): string {
  const base = name.split(/[/\\]/).pop() ?? fallback;
  const cleaned = base.replace(/[^\w.\- ()]/g, "_").slice(0, MAX_SAFE_NAME);
  return cleaned.trim() || fallback;
}

function readFileHeader(file: File, bytes: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      if (!(buffer instanceof ArrayBuffer)) {
        reject(new Error("Failed to read file"));
        return;
      }
      resolve(new Uint8Array(buffer));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file.slice(0, bytes));
  });
}

function looksLikePdf(header: Uint8Array): boolean {
  // %PDF-
  return (
    header.length >= 5 &&
    header[0] === 0x25 &&
    header[1] === 0x50 &&
    header[2] === 0x44 &&
    header[3] === 0x46 &&
    header[4] === 0x2d
  );
}

function looksLikeImage(header: Uint8Array, mimeType: string): boolean {
  if (header.length < 4) return false;
  // JPEG SOI
  if (mimeType === "image/jpeg") return header[0] === 0xff && header[1] === 0xd8;
  // PNG signature
  if (mimeType === "image/png") {
    return (
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47
    );
  }
  // WEBP: RIFF....WEBP
  if (mimeType === "image/webp") {
    return (
      header.length >= 4 &&
      header[0] === 0x52 &&
      header[1] === 0x49 &&
      header[2] === 0x46 &&
      header[3] === 0x46
    );
  }
  return false;
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
