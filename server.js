const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Allow requests from your frontend domain on AWS Amplify
app.use(cors({ origin: 'https://www.cpb-uglsolution.com' }));

const PORT = 4000;
app.use(express.json());

const VISITOR_FILE = 'visitors.json';

// Initialize if not exist
if (!fs.existsSync(VISITOR_FILE)) {
  fs.writeFileSync(VISITOR_FILE, JSON.stringify({ count: 0, logs: [] }, null, 2));
}

app.post('/track-visitor', (req, res) => {
  const visitorData = req.body;
  const db = JSON.parse(fs.readFileSync(VISITOR_FILE));

  db.count += 1;
  db.logs.push({ ...visitorData, time: new Date().toISOString() });

  fs.writeFileSync(VISITOR_FILE, JSON.stringify(db, null, 2));
  res.status(200).send('Visitor logged');
});

app.get('/get-visitors', (req, res) => {
  const db = JSON.parse(fs.readFileSync(VISITOR_FILE));
  res.json(db);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
