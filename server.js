import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const PORT = 5050;

import usersRoute from "./routes/users.js";
import loginRoute from "./routes/login.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", usersRoute);
app.use("/", loginRoute);

mongoose.connect(
  "mongodb+srv://ildestramandinoli:K7Awy8DnCcWaH1YG@epicodetest.rrmc7bs.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Errore di connessione al database")
);
db.once("open", () => {
  console.log("database connesso");
});
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
