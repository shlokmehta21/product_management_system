const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User Model
const User = require('../models/User');

//Login
router.get('/login', (req, res) => res.render('login'));

//register
router.get('/register', (req, res) => res.render('register'));

//register handle
router.post('/register', (req, res) => {
    const { name,email,role, password,password2 } = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password || !password2 || !role){
        errors.push({message: 'Please enter all required fields'});
    }

    if(password !== password2){
        errors.push({message: 'passwords do not match'});
    }

    //check password length
    if(password.length < 6 ){
        errors.push({message: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            role
        });
    } else{
        //Validation passed
        User.findOne({ email: email })
        .then(user => {
            if(user){
                //User exists
                errors.push({message: 'email already registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    role
                });
            } else{
                const newUser = new User({
                    name,
                    email,
                    password,
                    role
                }); 

                //Hash password
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) throw err;
                    //Set password to hashed password
                    newUser.password = hash;
                    //Save new user
                    newUser.save()
                    .then(user => {
                        req.flash(
                          'success_msg',
                          'You are now registered and can log in'
                        );
                        res.redirect('/users/login');
                      })
                      .catch(err => console.log(err))
                }));
            }
        });
    }
});


//Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/products/dashboard/1',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

  //logout handle
  router.get('/logout', (req, res) => {
      req.logout();
      req.flash('success_msg','You are now logged out');
      res.redirect('/users/login');
  });
  
module.exports = router;



