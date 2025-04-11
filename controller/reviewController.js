const reviewModel = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../model/reviewModel');
const factory = require('../controller/handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await reviewModel.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    reviews,
  });
});

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createone(Review);
exports.updateReview = factory.updateone(Review);
exports.deleteReview = factory.deleteone(Review);
