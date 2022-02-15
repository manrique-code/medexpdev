const getDb = require("../mongodb");
let db = null;

class Pacientes {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection("Pacientes");
        if (process.env.MIGRATE === "true") {
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Es importante mantener esta atomicidad, porque al momento de realizar cambios, la lógica de negocios no se afectada.
  async new(nombre, apellidos, identidad, telefono, correo) {
    const newPaciente = {
      nombre,
      apellidos,
      identidad,
      telefono,
      correo,
    };
    const rslt = await this.collection.insertOne(newPaciente);
    return rslt;
  }

  async getAll() {}

  async getById(id) {}

  async updateOne(id, nombre, apellidos, identidad, telefono, correo) {}

  async deleteOne(id) {}
}

module.exports = Pacientes;
