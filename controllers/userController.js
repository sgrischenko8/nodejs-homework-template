const { userValidator } = require("../utils");

const User = require("../models/userModel");
const { signToken } = require("../services/jwtService");
const { sendingEmail } = require("../services/sendingEmail");
const { nanoid } = require("nanoid");

exports.register = async (req, res, next) => {
  const { value } = userValidator.checkUserDataValidator.validate(req.body);
  req.body.verificationToken = nanoid();

  const { email: mail, verificationToken } = req.body;
  try {
    const newUser = await User.create(req.body);
    await sendingEmail(verificationToken, mail);

    const { email, subscription } = newUser;
    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  const { _id } = req.user;

  try {
    await User.findByIdAndUpdate(_id, {
      verificationToken: null,
      verify: true,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { value } = userValidator.checkUserDataValidator.validate(req.body);
  const { email } = value;
  try {
    const user = req.user;
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

exports.resendVerificationRequest = async (req, res, next) => {
  const { verificationToken, email } = req.user;

  try {
    await sendingEmail(verificationToken, email);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
