# TradeVista — Stock Trading Platform (Zerodha Clone)

TradeVista is a full-stack, MERN-based stock trading platform inspired by Zerodha Kite. It simulates real trading with virtual funds — including buying/selling stocks, tracking holdings and positions, order management, and a Razorpay-powered wallet system — backed by secure, session-based authentication.

This project consists of **three independent applications**:

| App | Description | Default Port |
|---|---|---|
| `backend` | Node.js/Express API server, MongoDB via Mongoose | `3002` |
| `dashboard` | React trading dashboard (the core app) | `3000` |
| `frontend` | React marketing/landing website | `3001` |

---

## ✨ Features

### Authentication & Security
- Local email/password authentication using **Passport.js** + **passport-local-mongoose** (automatic password hashing & salting via PBKDF2)
- Server-side sessions with **express-session**, persisted in MongoDB via **connect-mongo**
- Role-based **authorization** middleware (`user` / `admin`)
- Rate limiting on auth routes to prevent brute-force attacks
- Secure HTTP headers via **Helmet**
- Server-side input validation via **express-validator**
- Centralized error handling with a global error middleware and 404 handler
- Request logging via **Morgan**

### Trading Features
- Live watchlist with Buy/Sell actions
- **Holdings** — aggregated view of currently owned stocks with P&L, allocation %, sortable columns, and best/worst performer highlights
- **Positions** — today's intraday activity, split into realized and unrealized P&L
- **Orders** — full transaction history with search, delete (with automatic holdings/balance reversal), and timestamps
- Buy/Sell validation — blocks selling more shares than owned, and blocks buying beyond available balance

### Funds & Payments
- Virtual wallet balance (₹1,00,000 starting balance for new users)
- **Add Funds** via Razorpay (test mode) with server-side payment signature verification
- **Withdraw Funds** with balance validation
- Automatic balance updates on every Buy/Sell/Delete order action
- Used margin & total balance calculated live from current holdings

### User Experience
- Persistent login across page refreshes
- Profile dropdown with logout
- Protected routes — trading dashboard is inaccessible without authentication
- Cross-app navigation between the marketing site and the trading dashboard

---

## 🛠️ Tech Stack

**Frontend (dashboard & frontend)**
- React
- React Router
- Axios
- Material UI (Tooltips, icons)
- Chart.js / react-chartjs-2 (holdings performance chart)
- Razorpay Checkout (client-side)

**Backend**
- Node.js, Express
- MongoDB, Mongoose
- Passport.js (`passport-local`, `passport-local-mongoose`)
- express-session, connect-mongo
- Helmet, express-rate-limit, express-validator, Morgan
- Razorpay Node SDK

---

## 📂 Project Structure

```
zerodha/
├── backend/
│   ├── config/           # Passport & Razorpay configuration
│   ├── middleware/        # Auth, authorization, validation, rate limiting, error handling
│   ├── model/             # Mongoose models
│   ├── schemas/           # Mongoose schemas
│   ├── .env               # Environment variables (not committed)
│   └── index.js           # Express app entry point
│
├── dashboard/
│   └── src/
│       ├── components/    # All React components (Holdings, Orders, Positions, Funds, Auth, etc.)
│       ├── axiosConfig.js # Axios instance with credentials enabled
│       └── index.js
│
└── frontend/
    └── src/
        └── landing_page/  # Marketing site (Home, About, Pricing, Signup, etc.)
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas)
- A [Razorpay](https://razorpay.com) account (Test Mode API keys)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd zerodha
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3002
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=a_long_random_secret_string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Start the backend:
```bash
npm start
```

### 3. Dashboard setup
```bash
cd ../dashboard
npm install
```

Create a `.env` file in `dashboard/`:
```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

Start the dashboard:
```bash
npm start
```
Runs on `http://localhost:3000`

### 4. Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
PORT=3001
```

Start the frontend:
```bash
npm start
```
Runs on `http://localhost:3001`

> **Note:** All three apps (`backend`, `dashboard`, `frontend`) must be running simultaneously, in separate terminals, for the full application to work.

---

## 🔑 Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `PORT` | backend, frontend | Port the server runs on |
| `MONGO_URL` | backend | MongoDB connection string |
| `SESSION_SECRET` | backend | Secret used to sign session cookies |
| `CLIENT_URL` | backend | Allowed CORS origin (dashboard URL) |
| `NODE_ENV` | backend | `development` or `production` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | backend | Razorpay test API credentials |
| `REACT_APP_RAZORPAY_KEY_ID` | dashboard | Public Razorpay key for client-side checkout |

---

## 🧪 Testing Payments

Use [Razorpay's official test card details](https://razorpay.com/docs/payments/payments/test-card-upi-details/) in Test Mode, for example:
- **Card:** `4111 1111 1111 1111`
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **OTP (if prompted):** `1234`

No real money is charged in Test Mode.

---

## 🔐 Security Notes

- Passwords are never stored in plain text — hashed and salted automatically via `passport-local-mongoose`
- Sessions are `httpOnly` and use `sameSite: lax` cookies to reduce XSS/CSRF exposure
- All trading and funds routes are protected by authentication middleware and scoped per-user — no user can view or modify another user's data
- Razorpay payments are verified server-side via HMAC signature before crediting any balance

---

## 📌 Known Limitations / Future Improvements

- Stock prices are static/manually entered rather than pulled from a live market feed
- No password reset / forgot password flow
- No automated test suite
- Single Razorpay test key pair shared across environments (fine for development, would need separation for production)

---

## 📄 License

This project was built for educational purposes as a personal/college project and is not affiliated with or endorsed by Zerodha.
