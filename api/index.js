import connectDB from '../server/config/db.js';
import app from '../server/server.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Serverless DB Connect Error:', error);
  }
  return app(req, res);
}
