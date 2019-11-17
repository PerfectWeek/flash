import socketIo from "socket.io";

export function socketHandler(io: socketIo.Server, socket: socketIo.Socket) {
  socket.on("join", (id: string) => {
    socket.join(id);
    io.to(id).emit("newUser");
  });
  socket.on("focusTimeslot", (id: string, start: Date, end: Date) => {
    io.to(id).emit("focusTimeslot", { start, end });
  });
  socket.on("disconnect", reason => {
    console.log(`User disconnected (${reason})`);
  });
}
