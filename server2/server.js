require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const rateLimit = require("express-rate-limit");

const upload = multer({ dest: "Uploads/" });
const app = express();
const PORT = process.env.PORT || 5000;

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later.",
});

app.use(cors());
app.use(express.json());
app.use("/tts-audio", express.static(path.join(__dirname, "tts-audio")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const Message = mongoose.model("Message", new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
}));

const userSessionMap = new Map();

async function fetchDatabaseInfo(userId) {
  try {
    if (!mongoose.connection.readyState) {
      throw new Error("MongoDB not connected.");
    }

    const db = mongoose.connection.db;
    const collections = ["buses", "busroutes", "favoritebuses", "users", "onlinetickets"];
    let dbInfo = "";

    for (const name of collections) {
      let data;
      if (name === "users") {
        data = await db.collection(name).find({ _id: userId }).toArray();
        if (data.length === 0) {
          data = await db.collection(name).find({}).toArray();
        }
      } else {
        data = await db.collection(name).find({}).toArray();
      }
      dbInfo += `\nCollection: ${name}\n${data.map(d => JSON.stringify(d)).join("\n")}`;
    }

    console.log(`fetchDatabaseInfo output length: ${dbInfo.length}`);
    return dbInfo;
  } catch (err) {
    console.error("❌ DB Fetch Error:", err);
    return "Database fetch error.";
  }
}

app.post("/chat", chatLimiter, async (req, res) => {
  const { message, userId, speak } = req.body;
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      let session = userSessionMap.get(userId) || { messages: [], booking: {} };
      console.log("User message:", message);
      console.log("Current session booking data:", session.booking);

      if (!session.messages.length) {
        const dbInfo = await fetchDatabaseInfo(userId);
        const systemPrompt = `
You are a multilingual bus assistant built by techy squad, designed to assist users in booking bus tickets dynamically. The user might speak in Tamil or English. Detect the language and respond in the same language. Use the following data to help the user.
Current User ID: ${userId}
Bus-related Database Info:
${dbInfo}
Instructions:
- When the user expresses intent to book a ticket (e.g., "I want to book a ticket" or "I want to make a ticket"), ask for the starting point (e.g., "Please tell me the starting point (from where).").
- After receiving the starting point, ask for the destination (e.g., "Great, now tell me the destination (to where).").
- Once both starting point and destination are provided, list available buses with details (route number, bus number, time, available seats, price) based on the database info and ask which bus they want to book.
- After the user selects a bus (e.g., by mentioning the route number like "55B"), ask how many seats they want.
- Once the number of seats is provided, confirm the booking details (e.g., "I will book a ticket for you from [from] to [to] on [bus] for [seats] seats") and indicate that the booking is complete with "Booking complete!".
- For non-booking queries, provide helpful responses based on the database info or general knowledge.
- Ensure responses are conversational and natural, similar to the example chat provided.
- When the booking is complete, include a trigger in the response to indicate that the booking process is finished and provide the booking data (from, to, bus, seats).
User message:
${message}`;
        session.messages = [{ role: "user", parts: [{ text: systemPrompt }] }];
      } else {
        session.messages.push({ role: "user", parts: [{ text: message }] });
      }

      const result = await model.generateContent({ contents: session.messages });
      let botResponse = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      console.log("AI Response:", botResponse);

      // Check if the response indicates a completed booking
      let triggerBooking = false;
      let bookingData = {};
      const lowerResponse = botResponse.toLowerCase();
      if (lowerResponse.includes("book a ticket for you") || lowerResponse.includes("booking complete")) {
        triggerBooking = true;
        // Strip metadata from botResponse
        const cleanedResponse = botResponse.replace(/\{\{.*?\}\}/, "").trim();
        // Extract booking details from the cleaned response or session
        const fromMatch = cleanedResponse.match(/from\s+([^\s]+(?:\s+[^\s]+)*?)(?=\s+to\s+[^\s])/i) || (session.booking.from && [null, session.booking.from]);
        const toMatch = cleanedResponse.match(/to\s+([^\s]+(?:\s+[^\s]+)*?)(?=\s+on\s+[^\s])/i) || (session.booking.to && [null, session.booking.to]);
        const busMatch = cleanedResponse.match(/on\s+([^\s]+(?:\s+[^\s]+)*?)(?=\s+for\s+\d+)/i) || (session.booking.bus && [null, session.booking.bus]);
        const seatsMatch = cleanedResponse.match(/for\s+(\d+)\s+seats/i) || (session.booking.seats && [null, session.booking.seats]);

        bookingData = {
          from: fromMatch ? fromMatch[1] : session.booking.from,
          to: toMatch ? toMatch[1] : session.booking.to,
          bus: busMatch ? busMatch[1] : session.booking.bus,
          seats: seatsMatch ? seatsMatch[1] : session.booking.seats
        };
        console.log("Booking triggered with data:", bookingData);
        // Reset session booking data after a successful booking
        session.booking = {};
      }

      // Update session booking data incrementally
      if (!session.booking.from && message.toLowerCase().includes("from")) {
        const fromMatch = message.match(/from\s+([^\s]+(?:\s+[^\s]+)*)/i);
        if (fromMatch) session.booking.from = fromMatch[1];
      }
      if (!session.booking.to && message.toLowerCase().includes("to")) {
        const toMatch = message.match(/to\s+([^\s]+(?:\s+[^\s]+)*)/i);
        if (toMatch) session.booking.to = toMatch[1];
      }
      if (!session.booking.bus && message.match(/(bus\s+)?(\d+[a-zA-Z]*)/i)) {
        const busMatch = message.match(/(bus\s+)?(\d+[a-zA-Z]*)/i);
        if (busMatch) session.booking.bus = busMatch[2];
      }
      if (!session.booking.seats && message.match(/(\d+)\s+seats?/i)) {
        const seatsMatch = message.match(/(\d+)\s+seats?/i);
        if (seatsMatch) session.booking.seats = seatsMatch[1];
      }

      session.messages.push({ role: "model", parts: [{ text: botResponse }] });
      userSessionMap.set(userId, session);

      await Message.insertMany([
        { sender: "user", text: message },
        { sender: "bot", text: botResponse }
      ]);

      let audioPath = null;
      if (speak && botResponse.trim()) {
        const filename = `tts-audio/${Date.now()}.mp3`;
        audioPath = filename;
        try {
          if (!fs.existsSync(path.join(__dirname, "tts-audio"))) {
            fs.mkdirSync(path.join(__dirname, "tts-audio"));
          }
          await new Promise((resolve, reject) => {
            exec(`edge-tts --text "${botResponse.replace(/"/g, '\\"').replace(/\{\{.*?\}\}/, "")}" --write-media "${filename}"`, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        } catch (err) {
          console.error("TTS Error:", err);
          audioPath = null;
        }
      }

      const responsePayload = {
        response: botResponse,
        audioPath: audioPath || null,
        triggerBooking,
        bookingData: triggerBooking ? bookingData : null
      };
      console.log("Final response:", responsePayload);

      res.json(responsePayload);
      return;

    } catch (err) {
      console.error("Chat Error:", err);
      if (err.status === 429 && attempt < maxRetries - 1) {
        console.warn(`Rate limit hit, retrying in 5 seconds... (Attempt ${attempt + 1})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempt++;
      } else {
        res.status(500).json({ error: "Server error", details: err.message });
        return;
      }
    }
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));