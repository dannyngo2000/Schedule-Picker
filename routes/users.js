const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/database");
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
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 10800, //3 hours
        });
        res.json({
          success: true,
          token: token,
          user: {
            id: user._id,
            name: user.name,
            user: user.username,
            email: user.email,
          },
        });
      } else {
        return res.json({ success: false, msg: "Wrong password" });
      }
    });
  });
});

//Current Profile/ Schedule

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

//Validate

router.get("/validate", (req, res, next) => {
  res.send("validate");
});

module.exports = router;
