const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).send({ error: "Authorization token is missing" });
    }

    const cleanToken = token.replace("Bearer ", "").trim();
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error("Unable to login, invalid credentials");
    }

    req.user = user;
    req.token = cleanToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ error: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).send({ error: "Token expired" });
    }
    res.status(401).send({ error: error.message });
  }
};

module.exports = auth;
