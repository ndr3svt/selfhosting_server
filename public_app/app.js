const express = require('express');
const app = express();
const PORT = 3000;


// Middleware to log details about each incoming request
app.use((req, res, next) => {
  let now = new Date();
  console.log('New connection:');
  console.log('Time:', now.toUTCString());
  console.log('Host:', req.hostname);
  console.log('URL:', req.originalUrl);
  next();
});

app.use(express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.listen(PORT, () => {
  console.log(`Dynamic site running at http://localhost:${PORT}`);
});
