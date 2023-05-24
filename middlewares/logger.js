// il middleware e' una funzione
// accetta sempre tre parametri
const logger = (req, res, next) => {
  const { url, ip, method } = req;
  console.log(
    `${new Date().toISOString()} Effettuata richiesta ${method} all'endpoit ${url} da indirizzo ${ip}`
  );

  next(); // procedi con la richiesta
};

export default logger;
