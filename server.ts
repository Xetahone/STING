import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import mediaRoutes from "./routes/media";
import initSocket from "./ws";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: "*" }
});

app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/media", mediaRoutes);

initSocket(io);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Sting backend running on http://localhost:${port}`);
});