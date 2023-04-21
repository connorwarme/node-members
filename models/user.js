const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  family_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  member_status: {
    type: Boolean,
    default: false,
  }
})

UserSchema.virtual("name").get(function() {
  let fullname = ""
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name} ${this.family_name}`
  }
  if (!this.first_name || !this.family_name) {
    fullname = ""
  }
  return fullname;
})

UserSchema.virtual("url").get(function() {
  return `/user/${this._id}`
})

module.exports = mongoose.model("User", UserSchema)