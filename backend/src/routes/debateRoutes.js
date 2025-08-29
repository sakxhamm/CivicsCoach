const express = require('express');
const router = express.Router();
const { 
  generateDebate, 
  generateDebateWithCoT, 
  generateDebateWithZeroShot, 
  generateDebateWithDynamicPrompting 
} = require('../controllers/debateController');

// Main debate generation endpoint (auto-selects strategy)
router.post('/generate', generateDebate);

// Specific prompting strategy endpoints
router.post('/generate/cot', generateDebateWithCoT);
router.post('/generate/zero-shot', generateDebateWithZeroShot);
router.post('/generate/dynamic', generateDebateWithDynamicPrompting);

module.exports = router;
