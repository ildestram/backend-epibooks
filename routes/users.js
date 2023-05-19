import express from "express";
import UsersModel from "../models/users.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET
router.get("/users", async (req, res) => {
  // impaginazioni
  const { page = 1, pageSize = 3 } = req.query;
  try {
    // sempre relativo alle impaginazioni
    const users = await UsersModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    // conta tutti gli utenti
    const totalUsers = await UsersModel.count();
    res.status(200).send({
      count: totalUsers,
      currentPage: +page, // e' la stessa cosa di scrivere Number(page)
      totalPage: Math.ceil(totalUsers / pageSize),
    });
  } catch (error) {
    res.status(500).send({
      message: "Errore interno del server",
    });
  }
});

// POST
const saltRound = 10;
const myPlaintextPassword = "";

router.post("/users", async (req, res) => {
  // gestiamo le hash password
  const genSalt = await bcrypt.genSalt(10); // algoritmo per decriptare password
  const hashPassword = await bcrypt.hash(req.body.password, genSalt);
  
  const user = new UsersModel({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    // facciamo prima una query
    const userExist = await UsersModel.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(409).send({
        message: "Email gia' esistente",
      });
    }
    const newUser = await user.save();
    res.status(201).send({
      message: "user registered",
      payload: newUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "errore interno del server",
    });
  }
});

// PATCH
router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const userExist = await UsersModel.findById(id);
  if (!userExist) {
    return res.status(404).send({
      message: "utente inesistente",
    });
  }
  try {
    const userID = id;
    const dataUpdated = req.body;
    const options = { new: true };
    const result = await UsersModel.findByIdAndUpdate(
      userID,
      dataUpdated,
      options
    );
    res.status(200).send({
      message: "user modified",
      payload: result,
    });
  } catch (error) {
    res.status(500).send({
      message: "Errore generico del server",
    });
  }
});

export default router;
