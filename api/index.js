export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    message: 'Hello from Vercel Serverless Function!',
    timestamp: new Date().toISOString()
  });
}
