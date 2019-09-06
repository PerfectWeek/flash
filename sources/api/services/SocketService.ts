import socketIo from 'socket.io';

export function socketHandler(io: socketIo.Server, socket: socketIo.Socket) {
  socket.on('join', (id: string) => {
    socket.join(id);
    io.to(id).emit('newUser', `New user joined room ${id}`);
  });
}
