const { body, validationResult } = require("express-validator")
const Post = require("../models/post")
const asyncHandler = require("express-async-handler")

exports.index = asyncHandler(async (req, res, next) => {
  console.log(req.user)
  res.render("index", { user: req.user })
})

exports.post_list = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post list")
})
exports.post_detail = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post detail")
})
exports.post_create_get = asyncHandler(async (req, res, next) => {
  res.render("post_create", { title: "Create Post" })
})
exports.post_create_post = [
  body("title", "Post title is required")
    .trim() 
    .isLength({ min: 1 })
    .escape(),
  body("post", "Post text is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const post = new Post({
      title: req.body.title,
      text: req.body.post,
      author: res.locals.currentUser._id,
      date: new Date(),
    })

    if (!errors.isEmpty()) {
      res.render("post_create", {
        title: "Create Post",
        errors: errors.array(),
      })
      return;
    } else {
      const newpost = await post.save()
      res.redirect(newpost.url)
    }
  })
]