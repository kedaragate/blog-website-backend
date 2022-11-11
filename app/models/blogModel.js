const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: "user" },
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now() },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});

const blog = mongoose.model("blog", blogSchema);

module.exports = blog;
