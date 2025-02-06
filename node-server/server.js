import express from 'express';
import cors from 'cors';




const app = express();
const PORT = 5000;
console.log(PORT);
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',//?
    credentials: true,
}))

