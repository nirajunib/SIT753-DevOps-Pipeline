const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

// Middleware to parse JSON-formatted request bodies
router.use(express.json());

router.post('/saveUserForm', User.saveUserForm);

router.delete('/deleteUser', User.deleteUser);

module.exports = router;
