const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "yourJWTSecret"; // Make sure this is defined

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  console.log("Received token:", token); // Log the received token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user; // Make sure this structure matches your payload
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
