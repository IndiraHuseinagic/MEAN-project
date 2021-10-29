const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const validate = require('../middleware/validate');


//POST
router.post('/', validate(validateLogin), async (req, res) => {

  //Make sure we have user with given email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('You are not registered. Please register first')

  //Validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .header('Access-Control-Expose-Headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'name', 'email', 'phone', 'isAdmin']));
});

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(req);
}


module.exports = router;
