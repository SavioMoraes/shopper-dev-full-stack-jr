import { MongoClient, Db } from 'mongodb';
// import { MongoClient } from 'mongodb';

export const Mongo = {
  client: null as MongoClient | null,
  db: null as Db | null,

  async connect({ mongoConnectionString, mongoDbName }: { mongoConnectionString: string, mongoDbName: string }) {
    try {
      const client = new MongoClient(mongoConnectionString);
  
      await client.connect();
      const db = client.db(mongoDbName);

      this.client = client;
      this.db = db;

      return 'Connected to MongoDB!';
      
    } catch (error) {
      return { text: 'Error during mongo connection', error };
    }
  }
}
