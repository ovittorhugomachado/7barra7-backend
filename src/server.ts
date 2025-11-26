import express from 'express';
import cors from 'cors';
import { testJwtRoutes } from './modules/teste-jwt';
import testRoutes from './modules/tests/tests.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(testJwtRoutes);
app.use(testRoutes);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(80, () => {
  console.log('CORS-enabled web server listening on port 80');
});
