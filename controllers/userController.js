const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");


exports.user_list = asyncHandler(async (req, res, next) => {
  res.send("not implemented: user list")
})
exports.user_detail = asyncHandler(async (req, res, next) => {
  res.send("not implemented: post detail")
})
exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up", {title: "Sign Up"})
})
exports.user_create_post = [
  body("first_name", "Please add your first name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("family_name", "Please add your family name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Please add your email address.")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage("Must be a valid email address!")
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    const user = new User({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      email: req.body.email,
    })

    if (!errors.isEmpty()) {
      res.render("sign-up", {
        title: "Sign Up",
        user,
        errors: errors.array(),
      })
      return;
    } else {
      // check if email is already in use
      const emailExists = await User.findOne({ email: req.body.email }).exec()
      if (emailExists) {
        const error = new Error("Email address already associated with an account!")
        error.status = 404
        res.render("sign-up", {
          title: "Sign Up",
          user,
          errors: error,
        })
      } else {
      await user.save()
      res.redirect(user.url)
      }
    }
  })
]