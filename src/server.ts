import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './modules/user/user.routes';
import authRoutes from './modules/auth/auth.routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.get('/ping', (_, res) => {
  res.json({ message: 'pong' });
});

app.use('/api', userRoutes);
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
