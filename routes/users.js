const {User, validate} = require('../models/user')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//GET
router.get('/me', auth, async (req, res) => { 
  const user = await User.findById(req.user._id).select('-password'); //we get _id from jwt not from route params
  res.send(user);
});

router.get('/', [auth, admin], async (req, res) => { 
  const user = await User.find().select('-password'); //we get _id from jwt not from route params
  res.send(user);
});


//POST
router.post('/', async (req,res)=> {
    const {error} = validate(req.body);   
    if(error) return res.status(400).send(error.details[0].message);  

    //Make sure that user is not already registered
    let user = await User.findOne({ email: req.body.email });
      if(user) return res.status(400).send('User Already registered');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    });  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt); //to hash passwords, not to store as plain text

    //create new user
    await user.save(); 

    const token = user.generateAuthToken();
    
    res
    .header('x-auth-token', token)
    .send(_.pick(user, ['_id', 'name', 'email', 'phone'])); //we dont send password to client
})


module.exports = router;
