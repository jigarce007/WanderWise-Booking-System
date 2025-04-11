const fs = require('fs');
const joi = require('joi');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../model/userModel');
const factory = require('./../controller/handlerFactory');

const joiSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
});

exports.validateBody = (req, res, next) => {
  const { error } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.details[0].message,
    });
  } else {
    next();
  }
};

exports.validateBody;

//route handlers for users
exports.allUsers = factory.getAll(User);
exports.getuser = factory.getOne(User);
exports.updateuserData = factory.updateone(User); //do not uodate password with this route.
exports.deleteuser = factory.deleteone(User);

exports.createuser = (req, res) => {
  const newID =
    Math.floor(Date.now() / 1000).toString(16) +
    'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    ); //generating unique id
  const newUser = Object.assign({ _id: newID }, req.body);
  usersData.push(newUser);
  fs.writeFile(
    './dev-data/data/users.json',
    JSON.stringify(usersData),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          user: 'New User Created!!!',
        },
      });
    }
  );
};

exports.updateuser = (req, res) => {
  res.status(201).json({
    status: 'Success',
    data: {
      user: 'User updated successfully',
    },
  });
};

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates', 400));
  }
  //2) Update user document
  const filteredBody = filterObject(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

//to get the current logged in user details
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}