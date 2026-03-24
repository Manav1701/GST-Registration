/**
 * Utility for processing images: Compressing and Converting formats
 * primarily for GST registration requirements.
 */

export const processImage = async (file, maxKb, forceJpeg = false) => {
  if (!file) return null;

  // 1. If it's a PDF, we check size and optionally compress via backend
  if (file.type === "application/pdf") {
    const targetSizeBytes = maxKb * 1024;
    // If PDF is already small enough, return as is.
    if (file.size <= targetSizeBytes) return file;

    // Otherwise, try backend-aided compression
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "https://gst-fastapi-api-1.onrender.com";
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${apiBase}/api/compress-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend compression failed");

      const blob = await res.blob();
      const pct = (1 - (blob.size / file.size)) * 100;
      console.log(`
--- 📄 PDF OPTIMIZATION ---
Original: ${(file.size/1024/1024).toFixed(2)} MB (${(file.size/1024).toFixed(1)} KB)
Compressed: ${(blob.size/1024/1024).toFixed(2)} MB (${(blob.size/1024).toFixed(1)} KB)
REDUCTION: ${pct.toFixed(1)}%
--------------------------`);
      return new File([blob], file.name, { type: "application/pdf" });
    } catch (err) {
      console.error("PDF Compression failed, using original:", err);
      return file; // Fallback to original
    }
  }

  // 2. If it's an image, we process it
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // We use a helper function for iterative resizing to ensures it fits EXACTLY under maxKb
        const targetSizeBytes = maxKb * 1024;
        let quality = 0.9;
        let scale = 1.0;
        
        // Initial max dimension to save performance
        const MAX_INITIAL_DIM = 2400;
        if (img.width > MAX_INITIAL_DIM || img.height > MAX_INITIAL_DIM) {
          scale = Math.min(MAX_INITIAL_DIM / img.width, MAX_INITIAL_DIM / img.height);
        }

        const getResizedFile = (q, s) => {
          const canvas = document.createElement("canvas");
          const width = Math.floor(img.width * s);
          const height = Math.floor(img.height * s);
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          const mimeType = "image/jpeg"; // Always using JPEG for best size-to-quality ratio
          const dataUrl = canvas.toDataURL(mimeType, q);
          
          // Convert dataUrl (base64) back to a File object to check ACTUAL size
          const arr = dataUrl.split(",");
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          
          const ext = ".jpeg";
          const newFileName = file.name.replace(/\.[^/.]+$/, "") + ext;
          return new File([u8arr], newFileName, { type: mimeType });
        };

        let processedFile = getResizedFile(quality, scale);

        // --- Iterative Optimization Loop ---
        // We reduce quality first (down to 0.3)
        while (processedFile.size > targetSizeBytes && quality > 0.3) {
          quality -= 0.15;
          processedFile = getResizedFile(quality, scale);
        }

        // If still too big, we scale down dimensions (width/height) by 20% steps
        while (processedFile.size > targetSizeBytes && scale > 0.1) {
          scale *= 0.8;
          processedFile = getResizedFile(quality, scale);
        }

        const pct = (1 - (processedFile.size / file.size)) * 100;
        console.log(`
--- 🖼️ IMAGE OPTIMIZATION ---
Original: ${(file.size/1024/1024).toFixed(2)} MB (${(file.size/1024).toFixed(1)} KB)
Compressed: ${(processedFile.size/1024/1024).toFixed(2)} MB (${(processedFile.size/1024).toFixed(1)} KB)
REDUCTION: ${pct.toFixed(1)}%
-----------------------------`);
        resolve(processedFile);
      };
    };
  });
};

export const validateFileSize = (file, maxMb) => {
  if (!file) return true;
  return file.size <= maxMb * 1024 * 1024;
};
