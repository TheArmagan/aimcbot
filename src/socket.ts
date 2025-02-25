import socketIO from "socket.io";

export const io = new socketIO.Server({
  cors: {
    origin: "*",
  },
});

io.listen(3001);
console.log("Socket server is running on port 3001");