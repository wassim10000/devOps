const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const userRoutes = require('./routes/user.routes');
require('./auth/google'); // <-- Import stratégie OAuth

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Session obligatoire pour Passport
app.use(
  session({
    secret: 'devopssecret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
