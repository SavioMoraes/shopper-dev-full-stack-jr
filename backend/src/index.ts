import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { Mongo } from './database/mongo';

config();

async function main() {
  const hostname = 'localhost';
  const port = process.env.PORT || 3000;

  const app = express();

  const mongoDbName = process.env.MONGO_DB_NAME || '';
  const mongoConnection = await Mongo.connect({
    mongoConnectionString: process.env.MONGO_CS ?? '',
    mongoDbName
  });
  console.log(mongoConnection);

  app.use(express.json());
  app.use(cors());
  
  app.get('/', (req, res) => {
    res.send({
      success: true,
      statusCode: 200,
      body: 'Welcome to the Shopper API!'
    });
  });
  
  
  app.listen(port, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
  });
}

main();
