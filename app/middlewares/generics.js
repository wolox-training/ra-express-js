exports.logRequestInformation = (req, res, next) => {
  console.log(`A new request received at ${new Date()}`);
  console.log('Request URL:', req.originalUrl);
  console.log('Request Type:', req.method);
  next();
};

exports.success = (req, res) => res.sendStatus(200);
