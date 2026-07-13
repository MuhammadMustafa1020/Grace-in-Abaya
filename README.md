<![CDATA[<div align="center">

# ✨ Grace in Abaya

### AI-Powered Modest Fashion E-Commerce Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-blue?style=for-the-badge)](https://ai.google.dev/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-purple?style=for-the-badge)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#license)

*A full-stack e-commerce platform for modest fashion with AI-powered styling, outfit planning, and trend analysis — built with the MERN stack and Google Gemini AI.*

**BS Computer Science — Final Year Project | UET Peshawar**

---

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Screenshots](#-screenshots)

</div>

---

## 🎯 Features

### 🛒 E-Commerce Core
- **Product Catalog** — Browse 6 categories of abayas, hijabs, and accessories with advanced filtering, search, sorting & pagination
- **Shopping Cart** — Slide-out cart drawer with quantity controls and free shipping threshold (PKR 5,000+)
- **Secure Checkout** — Stripe payment integration with order tracking
- **Order Management** — Full order lifecycle: `pending` → `processing` → `shipped` → `delivered`
- **Product Reviews** — Authenticated users can rate and review products (duplicate prevention)

### 🤖 AI-Powered Features (Google Gemini)
- **Noor — AI Stylist Chatbot** — A warm, culturally-aware fashion assistant that helps with outfit recommendations, styling tips, and size guidance via a floating chat widget
- **Fashion Planner Agent** — A 3-step agentic AI pipeline that creates personalized outfit plans using real catalog products based on occasion, budget, season, and color preferences
- **Trend Miner** — Automated weekly trend report generation that identifies 7 seasonal modest fashion trends using AI analysis

### 👗 Wardrobe System
- **Personal Wardrobe** — Save and organize wardrobe items (from purchases or manually added)
- **AI Outfit Suggestions** — Get AI-powered outfit combinations from your existing wardrobe

### 🛡️ Admin Dashboard
- **Overview** — Revenue stats, order counts, low stock alerts, recent orders
- **Product Management** — Full CRUD with search, image URLs, color/size variants, tags
- **Order Management** — Filter by status, inline status updates, order details view

### 🔐 Authentication & Security
- JWT-based authentication with protected routes
- Password hashing with bcrypt
- Role-based access control (customer / admin)

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Document database (MongoDB Atlas) |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Stripe** | Payment processing |
| **Google Gemini AI** | Chatbot, trend mining, fashion agent |
| **node-cron** | Scheduled trend mining (weekly) |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **React Router v6** | Client-side routing |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Axios** | HTTP client with JWT interceptor |
| **Stripe React SDK** | Payment UI integration |

### Design System
| Token | Value | Usage |
|---|---|---|
| Rose | `#8B3252` | Primary brand color |
| Gold | `#C19A6B` | Accent / luxury color |
| Cream | `#FAF8F5` | Background |
| Mink | `#6B5B52` | Text color |
| Playfair Display | Serif | Headings |
| Nunito Sans | Sans-serif | Body text |

---

## 🏗 Architecture

```
┌─────────────────────────────────┐     ┌──────────────────────────────┐
│   Frontend (React + Vite)       │     │   External Services          │
│                                 │     │                              │
│  9 Pages · 7 Components        │────▶│  MongoDB Atlas (Database)    │
│  Auth & Cart Context            │     │  Google Gemini AI            │
│  Axios + JWT Interceptor        │     │  Stripe Payments             │
└───────────────┬─────────────────┘     └──────────────────────────────┘
                │ /api/* proxy                        ▲
                ▼                                     │
┌─────────────────────────────────┐                   │
│   Backend (Node.js + Express)   │───────────────────┘
│                                 │
│  7 Route Modules · 7 Controllers│
│  3 AI Services · JWT Middleware  │
│  6 Mongoose Models · Cron Jobs   │
└─────────────────────────────────┘
```

### Data Models
- **User** — name, email, hashed password, role (customer/admin), avatar, address
- **Product** — name, description, price, images, category, tags, colors, sizes, stock, embedded reviews
- **Order** — user ref, order items, shipping address, payment details, status lifecycle
- **WardrobeItem** — user's personal wardrobe items (from purchases or manual entry)
- **OutfitPlan** — AI-generated outfit plans with outfits, styling tips, budget advice
- **TrendReport** — seasonal trend reports with 7 trends per season

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Atlas** account (or local MongoDB instance)
- **Google Gemini API Key** — [Get one here](https://makersuite.google.com/app/apikey)
- **Stripe API Key** — [Get one here](https://dashboard.stripe.com/test/apikeys)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/grace-in-abaya.git
cd grace-in-abaya
```

### 2. Backend Setup

```bash
cd grace-in-abaya-backend/grace-in-abaya-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/grace-in-abaya
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

```bash
# Seed the database with sample products & admin user
npm run seed

# Start the backend server
npm run dev
```

> **Default Admin Credentials:** `admin@graceinabaya.com` / `Admin@123`

### 3. Frontend Setup

```bash
cd grace-in-abaya-frontend/grace-in-abaya-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to the backend at `http://localhost:5000`.

---

## 📡 API Reference

The backend exposes **24 REST API endpoints** across 7 route modules:

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login & get JWT token |
| `GET` | `/me` | 🔒 Private | Get current user profile |
| `PUT` | `/profile` | 🔒 Private | Update profile |

### Products — `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | List products (filter, search, paginate, sort) |
| `GET` | `/:id` | Public | Get single product |
| `POST` | `/` | 🔐 Admin | Create product |
| `PUT` | `/:id` | 🔐 Admin | Update product |
| `DELETE` | `/:id` | 🔐 Admin | Delete product |
| `POST` | `/:id/reviews` | 🔒 Private | Add product review |

### Orders — `/api/orders`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | 🔒 Private | Create order + Stripe PaymentIntent |
| `POST` | `/:id/confirm-payment` | 🔒 Private | Confirm payment |
| `GET` | `/my` | 🔒 Private | Get user's orders |
| `GET` | `/` | 🔐 Admin | Get all orders |
| `PUT` | `/:id/status` | 🔐 Admin | Update order status |

### Chatbot — `/api/chatbot`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/chat` | 🔒 Private | Chat with AI stylist "Noor" |

### Wardrobe — `/api/wardrobe`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | 🔒 Private | Get wardrobe items |
| `POST` | `/` | 🔒 Private | Add wardrobe item |
| `DELETE` | `/:id` | 🔒 Private | Remove wardrobe item |
| `POST` | `/suggest` | 🔒 Private | AI outfit suggestion |

### Trends — `/api/trends`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | Get latest trend report |
| `POST` | `/mine` | 🔐 Admin | Trigger AI trend mining |

### Fashion Agent — `/api/fashion-agent`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/plan` | 🔒 Private | Create AI outfit plan |
| `GET` | `/plans` | 🔒 Private | Get user's saved plans |
| `DELETE` | `/plans/:id` | 🔒 Private | Delete a plan |

> **Auth Legend:** Public = No auth · 🔒 Private = JWT required · 🔐 Admin = JWT + admin role required

---

## 📂 Project Structure

```
grace-in-abaya/
│
├── grace-in-abaya-backend/
│   └── grace-in-abaya-backend/
│       ├── server.js                 # Express entry point + cron setup
│       ├── seed.js                   # Database seeder (16 products + admin)
│       ├── package.json
│       ├── config/
│       │   └── db.js                 # MongoDB connection
│       ├── middleware/
│       │   └── auth.js               # JWT authentication + admin guard
│       ├── models/
│       │   ├── User.js               # User schema + password hashing
│       │   ├── Product.js            # Product + embedded reviews
│       │   ├── Order.js              # Order + embedded items
│       │   ├── WardrobeItem.js       # Personal wardrobe items
│       │   ├── OutfitPlan.js         # AI outfit plans
│       │   └── TrendReport.js        # Seasonal trend reports
│       ├── routes/                   # 7 Express route modules
│       ├── controllers/              # 7 controller files
│       └── services/
│           ├── chatbot.service.js    # Gemini chatbot ("Noor")
│           ├── fashionAgent.service.js  # 3-step outfit planner
│           └── trendMiner.service.js # Seasonal trend mining
│
├── grace-in-abaya-frontend/
│   └── grace-in-abaya-frontend/
│       ├── index.html                # Entry HTML with Google Fonts
│       ├── package.json
│       ├── vite.config.js            # Vite config + API proxy
│       ├── tailwind.config.js        # Custom design tokens
│       ├── postcss.config.js
│       └── src/
│           ├── main.jsx              # React root with providers
│           ├── App.jsx               # Router + layout
│           ├── index.css             # Tailwind + custom components
│           ├── api/
│           │   └── api.js            # Axios instance + JWT interceptor
│           ├── context/
│           │   ├── AuthContext.jsx    # Auth state management
│           │   └── CartContext.jsx    # Cart state management
│           ├── components/           # 7 reusable components
│           │   ├── Navbar.jsx
│           │   ├── Footer.jsx
│           │   ├── AuthModal.jsx
│           │   ├── CartDrawer.jsx
│           │   ├── ChatbotWidget.jsx
│           │   ├── ProductCard.jsx
│           │   └── AdminRoute.jsx
│           └── pages/                # 9 page components
│               ├── HomePage.jsx
│               ├── ProductsPage.jsx
│               ├── ProductDetailPage.jsx
│               ├── CheckoutPage.jsx
│               ├── OrdersPage.jsx
│               ├── WardrobePage.jsx
│               ├── TrendsPage.jsx
│               ├── FashionAgentPage.jsx
│               └── AdminPage.jsx
│
└── README.md
```

---

## 🎨 Product Categories

| Category | Description |
|----------|-------------|
| `abaya-casual` | Everyday abayas |
| `abaya-designer` | Luxury & bridal abayas |
| `abaya-handmade` | Artisan crafted abayas |
| `abaya-fashion` | Trendy, fashion-forward abayas |
| `hijab` | Shaylas, wraps, undercaps |
| `accessory` | Pins, brooches, bags |

---

## 🔑 Environment Variables

### Backend (`grace-in-abaya-backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for modest fashion**

*Grace in Abaya — Where tradition meets technology*

</div>
]]>
