const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Support Authorization: "Bearer <token>" or token stored in cookies (req.cookies.token)
  const authHeader = req.headers.authorization || (req.cookies && req.cookies.token);
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let token = authHeader;
  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // normalized values for downstream controllers
    req.userId = decoded.id || decoded._id || null;
    req.user = decoded;   // full decoded payload (useful if you embed more info)
    req.token = token;
    next();
  } catch (err) {
    console.error("Auth verify error:", err);
    res.status(403).json({ message: "Token invalid or expired" });
  }
};

module.exports = { protect };