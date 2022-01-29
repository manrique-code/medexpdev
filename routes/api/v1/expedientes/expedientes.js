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

router.get("/byid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await expedientesModel.getRegisterByID(parseInt(id));
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
      fecha,
      descripcion,
      observacion
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

router.put("/update/:id", async (req, res) => {
  try {
    const { identidad, fecha, descripcion, observacion } = req.body;
    const { id } = req.params;
    let result = await expedientesModel.updateOneExpediente(
      id,
      identidad,
      fecha,
      descripcion,
      observacion
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
    let result = await expedientesModel.deleteOneExpediente(parseInt(id));
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
