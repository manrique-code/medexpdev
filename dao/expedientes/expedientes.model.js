const getDb = require("../db");
let db = null;
class Expedientes {
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        if (process.env.MIGRATE === "true") {
          const createStatement =
            "CREATE TABLE IF NOT EXISTS expedientes(id INTEGER PRIMARY KEY AUTOINCREMENT, identidad TEXT, fecha TEXT, descripcion TEXT, observacion TEXT);";
          db.run(createStatement);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Método para insertar nuevos expedientes en la base de datos.
   */
  new(identidad, fecha, descripcion, observacion) {
    return new Promise((accept, reject) => {
      db.run(
        "INSERT INTO expedientes(identidad, fecha, descripcion, observacion) VALUES(?, ?, ?, ?);",
        [identidad, fecha, descripcion, observacion],
        (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          accept(result);
        }
      );
    });
  }

  /**
   * Método para obtener todos los expedientes de la base de datos.
   */
  getAll() {
    return new Promise((accept, reject) => {
      db.all("SELECT * FROM expedientes;", (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          accept(rows);
        }
      });
    });
  }

  /**
   * Método para obtener un registro por ID.
   */
  getRegisterByID(id) {
    return new Promise((accept, reject) => {
      db.get("SELECT * FROM expedientes WHERE id = ?;", [id], (err, row) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          accept(row);
        }
      });
    });
  }

  /**
   * Método para actualizar el expediente de los pacientes
   */
  updateOneExpediente(id, identidad, fecha, descripcion, observacion) {
    return new Promise((accept, reject) => {
      const sqlQuery =
        "UPDATE expedientes SET identidad = ?, fecha = ?, descripcion = ?, observacion = ? WHERE id = ?;";
      db.run(
        sqlQuery,
        [identidad, fecha, descripcion, observacion, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            accept(this);
          }
        }
      );
    });
  }

  /**
   * Método para eliminar un paciente de los expedientes
   */
  deleteOneExpediente(id) {
    return new Promise((accept, reject) => {
      const sqlQuery = "DELETE FROM expedientes WHERE id = ?;";
      db.run(sqlQuery, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          accept(this);
        }
      });
    });
  }
}

module.exports = Expedientes;
