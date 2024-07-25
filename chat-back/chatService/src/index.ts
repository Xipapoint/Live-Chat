import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectToDatabase from './database';
import { connectRabbitMQ } from './services/rabbitmqService';
import chatRoutes from './routes/chatRoutes';
import { setupWebSocket } from './services/websocketService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/chat', chatRoutes);

const server = createServer(app);

connectToDatabase();
connectRabbitMQ()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Chat service running on port ${PORT}`);
      setupWebSocket(server);
    });
  })
  .catch((err: any) => {
    console.log(err);
    
    process.exit(1);
  });
