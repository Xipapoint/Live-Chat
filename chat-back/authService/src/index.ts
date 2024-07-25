import express, { Application } from 'express';
import connectDB from './database';
import dotenv from 'dotenv';
import { router } from './router';
import cors from 'cors'

const app: Application = express();

app.use(cors())
app.use(express.json());
dotenv.config({ path: __dirname+'/.env' });
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Connect to MongoDB
connectDB();
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
