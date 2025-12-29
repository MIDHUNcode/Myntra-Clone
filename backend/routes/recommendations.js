const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const User = require("../models/User");

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.query.userId; 

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let recommended = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId },
    }).limit(10);

    if (userId) {
      const user = await User.findById(userId);

      if (user) {
        const wishlistIds = user.wishlist.map((id) => id.toString());
        const historyIds = user.browsingHistory.map((id) => id.toString());

        recommended = recommended.sort((a, b) => {
          const aScore =
            wishlistIds.includes(a._id.toString()) ||
            historyIds.includes(a._id.toString())
              ? 1
              : 0;

          const bScore =
            wishlistIds.includes(b._id.toString()) ||
            historyIds.includes(b._id.toString())
              ? 1
              : 0;

          return bScore - aScore;
        });
      }
    }

    res.json(recommended);
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
