const express = require("express");
const { registerRules, loginRules } = require("../utils/validators");
const { register, login } = require("../controllers/authController");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({windowMs: 15 * 60 * 1000, max: 20});

router.post("/register", registerRules, register);
router.post("/login", loginLimiter, loginRules, login);

module.exports = router;