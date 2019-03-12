const router = require('express').Router();

router.get('/wordLists', (req, res) => {
  console.log(req, 22);
  res.send({a: 2});
});
// router.post('/wordLists');
// router.delete('');

module.exports = router;
