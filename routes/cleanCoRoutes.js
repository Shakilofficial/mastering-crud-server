const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get Data From Clean Co");
});

module.exports = router;
