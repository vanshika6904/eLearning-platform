import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= TEST ROUTES =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/test", (req, res) => {
  res.json({ message: "TEST WORKING" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quiz", quizRoutes);

// ================= DATABASE =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};

// ================= SOCKET.IO =================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// { quizId: { remaining: number, interval: NodeJS.Timeout } }
const quizTimers = {};

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("startQuiz", ({ quizId, duration = 60, forceRestart = false }) => {
    if (!quizId) return;
    socket.join(quizId);

    if (forceRestart && quizTimers[quizId]) {
      clearInterval(quizTimers[quizId].interval);
      delete quizTimers[quizId];
    }

    if (quizTimers[quizId]) {
      socket.emit("timerUpdate", quizTimers[quizId].remaining);
      return;
    }

    let remaining = Number(duration) || 60;
    io.to(quizId).emit("timerUpdate", remaining);

    const interval = setInterval(() => {
      remaining -= 1;
      if (quizTimers[quizId]) {
        quizTimers[quizId].remaining = remaining;
      }

      io.to(quizId).emit("timerUpdate", remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        io.to(quizId).emit("quizEnded");
        delete quizTimers[quizId];
      }
    }, 1000);

    quizTimers[quizId] = {
      remaining,
      interval
    };
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});