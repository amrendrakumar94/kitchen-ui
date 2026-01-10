# Orders API Specification

## Overview
This document specifies the backend API endpoints required for the order management feature in the Indian Kitchen application.

---

## API Endpoints

### 1. Place Order (Create Order from Cart)

**Endpoint:** `POST /api/orders/place`

**Authentication:** Required (JWT Token)

**Request Body:**
```json
{
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "specialInstructions": "Please ring the doorbell"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD-2024-001234",
    "orderNumber": "001234",
    "orderDate": "2024-01-10T14:30:00Z",
    "estimatedDelivery": "2024-01-10T15:30:00Z",
    "status": "pending",
    "items": [
      {
        "productId": 1,
        "productName": "Chicken Biryani",
        "quantity": 2,
        "price": 350,
        "image": "https://example.com/images/chicken-biryani.jpg"
      }
    ],
    "summary": {
      "subtotal": 700,
      "tax": 63,
      "deliveryCharge": 40,
      "discount": 0,
      "total": 803
    }
  }
}
```

---

### 2. Get All Orders (Order History)

**Endpoint:** `GET /api/orders`

**Authentication:** Required (JWT Token)

**Query Parameters:**
- `page` (optional, default: 1)
- `pageSize` (optional, default: 10)
- `status` (optional) - Filter by status

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "orderId": "ORD-2024-001234",
        "orderNumber": "001234",
        "orderDate": "2024-01-10T14:30:00Z",
        "status": "delivered",
        "itemCount": 3,
        "total": 803,
        "items": [
          {
            "productId": 1,
            "productName": "Chicken Biryani",
            "quantity": 2,
            "price": 350,
            "image": "https://example.com/images/chicken-biryani.jpg"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalPages": 5,
      "totalItems": 48
    }
  }
}
```

---

### 3. Get Order Details

**Endpoint:** `GET /api/orders/{orderId}`

**Authentication:** Required (JWT Token)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "orderId": "ORD-2024-001234",
    "orderNumber": "001234",
    "orderDate": "2024-01-10T14:30:00Z",
    "status": "delivered",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-10T14:30:00Z",
        "note": "Order placed"
      },
      {
        "status": "delivered",
        "timestamp": "2024-01-10T15:45:00Z",
        "note": "Order delivered"
      }
    ],
    "items": [
      {
        "productId": 1,
        "productName": "Chicken Biryani",
        "quantity": 2,
        "price": 350,
        "image": "https://example.com/images/chicken-biryani.jpg"
      }
    ],
    "summary": {
      "subtotal": 700,
      "tax": 63,
      "deliveryCharge": 40,
      "total": 803
    },
    "deliveryAddress": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "phone": "9876543210"
    },
    "paymentMethod": "COD",
    "paymentStatus": "paid"
  }
}
```

---

### 4. Cancel Order

**Endpoint:** `PUT /api/orders/{orderId}/cancel`

**Authentication:** Required (JWT Token)

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Order cancelled successfully"
}
```

---

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```
