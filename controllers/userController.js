const { userValidator } = require("../utils");
// console.log(userValidator.checkUserDataValidator);

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { signToken } = require("../services/jwtService");

exports.register = async (req, res, next) => {
  const { value } = userValidator.checkUserDataValidator.validate(req.body);

  try {
    const newUser = await User.create(req.body);
    console.log(newUser);

    const { email, subscription } = newUser;
    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { value } = userValidator.checkUserDataValidator.validate(req.body);
  const { email } = value;
  try {
    const user = await User.findOne({ email });
    const token = signToken(user.id);
    await User.findByIdAndUpdate({ _id: user.id }, { token });

    const { subscription } = user;

    res.status(200).json({ user: { email, subscription }, token });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  const { token } = req.user;
  console.log(token);
  try {
    const user = await User.findOne({ token });
    console.log(user);
    console.log("del token, Status: 204 No Content");

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  const { value } = userValidator.checkUserDataValidator.validate(req.body);
  try {
    // const user = await User.findOne({ token });
    console.log("del token, Status: 204 No Content");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
