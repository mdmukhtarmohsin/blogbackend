const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(
      req.body.password,
      +process.env.SALT_ROUNDS
    );
    const user = await new userModel(req.body);
    await user.save();
    res.status(201).json({ ok: true, msg: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.JWT_KEY
      );
      res.status(200).json({ ok: true, username: user.username, token });
    } else {
      res.status(200).json({ ok: false, msg: "Incorrect credintials" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

module.exports = userRouter;
