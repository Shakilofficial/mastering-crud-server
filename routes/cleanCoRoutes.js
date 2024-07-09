const express = require("express");
const router = express.Router();
const { getCollection } = require("../config/db");
const { ObjectId } = require("mongodb");

//     <--GET ROUTES ENDPOINT-->

// Welcome Route to test connection
router.get("/", (req, res) => {
  res.send("Welcome to Clean Co API");
});

// Route to fetch services
router.get("/services", async (req, res) => {
  const serviceCollection = getCollection("services");
  const result = await serviceCollection.find({}).toArray();
  res.send(result);
});

// Route to fetch services
router.get("/user/all-booking", async (req, res) => {
    const bookingCollection = getCollection("bookings");
    const result = await bookingCollection.find({}).toArray();
    res.send(result);
});

//     <--POST ROUTES ENDPOINT-->

// JWT create and send to the client
router.post('/auth/access-token', async (req, res) => {
    
})

// Route to create a new booking from user
router.post("/user/create-booking", async (req, res) => {
  const booking = req.body;
  const bookingCollection = getCollection("bookings");
  const result = await bookingCollection.insertOne(booking);
  res.send(result);
});

//      <--DELETE ROUTES ENDPOINT-->

// Route to delete a booking from user
router.delete("/user/cancel-booking/:bookingId", async (req, res) => {
  const id = req.params.bookingId;
  const query = { _id: new ObjectId(id) };
  const bookingCollection = getCollection("bookings");
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
