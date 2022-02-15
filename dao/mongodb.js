// Ambas líneas de código son váldas para extraer el MongoClient.
const MongoClient = require("mongodb").MongoClient;
// import { MongoClient } from "mongodb";
let db = null;
let client = null;

// Conexión a la base de datos de MongoDB.
const getDb = async () => {
  if (db) {
    return db;
  }
  if (!client) {
    client = await MongoClient.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  db = client.db();
  return db;
};

// export default getDb;
module.exports = getDb;
