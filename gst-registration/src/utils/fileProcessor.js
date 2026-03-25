/**
 * Utility for validating files: Size and Format checks
 * strictly for GST registration requirements.
 */

export const processImage = async (file, maxKb, forceJpeg = false) => {
  if (!file) return null;

  const fileSizeKb = file.size / 1024;
  
  // 1. Check Format if JPEG is required (Photos)
  if (forceJpeg && !file.type.match(/image\/jpe?g/)) {
    throw new Error("ONLY_JPEG");
  }

  // 2. Check Size
  if (fileSizeKb > maxKb) {
    throw new Error("FILE_TOO_LARGE");
  }

  // If valid, simply return the file as-is
  return file;
};

export const validateFileSize = (file, maxMb) => {
  if (!file) return true;
  return file.size <= maxMb * 1024 * 1024;
};

