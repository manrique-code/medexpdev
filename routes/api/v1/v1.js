const express = require("express");
const router = express.Router();
const { verifyApiHeaderToken } = require("./headerVerifyMiddleware");
const { passport, jwtMiddleware } = require("./seguiridad/jwtHelper");
// Es buena práctica no utilizar la extensión.
const pacientesRoutes = require("./pacientes/pacientes");
const expedientesRoutes = require("./expedientes/expedientes");
const seguridadRoutes = require("./seguiridad/seguridad");

// Public
router.use("/seguridad", verifyApiHeaderToken, seguridadRoutes);

// use = una forma para decir que tengo un enrutador para que todos los registros de la misma sean utilizado en es URI.
// todas las URIs comienzan con pleca.
// se utiliza como un comuntador.
// en parciales más adelante vamos a utilizar middlewares.
router.use("/pacientes", verifyApiHeaderToken, jwtMiddleware, pacientesRoutes);
router.use("/expedientes", expedientesRoutes);

module.exports = router;
