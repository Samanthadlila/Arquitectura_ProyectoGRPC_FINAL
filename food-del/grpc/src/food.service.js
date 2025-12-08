import { FoodModel } from "./db.js";

export const handlers = {

  async ListFoods(call, callback) {
    try {
      const docs = await FoodModel.find({}).lean();
      const items = docs.map(d => ({
        id: String(d._id),
        name: d.name ?? "",
        description: d.description ?? "",
        price: d.price ?? 0,
        image: d.image ?? "",
        category: d.category ?? "",
      }));
      callback(null, { items });
    } catch (err) {
      callback(err);
    }
  },

  // Crear
  async CreateFood(call, callback) {
    try {
      const { name, description, price, image, category } = call.request;
      const created = await FoodModel.create({ name, description, price, image, category });
      callback(null, {
        id: String(created._id),
        name: created.name,
        description: created.description,
        price: created.price,
        image: created.image,
        category: created.category,
      });
    } catch (err) {
      callback(err);
    }
  },

 
  async DeleteFood(call, callback) {
    try {
      const { id } = call.request;
      await FoodModel.findByIdAndDelete(id);
      callback(null, {});
    } catch (err) {
      callback(err);
    }
  },
};
