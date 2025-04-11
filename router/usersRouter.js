const express = require('express');
const router = express.Router();
const usersController = require('../controller/usersController');
const authController = require('../controller/authController');

//ROUTES
router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);

router.get('/me', usersController.getMe, usersController.getuser);
router.patch('/update-me', usersController.updateMe);
router.patch('/delete-me', usersController.deleteMe);
router.get('/allusers', usersController.allUsers);

router.delete('/:id', usersController.deleteuser);
router.patch('/:id', usersController.updateuserData);

module.exports = router;
