const express = require('express');
const fs = require('fs');
const app = express();
const port = 3030;

app.set('trust proxy', true);

// Serve static favicon if needed (optional: drop in your own favicon.ico)
app.use('/favicon.ico', express.static('favicon.ico'));

app.get('/', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Ensure IP is IPv4
  if (ip && ip.includes('::ffff:')) {
    ip = ip.split('::ffff:')[1]; // Extract IPv4 from IPv6-mapped IPv4 address
  }
  
  const userAgent = req.get('User-Agent');
  const language = req.get('Accept-Language');
  const referrer = req.get('Referer') || 'None';
  const method = req.method;
  const time = new Date().toString();

  const city = req.get('cf-ipcity') || 'Unknown';
  const country = req.get('cf-ipcountry') || 'Unknown';
  const region = req.get('cf-region') || 'Unknown';

  const logLine = `${time} | ${ip} | ${country}, ${region}, ${city} | ${userAgent}\n`;
  fs.appendFileSync('visits.log', logLine);

  res.send(`
    <!DOCTYPE html>
    <html lang="en" data-bs-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Visitor Info</title>

      <!-- Favicon -->
      <link rel="icon" href="https://emojicdn.elk.sh/😭" />

      <!-- Bootstrap -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

      <!-- Fira Code Font -->
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">

      <style>
        body {
          background-color: #121212;
          color: #f8f9fa;
          font-family: 'Fira Code', monospace;
        }
        .card {
          background-color: #1e1e1e;
          border: 1px solid #333;
        }
        .list-group-item {
          background-color: #2c2c2c;
          border-color: #444;
        }
        .muted {
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container d-flex align-items-center justify-content-center vh-100">
        <div class="card shadow-lg p-4 w-100" style="max-width: 600px;">
          <h2 class="mb-4 text-center">😭🌍😭🌍😭 Your Visitor Info</h2>
          <ul class="list-group mb-3">
            <li class="list-group-item"><strong>IP Address:</strong> ${ip}</li>
            <li class="list-group-item"><strong>City:</strong> ${city}</li>
            <li class="list-group-item"><strong>Region:</strong> ${region}</li>
            <li class="list-group-item"><strong>Country:</strong> ${country}</li>
            <li class="list-group-item"><strong>User-Agent:</strong> <small>${userAgent}</small></li>
            <li class="list-group-item"><strong>Language:</strong> ${language}</li>
            <li class="list-group-item"><strong>Referrer:</strong> ${referrer}</li>
            <li class="list-group-item"><strong>HTTP Method:</strong> ${method}</li>
            <li class="list-group-item"><strong>Time:</strong> ${time}</li>
          </ul>
          <div class="text-center muted">
            Logged to <code>visits.log</code>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`);
});
