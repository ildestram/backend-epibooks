import express from "express";
import UsersModel from "../models/users.js";
const router = express.Router();
import bcrypt from "bcrypt";

// POST
router.post("/login", async (req, res) => {
  const user = await UsersModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(404).send({
      message: "utente non trovato",
    });
  }

  // validiamo la password
  // parametri che accetta compare = password che scrive utente nel login, password trovata con findOne
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send({
      message: "Password invalid",
    });
  }
  // se tutto va bene
  return res.status(200).send({
    message: "Login effettuato con successo",
    payload: user, // solo a titolo di debug
  });
});

export default router;
