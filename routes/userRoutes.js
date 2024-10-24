const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("User routes are working!");
});

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ user, message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Login a User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Unable to login, invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login, invalid credentials");
    }

    const token = jwt.sign(
      {
        _id: user._id.toString(),
      },
      process.env.JWT_SECRET_KEY
    );

    res.status(201).json({ user, token, message: "Login successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// get all users
// router.get("/all", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (error) {
//     res.status(400).send({ error });
//   }
// });

module.exports = router;
