import { MongoClient } from "mongodb";

const connectionString =
  "mongodb+srv://arunmuthaiah007:vcjn4b84gUTVoPSU@cluster0.y84b9vz.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";

let db;

export const connectDB = async () => {
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

export const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};
