const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mehtabatkips@gmail.com", // Replace with your email
    pass: "tdgn vbuu qcqu htip", // Replace with your email password or app password
  },
});

//******************************************************************************************************************* */
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI =
  "mongodb+srv://CN_User:Kiahal1122@Mehtab2046.m6bmv.mongodb.net/CN_User?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//******************************************************************************************************************* */
//******************************************************************************************************************* */
//-----------Fetching User Events--------------------------------

// API endpoint to get events by username
app.get("/api/userEvents", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const events = await Event.find({ username });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});
//******************************************************************************************************************* */
//----------------------------------       Booking Venues-------------------------------------------------
// Schema for Events (Bookings)
const bookingSchema = new mongoose.Schema({
  venueId: String,
  venueName: String, // Corrected 'venuName' to 'venueName'
  username: String,
  noOfPersons: Number,
  selectedDishes: [String],
  eventDate: String,
  totalBill: Number,
});

const Event = mongoose.model("Event", bookingSchema);

// API Route to check availability
app.post("/api/checkAvailability", async (req, res) => {
  const { venueId, eventDate } = req.body;

  try {
    const existingEvent = await Event.findOne({ venueId, eventDate });
    if (existingEvent) {
      return res.json({ isAvailable: false });
    }
    return res.json({ isAvailable: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// API Route to book venue
app.post("/api/bookVenue", async (req, res) => {
  const {
    venueId,
    venueName, // Ensure 'venueName' is passed correctly here
    username,
    noOfPersons,
    selectedDishes,
    eventDate,
    totalBill,
  } = req.body;

  try {
    // Check if the venue is already booked on the selected date
    const existingEvent = await Event.findOne({ venueId, eventDate });

    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: "Venue already booked for the selected date",
      });
    }

    // Create a new event booking
    const newEvent = new Event({
      venueId,
      venueName, // Corrected reference to 'venueName'
      username,
      noOfPersons,
      selectedDishes,
      eventDate,
      totalBill,
    });

    await newEvent.save();

    // Email content
    const emailContent = `
      <h3>Booking Confirmation</h3>
      <p>Dear ${username},</p>
      <p>Your booking has been successfully confirmed with the following details:</p>
      <ul>
        <li><strong>Venue:</strong> ${venueName}</li> <!-- Corrected 'Name' to 'venueName' -->
        <li><strong>Number of Persons:</strong> ${noOfPersons}</li>
        <li><strong>Selected Dishes:</strong> ${selectedDishes.join(", ")}</li>
        <li><strong>Event Date:</strong> ${eventDate}</li>
        <li><strong>Total Bill:</strong> PKR ${totalBill}</li>
      </ul>
      <p>Thank you for choosing us!</p>
    `;

    // Send email
    await transporter.sendMail({
      from: "mehtabatkips@gmail.com", // Replace with your email
      to: username, // Use the username for dynamic email// Replace with user's email
      subject: "Booking Confirmation",
      html: emailContent,
    });

    res.json({
      success: true,
      message: "Booking successful. Confirmation email sent!",
      bookingDetails: {
        venueId,
        username,
        noOfPersons,
        selectedDishes,
        eventDate,
        totalBill,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again" });
  }
});

//******************************************************************************************************************* */
//******************************************************************************************************************* */
//******************************************************************************************************************* */
//-----------Fetching Upcoming Events--------------------------------
// API endpoint to get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events from the database
    res.status(200).json(events); // Send the events as a response
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

//******************************************************************************************************************* */
//-----------------------------Fetching Venues--------------------------------
// API Route to Get All Venues
app.get("/api/venues", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res
      .status(500)
      .json({ error: "Error fetching venues. Please try again later." });
  }
});
//******************************************************************************************************************* */

//******************************************************************************************************************* */
//-----------Adding Users----------------
// Create User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phoneNo: String,
  password: String,
});

// Create User model
const User = mongoose.model("User", userSchema);

// API Route to Add User
app.post("/api/users", async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phoneNo || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if a user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      phoneNo,
      password,
    });

    // Save user to the database
    await newUser.save();

    // Return success response
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});
//******************************************************************************************************************* */

//******************************************************************************************************************* */
//------SIGN INN AND LOGINN

// Route for SignUp
app.post("/api/signup", async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  // Validate required fields
  if (!name || !email || !phoneNo || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Save new user to the database
    const newUser = new User({ name, email, phoneNo, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during SignUp:", error);
    res.status(500).json({ error: "SignUp failed. Please try again later." });
  }
});

// Route for Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error during Login:", error);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});
//******************************************************************************************************************* */

//******************************************************************************************************************* */
//------------API Route to Add User--------------------------------
app.post("/api/users", async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phoneNo || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if a user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      phoneNo,
      password,
    });

    // Save user to the database
    await newUser.save();

    // Return success response
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});
//******************************************************************************************************************* */

//******************************************************************************************************************* */
// API Route to Get All Users
app.get("/api/users", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    // Send the users data as the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ error: "Error fetching users. Please try again later." });
  }
});
//******************************************************************************************************************* */

//******************************************************************************************************************* */
//-----------------------------VENUE SCHEME--------------------------------
// Define schemas and models for venue only
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerPerson: { type: Number, required: true },
  timeAllowed: { type: Number, required: true },
});

const Venue = mongoose.model("Venue", venueSchema);

// Route to handle adding a venue
app.post("/api/venues", async (req, res) => {
  const { name, location, capacity, pricePerPerson, timeAllowed } = req.body;
  try {
    const newVenue = new Venue({
      name,
      location,
      capacity,
      pricePerPerson,
      timeAllowed,
    });
    await newVenue.save();
    res.status(201).json({ message: "Venue added successfully" });
  } catch (error) {
    console.error("Error saving venue:", error);
    res.status(500).json({ error: "Failed to add venue" });
  }
});
//******************************************************************************************************************* */

//******************************************************************************************************************* */
//******************************************************************************************************************* *///******************************************************************************************************************* *///******************************************************************************************************************* *///******************************************************************************************************************* *///******************************************************************************************************************* */
//******************************************************************************************************************* */

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
