const express = require("express");
const jwt = require("jsonwebtoken");
const { getCollection } = require("../config/db");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

// <--GET ROUTES ENDPOINT-->

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

// Route to fetch all bookings
router.get("/user/all-booking", verifyToken, async (req, res) => {
  const bookingCollection = getCollection("bookings");
  const result = await bookingCollection.find({}).toArray();
  res.send(result);
});

// <--POST ROUTES ENDPOINT-->

// JWT create and send to the client
router.post("/auth/access-token", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
    res.send({ token });
    console.log(token);
});

// Route to create a new booking from user
router.post("/user/create-booking", async (req, res) => {
  const booking = req.body;
  const bookingCollection = getCollection("bookings");
  const result = await bookingCollection.insertOne(booking);
  res.send(result);
});

// <--DELETE ROUTES ENDPOINT-->

// Route to delete a booking from user
router.delete("/user/cancel-booking/:bookingId", async (req, res) => {
  const id = req.params.bookingId;
  const query = { _id: new ObjectId(id) };
  const bookingCollection = getCollection("bookings");
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
