const passport = require('passport');
const { v4 } = require('uuid');
const passportSteam = require('passport-steam');
const User = require('./models/User');
const SteamStrategy = passportSteam.Strategy;

passport.use(
  new SteamStrategy(
    {
      returnURL: 'http://localhost:5000/auth/steam/return',
      realm: 'http://localhost:5000/',
      apiKey: process.env.STEAM_API_KEY,
    },
    async function (identifier, profile, done) {
      const existingUser = await User.findOne({ steamid: profile.id });
      const { value: pfp } = profile.photos[2];
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = new User({
        username: profile.displayName,
        id: v4(),
        steamid: profile.id,
        profilePic: pfp,
      });
      await user.save();
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findOne({ id: id }, function (err, user) {
    if (err) return done(err);
    return done(null, user._doc);
  });
});
