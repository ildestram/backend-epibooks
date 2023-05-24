import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: false,
    max: 5,
    min: 0,
    default: 0,
  },
  image: {
    type: String,
    required: false,
    default: "https://picsum.photos/1920/1080",
  },
});

const PostModel = mongoose.model("Post", PostSchema, "posts");
export default PostModel;
