require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const helmet = require("helmet");
const morgan = require("morgan");
const crypto = require("crypto");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const passport = require("./config/passport");
const razorpayInstance = require("./config/razorpay");
const { ensureAuthenticated, authorize } = require("./middleware/auth");
const { authLimiter, generalLimiter } = require("./middleware/rateLimiter");
const {
  validateNewOrder,
  validateRegister,
  validateLogin,
  validateFundsAmount,
} = require("./middleware/validators");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3002;
const URL = process.env.MONGO_URL;

const app = express();

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(generalLimiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- AUTH ROUTES ----------

app.post(
  "/auth/register",
  authLimiter,
  validateRegister,
  async (req, res, next) => {
    const { email, password, username } = req.body;

    try {
      await UserModel.register(new UserModel({ username, email }), password);
      res.json({ message: "Registration successful" });
    } catch (err) {
      if (
        err.name === "UserExistsError" ||
        err.message.includes("already exists")
      ) {
        return res.status(400).send(err.message);
      }
      next(err);
    }
  },
);

app.post("/auth/login", authLimiter, validateLogin, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info?.message || "Login failed");

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({
        email: user.email,
        username: user.username,
        role: user.role,
        balance: user.balance,
      });
    });
  })(req, res, next);
});

app.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.send("Logged out");
    });
  });
});

app.get("/auth/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      balance: req.user.balance,
    });
  } else {
    res.json(null);
  }
});

// ---------- HOLDINGS & ORDERS (user-scoped) ----------

app.get("/allHoldings", ensureAuthenticated, async (req, res, next) => {
  try {
    const allHoldings = await HoldingsModel.find({ user: req.user._id });
    res.json(allHoldings);
  } catch (err) {
    next(err);
  }
});

app.get("/allPositions", ensureAuthenticated, async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysOrders = await OrdersModel.find({
      user: req.user._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const grouped = {};

    todaysOrders.forEach((order) => {
      if (!grouped[order.name]) {
        grouped[order.name] = {
          name: order.name,
          buyQty: 0,
          buyValue: 0,
          sellQty: 0,
          sellValue: 0,
          lastPrice: order.price,
        };
      }

      const stock = grouped[order.name];
      stock.lastPrice = order.price;

      if (order.mode === "BUY") {
        stock.buyQty += order.qty;
        stock.buyValue += order.qty * order.price;
      } else if (order.mode === "SELL") {
        stock.sellQty += order.qty;
        stock.sellValue += order.qty * order.price;
      }
    });

    const positions = Object.values(grouped).map((stock) => {
      const netQty = stock.buyQty - stock.sellQty;
      const avgBuyPrice = stock.buyQty > 0 ? stock.buyValue / stock.buyQty : 0;

      const avgSellPrice =
        stock.sellQty > 0 ? stock.sellValue / stock.sellQty : 0;
      const realizedPL =
        stock.sellQty > 0 ? (avgSellPrice - avgBuyPrice) * stock.sellQty : 0;

      const unrealizedPL =
        netQty > 0 ? (stock.lastPrice - avgBuyPrice) * netQty : 0;

      return {
        name: stock.name,
        netQty,
        avgPrice: avgBuyPrice,
        ltp: stock.lastPrice,
        realizedPL,
        unrealizedPL,
        totalPL: realizedPL + unrealizedPL,
      };
    });

    res.json(positions);
  } catch (err) {
    next(err);
  }
});

app.post(
  "/newOrder",
  ensureAuthenticated,
  validateNewOrder,
  async (req, res, next) => {
    const { name, qty, price, mode } = req.body;
    const orderQty = Number(qty);
    const orderPrice = Number(price);
    const userId = req.user._id;
    const orderTotal = orderQty * orderPrice;

    try {
      const user = await UserModel.findById(userId);
      const existingHolding = await HoldingsModel.findOne({
        name,
        user: userId,
      });

      if (mode === "BUY") {
        if (user.balance < orderTotal) {
          return res.status(400).send("Insufficient funds to place this order");
        }

        if (existingHolding) {
          const totalCost =
            existingHolding.avg * existingHolding.qty + orderPrice * orderQty;
          const totalQty = existingHolding.qty + orderQty;

          existingHolding.qty = totalQty;
          existingHolding.avg = totalCost / totalQty;
          existingHolding.price = orderPrice;
          await existingHolding.save();
        } else {
          const newHolding = new HoldingsModel({
            user: userId,
            name,
            qty: orderQty,
            avg: orderPrice,
            price: orderPrice,
            net: "0.00%",
            day: "0.00%",
          });
          await newHolding.save();
        }

        user.balance -= orderTotal;
        await user.save();
      } else if (mode === "SELL") {
        if (!existingHolding || existingHolding.qty < orderQty) {
          return res.status(400).send("Not enough quantity to sell");
        }

        const remainingQty = existingHolding.qty - orderQty;

        if (remainingQty === 0) {
          await HoldingsModel.deleteOne({ name, user: userId });
        } else {
          existingHolding.qty = remainingQty;
          existingHolding.price = orderPrice;
          await existingHolding.save();
        }

        user.balance += orderTotal;
        await user.save();
      }

      const newOrder = new OrdersModel({
        user: userId,
        name,
        qty: orderQty,
        price: orderPrice,
        mode,
      });
      await newOrder.save();

      res.send("Order Placed");
    } catch (err) {
      next(err);
    }
  },
);

app.get("/allOrders", ensureAuthenticated, async (req, res, next) => {
  try {
    const allOrders = await OrdersModel.find({ user: req.user._id });
    res.json(allOrders);
  } catch (err) {
    next(err);
  }
});

app.delete("/deleteOrder/:id", ensureAuthenticated, async (req, res, next) => {
  try {
    const order = await OrdersModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) return res.status(404).send("Order not found");

    const { name, qty, mode, price } = order;
    const user = await UserModel.findById(req.user._id);
    const holding = await HoldingsModel.findOne({
      name,
      user: req.user._id,
    });
    const orderTotal = qty * price;

    if (mode === "BUY") {
      if (holding) {
        const newQty = holding.qty - qty;
        if (newQty <= 0) {
          await HoldingsModel.deleteOne({ name, user: req.user._id });
        } else {
          holding.qty = newQty;
          await holding.save();
        }
      }
      user.balance += orderTotal;
      await user.save();
    } else if (mode === "SELL") {
      if (holding) {
        const totalCost = holding.avg * holding.qty + price * qty;
        const totalQty = holding.qty + qty;
        holding.qty = totalQty;
        holding.avg = totalCost / totalQty;
        await holding.save();
      } else {
        const newHolding = new HoldingsModel({
          user: req.user._id,
          name,
          qty,
          avg: price,
          price,
          net: "0.00%",
          day: "0.00%",
        });
        await newHolding.save();
      }
      user.balance -= orderTotal;
      await user.save();
    }

    await OrdersModel.findByIdAndDelete(req.params.id);
    res.send("Order deleted");
  } catch (err) {
    next(err);
  }
});

// ---------- FUNDS ----------

app.get("/funds", ensureAuthenticated, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const holdings = await HoldingsModel.find({ user: req.user._id });

    const usedMargin = holdings.reduce(
      (sum, stock) => sum + stock.avg * stock.qty,
      0,
    );

    res.json({
      available: user.balance,
      usedMargin,
      total: user.balance + usedMargin,
    });
  } catch (err) {
    next(err);
  }
});

app.post(
  "/funds/create-order",
  ensureAuthenticated,
  validateFundsAmount,
  async (req, res, next) => {
    try {
      const { amount } = req.body;
      const numAmount = Number(amount);

      const options = {
        amount: Math.round(numAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpayInstance.orders.create(options);
      res.json(order);
    } catch (err) {
      next(err);
    }
  },
);

app.post(
  "/funds/verify-payment",
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
      } = req.body;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).send("Payment verification failed");
      }

      const user = await UserModel.findById(req.user._id);
      user.balance += Number(amount);
      await user.save();

      res.json({ balance: user.balance });
    } catch (err) {
      next(err);
    }
  },
);

app.post(
  "/funds/withdraw",
  ensureAuthenticated,
  validateFundsAmount,
  async (req, res, next) => {
    try {
      const { amount } = req.body;
      const numAmount = Number(amount);

      const user = await UserModel.findById(req.user._id);

      if (user.balance < numAmount) {
        return res.status(400).send("Insufficient balance to withdraw");
      }

      user.balance -= numAmount;
      await user.save();

      res.json({ balance: user.balance });
    } catch (err) {
      next(err);
    }
  },
);

// ---------- ADMIN ----------

app.delete(
  "/admin/deleteUser/:id",
  ensureAuthenticated,
  authorize("admin"),
  async (req, res, next) => {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.send("User deleted");
    } catch (err) {
      next(err);
    }
  },
);

// ---------- 404 + ERROR HANDLING (must be last) ----------

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("App Started");
  mongoose.connect(URL);
  console.log("MongoDB Connected");
});
