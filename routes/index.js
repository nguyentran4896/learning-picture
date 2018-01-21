var express = require('express');
var router = express.Router();
var async = require('async');
const translate = require('google-translate-api');

/* GET home page. */
router.get('/mapping-word', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/audio', function(req, res, next) {
  res.render('audio', { title: 'Audio' });
});

router.get('/verser', function (req, res, next) {
  res.render('verser', { title: 'Express' });
});

router.get('/search', function (req, res, next) {
  res.render('search', { title: 'Search By Photo' });
});

router.get('/', function(req, res, next) {
  res.render('homepage', { title: 'Homepage' });
});

// combine text and translated text in one object
router.post('/translate-combine', function (req, res, next) {
  let arr = []
  let convertLanguage = req.body.convertLanguage

  async.eachSeries(JSON.parse(req.body.strArr), function (text, callback) {
    translateText(text, convertLanguage, function (str) {
      arr.push({
        text: text,
        transated: str
      })

      return callback()
    })
  }, function (err) {
    res.send({ arr: arr });
  })
});

// array random text and translated text
router.post('/translate-arr', function (req, res, next) {
  let arr = []
  let count = 0
  let convertLanguage = req.body.convertLanguage
  async.eachSeries(JSON.parse(req.body.strArr), function (text, callback) {
    translateText(text, convertLanguage, function (str) {
      arr.push({
        text: text,
        id: count,
        userSelect: false
      })
      arr.push({
        text: str,
        id: count,
        userSelect: false
      })

      count++
      return callback()
    })
  }, function (err) {
    err && console.log(err)
    res.send({ arr: randomArray(arr) });
  })
});

function translateText(text, convertLanguage, callback) {
  translate(text, { from: 'en', to: convertLanguage, raw: true }).then(res => {
    return callback(res.text)
  }).catch(err => {
    return callback('')
  });
}

function randomArray(arra1) {
  var ctr = arra1.length, temp, index;

  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}

module.exports = router;
