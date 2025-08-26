// routes/assetRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();

// Middleware cek token (contoh sederhana)
function checkToken(req, res, next) {
  const token = req.query.token;
  if (token === 'token-valid-mu') { // Ganti dengan validasi token asli
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

router.get('/asset/:filename', checkToken, (req, res) => {
  const filename = req.params.filename;
  const assetPath = path.join(__dirname, '../Puzzle-Assets', filename);
  res.sendFile(assetPath);
});

module.exports = router;



router.get("/:file", validateToken, (req, res) => {
  const file = req.params.file;
  res.sendFile(path.join(__dirname, "../Puzzle-Assets", file));
});

module.exports = router;
