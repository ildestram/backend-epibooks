const validateUser = (req, res, next) => {
  const error = [];
  const { userName, email, password } = req.body;

  if (typeof userName !== "string") {
    error.push("userName must be a valid string");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.push("Please provide a valid email address");
  }

  if (typeof password !== "string" || password.length < 8) {
    error.push("Password must be a string or at least with eight charachters");
  }

  if (error.length > 0) {
    res.status(400).send({ error });
  } else {
    next();
  }
};

export default validateUser;
