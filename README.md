# 📚 BookCart — Modern MERN Stack Online Bookstore

![BookCart Banner](https://images.unsplash.com/photo-1507842229451-7f01be637b52?auto=format&fit=crop&q=80&w=1200)

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Redux%20Toolkit-2.0-764abc?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas%20Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

---

## 🌟 Overview

**BookCart** is a full-stack e-commerce web application engineered with the **MERN Stack** (MongoDB Atlas, Express.js, React 18, Node.js) and styled with **Tailwind CSS**. It delivers a high-performance shopping experience with dynamic pricing (₹59 to ₹199), 1-Click Instant Payment & Cash on Delivery (COD), comprehensive Admin ERP capabilities, live search & multi-faceted filtering, customer review lifecycles, and a responsive Dark / Light mode UI with Electric Neon Orange accents.

---

## ✨ Key Features

### 🛒 Customer Storefront
- **Electric Neon Orange Design System**: Dynamic dark & light mode support with persistent user preferences.
- **Fast Catalog & Search**: Real-time debounce title/author/ISBN search, category filtering, price slider, and sorting (price low-to-high, high-to-low, top-rated, newest).
- **Book Details**: High-resolution image viewer with error fallbacks, discount calculations, stock indicators, and customer reviews.
- **Cart & Wishlist Management**: Dynamic subtotal, shipping fee waiver above ₹500, stepper quantity updates, and synchronized storage.
- **1-Click Streamlined Checkout**:
  - In-line address management with **⚡ 1-Click Address Autofill**.
  - **Instant Online Payment (Direct Confirmation)** & **Cash on Delivery (COD)** options.
  - Confetti celebration receipt with live shipment lifecycle tracking (`Order Placed` ➔ `Packing in Warehouse` ➔ `Out for Delivery` ➔ `Delivered`).
- **User Dashboard**: Profile details editor, address book manager, and detailed past order receipts.

### 👑 Administrator Dashboard (`/admin/dashboard`)
- **Real-Time Analytics**: Total store revenue, total orders count, inventory status, low-stock alerts, and user registrations.
- **Inventory & Book Management**: Add new titles with custom cover uploads, edit details, update pricing, and adjust warehouse stock.
- **Order Lifecycle Fulfillment**: View all customer orders, filter by status, update shipment tracking stages, and cancel orders with auto-restocking.
- **Category & Review Moderation**: Organize genres and moderate customer reviews.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Redux Toolkit, React Router v6, Lucide Icons, Canvas Confetti, React Hot Toast |
| **Styling** | Tailwind CSS v3.4, Google Fonts (*Plus Jakarta Sans*, *Merriweather*), Neon Orange Palette |
| **Build Tool** | Vite 5.4 |
| **Backend** | Node.js (ES Modules), Express.js |
| **Database** | MongoDB Atlas Cloud Database with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) in HTTP Headers + bcryptjs password hashing |
| **File Uploads** | Multer disk storage for book cover assets |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** database cluster (or local MongoDB)

### 2. Clone the Repository
```bash
git clone https://github.com/prathamshahi1/BookCart.git
cd BookCart
```

### 3. Server Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (reference `server/.env.example`):
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

Seed initial books, categories, and demo accounts:
```bash
node seeder.js
```

Start the backend API server:
```bash
npm run dev
```

### 4. Client Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `prathamm0001@gmail.com` | `Pratham@05` |
| **Customer** | `user@bookcart.com` | `User@123` |

*(1-Click Demo autofill buttons are available on the [Login page](http://localhost:3000/login))*

---

## 📁 Project Architecture

```
BookCart/
├── client/                      # Frontend Application (React + Vite)
│   ├── public/                  # Static assets & favicon.svg
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, BookCard, Loader, ErrorBoundary)
│   │   ├── context/             # ThemeContext (Dark/Light mode)
│   │   ├── pages/               # Views (Home, Books, BookDetails, Cart, Checkout, Orders, Admin)
│   │   ├── redux/               # Redux Toolkit Store & Slices (auth, cart, order, books, wishlist)
│   │   ├── services/            # Axios API client with auto-session interceptors
│   │   ├── App.jsx              # Main App routing & layout
│   │   └── main.jsx             # React DOM entry point
│   └── package.json
│
├── server/                      # Backend API (Node.js + Express)
│   ├── config/                  # MongoDB database connection
│   ├── controllers/            # Route controllers (auth, books, cart, orders, payment, admin)
│   ├── middleware/             # JWT auth & error handling middlewares
│   ├── models/                 # Mongoose schemas (User, Book, Category, Order, Cart, Review)
│   ├── routes/                 # Express API routes
│   ├── uploads/                # Uploaded book cover images
│   ├── seeder.js               # Database population script
│   ├── server.js               # Express application entry
│   └── package.json
│
├── .gitignore                   # Ignored files & secrets
├── package.json                 # Monorepo scripts
└── README.md                    # Project documentation
```

---

## 📄 License

This project is open source and available under the **MIT License**.
