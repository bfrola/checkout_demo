# Checkout Demo

Simple Vite + React demo that implements a Facebook Commerce checkout landing page.

Features:
- Lists all URL parameters (shows multi-valued params)
- Parses the `products` param and lists product IDs and quantities (supports JSON or common `id:qty,id2:qty2` patterns)

Quick start

```bash
cd /workspaces/checkout_demo
npm install
npm run dev
```

Open the app in your browser (Vite prints the local URL). Try examples:

- `http://localhost:5173/?products=123:2,456:1&currency=USD`
- `http://localhost:5173/?products=%5B%7B%22id%22%3A%22123%22%2C%22quantity%22%3A2%7D%2C%7B%22id%22%3A%22456%22%2C%22quantity%22%3A1%7D%5D` (encoded JSON)
# checkout_demo