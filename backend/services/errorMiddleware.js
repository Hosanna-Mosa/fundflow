const errorHandler = (err, req, res, next) => {
  // If status is 200, it means it was an uncaught error, so we change it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
