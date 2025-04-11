const { privateDecrypt } = require('crypto');
const fs = require('fs');
const joi = require('joi');
const APIfeatures = require('./../utils/APIfeatures');
const Tour = require('./../model/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controller/handlerFactory');

exports.newtour = factory.createone(Tour);
exports.updatetour = factory.updateone(Tour);
exports.delettour = factory.deleteone(Tour);

exports.gettours = catchAsync(async (req, res, next) => {
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    data: tours,
  });
});

//aliasing - using middleware(manipulate the request params)
//get top 5 chep tours.
exports.aliasTopTours = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
});

//get a tour

exports.getour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
    .populate('guides')
    .populate('reviews');
  console.log(tour);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const tourstats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    // {
    //   $sort: { numRatings: -1 },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: tourstats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
