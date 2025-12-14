import { Server } from "socket.io";

/**
 * Basic Socket.IO setup for signaling (calls) and realtime chat streaming.
 * - 'signal' for WebRTC SDP/ICE
 * - 'voice-stream-chunk' forwarded to recipient(s)
 * - 'call:invite', 'call:end'
 *
 * NOTE: This is a scaffold. Real production should authenticate sockets and scale with adapters.
 */
export default function initSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    socket.on("join", ({ userId }) => {
      socket.data.userId = userId;
      socket.join(`user:${userId}`);
    });

    socket.on("signal", (payload) => {
      // payload: { toUserId, data }
      io.to(`user:${payload.toUserId}`).emit("signal", {
        from: socket.data.userId,
        data: payload.data
      });
    });

    socket.on("voice-stream-chunk", (payload) => {
      // Forward realtime audio chunks (base64 or binary)
      io.to(`user:${payload.toUserId}`).emit("voice-stream-chunk", {
        from: socket.data.userId,
        chunk: payload.chunk
      });
    });

    socket.on("call:invite", (p) => {
      io.to(`user:${p.toUserId}`).emit("call:invite", {
        from: socket.data.userId,
        meta: p.meta
      });
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });
  });
}