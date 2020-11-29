const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Register Route

router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  //Adding new data to the User database
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: "Fail to register" });
    } else {
      res.json({ success: true, msg: "Successfully register" });
    }
  });
});

//Authenticate
router.get("/authenticate", (req, res, next) => {
  res.send("Authenticate");
});

//Current Profile/ Schedule

router.get("/profile", (req, res, next) => {
  res.send("Profile");
});

//Validate

router.get("/validate", (req, res, next) => {
  res.send("validate");
});

module.exports = router;
