import connectDB from '../server/config/db.js';
import app from '../server/server.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Vercel Serverless Function DB Error:', error);
    return res.status(500).json({
      success: false,
      message: `Database Connection Failed: ${error.message}`
    });
  }
}
