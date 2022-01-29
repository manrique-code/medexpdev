const express = require("express");
const router = express.Router();
// Es buena práctica no utilizar la extensión.
const pacientesRoutes = require("./pacientes/pacientes");
const expedientesRoutes = require("./expedientes/expedientes");

// use = una forma para decir que tengo un enrutador para que todos los registros de la misma sean utilizado en es URI.
// todas las URIs comienzan con pleca.
// se utiliza como un comuntador.
// en parciales más adelante vamos a utilizar middlewares.
router.use("/pacientes", pacientesRoutes);
router.use("/expedientes", expedientesRoutes);

module.exports = router;
