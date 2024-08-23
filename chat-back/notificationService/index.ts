import express, { Application } from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import connectToDatabase from './database';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// import { router } from './routes';
import http from 'http';
import { WebSocketServer } from 'ws';
// import { handleConnection } from './ws/connectionHandler';
// import errorMiddleware from './middleware/errorMiddleware';
// import chatRoutes from './routes/chatRoutes';
// import { setupWebSocket } from './services/websocketService';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5002;

const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
        if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // This is important to allow cookies and other credentials
};

app.use(cors(corsOptions));
app.use(express.json());
dotenv.config({ path: __dirname+'/.env' });
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser()); 

// app.use('/api', router);
// app.use(errorMiddleware);

connectToDatabase();
const server = http.createServer(app);

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
const wss = new WebSocketServer({ server });

// wss.on('connection', (ws, req) => {
//   handleConnection(wss, ws, req);
// });