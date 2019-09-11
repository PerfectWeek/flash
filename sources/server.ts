import mongoose from 'mongoose';
import socketIo from 'socket.io';

import app from './app';
import { checkEnvVariable } from './utils/checkEnvVariable';
import { socketHandler } from './api/services/SocketService';

const port = process.env.PORT || 3000;

try {
  checkEnvVariable('GOOGLE_CLIENT_ID');
  checkEnvVariable('GOOGLE_CLIENT_SECRET');
  checkEnvVariable('API_HOST');
  checkEnvVariable('WEB_HOST');
  checkEnvVariable('MONGODB_URI');
  checkEnvVariable('JWT_ENCODE_KEY');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err: any) => {
  if (err) {
    console.log(err.message);
    process.exit(1);
  } else {
    console.log('Succesfully Connected!');
  }
});

const server = app.listen(
  port,
  () => console.log(`Server is now running on port ${port}`),
);

const io = socketIo(server);

io.on('connection', (socket: socketIo.Socket) => socketHandler(io, socket));

export default server;
