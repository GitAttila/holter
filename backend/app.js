const express = require('express');
const fs = require('fs');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-Width, Content-type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/api//data' ,(req, res, next) => {
  fs.readFile(__dirname + '/data/ID0123456789_Date20191113_Time142125_George_ECG.json',
  (err, data) => {
    if (err) throw err;
    let rawdata = JSON.parse(data);
    res.status(200).json(rawdata);
  });
});

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(
    (post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(403).json({message: 'Post not found!'});
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching post failed!'
      })
    })
};

module.exports = app;
