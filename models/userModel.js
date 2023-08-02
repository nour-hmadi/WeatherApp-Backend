import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please add your first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please add your last name"],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("UserWeatherApi", userSchema);

export default User;
