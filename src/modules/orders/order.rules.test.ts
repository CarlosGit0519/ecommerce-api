import { describe, expect, it } from "vitest";

import { assertStockAvailable, calculateOrderTotal } from "./order.rules";

describe("order rules", () => {
  it("accepts items when stock is sufficient", () => {
    expect(() => assertStockAvailable([
      { name: "Headphones", quantity: 2, stockQuantity: 15, unitPrice: 79.99 },
    ])).not.toThrow();
  });

  it("rejects items when requested quantity exceeds stock", () => {
    expect(() => assertStockAvailable([
      { name: "Headphones", quantity: 16, stockQuantity: 15, unitPrice: 79.99 },
    ])).toThrow("Insufficient stock for Headphones.");
  });

  it("calculates the order total", () => {
    expect(calculateOrderTotal([
      { name: "Headphones", quantity: 2, stockQuantity: 15, unitPrice: 79.99 },
      { name: "Cable", quantity: 1, stockQuantity: 20, unitPrice: 9.5 },
    ])).toBeCloseTo(169.48);
  });
});
