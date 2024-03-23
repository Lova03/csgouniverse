module.exports = (req, res, next) => {
  const auth = req.isAuthenticated();
  if (!auth) {
    return res.status(401).send('User is not authenticated!');
  }
  next();
};
