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
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(_id, { token: "" });

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
      { subscription: req.body.subscription }
    );
    const { email } = currentUser;

    res
      .status(201)
      .json({ user: { email, subscription: req.body.subscription } });
  } catch (error) {
    next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  console.log(req.file);
  let avatar = "";
  if (req.file) {
    avatar = req.file.path.replace("tmp", "avatars");
  }
  try {
    if (avatar === "") throw error;
    await User.findByIdAndUpdate(_id, { avatarURL: avatar });

    res.status(200).json({ avatarURL: avatar });
  } catch (error) {
    next(error);
  }
};
