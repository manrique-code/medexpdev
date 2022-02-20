const express = require("express");
const router = express.Router();

const Expedientes = new require(
  "../../../../dao/expedientes/expedientes.model"
);
const expedientesModel = new Expedientes();

router.get("/", (req, res) => {
  res.status(200).json({
    endpoint: "Expedientes",
    updates: new Date(2022, 0, 20, 18, 42),
  });
}); // GET /

router.get("/all", async (req, res) => {
  try {
    let result = await expedientesModel.getAll();
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      result: {},
    });
  }
}); // GET /all

//  constant to know how many items are allowed to be queried from the database
const ALLOWED_ITEMS_NUMBERS = [10, 15, 20];

router.get("/facet/:page/:items", async (req, res) => {
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items, 10);
  if (ALLOWED_ITEMS_NUMBERS.includes(items)) {
    try {
      const expedientes = await expedientesModel.getFaceted(page, items);
      res.status(200).json({ docs: expedientes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed" });
    }
  } else {
    return res.status(403).json({
      status: "error",
      msg: `Not a valid item value ${ALLOWED_ITEMS_NUMBERS.join(", ")}`,
    });
  }
});

router.get("/facet/:identidad/:page/:items", async (req, res) => {
  const identidad = req.params.identidad;
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items, 10);
  if (ALLOWED_ITEMS_NUMBERS.includes(items)) {
    try {
      const expedientes = await expedientesModel.getFaceted(page, items, {
        identidad,
      });
      res.status(200).json({ docs: expedientes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed" });
    }
  } else {
    return res.status(403).json({
      status: "error",
      msg: `Not a valid item value ${ALLOWED_ITEMS_NUMBERS.join(", ")}`,
    });
  }
});

router.get("/byid/:identidad", async (req, res) => {
  try {
    const { identidad } = req.params;
    const result = await expedientesModel.getRegisterByID(identidad);
    res.status(200).json({
      status: "ok",
      expediente: result,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ status: "failed", result: {} });
  }
}); // GET /byid/:id

router.post("/new", async (req, res) => {
  const { identidad, fecha, descripcion, observacion } = req.body;
  try {
    let result = await expedientesModel.new(
      identidad,
      descripcion,
      observacion,
      fecha
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

router.put("/addtag/:id", async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const rslt = await expedientesModel.updateAddTag(id, tag);
    res.status(200).json({ status: "ok", rslt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/addtagset/:id", async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const rslt = await expedientesModel.updateAddTagSet(id, tag);
    res.status(200).json({ status: "ok", rslt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { identidad, fecha, descripcion, observacion } = req.body;
    const { id } = req.params;
    let result = await expedientesModel.updateOneExpediente(
      id,
      identidad,
      descripcion,
      observacion,
      fecha
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
}); // PUT /update

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await expedientesModel.deleteOneExpediente(id);
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
}); // DELETE /delete

module.exports = router;
