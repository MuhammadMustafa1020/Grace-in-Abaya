# Grace in Abaya — Frontend

React + Tailwind CSS e-commerce frontend for the AI-powered modest fashion platform.

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:5173
# Backend must be running at http://localhost:5000
```

## Pages
| Route              | Page               | Auth Required |
|--------------------|--------------------|---------------|
| `/`                | Home               | No            |
| `/products`        | Product Listing    | No            |
| `/products/:id`    | Product Detail     | No (review: Yes) |
| `/checkout`        | Checkout           | Yes           |
| `/orders`          | My Orders          | Yes           |
| `/wardrobe`        | Smart Wardrobe     | Yes           |

## Key Features
- **Chatbot (Noor)** — floating button, bottom-right, powered by Anthropic Claude API
- **Cart Drawer** — slides in from the right, full cart management
- **Auth Modal** — login/register with JWT, persisted across sessions
- **Wardrobe** — add items manually, get AI outfit suggestions for occasions
- **Category Filtering** — sidebar + URL params, works with React Router

## Tech Stack
- React 18 + React Router v6
- Tailwind CSS (custom rose/gold/cream palette)
- Axios (with JWT interceptor)
- Vite (dev server with proxy to backend on :5000)

## Folder Structure
```
src/
├── api/api.js            — Axios instance with JWT
├── context/
│   ├── AuthContext.jsx   — User auth state
│   └── CartContext.jsx   — Cart state
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CartDrawer.jsx
│   ├── AuthModal.jsx
│   └── ChatbotWidget.jsx — Noor AI stylist chat
└── pages/
    ├── HomePage.jsx
    ├── ProductsPage.jsx
    ├── ProductDetailPage.jsx
    ├── OrdersPage.jsx
    ├── WardrobePage.jsx
    └── CheckoutPage.jsx
```
