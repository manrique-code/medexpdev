const express = require("express");
const router = express.Router();

const Paciente = require("../../../../dao/pacientes/pacientes.model");
const pacienteModel = new Paciente();

// Corresponden a los métodos de un trama si vienen en métodos de HTTP.
// Estos son los 4 que siempre se utilizan en las REST API.
// Todas estas rutas reciben dos parámetros obligatorios.
// URI
// Y una función
// router.get();
// router.post();
// router.put();
// router.delete();

// Todos los registros de los endpoints deben comenzar con plecas.
router.get("/", (req, res) => {
  res.status(200).json({
    endpoint: "Pacientes",
    updates: new Date(2022, 0, 19, 18, 41, 00),
  });
}); // GET /

router.get("/all", async (req, res) => {
  try {
    const rows = await pacienteModel.getAll();
    res.status(200).json({ status: "ok", pacientes: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed" });
  }
}); // GET /all

const ALLOWED_ITEMS_NUMBERS = [10, 15, 20];

router.get("/facet/:page/:items", async (req, res) => {
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items, 10);

  if (ALLOWED_ITEMS_NUMBERS.includes(items)) {
    try {
      const pacientes = await pacienteModel.getFaceted(page, items);
      res.status(200).json({ docs: pacientes });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "failed" });
    }
  } else {
    return res
      .status(403)
      .json({ status: "error", msg: "Not a valid item value (10, 15, 20)" });
  }
});

router.get("/byname/:name/:page/:items", async (req, res) => {
  const name = req.params.name;
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items, 10);

  if (ALLOWED_ITEMS_NUMBERS.includes(items)) {
    try {
      const pacientes = await pacienteModel.getFaceted(page, items, {
        nombres: name,
      });
      res.status(200).json({ docs: pacientes });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "failed" });
    }
  } else {
    return res
      .status(403)
      .json({ status: "error", msg: "Not a valid item value (10, 15, 20)" });
  }
});

/**
 * Los query params se escriben con diagonal segun la specs de REST así:
 * /byid/1
 * para varios para varios parámetros es así:
 * /byagegender/age/gender
 */
router.get("/byid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const row = await pacienteModel.getById(id);
    res.status(200).json({ status: "ok", paciente: row });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed" });
  }
});

/**
 * Ejemplo de un path con varios query parameters
 router.get('/byagegender/:age/:gender', async (req, res) => {
    try {
      const { age, gender } = req.params;
      const row = {}; // await pacienteModel.getById(parseInt(id));
      res.status(200).json({ status: 'ok', paciente: row });
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ status: 'failed' });
    }
  });
 */

router.post("/new", async (req, res) => {
  const { nombres, apellidos, identidad, email, telefono } = req.body;
  try {
    result = await pacienteModel.new(
      nombres,
      apellidos,
      identidad,
      telefono,
      email
    );
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      result: {},
    });
  }
}); // POST /new

// El POST y el PUT si reciben datos dentro del body en form-encoded
// proyecto phoenix
router.put("/update/:id", async (req, res) => {
  try {
    const { nombres, apellidos, identidad, email, telefono } = req.body;
    const { id } = req.params;
    const result = await pacienteModel.updateOne(
      id,
      nombres,
      apellidos,
      identidad,
      telefono,
      email
    );
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
    });
  }
});

/**
 * Es tanta la flexibilidad de MongoDB que los documentos no pueden tener la misma estructura
 */
router.put("/addtag/:id", async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const result = await pacienteModel.updateAddTag(id, tag);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
    });
  }
});

router.put("/addtagset/:id", async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const result = await pacienteModel.updateAddTagSet(id, tag);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
    });
  }
});

router.put("/removetag/:id", async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const result = await pacienteModel.deleteTagSet(id, tag);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
    });
  }
});

router.get("/one/:id", (req, res) => {
  let { id } = req.params;
  id = Number(id);
  productModel.getOne(id, (err, rslts) => {
    if (err) {
      res.status(500).json({ status: "failed" });
    } else {
      res.status(200).json({ status: "ok", rslts });
    }
  });
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pacienteModel.deleteOne(id);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
    });
  }
});

module.exports = router;
