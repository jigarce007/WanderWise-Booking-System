const express = require('express');
const viewController = require('../controller/viewController');

const router = express.Router();

router.get('/', viewController.getAllTours);
router.get('/tour/:slug', viewController.getTour);
router.get('/overview', viewController.getAllTours);
router.get('/login', viewController.getLoginForm);

module.exports = router;
