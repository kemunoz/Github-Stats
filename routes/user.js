const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user');

router.get('/:username', userController.stats);

module.exports = router;