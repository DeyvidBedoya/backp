const visitedIPs = new Set();

const consoleLoggerMiddleware = (req, res, next) => {
  const clientIp = req.ip;

  // Verificar si es la primera vez que se recibe una solicitud de esta IP
  if (!visitedIPs.has(clientIp)) {
    console.log(`Petición recibida desde la nueva IP: ${clientIp}, Método: ${req.method}, URL: ${req.originalUrl}`);
    visitedIPs.add(clientIp);
  }

  next();
};

module.exports = consoleLoggerMiddleware;