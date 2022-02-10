const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const url = require('./config/keys').mongoUrl;

const PORT = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//passport middleware
app.use(passport.initialize());

//require routes
const usersRoutes = require('./api/users');

//connecting database
mongoose.connect(url)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err))

app.get('/', (req, res) => {
    res.send("Server Running");
})

//initializePassport
require('./config/passport')(passport);

//use Routes
app.use('/api/users', usersRoutes);

//listen to port
app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));