export default async function handler(req, res) {
  try {
    const { default: app } = await import('./app.js');
    return app(req, res);
  } catch (err) {
    return res.status(200).json({
      success: false,
      debugError: err.message,
      debugStack: err.stack
    });
  }
}
