const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTours = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user',
    })
    .populate({
      path: 'guides',
      select: 'name role photo', // only pick the fields you need
    });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
