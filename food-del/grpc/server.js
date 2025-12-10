import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "../backend/config/db.js";
import Food from "../backend/models/foodModel.js";

const protoPath = fileURLToPath(new URL("./proto/food.proto", import.meta.url));

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDef).food;

await connectDB();

const impl = {
  async ListFoods(call, callback) {
    try {
      const docs = await Food.find().lean();
      const items = docs.map((d) => ({
        id: String(d._id),
        name: d.name || "",
        description: d.description || "",
        price: d.price || 0,
        category: d.category || "",
        image: d.image || "",
      }));
      callback(null, { items });
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, details: error.message });
    }
  },

  async GetFood(call, callback) {
    try {
      const { id } = call.request;
      const food = await Food.findById(id).lean();
      if (!food)
        return callback({
          code: grpc.status.NOT_FOUND,
          details: "Food not found",
        });
      callback(null, {
        id: String(food._id),
        name: food.name,
        description: food.description,
        price: food.price,
        category: food.category,
        image: food.image,
      });
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, details: error.message });
    }
  },

  async CreateFood(call, callback) {
    try {
      const { name, description, price, category, image } = call.request;
      if (!name || !description || !category || !image) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          details:
            "name, description, category e image son campos obligatorios",
        });
      }

      const newFood = await Food.create({
        name,
        description,
        price,
        category,
        image,
      });

      callback(null, {
        item: {
          id: String(newFood._id),
          name: newFood.name,
          description: newFood.description,
          price: newFood.price,
          category: newFood.category,
          image: newFood.image,
        },
      });
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, details: error.message });
    }
  },

 UpdateFood: async (call, callback) => {
  try {
    const { id, name, description, price, category, image } = call.request;

    if (!id) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "El campo 'id' es obligatorio.",
      });
    }

    console.log("ID recibido:", id);

    const existingFood = await Food.findById(id);

    if (!existingFood) {
      console.log("No se encontró el registro con ese ID en MongoDB");
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Food not found",
      });
    }

    if (name) existingFood.name = name;
    if (description) existingFood.description = description;
    if (price) existingFood.price = price;
    if (category) existingFood.category = category;
    if (image) existingFood.image = image;

    const updatedFood = await existingFood.save();

    console.log("Registro actualizado:", updatedFood);

    return callback(null, { item: {
      id: String(updatedFood._id),
      name: updatedFood.name,
      description: updatedFood.description,
      price: updatedFood.price,
      category: updatedFood.category,
      image: updatedFood.image
    }});
  } catch (err) {
    console.error("Error en UpdateFood:", err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message
    });
  }
},

  async DeleteFood(call, callback) {
    try {
      const { id } = call.request;
      const deleted = await Food.findByIdAndDelete(id);
      callback(null, { success: !!deleted });
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, details: error.message });
    }
  },
};

const server = new grpc.Server();
server.addService(proto.FoodService.service, impl);

const PORT = process.env.GRPC_PORT || 5051;

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, boundPort) => {
    if (err) throw err;
    console.log(`Conectado correctamente a MongoDB Atlas`);
    console.log(`gRPC escuchando en 0.0.0.0:${boundPort}`);
    server.start();
  }
);
