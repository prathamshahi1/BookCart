export default async function handler(req, res) {
  const log = [];
  try {
    log.push('1. Importing express');
    await import('express');

    log.push('2. Importing dotenv');
    await import('dotenv');

    log.push('3. Importing mongoose');
    await import('mongoose');

    log.push('4. Importing bcryptjs');
    await import('bcryptjs');

    log.push('5. Importing jsonwebtoken');
    await import('jsonwebtoken');

    log.push('6. Importing cors');
    await import('cors');

    log.push('7. Importing helmet');
    await import('helmet');

    log.push('8. Importing db.js');
    await import('../server/config/db.js');

    log.push('9. Importing models');
    await import('../server/models/User.js');
    await import('../server/models/Book.js');
    await import('../server/models/Cart.js');
    await import('../server/models/Order.js');

    log.push('10. Importing routes');
    await import('../server/routes/authRoutes.js');
    await import('../server/routes/bookRoutes.js');

    log.push('11. Importing app.js');
    const { default: app } = await import('../server/app.js');

    log.push('12. Delegating to app');
    return app(req, res);
  } catch (err) {
    return res.status(200).json({
      status: 'error_caught',
      lastStep: log[log.length - 1],
      allSteps: log,
      errorMessage: err.message,
      errorStack: err.stack
    });
  }
}
