const mongoose = require("mongoose")

const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
})

PostSchema.virtual("url").get(function() {
  return `/post/${this._id}`
})

module.exports = mongoose.model("Post", PostSchema)