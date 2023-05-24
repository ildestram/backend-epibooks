const isAuthored = (req, res, next) => {
  // controlliamo il ruolo dell'utente
  const role = req.body;
  if (role !== "admin") {
    return res.status(400).send({
      message: "You need to be an admin to perform this request",
    });
  }
  next();
};

export default isAuthored;
