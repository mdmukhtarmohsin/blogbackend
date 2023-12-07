const express = require("express");
const mongoose = require("mongoose");
const blogModel = require("../models/blog.model");

const blogRouter = express.Router();

blogRouter.get("/blogs", async (req, res) => {
  try {
    const user = req.user;
    let { title, category, sort, order } = req.query;
    let blogs;
    let queryto = { $and: [{ username: user.username }] };
    if (title) {
      queryto.$and.push({ title: title });
    }
    if (category) {
      queryto.$and.push({ category: category });
    }
    if (!order) {
      order = "asc";
    }
    if (sort) {
      blogs = await blogModel.find(queryto).sort({ date: order });
    } else {
      blogs = await blogModel.find(queryto);
    }
    console.log(queryto);
    res.status(200).json({ ok: true, msg: blogs });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

blogRouter.post("/blogs", async (req, res) => {
  try {
    const user = req.user;
    req.body.username = user.username;
    const newBlog = new blogModel(req.body);
    await newBlog.save();
    res.status(201).json({ ok: true, msg: newBlog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

blogRouter.patch("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let blog = await blogModel.findById(id);
    if (blog.username != req.user.username) {
      throw new Error("Not Authorized, user can edit only his own blog");
    }
    blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json({ ok: true, msg: blog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

blogRouter.delete("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let blog = await blogModel.findById(id);
    if (blog.username != req.user.username) {
      throw new Error("Not Authorized, user can delete only his own blog");
    }
    blog = await blogModel.findByIdAndDelete(id);
    res.status(200).json({ ok: true, msg: blog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

blogRouter.patch("/blogs/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    let blog = await blogModel.findById(id);
    blog = await blogModel.findByIdAndUpdate(
      id,
      { likes: blog.likes + 1 },
      { new: true }
    );
    res.status(200).json({ ok: true, msg: blog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

blogRouter.patch("/blogs/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    let blog = await blogModel.findById(id);
    const commentSchema = {
      username: req.user.username,
      content: req.body.comment,
    };
    blog.comments.push(commentSchema);
    await blog.save();
    res.status(200).json({ ok: true, msg: blog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: error });
  }
});

module.exports = blogRouter;
