/**
 * Helper functions for handling images
 */

/**
 * Kiểm tra xem URL có hợp lệ không
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Lấy placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 400): string => {
  // Sử dụng data URL cho placeholder thay vì external service
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='48' fill='%239ca3af'%3E📚%3C/text%3E%3C/svg%3E`;
};

/**
 * Xử lý image error và set placeholder
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;

  // Tránh infinite loop nếu placeholder cũng lỗi
  if (target.src.startsWith("data:image/svg+xml")) {
    return;
  }

  // Set placeholder
  target.src = getPlaceholderImage();
};

/**
 * Validate và clean image URL
 */
export const sanitizeImageUrl = (url: string | undefined | null): string => {
  if (!url) {
    return getPlaceholderImage();
  }

  // Nếu là relative URL, có thể cần thêm base URL
  if (url.startsWith("/")) {
    // TODO: Thêm base URL từ env nếu cần
    const baseUrl = import.meta.env.VITE_API_URL || "";
    return `${baseUrl}${url}`;
  }

  // Special handling for Cloudinary URLs
  try {
    const urlObj = new URL(url);
    const allowedCloudinaryHosts = [
      "res.cloudinary.com",
      "cloudinary.com"
    ];
    // Check if hostname is exactly an allowed cloudinary host or a subdomain.
    const hostname = urlObj.hostname;
    const isCloudinary = allowedCloudinaryHosts.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
    if (isCloudinary) {
      // Ensure HTTPS
      const secureUrl = url.replace(/^http:/, "https:");

      // Add Cloudinary transformations for optimization (optional)
      // Example: auto format, auto quality
      if (!secureUrl.includes("/upload/")) {
        return secureUrl;
      }

      // Insert transformations after /upload/
      // This helps with loading and can fix some CORS issues
      const transformed = secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");

      return transformed;
    }
  } catch (e) {
    // If URL parsing fails, proceed with fallback handling below
  }

  // Nếu không phải http/https, return placeholder
  if (!isValidImageUrl(url)) {
    return getPlaceholderImage();
  }

  return url;
};
