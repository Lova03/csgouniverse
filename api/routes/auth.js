const authRouter = require('express').Router();
const passport = require('passport');

// Routes
authRouter.get('/', (req, res) => {
  res.json({ ...req.user, success: req.user ? true : false });
});

authRouter.get('/steam', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

authRouter.get('/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

authRouter.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = authRouter;
