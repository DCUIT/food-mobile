// Format utility - thống nhất 1 nơi

/**
 * Format giá tiền theo định dạng Việt Nam
 * @param {number} price - Giá tiền
 * @returns {string} Chuỗi đã format
 */
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null) {
    return '0đ';
  }
  return Number(price).toLocaleString('vi-VN') + 'đ';
}

/**
 * Format giá tiền theo kiểu currency (VND)
 * @param {number} price - Giá tiền  
 * @returns {string} Chuỗi đã format với định dạng currency
 */
export function formatCurrency(price: number | undefined | null): string {
  if (price === undefined || price === null) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0);
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

/**
 * Tính tổng tiền giỏ hàng
 * @param {Array} items - Mảng items [{price, quantity}, ...]
 * @returns {number} Tổng tiền
 */
export function calculateTotal(items: Array<{price?: number; quantity?: number}>): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
}

export default formatPrice;
