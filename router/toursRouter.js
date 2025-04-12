const router = require('express').Router();
const authController = require('../controller/authController');
const toursController = require('../controller/toursController');
const reviewController = require('./../controller/reviewController');
const reviewRouter = require('./reviewRouter');

router.route('/tours-stats').get(toursController.getTourStats);

router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours, toursController.gettours);

router.route('/').get(authController.protect, toursController.gettours);
router.route('/addtour').post(toursController.newtour);
router
  .route('/:id')
  .get(toursController.getour)
  .patch(toursController.updatetour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.delettour
  );

module.exports = router;
