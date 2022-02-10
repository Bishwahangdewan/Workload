const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys').JWTsecret;

//import models
const User = require('../models/User');

// Test Route 
// Method - GET
// PATH - api/users/test
router.get("/test", (req, res) => {
    return res.json("Test Passed");
})

//Signup Route
//Method - POST
//PATH - api/users/signup
router.post("/signup", (req, res) => {
    const username = req.body.username;
    const userposition = req.body.userposition;
    const company = req.body.company;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    const email = req.body.email;


    //check for empty
    if (username === "" || userposition === "" || company === "" || email === "") {
        return res.status(400).json({ msg: "Please don't leave any empty fields" });
    }

    //check if password matches
    if (password !== confirmpassword) {
        return res.status(400).json({ msg: "Passwords do not match" })
    }

    const saltRounds = 10;

    //hash password
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            //save data

            const userData = new User({
                username,
                userposition,
                company,
                email,
                password: hash
            })

            userData.save().then(data => res.json({ newuser: data })).catch(err => res.json(err))
        })
    })
})


//Login Route
//Method - POST
//PATH - api/users/login
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === "" || password === "") {
        return res.status(400).json({ msg: "Invalid Inputs" })
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: "No user with this email found" })
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                //json web token
                const payload = {
                    id: user.id,
                    name: user.username,
                    position: user.userposition,
                    company: user.company
                }

                jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
                    if (err) {
                        return res.status(400).json(err);
                    } else {
                        return res.json({
                            success: true,
                            token
                        })
                    }
                })
            } else {
                return res.status(400).json({ msg: "Password is incorrect" })
            }
        })
    })
})

//Get Current User Route
//Method - GET
//PATH - api/users/current
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json(req.user);
})

module.exports = router;