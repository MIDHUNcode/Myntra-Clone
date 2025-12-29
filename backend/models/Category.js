const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    subcategory: [{ type: String }],
    productId: [ProductSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
