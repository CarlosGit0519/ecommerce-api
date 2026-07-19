export type CheckoutItem = {
  name: string;
  quantity: number;
  stockQuantity: number;
  unitPrice: number;
};

export function assertStockAvailable(items: CheckoutItem[]): void {
  for (const item of items) {
    if (item.quantity > item.stockQuantity) {
      throw new Error(`Insufficient stock for ${item.name}.`);
    }
  }
}

export function calculateOrderTotal(items: CheckoutItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}
