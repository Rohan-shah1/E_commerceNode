# E-commerce Backend API

A complete, production-ready RESTful backend built for Phase 1-8 coursework utilizing the MERN stack architecture (Node.js, Express, MongoDB).

## 🚀 Features
- **MVC Architecture** with decoupled routes, controllers, and services (Models).
- **Advanced Auth/Authorization** using JWT Bearer tokens and specific Role-Based Access Control (`authorize('admin')`).
- **Data Filtering & Sorting** utilizing a custom `APIFeatures` adapter for rich product querying (`?page=1&limit=5&sort=-price`).
- **Security Protocols** implemented globally via Helmet (Headers), simple Request sanitization (xss-clean), and DDoS protection via express-rate-limit.
- **Custom Logging & Traceability** generating unique request UUIDs mapped into tracking interceptors and physical `access.log` exports.

## 🛠 Setup & Installation

1. Ensure MongoDB is running locally.
2. Install repository packages:
   ```bash
   npm install
   ```
3. Establish your `.env` variables locally:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_assignment
   JWT_SECRET=supersecretjwtkey12345
   JWT_EXPIRE=15m
   JWT_REFRESH_SECRET=anothersupersecretrefreshkey
   JWT_REFRESH_EXPIRE=7d
   ```
4. Start the development server using nodemon:
   ```bash
   npm run dev
   ```

## ☁️ Deployment Guides (Render / Railway)

1. Initialize a Git repository locally if you haven't and commit the files.
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Phase 8 Deployment"
   ```
2. Push your source code up to an empty GitHub repository.
3. Login to **Render or Railway** and configure a 'New Web Service'.
4. Hook Render to your new GitHub repository.
5. Provide the start commands:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Enter all **Environment Variables** (`MONGO_URI`, `JWT_SECRET`, etc.) defined previously into the Platform's Secret Configuration pane. Note that Cloud providers usually dictate `PORT`, so it may be omitted.

## 🧪 Postman API Testing (Phase 7)
Simply point your collections to `http://localhost:5000/api/v1/auth/register` to generate your first user and snag the JWT Bearer token needed for Authorization tabs.
