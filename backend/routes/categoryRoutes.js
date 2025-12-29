const express = require("express");
const router = express.Router();
const categories = require("../../TaskApp/app/categorydata");

router.get("/", (req, res) => {
  res.status(200).json(categories);
});

module.exports = router;
