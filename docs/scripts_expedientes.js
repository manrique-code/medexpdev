require("dotenv").config();
const getDb = require("../dao/mongodb");

// we can expand both names and surnames if we want more variety in the dataset.
const names = [
  "FULANITO",
  "MENGANO",
  "SUTANITO",
  "LULU",
  "PACO",
  "HUGO",
  "LUIS",
  "DONALD",
];

const surnames = [
  "MkQUACK",
  "RICO",
  "DTAL",
  "DE LA SANTA CRUZ",
  "MELGAR",
  "CABILDO",
  "CADILLO",
  "CHE",
];

const PACIENTES = 50;
const pacientesArr = [];

// Algorithm to generate data random patients.
for (let i = 0; i < PACIENTES; i++) {
  // year of birth generated randomly between 1980 and 2022.
  const year =
    new Date().getTime() % 2 === 0
      ? 1980 + Math.floor(Math.random() * 20)
      : 2000 + Math.floor(Math.random() * 23);
  const secuencias = String(Math.ceil(Math.random() * 99999)).padStart(5, "0");
  const nombres = names[Math.floor(Math.random() * 8)];
  const apellidos = surnames[Math.floor(Math.random() * 8)];
  const correo = `${nombres}.${apellidos}@unmail.com`.toLowerCase();
  const telefono = `${20000000 + Math.floor(Math.random() * 10000000)}`;
  const doc = {
    nombres,
    apellidos,
    identidad: `0801${year}${secuencias}`,
    telefono,
    correo,
  };
  pacientesArr.push(doc);
}

// We push the data to MongoDB directly.
getDb().then((db) => {
  const pacientes = db.collection("Pacientes");
  pacientes.insertMany(pacientesArr, (err, rslt) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(rslt);
    return rslt;
  });
});
