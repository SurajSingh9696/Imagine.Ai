const express = require('express');
const router = express.Router();
const controller = require('../controllers/pollinationai.js');

// Generate image route
router.post('/generateImage', controller);

module.exports = router;