import mongoose from 'mongoose';

import app from './app';
import { checkEnvVariable } from './utils/checkEnvVariable';

const port = process.env.PORT || 3000;

try {
  checkEnvVariable('GOOGLE_CLIENT_ID');
  checkEnvVariable('GOOGLE_CLIENT_SECRET');
  checkEnvVariable('API_HOST');
  checkEnvVariable('MONGODB_URI');
  checkEnvVariable('JWT_ENCODE_KEY');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err: any) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Succesfully Connected!');
  }
});

const server = app.listen(
  port,
  () => console.log(`Server is now running on port ${port}`),
);

export default server;
