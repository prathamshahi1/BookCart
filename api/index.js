export default async function handler(req, res) {
  try {
    const { default: app } = await import('../server/server.js');
    return app(req, res);
  } catch (error) {
    console.error('SERVERLESS BOOT ERROR:', error);
    return res.status(500).json({
      error: 'SERVERLESS BOOT ERROR',
      message: error.message,
      stack: error.stack
    });
  }
}
