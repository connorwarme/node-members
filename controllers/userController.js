const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy; 
const bcrypt = require("bcryptjs")

// passport setup
// do I need an error / catch ? 
// passport.use(
//   new LocalStrategy(asyncHandler(async(username, password, done) => {
//     const user = await User.findOne({ email: username })
//     if (!user) {
//       return done(null, false, {message: "Incorrect email"})
//     }
//     bcrypt.compare(password, user.hash, (err, res) => {
//       if (res) {
//         return done(null, user)
//       } else {
//         return done(null, false, { message: "Incorrect password"})
//       }
//     })
//   }))
// )
// passport.serializeUser(function(user, done) {
//   done(null, user.id)
// })
// // does this need an error/catch?
// passport.deserializeUser(asyncHandler(async(id, done) => {
//   const user = await User.findById(id)
//   done(null, user)
// }))
// haven't dealt with bcrypt yet
// haven't tested passport authentication
// haven't added validation and sanitization for password and confirmation



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
  body("password", "Password required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
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
    failureRedirect: "/login",
  })
exports.user_logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
}