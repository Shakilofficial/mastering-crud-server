const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { getCollection } = require("../config/db");
const { ObjectId } = require("mongodb");
const router = express.Router();

const secret = process.env.ACCESS_TOKEN_SECRET;

//parser
router.use(express.json());
router.use(cookieParser());

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

// <--GET ROUTES ENDPOINT-->

// Welcome Route to test connection
router.get("/", (req, res) => {
  res.send("Welcome to Clean Co API");
});

//Fetch data by Id
router.get("/service/:serviceId", verifyToken, async (req, res) => {
  const id = req.params.serviceId;
  const query = { _id: new ObjectId(id) };
  const serviceCollection = getCollection("services");
  const result = await serviceCollection.findOne(query);
  res.send(result);
});

// Route to fetch services & different categorize & sorting by Price sort oder=asc/desc
//Pagination format
router.get("/services", verifyToken, async (req, res) => {
  let queryObj = {};
  let sortObj = {};
  const category = req.query.category;
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder;

  //pagination
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const skip = (page - 1) * limit;

  if (category) {
    queryObj.category = category;
  }
  if (sortField && sortOrder) {
    sortObj[sortField] = sortOrder;
  }
  const serviceCollection = getCollection("services");
  const cursor = serviceCollection
    .find(queryObj)
    .skip(skip)
    .limit(limit)
    .sort(sortObj);
  const result = await cursor.toArray();
  //count data
  const total = await serviceCollection.countDocuments();
  res.send({ total, result });
});

// Route to fetch bookings by user email
router.get("/user/bookings", verifyToken, async (req, res) => {
  const queryEmail = req.query.email;
  const tokenEmail = req.user.email;
  if (queryEmail !== tokenEmail) {
    return res.status(403).send({ message: "Forbidden Access" });
  }
  let query = {};
  if (queryEmail) {
    query.email = queryEmail;
  }
  const bookingCollection = getCollection("bookings");
  const result = await bookingCollection.find(query).toArray();
  res.send(result);
});

// <--POST ROUTES ENDPOINT-->

// JWT create and send to the client
router.post("/auth/access-token", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, secret, { expiresIn: "1h" });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send({ success: true });
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
