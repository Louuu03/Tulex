import { MongoClient, Db } from 'mongodb';

const uri: string = process.env.MONGODB_URI!;
const dbName: string = process.env.DB_NAME!;

// Use a more specific type for the client to leverage TypeScript's type system.
let client: MongoClient = new MongoClient(uri);

// Define an interface for the connection object.
interface DbConnection {
  db: Db;
  client: MongoClient;
}

// This variable will hold the connection object once established.
let dbConnection: DbConnection | null = null;

const connectToDatabase = async (): Promise<DbConnection> => {
  if (dbConnection) {
    return dbConnection;
  }

  try {
    await client.connect();
    const db: Db = client.db(dbName);
    dbConnection = { db, client };
    return dbConnection;
  } catch (error) {
    console.error('Could not connect to the database:', error);
    // Depending on your error handling policy, you might want to throw the error,
    // return a rejected promise, or handle it in some other way.
    throw error;
  }
};

export { connectToDatabase };
