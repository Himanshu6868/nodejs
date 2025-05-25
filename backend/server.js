const express = require("express");
const connectDB = require("./index");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./route/auth");
const auth = require("./middleware/verify");

const Data = require("./models/schema");
const sql = require("./database");

const app = express();
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRoutes);

connectDB();

console.log("Middleware:", auth);

console.log("Database connection:", sql);

app.get("/app/getUser", auth, (req, res) => {
  res.send(`Hello World! ${req.user}`);
});

app.post("/app/user", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newUser = new Data({
      title,
      content,
    });

    await newUser.save();
    console.log("New user created:", newUser);
    return res
      .status(201)
      .json({ message: "Post created successfully", user: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/app/users", async (req, res) => {
  try {
    const users = await Data.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/app/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Data.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/app/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {};
    const { title, content } = req.body;
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    // if (phone) updateData.phone = phone;

    const updatedUser = await Data.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/app/search", async (req, res) => {
  try {
    const { searchText } = req.body;

    if (!searchText) {
      return res.status(400).json({ message: "Search text is required" });
    }

    const users = await Data.findOne({
      name: { $regex: searchText, $options: "i" },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
