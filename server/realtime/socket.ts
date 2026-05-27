import { io } from "../store";

io.on("connection", (socket) => {
  console.log("A user connected to real-time feed:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
