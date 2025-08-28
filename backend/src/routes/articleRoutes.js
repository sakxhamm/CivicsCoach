const express = require('express');
const router = express.Router();

// Placeholder endpoint - implement actual article functionality later
router.get('/', (req, res) => {
  res.json({ message: 'Article routes working' });
});

module.exports = router;
