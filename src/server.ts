import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './modules/user/user.routes'

const app = express();
const port = 3000;

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

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log('CORS-enabled web server listening on port 3000');
});
