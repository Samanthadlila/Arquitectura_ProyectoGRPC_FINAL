import mongoose from "mongoose";

mongoose.set("debug", true);

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://root:1234@ac-ak5wnwm-shard-00-00.uub6rlz.mongodb.net:27017,ac-ak5wnwm-shard-00-01.uub6rlz.mongodb.net:27017,ac-ak5wnwm-shard-00-02.uub6rlz.mongodb.net:27017/food-del?ssl=true&replicaSet=atlas-mdf3s7-shard-0&authSource=admin&appName=Cluster0", {
  serverSelectionTimeoutMS: 20000,
  family: 4,
});

    console.log("Conectado correctamente a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
  }
};