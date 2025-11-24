import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(80, () => {
  console.log('CORS-enabled web server listening on port 80');
});
