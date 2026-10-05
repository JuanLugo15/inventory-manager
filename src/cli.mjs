import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadInventory } from "./inventory.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataPath = join(root, "data", "products.json");

function printProducts(products) {
  for (const product of products) console.log(`${product.sku} | ${product.name} | ${product.stock} units | $${product.price.toFixed(2)}`);
}

const [, , command, ...args] = process.argv;
const inventory = await loadInventory(dataPath);

if (command === "list") {
  printProducts(inventory.listProducts());
} else if (command === "low-stock") {
  printProducts(inventory.lowStock());
} else if (command === "search") {
  printProducts(inventory.search(args.join(" ")));
} else {
  console.log("Usage: node src/cli.mjs <list|low-stock|search> [query]");
}
