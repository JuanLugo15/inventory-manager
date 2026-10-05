# Inventory Manager

Dependency-free inventory management application in Node.js. It focuses on the fundamentals behind a small business inventory workflow: CRUD, validation, stock movement, search, low-stock alerts, persistence, and reporting.

## Features

- Register products with SKU, category, price, stock, and minimum stock.
- Search by SKU, name, or category.
- Increase and decrease stock with validation against negative quantities.
- Low-stock report and total inventory valuation.
- JSON persistence using a repository boundary.
- Automated tests with Node's built-in test runner.

## Run

```bash
node --test --test-isolation=none tests/inventory.test.mjs
node src/cli.mjs list
node src/cli.mjs low-stock
node src/cli.mjs search cafe
```

## Structure

```text
src/inventory.mjs  Domain model and JSON repository functions
src/cli.mjs        Command-line interface
data/products.json Sample data for a small store
tests/             Tests for validation and stock rules
```
