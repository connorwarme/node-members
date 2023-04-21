const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")

// not sure if I'll use this...
// const MongoStore = require("connect-mongo")(session)

// access variables in .env file
require("dotenv").config()

const app = express()

// middleware allowing Express to parse through both JSON and urlencoded request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// database
// const connection = mongoose.createConnection(process.env.DB_STRING)
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DB_STRING)
}

// create simple schema for User. the hash and salt are derived from user's given password upon registration
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
})
// define model used in app
mongoose.model("User", UserSchema)


