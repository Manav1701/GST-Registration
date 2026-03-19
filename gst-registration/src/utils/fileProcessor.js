/**
 * Utility for processing images: Compressing and Converting formats
 * primarily for GST registration requirements.
 */

export const processImage = async (file, maxKb, forceJpeg = false) => {
  if (!file) return null;

  // 1. If it's a PDF, we don't compress (as per requirement), just return.
  if (file.type === "application/pdf") {
    return file;
  }

  // 2. If it's an image, we process it
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Optional: Downscale if image is extremely large (e.g. > 3000px)
        const MAX_DIM = 2400;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          } else {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output format
        // If forceJpeg is true (for photos), always use image/jpeg
        const mimeType = forceJpeg ? "image/jpeg" : "image/jpeg"; // Defaulting to jpeg for better compression

        // Initial quality
        let quality = 0.9;
        let dataUrl = canvas.toDataURL(mimeType, quality);
        
        // Loop to find the right quality to fit under maxKb
        // (Rough estimation: base64 size is ~1.33x actual file size)
        const targetSizeBytes = maxKb * 1024;
        
        while (dataUrl.length * 0.75 > targetSizeBytes && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL(mimeType, quality);
        }

        // Convert dataUrl back to File object
        const arr = dataUrl.split(",");
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + (forceJpeg ? ".jpg" : ".jpg");
        const processedFile = new File([u8arr], newFileName, { type: mimeType });
        
        console.log(`[FileProcessor] Original: ${(file.size/1024).toFixed(1)}KB, Processed: ${(processedFile.size/1024).toFixed(1)}KB`);
        resolve(processedFile);
      };
    };
  });
};

export const validateFileSize = (file, maxMb) => {
  if (!file) return true;
  return file.size <= maxMb * 1024 * 1024;
};
