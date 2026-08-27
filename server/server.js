import app from './app.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 BookCart Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
