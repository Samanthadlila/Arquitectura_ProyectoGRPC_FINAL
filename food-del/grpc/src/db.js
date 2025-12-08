import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "food-del";
  await mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 20000,
    family: 4,
  });
  console.log("gRPC conectado a MongoDB Atlas");
}

const FoodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
}, { timestamps: true });

export const FoodModel = mongoose.model("foods", FoodSchema);
