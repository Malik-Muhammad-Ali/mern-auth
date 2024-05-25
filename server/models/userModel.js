const mongoose = require("mongoose");
require("dotenv").config();

// connect to mongodb atlas
const password = process.env.password;
const url =
  `mongodb+srv://Ali:${password}@cluster0.0szx0ys.mongodb.net/practiceAuth?retryWrites=true&w=majority&appName=Cluster0`;
try {
  mongoose.connect(url);
  console.log("Connected to MongoDB Atlas");
} catch (error) {
  console.log("Error connecting to MongoDB Atlas");
  console.log(error);
}

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
    },
  },
  {
    collection: "user-data",
  }
);

const userModel = mongoose.model("UserData", user);
module.exports = userModel;
