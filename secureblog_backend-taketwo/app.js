const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
  styleSrc:  ["'self'"],
  imgSrc:    ["'self'", "https://images.unsplash.com"],
  connectSrc:["'self'", "https://api.example.com"],
  frameAncestors: ["'none'"],
};

//CSP settings
app.use(
helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    ...cspDirectives,
    // use camelCase reportUri for helmet, not "report-uri"
    reportUri: ["/csp-report"],
  },
  reportOnly: process.env.NODE_ENV !== "production",
  })
);

// Routes
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const postRoutes = require('./routes/postRoutes');

app.use("/api/auth", authRoutes);

app.use(postRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    timestamp: new Date()
  });
});

const cspReports = [];
app.post("/csp-report", (req, res) => {
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  cspReports.push({
    receivedAt: new Date().toISOString(),
    report: req.body
  });
  res.status(200).json({ received: true, report: req.body });
});

app.get("/csp-report", (_req, res) => {
  res.json({ count: cspReports.length, reports: cspReports });
});

module.exports = app;