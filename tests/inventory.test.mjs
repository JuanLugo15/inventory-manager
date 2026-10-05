import test from "node:test";
import assert from "node:assert/strict";
import { Inventory, InventoryError } from "../src/inventory.mjs";

function createInventory() {
  return new Inventory([{ sku: "A-1", name: "Apple", category: "Fruit", price: 2, stock: 10, minStock: 3 }]);
}

test("adds products and rejects duplicate SKUs", () => {
  const inventory = createInventory();
  assert.equal(inventory.getProduct("a-1").name, "Apple");
  assert.throws(() => inventory.addProduct({ sku: "A-1", name: "Other", price: 1, stock: 1 }), InventoryError);
});

test("stock changes cannot create negative inventory", () => {
  const inventory = createInventory();
  assert.equal(inventory.adjustStock("A-1", -4).stock, 6);
  assert.throws(() => inventory.adjustStock("A-1", -7), /negative/);
});

test("search, low-stock report, and valuation work together", () => {
  const inventory = createInventory();
  inventory.adjustStock("A-1", -7);
  assert.equal(inventory.search("fruit").length, 1);
  assert.equal(inventory.lowStock()[0].sku, "A-1");
  assert.equal(inventory.totalValue(), 6);
});
