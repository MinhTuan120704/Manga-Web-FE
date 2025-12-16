/**
 * Parse và format error messages từ API thành thông báo thân thiện với người dùng
 */

interface ParsedError {
  message: string;
  suggestion?: string;
  retryAfter?: number;
}

export const parseAIError = (error: unknown): ParsedError => {
  const errorMessage = (error as Error)?.message || String(error);

  // Rate limit / Quota exceeded error
  if (
    errorMessage.includes("429") ||
    errorMessage.includes("Too Many Requests") ||
    errorMessage.includes("Quota exceeded") ||
    errorMessage.includes("quota")
  ) {
    // Try to extract retry time
    const retryMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)/i);
    const retrySeconds = retryMatch
      ? Math.ceil(parseFloat(retryMatch[1]))
      : null;

    return {
      message: "Dịch vụ AI đang quá tải",
      suggestion: retrySeconds
        ? `Vui lòng thử lại sau ${retrySeconds} giây.`
        : "Vui lòng thử lại sau ít phút.",
      retryAfter: retrySeconds ?? undefined,
    };
  }

  // Timeout error
  if (
    errorMessage.includes("timeout") ||
    errorMessage.includes("ECONNABORTED")
  ) {
    return {
      message: "Yêu cầu mất quá nhiều thời gian",
      suggestion: "Thử lại với mô tả ngắn gọn hơn hoặc kiểm tra kết nối mạng.",
    };
  }

  // Network error
  if (
    errorMessage.includes("Network Error") ||
    errorMessage.includes("ERR_NETWORK") ||
    errorMessage.includes("Không thể kết nối")
  ) {
    return {
      message: "Không thể kết nối đến server",
      suggestion: "Vui lòng kiểm tra kết nối mạng và thử lại.",
    };
  }

  // Authentication error
  if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
    return {
      message: "Phiên đăng nhập đã hết hạn",
      suggestion: "Vui lòng đăng nhập lại để tiếp tục.",
    };
  }

  // Validation error
  if (
    errorMessage.includes("validation") ||
    errorMessage.includes("invalid") ||
    errorMessage.includes("Mô tả")
  ) {
    return {
      message: errorMessage,
      suggestion: "Hãy kiểm tra lại mô tả và thử lại.",
    };
  }

  // Server error
  if (
    errorMessage.includes("500") ||
    errorMessage.includes("Internal Server Error")
  ) {
    return {
      message: "Server đang gặp sự cố",
      suggestion: "Vui lòng thử lại sau ít phút.",
    };
  }

  // Generic AI error
  if (errorMessage.includes("Failed to generate")) {
    return {
      message: "AI không thể tạo đề xuất",
      suggestion: "Thử mô tả rõ ràng hơn hoặc thử lại sau.",
    };
  }

  // Default: return simplified message
  // If message is too long (>200 chars), simplify it
  if (errorMessage.length > 200) {
    return {
      message: "Không thể tạo đề xuất truyện",
      suggestion:
        "Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu lỗi tiếp tục xảy ra.",
    };
  }

  return {
    message: errorMessage,
    suggestion: "Vui lòng thử lại sau.",
  };
};
