import express from "express";
import UsersModel from "../models/users.js";
const router = express.Router();
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

// POST
router.post("/login", async (req, res) => {
  const user = await UsersModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(404).send({
      message: "utente non trovato",
      statusCode: 404,
    });
  }

  // validiamo la password
  // parametri che accetta compare = password che scrive utente nel login, password trovata con findOne
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send({
      message: "Password invalid",
      statusCode: 400,
    });
  }

  // utilizziamo un token da mandare al frontend
  const token = jsonwebtoken.sign(
    { email: user.email },
    process.env.SECRET_JWT_KEY,
    {
      expiresIn: "24h",
    }
  );

  res.header("auth", token).status(200).send({
    statusCode: 200,
    token,
  });

  // // se tutto va bene
  // return res.status(200).send({
  //   message: "Login effettuato con successo",
  //   statusCode: 200,
  //   payload: user, // solo a titolo di debug
  // });
});

export default router;
