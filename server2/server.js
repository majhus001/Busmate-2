// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { exec } = require("child_process");
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");
// const { SpeechClient } = require("@google-cloud/speech");
// const rateLimit = require("express-rate-limit");

// const upload = multer({ dest: "uploads/" });
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Rate limiting middleware for /chat endpoint
// const chatLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 10, // Max 10 requests per minute per IP
//   message: "Too many requests, please try again later.",
// });

// app.use(cors());
// app.use(express.json());
// app.use("/tts-audio", express.static(path.join(__dirname, "tts-audio")));

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // MongoDB setup
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// const Message = mongoose.model(
//   "Message",
//   new mongoose.Schema({
//     sender: String,
//     text: String,
//     timestamp: { type: Date, default: Date.now },
//   })
// );

// // In-memory session tracking
// const userSessionMap = new Map(); // userId => [chatHistory]

// async function fetchDatabaseInfo(userId) {
//   try {
//     if (!mongoose.connection.readyState) {
//       throw new Error("MongoDB not connected.");
//     }

//     const db = mongoose.connection.db;
//     const collections = ["buses", "favoritebuses", "users", "onlinetickets"];
//     let dbInfo = "";

//     for (const name of collections) {
//       const data = await db.collection(name).find({}).limit(5).toArray();
//       dbInfo += `\nCollection: ${name}\n${data.map((d) => JSON.stringify(d)).join("\n")}`;
//     }

//     console.log(`fetchDatabaseInfo output length: ${dbInfo.length}`);
//     return dbInfo;
//   } catch (err) {
//     console.error("❌ DB Fetch Error:", err);
//     return "Database fetch error.";
//   }
// }

// // 🤖 Chat endpoint
// app.post("/chat", chatLimiter, async (req, res) => {
//   const { message, userId, speak } = req.body;
//   const maxRetries = 3;
//   let attempt = 0;

//   while (attempt < maxRetries) {
//     try {
//       let messages = userSessionMap.get(userId);

//       if (!messages) {
//         const dbInfo = await fetchDatabaseInfo(userId);
//         const systemPrompt = `
// You are a multilingual bus assistant. The user might speak in Tamil or English. Detect the language and respond in the same language.
// Use the following data to help the user.
// Bus-related Database Info:
// ${dbInfo}
// Current User ID: ${userId}
// User message:
// ${message}`;
//         console.log(`Input tokens estimate: ${systemPrompt.length + message.length}`);
//         messages = [{ role: "user", parts: [{ text: systemPrompt }] }];
//       } else {
//         messages.push({ role: "user", parts: [{ text: message }] });
//       }

//       const result = await model.generateContent({ contents: messages });
//       let botResponse =
//         result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//       const lowerMessage = message.toLowerCase();
//       const hasBookingIntent =
//         lowerMessage.includes("book") &&
//         lowerMessage.includes("ticket") &&
//         (lowerMessage.includes("from") ||
//           lowerMessage.includes("to") ||
//           lowerMessage.includes("bus"));

//       let triggerBooking = false;
//       if (hasBookingIntent) {
//         botResponse = "I will book a ticket for you";
//         triggerBooking = true;
//       }

//       messages.push({ role: "model", parts: [{ text: botResponse }] });
//       userSessionMap.set(userId, messages);

//       await Message.insertMany([
//         { sender: "user", text: message },
//         { sender: "bot", text: botResponse },
//       ]);

//       // TTS
//       let audioPath = null;
//       if (speak) {
//         const filename = `tts-audio/${Date.now()}.mp3`;
//         audioPath = filename;
//         try {
//           await new Promise((resolve, reject) => {
//             exec(
//               `edge-tts --text "${botResponse}" --write-media "${filename}"`,
//               (err) => {
//                 if (err) return reject(err);
//                 resolve();
//               }
//             );
//           });
//         } catch (err) {
//           console.error("TTS Error:", err);
//           audioPath = null;
//         }
//       }

//       res.json({ response: botResponse, audioPath: audioPath || null, triggerBooking });
//       return;
//     } catch (err) {
//       if (err.status === 429 && attempt < maxRetries - 1) {
//         console.warn(`Rate limit hit, retrying in 5 seconds... (Attempt ${attempt + 1})`);
//         await new Promise((resolve) => setTimeout(resolve, 5000));
//         attempt++;
//       } else {
//         console.error("Chat Error:", err);
//         res.status(500).json({ error: "Server error" });
//         return;
//       }
//     }
//   }
// });

// // 🎙 Speech-to-text
// const speechClient = new SpeechClient({
//   keyFilename: path.join(__dirname, "path-to-your-google-credentials.json"), // Update with actual path
// });

// app.post("/speech-to-text", upload.single("audio"), async (req, res) => {
//   try {
//     const audioFile = req.file.path;
//     const audioStream = fs.createReadStream(audioFile);

//     const config = {
//       encoding: "LINEAR16",
//       sampleRateHertz: 16000,
//       languageCode: "en-IN",
//       alternativeLanguageCodes: ["ta-IN"],
//     };

//     const request = {
//       config,
//       interimResults: false,
//     };

//     const recognizeStream = speechClient
//       .streamingRecognize(request)
//       .on("error", (err) => {
//         console.error("Streaming Recognition Error:", err);
//         res.status(500).json({ error: "Failed to process audio" });
//       })
//       .on("data", (data) => {
//         const transcription = data.results
//           .map((result) => result.alternatives[0].transcript)
//           .join("\n");

//         if (data.results[0]?.isFinal) {
//           fs.unlinkSync(audioFile);
//           res.json({ text: transcription || "No speech detected" });
//         }
//       });

//     audioStream.pipe(recognizeStream);
//   } catch (err) {
//     console.error("Speech-to-Text error:", err);
//     fs.unlinkSync(req.file.path);
//     res.status(500).json({ error: "Failed to process audio" });
//   }
// });

// app.listen(PORT, () =>
//   console.log(`🚀 Server running at http://localhost:${PORT}`)
// );


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { SpeechClient } = require("@google-cloud/speech");
const rateLimit = require("express-rate-limit");

const upload = multer({ dest: "uploads/" });
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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // Reverted to match above

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
    const collections = ["buses", "busroutes", "favoritebuses", "users", "onlinetickets"]; // Added busroutes
    let dbInfo = "";

    for (const name of collections) {
      let data;
      if (name === "users") {
        // Fetch specific user profile
        data = await db.collection(name).find({ _id: userId }).toArray(); // Adjust field name as needed
        if (data.length === 0) {
          data = await db.collection(name).find({}).toArray(); // Fallback to all
        }
      } else {
        data = await db.collection(name).find({}).toArray(); // Fetch all to match above
      }
      dbInfo += `\nCollection: ${name}\n${data.map(d => JSON.stringify(d)).join("\n")}`;
    }

    console.log(`fetchDatabaseInfo output length: ${dbInfo.length}`);
    console.log("dbInfo:", dbInfo);
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
      let messages = userSessionMap.get(userId);

      if (!messages) {
        const dbInfo = await fetchDatabaseInfo(userId);
        const systemPrompt = `
You are a multilingual bus assistant. The user might speak in Tamil or English. Detect the language and respond in the same language.
Use the following data to help the user.
Current User ID: ${userId}
Bus-related Database Info:
${dbInfo}
User message:
${message}`;
        console.log(`Input tokens estimate: ${systemPrompt.length + message.length}`);
        messages = [{ role: "user", parts: [{ text: systemPrompt }] }];
      } else {
        messages.push({ role: "user", parts: [{ text: message }] });
      }

      const result = await model.generateContent({ contents: messages });
      let botResponse = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      const lowerMessage = message.toLowerCase();
      const hasBookingIntent = 
        lowerMessage.includes("book") && 
        lowerMessage.includes("ticket") && 
        (lowerMessage.includes("from") || lowerMessage.includes("to") || lowerMessage.includes("bus"));

      let triggerBooking = false;
      if (hasBookingIntent) {
        botResponse = "I will book a ticket for you";
        triggerBooking = true;
      }

      messages.push({ role: "model", parts: [{ text: botResponse }] });
      userSessionMap.set(userId, messages);

      await Message.insertMany([
        { sender: "user", text: message },
        { sender: "bot", text: botResponse }
      ]);

      let audioPath = null;
      if (speak) {
        const filename = `tts-audio/${Date.now()}.mp3`;
        audioPath = filename;
        try {
          await new Promise((resolve, reject) => {
            exec(`edge-tts --text "${botResponse}" --write-media "${filename}"`, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        } catch (err) {
          console.error("TTS Error:", err);
          audioPath = null;
        }
      }

      res.json({ response: botResponse, audioPath: audioPath || null, triggerBooking });
      return;

    } catch (err) {
      if (err.status === 429 && attempt < maxRetries - 1) {
        console.warn(`Rate limit hit, retrying in 5 seconds... (Attempt ${attempt + 1})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempt++;
      } else {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Server error" });
        return;
      }
    }
  }
});

const speechClient = new SpeechClient({
  keyFilename: path.join(__dirname, "path-to-your-google-credentials.json"),
});

app.post("/speech-to-text", upload.single("audio"), async (req, res) => {
  try {
    const audioFile = req.file.path;
    const audioStream = fs.createReadStream(audioFile);

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-IN",
      alternativeLanguageCodes: ["ta-IN"],
    };

    const request = {
      config,
      interimResults: false,
    };

    const recognizeStream = speechClient
      .streamingRecognize(request)
      .on("error", (err) => {
        console.error("Streaming Recognition Error:", err);
        res.status(500).json({ error: "Failed to process audio" });
      })
      .on("data", (data) => {
        const transcription = data.results
          .map((result) => result.alternatives[0].transcript)
          .join("\n");
        if (data.results[0]?.isFinal) {
          fs.unlinkSync(audioFile);
          res.json({ text: transcription || "No speech detected" });
        }
      });

    audioStream.pipe(recognizeStream);

  } catch (err) {
    console.error("Speech-to-Text error:", err);
    fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Failed to process audio" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
