/* eslint-disable no-lonely-if */
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../db/credentials');

router.post('/auth', (req, res) => {
  const makeJwtToken = (userInfo) => {
    try {
      jwt.sign(userInfo,
        secret,
        {
          issuer: 'vocab-cuckoo',
          subject: 'userInfo',
        }, (error, token) => {
          if (error) {
            console.log(error);
            res.status(403).json({
              message: error.message,
            });
          } else {
            res.status(200).json({
              message: 'logged in successfully',
              token,
              id: userInfo.id,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  User.findOne({ id: req.body.id }, async (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        const registeredUser = await User.findOne({ id: req.body.id });
        req.body.id = registeredUser._id;
        makeJwtToken(req.body);
      } else {
        const newUser = new User(req.body);

        newUser.save((error) => {
          console.log(error);
        });
        const newRegisteredUser = await User.findOne({ id: req.body.id });
        req.body.id = newRegisteredUser._id;
        makeJwtToken(req.body);
      }
    }
  });
});

module.exports = router;
