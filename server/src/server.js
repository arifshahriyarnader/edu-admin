import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { appConfig } from './config/index.js';
import { connectDB } from './db/connection.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json())

//db
connectDB()
app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
})