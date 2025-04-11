const reviewModel = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../model/reviewModel');
const factory = require('../controller/handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createone(Review);
exports.updateReview = factory.updateone(Review);
exports.deleteReview = factory.deleteone(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
