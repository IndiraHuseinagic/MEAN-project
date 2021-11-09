const { User, validateUser } = require('../models/user')
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate')

//GET
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').select("-__v"); //we get _id from jwt not from route params
  res.send(user);
});

//POST
router.post('/', validate(validateUser), async (req, res) => {

  //Make sure that user is not already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('There already exists a user account with this email address. Please login');

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
    .send(_.pick(user, ['_id', 'name', 'email', 'phone'])); //no password to client
})

module.exports = router;
