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

const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting middleware to prevent abuse
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests", message: "Please try again later" },
  handler: (req, res, _next, options) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

// Security middleware
const helmet = require('helmet');
app.use(helmet()); // Set security headers

// Configure CORS with more restrictive settings
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://busmate.com']
    : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Body parser middleware with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static files
app.use("/tts-audio", express.static(path.join(__dirname, "tts-audio"), {
  maxAge: '1d', // Cache for 1 day
  etag: true
}));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // 5 second timeout for server selection
})
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit with failure if database connection fails
  });

const Message = mongoose.model("Message", new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
}));

const userSessionMap = new Map();

/**
 * Fetches relevant database information for the AI assistant
 * @param {string} userId - The user ID to fetch specific user data
 * @returns {Promise<string>} - Formatted database information
 */
async function fetchDatabaseInfo(userId) {
  try {
    // Check database connection
    if (!mongoose.connection.readyState) {
      console.error("❌ MongoDB not connected");
      throw new Error("MongoDB not connected.");
    }

    const db = mongoose.connection.db;
    const collections = ["buses", "busroutes", "favoritebuses", "users", "onlinetickets"];
    let dbInfo = "";

    console.log(`🔍 Fetching database info for user: ${userId || 'unknown'}`);

    // Process each collection with proper error handling
    for (const name of collections) {
      try {
        let data;
        // Special handling for user collection to get specific user data
        if (name === "users" && userId) {
          data = await db.collection(name).find({ _id: mongoose.Types.ObjectId(userId) }).limit(1).toArray();
          if (data.length === 0) {
            // Fallback to get a sample of users if specific user not found
            data = await db.collection(name).find({}).limit(5).toArray();
          }
        } else {
          // For other collections, get a reasonable sample size
          data = await db.collection(name).find({}).limit(10).toArray();
        }

        // Format the data for each collection
        dbInfo += `\nCollection: ${name} (${data.length} records)\n${data.map(d => JSON.stringify(d)).join("\n")}`;
        console.log(`✅ Fetched ${data.length} records from ${name}`);
      } catch (collectionErr) {
        console.error(`❌ Error fetching from ${name} collection:`, collectionErr);
        dbInfo += `\nCollection: ${name}\nError: Could not fetch data`;
      }
    }

    console.log(`💾 Database info fetched successfully: ${dbInfo.length} bytes`);
    return dbInfo;
  } catch (err) {
    console.error("❌ Database fetch error:", err);
    return "Database fetch error: " + err.message;
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
You are a multilingual bus assistant built by techy squad, designed to assist users in booking bus tickets dynamically and answer general questions. The user might speak in Tamil or English. Detect the language and respond in the same language. Use the following data to help the user.

Current User ID: ${userId}
Bus-related Database Info:
${dbInfo}

Instructions:

1. BOOKING TICKETS:
- When the user expresses intent to book a ticket (e.g., "I want to book a ticket" or "I want to make a ticket"), ask for the starting point (e.g., "Please tell me the starting point (from where).").
- After receiving the starting point, ask for the destination (e.g., "Great, now tell me the destination (to where).").
- Once both starting point and destination are provided, list available buses with details (route number, bus number, time, available seats, price) based on the database info and ask which bus they want to book.
- After the user selects a bus (e.g., by mentioning the route number like "55B"), ask how many seats they want.
- Once the number of seats is provided, confirm the booking details (e.g., "I will book a ticket for you from [from] to [to] on [bus] for [seats] seats") and indicate that the booking is complete with "Booking complete!".

2. GENERAL QUESTIONS:
- If the user asks general knowledge questions (e.g., "What is the capital of France?", "How does photosynthesis work?"), provide accurate, helpful, and concise answers.
- For questions about weather, time, date, or other real-time information, explain that you don't have access to real-time data but provide general information.
- If asked about your capabilities, explain that you can help with bus bookings, provide information about routes and schedules, and answer general knowledge questions.

3. BUS-RELATED QUERIES:
- For questions about specific bus routes, schedules, or fares, check the database info provided and give accurate answers.
- If the information isn't available in the database, politely say so and suggest alternatives.

4. RESPONSE STYLE:
- Always be polite, helpful, and conversational.
- Keep responses concise but informative.
- If you don't know the answer or can't help with a specific request, be honest and suggest alternatives.
- Always respond in the same language as the user's query (Tamil or English).

5. BOOKING TRIGGERS:
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
        
        const fromMatch = botResponse.match(/from\s+([^\s]+(?:\s+[^\s]+)*)\s+to/i) || (session.booking.from && [null, session.booking.from]);
        const toMatch = botResponse.match(/to\s+([^\s]+(?:\s+[^\s]+)*)\s+on/i) || (session.booking.to && [null, session.booking.to]);
        const busMatch = botResponse.match(/on\s+([^\s]+(?:\s+[^\s]+)*)\s+for/i) || (session.booking.bus && [null, session.booking.bus]);
        const seatsMatch = botResponse.match(/for\s+(\d+)\s+seats/i) || (session.booking.seats && [null, session.booking.seats]);

        bookingData = {
          from: fromMatch ? fromMatch[1] : session.booking.from,
          to: toMatch ? toMatch[1] : session.booking.to,
          bus: busMatch ? busMatch[1] : session.booking.bus,
          seats: seatsMatch ? seatsMatch[1] : session.booking.seats
        };
        session.booking = bookingData;
        console.log("Booking triggered with data:", bookingData);
      }

      // Update session booking data incrementally
      if (!session.booking.from && message.toLowerCase().includes("from")) {
        const fromMatch = message.match(/from\s+([^\s]+)/i);
        if (fromMatch) session.booking.from = fromMatch[1];
      }
      if (!session.booking.to && message.toLowerCase().includes("to")) {
        const toMatch = message.match(/to\s+([^\s]+)/i);
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
            exec(`edge-tts --text "${botResponse.replace(/"/g, '\"')}" --write-media "${filename}"`, (err) => {
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
      console.error("❌ Chat Error:", err);
      if (err.status === 429 && attempt < maxRetries - 1) {
        console.warn(`⚠️ Rate limit hit, retrying in 5 seconds... (Attempt ${attempt + 1})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempt++;
      } else {
        // Provide a fallback response even when there's an error
        const fallbackResponses = [
          "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
          "It seems there's a technical issue on my end. Could you please try again?",
          "I apologize for the inconvenience, but I'm experiencing some difficulties. Please try again shortly.",
          "I'm currently having trouble connecting to my knowledge base. Please try again in a few moments."
        ];

        const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        console.log(`🚫 Using fallback response due to error: ${fallbackResponse}`);

        // Create audio for the fallback response if speak was requested
        let audioPath = null;
        if (speak) {
          try {
            const filename = `tts-audio/${Date.now()}.mp3`;
            audioPath = filename;

            if (!fs.existsSync(path.join(__dirname, "tts-audio"))) {
              fs.mkdirSync(path.join(__dirname, "tts-audio"));
            }

            await new Promise((resolve, reject) => {
              exec(`edge-tts --text "${fallbackResponse}" --write-media "${filename}"`, (err) => {
                if (err) {
                  console.error("❌ TTS Error for fallback response:", err);
                  return reject(err);
                }
                resolve();
              });
            });
          } catch (ttsErr) {
            console.error("❌ TTS Error for fallback:", ttsErr);
            audioPath = null;
          }
        }

        // Send the fallback response
        res.json({
          response: fallbackResponse,
          audioPath: audioPath,
          triggerBooking: false,
          bookingData: null,
          error: true,
          errorDetails: err.message
        });
        return;
      }
    }
  }
});

// Start the server
const server = app.listen(PORT, () => {
  const address = server.address();
  const host = address.address === '::' ? 'localhost' : address.address;
  console.log(`🚀 Server running at http://${host}:${PORT}`);
  console.log(`💾 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔔 Press CTRL+C to stop`);
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Gracefully shut down the server
 */
function gracefulShutdown() {
  console.log('\n🔔 Received shutdown signal, closing server...');
  server.close(() => {
    console.log('💾 Closing database connection...');
    mongoose.connection.close(false, () => {
      console.log('👋 Server and database connections closed. Goodbye!');
      process.exit(0);
    });
  });

  // Force close if graceful shutdown takes too long
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}