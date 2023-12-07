const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./controllers/user.controller");
const auth = require("./middlewares/auth.middleware");
const blogRouter = require("./controllers/blog.controller");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ test: "test" });
});

app.use("/api", userRouter);
app.use("/api", auth, blogRouter);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
    console.log("Server running on port", PORT);
  } catch (error) {
    console.log(error);
  }
});
