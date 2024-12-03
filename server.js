const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // For password hashing

const app = express();
const PORT = 5000;

// Initialize Firebase Admin SDK
const serviceAccount = require("./myticket-7f435-firebase-adminsdk-ny5f3-18995f0fc3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myticket-7f435.firebaseio.com", // Replace with your Firebase URL
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Endpoint for User Registration
app.post("/api/register", async (req, res) => {
  const { fullName, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await admin.firestore().collection("users").add({
      fullName,
      email,
      password: hashedPassword,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user: ", error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

// API Endpoint for User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userSnapshot = await admin.firestore()
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: "Invalid email or password!" });
    }

    const user = userSnapshot.docs[0].data();
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password!" });
    }

    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

// API Endpoint to Add Tickets (Admin Only)
app.post("/api/tickets", async (req, res) => {
  const { eventName, ticketQuantity } = req.body;

  // Validate request payload
  if (!eventName || !ticketQuantity || ticketQuantity <= 0) {
    return res.status(400).json({ error: "Invalid event name or ticket quantity!" });
  }

  try {
    console.log("Attempting to add ticket data to Firestore...");
    const ticketData = {
      eventName,
      ticketQuantity: parseInt(ticketQuantity, 10), // Ensure it's an integer
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Create or overwrite a document in the 'tickets' collection
    await admin.firestore().collection("tickets").doc(eventName).set(ticketData);

    console.log("Ticket added successfully:", ticketData);
    return res.status(200).json({ message: "Tickets added successfully!" });
  } catch (error) {
    console.error("Error adding tickets: ", error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

// API Endpoint to Buy Tickets (Customer)
app.post("/api/buy-ticket", async (req, res) => {
  const { eventName, quantity } = req.body;

  if (!eventName || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid event name or quantity!" });
  }

  try {
    const ticketDoc = await admin.firestore().collection("tickets").doc(eventName).get();

    if (!ticketDoc.exists) {
      return res.status(404).json({ error: "Event not found!" });
    }

    const ticketData = ticketDoc.data();

    if (ticketData.ticketQuantity < quantity) {
      return res.status(400).json({ error: "Not enough tickets available. Sold out!" });
    }

    const newQuantity = ticketData.ticketQuantity - quantity;

    await admin.firestore().collection("tickets").doc(eventName).update({
      ticketQuantity: newQuantity,
    });

    return res.status(200).json({
      message: `Successfully purchased ${quantity} tickets for ${eventName}!`,
      remainingTickets: newQuantity,
    });
  } catch (error) {
    console.error("Error buying tickets: ", error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

// API Endpoint to Check Tickets
app.get("/api/tickets", async (req, res) => {
  const { eventName } = req.query; // Pass eventName as a query parameter if needed

  try {
    if (eventName) {
      // Fetch a specific ticket by event name
      const ticketDoc = await admin.firestore().collection("tickets").doc(eventName).get();

      if (!ticketDoc.exists) {
        return res.status(404).json({ error: "Event not found!" });
      }

      return res.status(200).json(ticketDoc.data());
    } else {
      // Fetch all tickets
      const ticketsSnapshot = await admin.firestore().collection("tickets").get();

      if (ticketsSnapshot.empty) {
        return res.status(404).json({ error: "No tickets found!" });
      }

      const tickets = ticketsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(tickets);
    }
  } catch (error) {
    console.error("Error fetching tickets: ", error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
