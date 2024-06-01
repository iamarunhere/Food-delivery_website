import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import multer from "multer";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const app = express();
const port = process.env.PORT || 4000;

// MongoDB connection
const connectionString = process.env.MONGO_URI;
let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db("Arunkumar"); // Specify the database name here
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve images statically

// Image Storage engine
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: Storage });

// Add food item
app.post("/api/food/add", upload.single("image"), async (req, res) => {
  const db = getDB();
  let image_filename = `${req.file.filename}`;
  const food = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  };
  try {
    await db.collection("Tabledata").insertOne(food); // Use the collection name here
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
});

// List all food items
app.get("/api/food/list", async (req, res) => {
  const db = getDB();
  try {
    const foods = await db.collection("Tabledata").find({}).toArray(); // Use the collection name here
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
});

// Remove food item
app.post("/api/food/remove", async (req, res) => {
  const db = getDB();
  try {
    const food = await db
      .collection("Tabledata")
      .findOne({ _id: new ObjectId(req.body.id) }); // Use the collection name here
    if (food) {
      fs.unlink(`uploads/${food.image}`, () => {});
      await db
        .collection("Tabledata")
        .deleteOne({ _id: new ObjectId(req.body.id) }); // Use the collection name here
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "Food item not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
});

// User Model (Schema)
const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
};

// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Login User
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
});

// Register User
app.post("/api/user/register", async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Checking if user already exists
    const exists = await db.collection("users").findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name: name,
      email: email,
      password: hashedPassword,
      cartData: {},
    };

    const user = await db.collection("users").insertOne(newUser);
    const token = createToken(user.insertedId);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start server
const startServer = () => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
