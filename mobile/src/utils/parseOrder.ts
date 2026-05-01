// Parse order items utility

/**
 * Parse items từ JSON string (trong orders table)
 * @param {string} itemsStr - Chuỗi JSON items
 * @returns {Array} Mảng items đã parse
 */
export function parseItems(itemsStr: string): Array<{name?: string; price?: number; quantity?: number}> {
  try {
    return JSON.parse(itemsStr);
  } catch {
    return [];
  }
}

/**
 * Tính tổng tiền đơn hàng
 * @param {string|Array} items - items string hoặc array
 * @returns {number} Tổng tiền
 */
export function calculateOrderTotal(items: string | Array<{price?: number; quantity?: number}>): number {
  let parsedItems = items;
  if (typeof items === 'string') {
    parsedItems = parseItems(items);
  }
  if (!Array.isArray(parsedItems)) return 0;
  return parsedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
}

/**
 * Statuses và labels
 */
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền'
};

export function getStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] || status;
}

export default parseItems;
