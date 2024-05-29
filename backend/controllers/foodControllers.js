import fs from "fs";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// Add food item
const addFood = async (req, res) => {
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
};

// List all food items
const listFood = async (req, res) => {
  const db = getDB();
  try {
    const foods = await db.collection("Tabledata").find({}).toArray(); // Use the collection name here
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
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
};

export { addFood, listFood, removeFood };
