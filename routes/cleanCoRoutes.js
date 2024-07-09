const express = require("express");
const router = express.Router();
const { getCollection } = require("../config/db");

// Example route to test connection
router.get("/", (req, res) => {
  res.send("Welcome to Clean Co API");
});

// Route to fetch services
router.get("/services", async (req, res) => {
  try {
    const serviceCollection = getCollection("services");
    const services = await serviceCollection.find({}).toArray();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

module.exports = router;
