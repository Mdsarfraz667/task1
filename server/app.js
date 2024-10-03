import express from "express"
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js';
import dbConnect from "./config/dbConnect.js";
import cors from 'cors'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();
app.use(express.json());
app.use(cors())
app.use('/api/v1/users', userRoutes);
app.use('/', (req, res) => {
    return res.send("Hello World1");
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})