import { createClient } from 'redis';

let redisAvailable = false;

const redisClient = createClient({
  url: 'redis://localhost:6379',

  socket: {
    reconnectStrategy() {
      return 10000;
    }
  }
});

redisClient.on('connect', () => {
  console.log('🔌 Conectando ao Redis...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis pronto!');
  redisAvailable = true;
});

redisClient.on('end', () => {
  console.log('❌ Conexão com Redis perdida.');
  redisAvailable = false;
});

redisClient.on('error', (err) => {
  console.log('⚠️ Erro no Redis:', err.message);
  redisAvailable = false;
});

redisClient.connect().catch(err => {
  console.log('Erro inicial ao conectar no Redis:', err);
});

export { redisAvailable };
export default redisClient;