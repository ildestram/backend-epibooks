import express from "express";
const router = express.Router();
import PostModel from "../models/posts.js";

// GET
router.get("/posts", async (req, res) => {
  const { page = 1, pageSize = 8 } = req.query; // impaginazione

  try {
    const posts = await PostModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const totalPosts = await PostModel.count();
    res.status(200).send({
      count: totalPosts,
      statusCode: 200,
      currentPage: +page,
      totalePage: Math.ceil(totalPosts / pageSize),
      posts,
    });
  } catch (error) {
    res.status(500).send({
      message: "errore interno del server",
      statusCode: 500,
    });
  }
});

// GET per cercare un libro dal nome
router.get("/posts/bytitle/title", async (req, res) => {
  try {
    const { title } = req.params;
    const postByTitle = await PostModel.find({
      // cerchiamo un match nella proprieta' del titolo
      title: {
        // operatori da utilizzare nel title
        // devi controllare all'interno di tutto il titolo la nostra query
        // . vuol dire qualsiasi carattere
        // * vuol dire numero ripetuto piu' volte
        $regex: ".*" + title + ".*",
        // passiamo le options
        // I = insensitive, non fare distinzione tra maiuscole e minuscole
        $options: "I",
      },
    });
    if (!postByTitle || postByTitle.length === 0) {
      return res.status(404).send({
        message: "errore, non esiste un post con questo titolo",
        statusCode: 404,
      });
    }
    res.status(200).send({
      message: "Post trovato",
      statusCode: 200,
      postByTitle,
    });
  } catch (error) {
    res.status(500).send({
      message: "errore interno del server",
      statusCode: 500,
    });
  }
});

// POST
router.post("/posts", async (req, res) => {
  const post = new PostModel({
    // mettiamo le proprieta' del modello
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    rate: req.body.rate,
  });

  try {
    await post.save();
    res.status(201).send({
      statusCode: 201,
      message: "Post salvato correttamente",
      post,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Qualcosa e' andato storto nel server",
    });
  }
});

// PATCH
// modifichiamo un post
router.patch("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const postExist = await PostModel.findById(id);
  if (!postExist) {
    return res.status(404).send({
      message: "Post inesistente",
      statusCode: 404,
    });
  }
  try {
    const postID = id;
    const dataUpdated = req.body;
    const options = { new: true }; // fa si che venga mostrato il post aggiornato
    const result = await PostModel.findByIdAndUpdate(
      postID,
      dataUpdated,
      options
    );
    res.status(200).send({
      message: "Post modificato",
      statusCode: 200,
      result,
    });
  } catch (error) {
    res.status(500).send({
      message: "Errore interno del server",
      statusCode: 500,
    });
  }
});

// DELETE
router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postExist = await PostModel.findByIdAndDelete(id);
    if (!postExist) {
      return res.status(404).send({
        message: "Post non trovato",
        statusCode: 404,
      });
    }
    return res.status(200).send({
      message: `Post con id ${id} rimosso dal database`,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).send({
      message: "Errore interno del server",
    });
  }
});

export default router;
