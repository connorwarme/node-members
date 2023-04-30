const User = require("../models/user")
const Post = require("../models/post")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");
const passport = require("passport") 
const bcrypt = require("bcryptjs")
require("dotenv").config()


exports.user_list = asyncHandler(async (req, res, next) => {
  res.send("not implemented: user list")
})
exports.user_detail = asyncHandler(async (req, res, next) => {
  const [ user, posts ] = await Promise.all([
    User.findById(req.params.id).exec(),
    Post.find({ author: req.params.id }).exec()
  ])
  res.render("user_detail", {
    title: `User: ${user.name}`,
    user,
    posts,
  })
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
  body("password", "Password required.")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .escape(),
  body("confirm_password", "Passwords did not match.")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password
    })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    const salt = 12
    bcrypt.hash(req.body.password, salt, async(err, hashedPassword) => {
      if (err) {
        return next(err)
      }
      const user = new User({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        email: req.body.email,
        hash: hashedPassword,
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
          console.log(error.message)
          res.render("sign-up", {
            title: "Sign Up",
            user,
            error: error,
          })
        } else {
        await user.save()
        res.redirect(user.url)
        }
      }
    })
  })
]
exports.user_login_get = asyncHandler(async(req, res, next) => {
  res.render("login", { 
    title: "Login", 
    messages: req.session.messages, 
  })
})
exports.user_login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
  })
exports.user_elite_get = asyncHandler(async(req, res, next) => {
  res.render("elite", { title: "Become Elite" })
})
exports.user_elite_post = [
  body("password", "Password is required")
    .trim()
    .isLength({ min: 1 })
    .custom((value) => {
      return value === process.env.ELITE_ACCESS
    })
    .withMessage("Password invalid - access denied!")
    .escape(),
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req)

    const user = new User({
      first_name: res.locals.currentUser.first_name,
      family_name: res.locals.currentUser.family_name,
      email: res.locals.currentUser.email,
      hash: res.locals.currentUser.hash,
      member_status: true,
      admin_status: false,
      _id: res.locals.currentUser._id,
    })

    if (!errors.isEmpty()) {
      res.render("elite", { 
        title: "Become Elite",
        errors: errors.array(), 
      })
      return;
    } else {
      const updateduser = await User.findByIdAndUpdate(res.locals.currentUser._id, user, {})
      res.redirect(updateduser.url)
    }
  })
]
exports.user_admin_get = asyncHandler(async(req, res, next) => {
  res.render("admin", { title: "Become Admin" })
})
exports.user_admin_post = [
  body("password", "Password is required")
    .trim()
    .isLength({ min: 1 })
    .custom((value) => {
      return value === process.env.ADMIN_ACCESS
    })
    .withMessage("Password invalid - access denied!")
    .escape(),
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req)

    const user = new User({
      first_name: res.locals.currentUser.first_name,
      family_name: res.locals.currentUser.family_name,
      email: res.locals.currentUser.email,
      hash: res.locals.currentUser.hash,
      member_status: res.locals.currentUser.member_status,
      admin_status: true,
      _id: res.locals.currentUser._id,
    })

    if (!errors.isEmpty()) {
      res.render("admin", { 
        title: "Become Admin",
        errors: errors.array(), 
      })
      return;
    } else {
      const updateduser = await User.findByIdAndUpdate(res.locals.currentUser._id, user, {})
      res.redirect(updateduser.url)
    }
  })
]

exports.user_logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
}