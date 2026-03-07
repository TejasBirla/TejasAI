import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/DBconnect.js";
import { chatWithAI } from "./controller/chatController.js";
import profileRouter from "./router/profileRouter.js";
import projectRouter from "./router/projectRouter.js";
import adminRouter from "./router/adminRouter.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const ALLOWED_ORIGIN =
  process.env.FRONTEND_URL || "https://tejas-personal-ai.vercel.app";

app.use(express.json());
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.status(200).send("Server working fine.");
});

app.use("/api/profile", profileRouter);
app.use("/api/project", projectRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 9000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: ALLOWED_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connect", (socket) => {
      console.log("User connected. ", socket.id);

      socket.on("sendMessage", (userMessage) => {
        chatWithAI(socket, userMessage);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected. ", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
};

startServer();
