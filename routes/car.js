const express = require('express');
const router = express.Router();
const Car = require('../controllers/car');

router.get('/cars', Car.getAllCars);

module.exports = router;
