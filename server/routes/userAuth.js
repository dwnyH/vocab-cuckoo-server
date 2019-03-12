/* eslint-disable no-lonely-if */
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../db/credentials');


router.post('/auth', (req, res) => {
  console.log(req.body);

  const { id, email, name } = req.body;
  const makeJwtToken = (userInfo) => {
    try {
      jwt.sign({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
      },
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
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  User.findOne({ id }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        makeJwtToken(req.body);
      } else {
        const newUser = new User({
          id,
          email,
          name,
        });
        newUser
          .save((error) => {
            console.log(2, error);
          })
          .then((userInfo) => {
            makeJwtToken(userInfo);
          });
      }
    }
  });
});
// router.post('/wordLists');
// router.delete('');

module.exports = router;
