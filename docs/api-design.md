# API Design Guidelines

## Response Envelope

All API responses use a standard envelope format:

```json
{
  "code": 200,
  "data": { ... },
  "message": "success"
}
```

Error responses:
```json
{
  "code": 400,
  "data": null,
  "message": "Validation failed: phone is required"
}
```

## Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer <accessToken>
```

Tokens are obtained via:
- `POST /api/auth/login` — returns `{ accessToken, refreshToken, user }`
- `POST /api/auth/register` — returns same
- `POST /api/auth/refresh` — refreshes access token

Token expiry: `accessToken` = 7 days, `refreshToken` = 30 days.

## Pagination

Paginated endpoints accept:
```
GET /api/products?page=1&pageSize=10
```

Response:
```json
{
  "code": 200,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

## Key Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login with phone + password |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/refresh` | Refresh access token |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (paginated, filterable) |
| GET | `/api/products/:id` | Get product detail |
| POST | `/api/products` | Create product (admin) |
| PATCH | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Cart
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add item to cart |
| PATCH | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove cart item |
| DELETE | `/api/cart` | Clear cart |

### Orders
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/orders` | List user orders (paginated) |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Get order detail |
| POST | `/api/orders/:id/pay` | Pay for order (mock) |
| POST | `/api/orders/:id/cancel` | Cancel order |
| POST | `/api/orders/:id/confirm` | Confirm receipt |

### Agent Service
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/chat/message` | Send chat message |

```json
POST /chat/message
{
  "session_id": "uuid",
  "message": "推荐一款手机",
  "agent_type": "recommendation"
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 500 | Internal server error |

## Swagger Documentation

API documentation is available at: `http://localhost:3000/api/docs`
