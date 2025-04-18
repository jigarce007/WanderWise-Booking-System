const express = require('express');
const viewController = require('../controller/viewController');
const authcontroller = require('../controller/authController');

const router = express.Router();

router.use(authcontroller.isLoggedIn);

router.get('/', viewController.getAllTours);
router.get('/tour/:slug', viewController.getTour);
router.get('/overview', viewController.getAllTours);
router.get('/login', viewController.getLoginForm);

module.exports = router;
