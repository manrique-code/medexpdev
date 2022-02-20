const { ObjectId } = require("mongodb");
const getDb = require("../mongodb");
let db = null;
class Expedientes {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection("Expedientes");
        if (process.env.MIGRATE === "true") {
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Método para insertar nuevos expedientes en la base de datos.
   */
  async new(
    identidad,
    descripcion,
    observacion,
    fecha = new Date().toISOString()
  ) {
    const newExpedientes = { identidad, fecha, descripcion, observacion };
    const rslt = await this.collection.insertOne(newExpedientes);
    return rslt;
  }

  /**
   * Método para obtener todos los expedientes de la base de datos.
   */
  async getAll() {
    const cursor = this.collection.find({});
    const documents = await cursor.toArray();
    return documents;
  }

  /**
   * Method to retrieve data in a faceted paradigm.
   * This is done to improve database query response time,
   * database quality life and DDoS attacks aswell.
   */
  async getFaceted(page, items, filter = {}) {
    const cursor = this.collection.find(filter);
    const totalItems = await cursor.count();
    cursor.skip((page - 1) * items);
    cursor.limit(items);

    const resultados = await cursor.toArray();
    return {
      totalItems,
      page,
      items,
      totalPages: Math.ceil(totalItems / items),
      resultados,
    };
  }

  /**
   * Método para obtener un expediente por el número de identidad.
   * When we are using mongo's find method, it returns a cursor.
   * which mean that we have to parse it to an array in order
   * to return an iterate every document.
   */
  async getRegisterByID(identidad) {
    const filter = { identidad };
    console.log(filter);
    const documento = await this.collection.find(filter).toArray();
    return documento;
  }

  /**
   * Method to add a tag even if exists in the database
   */
  async updateAddTag(id, tagEntry) {
    const updateCmd = {
      $push: {
        tags: tagEntry,
      },
    };
    const filter = { _id: new ObjectId(id) };
    const result = await this.collection.updateOne(filter, updateCmd);
    return result;
  }

  async updateAddTagSet(id, tagEntry) {
    const updateCmd = {
      $addToSet: {
        tags: tagEntry,
      },
    };
    const filter = { _id: new ObjectId(id) };
    const result = await this.collection.updateOne(filter, updateCmd);
    return result;
  }

  /**
   * Método para actualizar el expediente de los pacientes
   */
  async updateOneExpediente(
    id,
    identidad,
    descripcion,
    observacion,
    fecha = new Date().toISOString()
  ) {
    const filter = { _id: new ObjectId(id) };
    const updateCmd = {
      $set: {
        identidad,
        fecha,
        descripcion,
        observacion,
      },
    };
    const rslt = await this.collection.updateOne(filter, updateCmd);
    return rslt;
  }

  /**
   * Método para eliminar un paciente de los expedientes
   */
  async deleteOneExpediente(id) {
    const filter = { _id: new ObjectId(id) };
    const rslt = await this.collection.deleteOne(filter);
    return rslt;
  }
}

module.exports = Expedientes;
