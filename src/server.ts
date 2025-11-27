import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(80, () => {
  console.log('CORS-enabled web server listening on port 80');
});
