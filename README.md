# 🛍️ Baskit - An E-Commerce Store (MERN Stack)

![Baskit Banner](/frontend/public/Baskit%20Banner.png)

**Baskit** is a robust, full-stack e-commerce platform built using the **MERN** stack, tailored for premium fashion and wearables. Designed with clean architecture, modular scalability, and secure transaction flows, it demonstrates production-ready practices such as session management with Redis, token-based authentication, third-party payment integration, and dynamic content delivery via Cloudinary.

This project is ideal for demonstrating backend design, RESTful API development, secure payments integration, scalable state management, and CI-ready application structure—making it a solid fit for internship roles at product-based companies like **Meta**, **Amazon**, **Google**, **Microsoft**, **Netflix**, and high-growth startups.

---

## 🧰 Tech Stack & Tools

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=JSON%20web%20tokens\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge\&logo=stripe\&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge\&logo=cloudinary\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge\&logo=axios\&logoColor=white)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge\&logo=nodemon\&logoColor=white)
![Dotenv](https://img.shields.io/badge/Dotenv-000000?style=for-the-badge\&logo=dotenv\&logoColor=white)
![React Hot Toast](https://img.shields.io/badge/HotToast-FF6B6B?style=for-the-badge)
![Lucide React](https://img.shields.io/badge/Lucide-000000?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232a?style=for-the-badge\&logo=react\&logoColor=61dafb)
![React Router](https://img.shields.io/badge/React--Router-CA4245?style=for-the-badge\&logo=reactrouter\&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-EF4A82?style=for-the-badge\&logo=framer\&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge)
![React Confetti](https://img.shields.io/badge/React--Confetti-FFB800?style=for-the-badge)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735?style=for-the-badge\&logo=postcss\&logoColor=white)

---

## 🚀 Features

* 🛒 Fully functional e-commerce backend
* 🔐 Secure login/register with JWT access & refresh tokens
* 📦 Cart & order APIs with quantity-based logic
* 💳 Stripe payment gateway integration
* 📸 Image handling via Cloudinary
* ⚙️ Admin dashboard for analytics & control
* 📊 Dynamic revenue/metrics visualization using charts
* 🧠 Redis-based session and token management

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
UPSTASH_REDIS_URL=your_upstash_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUNDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUNDINARY_API_KEY=your_cloudinary_api_key
CLOUNDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret

CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## 💻 Running Locally

### 📥 Step-by-Step Guide

```bash
git clone https://github.com/CodeCenturian/Baskit.git
cd Baskit
npm install
```

* Setup the `.env` file with correct values
* Start backend server:

```bash
npm run dev
```

> Your backend will now be running on `http://localhost:5000`

---

## ☁️ Deployment

### 🔧 Backend

Deploy on [Render](https://render.com/), [Railway](https://railway.app/), or [Vercel Serverless](https://vercel.com/):

* Set environment variables from `.env`
* Build command: `npm install`
* Start command: `npm run start`

### 🎯 Frontend

Deploy using:

* [Vercel](https://vercel.com/)
* [Netlify](https://netlify.com/)

Set environment:

```env
REACT_APP_API_URL=https://your-deployed-api-url.com
```

---

## 📚 API Reference

### 🔐 Auth

```http
POST /api/auth/register     // Register
POST /api/auth/login        // Login (Returns tokens)
GET  /api/auth/profile      // Get current user
```

### 🛍️ Products

```http
GET    /api/products         // All products
GET    /api/products/:id     // Single product
POST   /api/products         // Add (admin)
PUT    /api/products/:id     // Edit (admin)
DELETE /api/products/:id     // Delete (admin)
```

### 🧺 Cart

```http
POST   /api/cart/add         // Add to cart
GET    /api/cart             // User cart
DELETE /api/cart/:itemId     // Remove item
```

### 💳 Checkout

```http
POST /api/checkout/stripe    // Create Stripe checkout session
```

---



> This project displays hands-on experience with real-world backend challenges, such as:

* **Authentication Flows** (Access/Refresh tokens using JWT)
* **State Management** (Cart & Orders)
* **Cloud & CDN Use** (Cloudinary & Redis)
* **Third-Party Payments** (Stripe Checkout)
* **Modular Codebase** (Easy for scaling/microservices)
* **Frontend UX Enhancements** (via animations, toasts, visual analytics)

💡 Add a CI pipeline, testing framework like Jest or Vitest, and logging (e.g. Winston) for an even stronger resume-ready showcase.

---

## 🤝 Contributing

Contributions are welcome! Want to add wishlist, reviews, advanced analytics, or integrate AI-driven recommendations? Fork, feature-branch, and PR away.

---

## 📄 License

MIT © CodeCenturian

---

## 📬 Contact

* 📧 Email: [ashutoshkumariiitb@gmail.com](mailto:ashutoshkumariiitb@gmail.com)


---


