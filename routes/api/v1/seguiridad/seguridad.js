const express = require("express");
const router = express.Router();
const Usuarios = require("../../../../dao/usuarios/usuarios.model");
const usuariosModel = new Usuarios();
const jwt = require("jsonwebtoken");

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: realizar validaciones de entrada de datos.
    const rslt = await usuariosModel.new(email, password);
    res.status(200).json({ status: "success", result: rslt });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInDB = await usuariosModel.getByEmail(email);
    if (userInDB) {
      const isPasswordValid = await usuariosModel.comparePassword(
        password,
        userInDB.password
      );
      if (isPasswordValid) {
        const { email, roles, _id } = userInDB;
        const payload = {
          jwt: jwt.sign({ email, roles, _id }, process.env.JWT_SECRET),
          user: { email, roles, _id },
        };
        res.status(200).json(payload);
      } else res.status(500).json({ status: "failed", error: 2 });
    } else res.status(500).json({ status: "failed", error: 1 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/answer/:id", async (req, res) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;
    const rslt = await usuariosModel.setAnswer(id, answer);
    res.status(200).json({ status: "success", rslt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/recoverpassword", async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    const userInDB = await usuariosModel.getByEmail(email);
    if (userInDB) {
      console.log(userInDB);
      const isAnswerValid = await usuariosModel.comparePassword(
        answer,
        userInDB.securityQuestion.answer
      );
      if (isAnswerValid) {
        const rslt = await usuariosModel.updatePassword(email, newPassword);
        res.status(200).json({ status: "success", result: rslt });
      } else {
        res.status(500).json({ status: "failed", error: 69 });
      }
    } else {
      res.status(500).json({ status: "failed", error: 78 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed" });
  }
});

module.exports = router;
