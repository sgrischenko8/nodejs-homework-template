const { userValidator } = require("../utils");

const User = require("../models/userModel");
const { signToken } = require("../services/jwtService");

exports.register = async (req, res, next) => {
  const { value } = userValidator.checkUserDataValidator.validate(req.body);

  try {
    const newUser = await User.create(req.body);

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
  try {
    const user = await User.findOne({ token });
    user.set("token", undefined, { strict: false });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  const { value } = userValidator.checkUserDataValidator.validate(req.body);
  const { token } = req.user;
  try {
    const currentUser = await User.findOne({ token });
    const { email, subscription } = currentUser;

    res.status(200).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

exports.changeSubscription = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const currentUser = await User.findByIdAndUpdate(
      { _id },
      { subscription: value.subscription }
    );
    const { email, subscription } = currentUser;

    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};
