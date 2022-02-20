const { ObjectId } = require("mongodb");
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

  // Retrieving collections always will return a Promise.
  async getAll() {
    const cursor = this.collection.find({});
    const documents = await cursor.toArray();
    return documents;
  }

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

  // Using any method, find or findOne.
  async getById(id) {
    const _id = new ObjectId(id);
    const filter = { _id };
    console.log(filter);
    const myDocument = await this.collection.findOne(filter);
    return myDocument;
  }

  // Update data with MongoDB
  async updateOne(id, nombre, apellidos, identidad, telefono, correo) {
    const filter = { _id: new ObjectId(id) };
    /**
     * UPDATE pacientes SET campo = valor
     * Esa palabra SET es la misma variable set que tenemos en el JSON.
     */
    const updateCmd = {
      $set: {
        nombre,
        apellidos,
        identidad,
        telefono,
        correo,
      },
    };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async updateAddTag(id, tagEntry) {
    const updateCmd = {
      // Permite definir las instrucciones que hacer con un atributo. En este caso añadir el tagEntry.
      $push: {
        tags: tagEntry,
      },
    };
    const filter = { _id: new ObjectId(id) };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async updateAddTagSet(id, tagEntry) {
    const updateCmd = {
      // sí no existe lo agrega.
      $addToSet: {
        tags: tagEntry,
      },
    };
    const filter = { _id: new ObjectId(id) };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async deleteTagSet(id, tagEntry) {
    const updateCmd = {
      // POP: pop the first element that encounters.
      // PULL: deletes all coincidences
      $pop: {
        tags: tagEntry,
      },
    };
    const filter = { _id: new ObjectId(id) };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async deleteOne(id) {}
}

module.exports = Pacientes;
