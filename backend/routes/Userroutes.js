const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  res.json({ user: { _id: "1", fullName: "Test User", email }, token: "abc123" });
});

module.exports = router;
