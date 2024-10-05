import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 4,
    },
    fullname: {
      type: String,
      required: true,
      minLength: 4,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minLength: 4,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
