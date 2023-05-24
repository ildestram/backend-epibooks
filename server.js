import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = 5050;

import usersRoute from "./routes/users.js";
import loginRoute from "./routes/login.js";
import postsRoute from "./routes/posts.js";

const app = express();

// questi sono middleware globali
app.use(cors());
app.use(express.json());

app.use("/", usersRoute);
app.use("/", loginRoute);
app.use("/", postsRoute);

// in questo modo abbiamo protetto i dati sensibili tramite il file .env
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Errore di connessione al database")
);
db.once("open", () => {
  console.log("database connesso");
});
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
