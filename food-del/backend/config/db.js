import mongoose from "mongoose";

mongoose.set(`debug`, true);

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://root:1234@cluster0.uub6rlz.mongodb.net/food-del?retryWrites=true&w=majority", {
      serverSelectionTimeoutMS: 20000, 
      family: 4,
    });

    console.log(" Conectado correctamente a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
  }
};

