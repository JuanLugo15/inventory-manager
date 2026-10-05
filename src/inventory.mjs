import { readFile, writeFile } from "node:fs/promises";

export class InventoryError extends Error {}
const nonNegative = (value, field) => { const number = Number(value); if (!Number.isFinite(number) || number < 0) throw new InventoryError(`${field} must be a non-negative number`); return number; };
const normalize = (input) => { const sku = String(input?.sku ?? "").trim().toUpperCase(); const name = String(input?.name ?? "").trim(); const category = String(input?.category ?? "General").trim() || "General"; if (!sku || !name) throw new InventoryError("sku and name are required"); return { sku, name, category, price: nonNegative(input.price, "price"), stock: nonNegative(input.stock, "stock"), minStock: nonNegative(input.minStock ?? 0, "minStock") }; };

export class Inventory {
  #products = new Map();
  constructor(products = []) { products.forEach((product) => this.addProduct(product)); }
  addProduct(input) { const product = normalize(input); if (this.#products.has(product.sku)) throw new InventoryError(`sku already exists: ${product.sku}`); this.#products.set(product.sku, product); return { ...product }; }
  getProduct(sku) { const product = this.#products.get(String(sku).trim().toUpperCase()); return product ? { ...product } : null; }
  listProducts() { return [...this.#products.values()].map((product) => ({ ...product })).sort((a, b) => a.name.localeCompare(b.name)); }
  search(query) { const term = String(query ?? "").trim().toLowerCase(); if (!term) return this.listProducts(); return this.listProducts().filter((product) => [product.sku, product.name, product.category].some((value) => value.toLowerCase().includes(term))); }
  adjustStock(sku, delta) { const key = String(sku).trim().toUpperCase(); const product = this.#products.get(key); if (!product) throw new InventoryError(`product not found: ${key}`); const amount = Number(delta); if (!Number.isInteger(amount) || amount === 0) throw new InventoryError("stock change must be a non-zero integer"); if (product.stock + amount < 0) throw new InventoryError("stock cannot become negative"); product.stock += amount; return { ...product }; }
  lowStock() { return this.listProducts().filter((product) => product.stock <= product.minStock); }
  totalValue() { return this.listProducts().reduce((total, product) => total + product.price * product.stock, 0); }
}

export async function loadInventory(filePath) { return new Inventory(JSON.parse(await readFile(filePath, "utf8"))); }
export async function saveInventory(inventory, filePath) { await writeFile(filePath, `${JSON.stringify(inventory.listProducts(), null, 2)}\n`, "utf8"); }
