import express, { Application } from 'express';
import connectDB from './database';
import dotenv from 'dotenv';
import { router } from './router';
import cors from 'cors'
import consumer from './rabbitmq/consumer';
import cookieParser from 'cookie-parser';
const app: Application = express();

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
app.use(cookieParser()); 

// Connect to MongoDB
connectDB();
consumer.start()
app.use('/api', router)


const PORT = process.env.PORT as number | undefined || 5000;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();
