import * as dotenv from 'dotenv';

dotenv.config();

if (process.env.JWT_SECRET == null) {
  throw new Error('JWT Secret has not been set up');
}

export default {
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: {
      session: false
  }
}