const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// User model
const User = require("../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  // Form validation
  const { errors, isValid } = await validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).send(errors);
  }

  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).send("Email already exists");
  } else {
    try {
      const newUser = new User(req.body);

      // @ts-ignore
      newUser.password = await bcrypt.hash(newUser.password, 8);

      await newUser.save();
      res.status(201).send(newUser);
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send("Email not found");
  }

  //@ts-ignore
  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  // User matched
  if (isMatch) {
    // Create JWT payload
    const payload = {
      id: user.id,
      //@ts-ignore
      name: user.name
    };

    // Sign token
    const signToken = await jwt.sign(payload, keys.secretOrKey, {
      expiresIn: 60
    });

    if (signToken) {
      res.send({
        success: true,
        token: `Bearer ${signToken}`
      });
    }
  } else {
    return res.status(400).send("Password incorrect");
  }
});

module.exports = router;
