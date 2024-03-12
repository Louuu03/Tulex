const { MongoClient } = require('mongodb');

let uri = process.env.MONGODB_URI;
let dbName = process.env.DB_NAME;
let client = new MongoClient(uri);
let dbConnection;

const connectToDatabase = async () => {
  if (dbConnection) {
    return dbConnection;
  }

  await client.connect(); // Always attempt to connect; MongoClient handles pooling.

  const db = client.db(dbName);
  dbConnection = { db, client };
  return dbConnection;
};

module.exports = { connectToDatabase };
