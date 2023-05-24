const cache = new Map();

const cacheMiddleware = (req, res, next) => {
  const { url } = req; // il map e' un oggetto chiave - valore

  const cachedResponse = cache.get(url);
  if (cachedResponse) {
    return res.send(cachedResponse);
  }

  res.sendResponse = res.send;
  res.send = (body) => {
    cache.set(url, body);
    res.sendResponse(body);
  };

  next();
};

export default cacheMiddleware;
