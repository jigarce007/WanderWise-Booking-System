const express = require('express');

const router = express.Router();
const usersController = require('../controller/usersController');
const authController = require('../controller/authController');

//ROUTES
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

router.get('/me', authController.protect, usersController.getMe);
router.patch('/update-me', authController.protect, usersController.updateMe);
router.patch('/delete-me', authController.protect, usersController.deleteMe);
router.get(
  '/allusers',
  authController.protect,
  authController.restrictTo('admin'),
  usersController.allUsers
);
router
  .route('/:id')
  .get(usersController.getuser)
  .patch(usersController.updateuserData)
  .delete(usersController.deleteuser);

module.exports = router;
