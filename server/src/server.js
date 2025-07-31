import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { appConfig } from './config/index.js';
import { connectDB } from './db/connection.js';
import configureRoutes from './routes/api/index.js';
import createTables from './db/init.js';

const app = express();

//app.use(bodyParser.json());

app.use(express.json())
app.use(cors());

//db
connectDB()
createTables()

configureRoutes(app);

app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
})