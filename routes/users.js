const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", (req, res) => res.render("login"));

router.get("/register", (req, res) => res.render("register"));

// User model
const User = require("../models/User");

// register

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  // errors
  const errors = [];

  //check required fields
  if(!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields"});
  }

  //check password match
  if(password!==password2) {
    errors.push({ msg: "Passwords does not match"});
  }

  //check password length
  if(password.length < 6) {
    errors.push({msg: "Password length should be at least 6"});
  }

  if(errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed

    User.findOne({email: email})
    .then(user => {
      if(user) {
        // User exists
        errors.push({msg: "Email is already registered"});
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        // console.log(newUser);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash)=> {
            
            if(err) throw err;
            
            // Set password to hashed
            newUser.password=hash;

            // Save User
            newUser.save()
            .then( user => {
              req.flash("success_msg","you are now registered and can log in");
              res.redirect('/users/login');
            }).catch( err => console.log(err) );
          })
        });
      }
      
    })
    
  }

});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashbord",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg","You are loged out");
  res.redirect("/users/login");
});

module.exports = router;