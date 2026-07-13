# Grace in Abaya — Backend API

AI-powered modest fashion e-commerce backend built with Node.js, Express, MongoDB, Stripe, and Anthropic Claude.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Stripe key, Anthropic key

# 3. Run in development
npm run dev

# 4. Run in production
npm start
```

## API Endpoints

### Auth  `/api/auth`
| Method | Endpoint       | Access  | Description           |
|--------|----------------|---------|-----------------------|
| POST   | /register      | Public  | Register new user     |
| POST   | /login         | Public  | Login, get JWT token  |
| GET    | /me            | Private | Get current user      |
| PUT    | /profile       | Private | Update profile        |

### Products  `/api/products`
| Method | Endpoint           | Access  | Description                          |
|--------|--------------------|---------|--------------------------------------|
| GET    | /                  | Public  | Get all products (filter/search/page)|
| GET    | /:id               | Public  | Get single product                   |
| POST   | /                  | Admin   | Create product                       |
| PUT    | /:id               | Admin   | Update product                       |
| DELETE | /:id               | Admin   | Delete product                       |
| POST   | /:id/reviews       | Private | Add review                           |

**Query params:** `category`, `search`, `minPrice`, `maxPrice`, `page`, `limit`, `sort`  
**Sort values:** `newest`, `price-asc`, `price-desc`, `rating`

### Orders  `/api/orders`
| Method | Endpoint              | Access  | Description                    |
|--------|-----------------------|---------|--------------------------------|
| POST   | /                     | Private | Create order + Stripe intent   |
| POST   | /:id/confirm-payment  | Private | Mark order as paid             |
| GET    | /my                   | Private | Get my orders                  |
| GET    | /                     | Admin   | Get all orders                 |
| PUT    | /:id/status           | Admin   | Update order status            |

**Order statuses:** `pending` → `processing` → `shipped` → `delivered` | `cancelled`

### Chatbot  `/api/chatbot`
| Method | Endpoint | Access  | Description                        |
|--------|----------|---------|------------------------------------|
| POST   | /chat    | Private | Send message to Noor (AI stylist)  |

**Request body:**
```json
{
  "history": [
    { "role": "user", "content": "What abaya should I wear for Eid?" }
  ]
}
```
The frontend maintains full conversation history and sends it with each request.

### Wardrobe  `/api/wardrobe`
| Method | Endpoint   | Access  | Description                       |
|--------|------------|---------|-----------------------------------|
| GET    | /          | Private | Get my wardrobe items             |
| POST   | /          | Private | Add item to wardrobe              |
| DELETE | /:id       | Private | Remove item from wardrobe         |
| POST   | /suggest   | Private | AI outfit suggestions from wardrobe|

**Suggest body:**
```json
{ "occasion": "Eid dinner", "season": "summer" }
```

## Authentication
All protected routes require:
```
Authorization: Bearer <jwt_token>
```

## Product Categories
- `abaya-casual`, `abaya-designer`, `abaya-handmade`, `abaya-fashion`
- `hijab`
- `accessory`

## Tech Stack
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Payments:** Stripe
- **AI Chatbot:** Anthropic Claude (claude-sonnet-4)
- **Deployment:** AWS / Heroku + MongoDB Atlas
