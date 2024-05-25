const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const cors = require("cors");
const userModel = require("./models/userModel");

app.use(cors(
  {
    origin: "https://deploy-mern-ali.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  }
));
app.use(express.json());

const PORT = process.env.PORT || 6001;

// Register Route
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json({ status: 200 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid Login Credientials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      let name = user.name;
      const token = jwt.sign(
        {
          name,
          email,
        },
        "secret123"
      );
      res.json({ status: 200, token: token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quote Route
app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, "secret123");

  const user = await userModel.findOne({
    email: decoded.email,
  });

  res.json({ status: 200, quote: user.quote });
});

// Update Quote Route
app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, "secret123");
  const quote = req.body.quote;

  try {
    const user = await userModel.findOneAndUpdate(
      {
        email: decoded.email,
      },
      {
        quote: quote,
      }
    );
    await user.save();
    res.json({ status: 200, quote: quote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
