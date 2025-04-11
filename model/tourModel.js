const mongoose = require('mongoose');
const Review = require('./reviewModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [5, 'A tour name must have at least 5 characters'],
    },
    duration: {
      type: String,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult', 'average'],
        message: 'Difficulty must be either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must be at most 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [100, 'A tour price must be at least 100'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    }, //embedding documents
    locations: [
      {
        //GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User', //referring to guides model
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // to show virtuals in json
    toObject: { virtuals: true }, // to show virtuals in object
  }
);

//to add virtual properties
// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review', // Refers to the 'Review' model
  foreignField: 'tour', // The field in the 'Review' model that references 'Tour'
  localField: '_id', // The field in the 'Tour' model that is used to reference 'Review'
});

//Document Middleware(pre Hook)
tourSchema.pre('save', function (next) {
  this.name = this.name.toUpperCase();
  console.log('Will save document...');
  next();
});

//Document Middleware(post Hook)
tourSchema.post('save', function (doc, next) {
  console.log('Document saved...');
  next();
});

//Query Middleware(pre Hook)
tourSchema.pre(/^find/, function (next) {
  //  /^find/ ---> for all "Find" queries
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//Query Middleware(post Hook)
tourSchema.post(/^find/, function (docs, next) {
  //  /^find/ ---> for all "Find" queries
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//Aggregation Middleware(pre Hook)
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //hiding secret tours
  next();
});

//creating tour model
const Tour = mongoose.model('tours', tourSchema);

module.exports = Tour;
