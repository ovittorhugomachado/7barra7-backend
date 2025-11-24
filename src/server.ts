import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';

const app = express();

app.use(cors());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({
      message: "Conexão com Prisma funcionando!",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao conectar no banco" });
  }
});

app.listen(80, () => {
  console.log('CORS-enabled web server listening on port 80');
});
