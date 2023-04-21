const Post = require("../models/post")
const asyncHandler = require("express-async-handler")

exports.post_list = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post list")
})
exports.post_detail = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post detail")
})
exports.post_create_get = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post create get")
})
exports.post_create_post = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post create post")
})