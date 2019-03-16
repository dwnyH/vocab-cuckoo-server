const router = require('express').Router();
const Word = require('../models/Word');
const User = require('../models/User');

router.post('/:user_id/words', async (req, res) => {
  const {
    savedAt,
    savedMonth,
    word,
    translated,
  } = req.body;

  const newWord = new Word({
    savedAt,
    savedMonth,
    word,
    translated,
    user_id: req.params.user_id,
  });

  const currentUser = await User.findOne({ _id: req.params.user_id });
  if (!currentUser.monthLists.includes(savedMonth)) {
    currentUser.update({
      $push: { monthLists: savedMonth },
    });
  }

  newWord.save((err) => {
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
});

router.get('/:user_id/months', async (req, res) => {
  const { user_id } = req.params;
  try {
    const currentUser = await User.findOne({ _id: user_id });
    res.status(200).json({
      monthLists: currentUser.monthLists,
    });
  } catch (error) {
    res.status(500).json({
      message: serverError
    });
  }
});

router.get('/:user_id/:selected_month/vocabularies', async (req, res) => {
  const { user_id, selected_month } = req.params;
  try {
    console.log(user_id, selected_month);
    const vocabularies = await Word.find({ user_id, savedMonth: selected_month });
    console.log(vocabularies);
    res.status(200).json({
      vocabularies,
    });
  } catch (error) {
    res.status(500).json({
      message: serverError
    });
  }
});

module.exports = router;
