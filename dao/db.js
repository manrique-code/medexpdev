// Lo más prudente sería tener variables de ambiente para poder elegir si vamos a usar
// SQLITE3 o MongoDB
const sqlite3 = require("sqlite3");
let db = null;
const initDB = () => {
  return new Promise((accept, reject) => {
    let database = new sqlite3.Database(
      // "../data/medexp.sqlite3",
      `./data/${process.env.DB_FILENAME}.sqlite3`,
      (err) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        accept(database);
      }
    );
  });
};

const singletonGetDB = async () => {
  if (!db) {
    db = await initDB();
  }
  return db;
};

module.exports = singletonGetDB;
