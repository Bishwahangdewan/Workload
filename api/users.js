const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

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


    //check for empty
    if (username === "" || userposition === "" || company === "") {
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
                password: hash
            })

            userData.save().then(data => res.json({ newuser: data })).catch(err => res.json(err))
        })
    })
})

module.exports = router;