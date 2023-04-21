const User = require("../models/user")
const asyncHandler = require("express-async-handler")

exports.user_list = asyncHandler(async (req, res, next) => {
  res.send("not implemented: user list")
})
exports.user_detail = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post detail")
})
exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up", {title: "Sign Up"})
})
exports.user_create_post = asyncHandler(async (req, res, next) => {
  res.send("not implemented: user create post")
})