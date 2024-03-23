const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('dotenv').config();
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const cors = require('cors');

const startUpdatingSkins = require('./updateSkins');

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to DB successfully');
  })
  .catch((err) => {
    console.log(err);
    console.log('Connection to DB failed');
  });

require('./passport');

const PORT = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.redirect(process.env.CLIENT_URL);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
