const { userValidator } = require("../utils");

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { extractId } = require("../services/jwtService");

exports.checkIsEmailAlreadyUsed = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkUserData = async (req, res, next) => {
  const { error } = userValidator.checkUserDataValidator.validate(req.body);

  if (error) {
    console.log(error);
    const empty = error.details.find(
      (el) => el.type === "string.empty" || el.type === "any.required"
    );
    if (empty) {
      return res.status(400).json({
        message: `missing required ${empty.context.label} field`,
      });
    }
    if (error.details[0].type === "string.email") {
      return res.status(400).json({
        message: "email must be a valid",
      });
    } else {
      const message = error.details.map((el) => el.message).join(". ");
      return res.status(400).json({
        message,
      });
    }
  }
  next();
};

exports.IsEmailAndPasswordFit = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const IsPasswordValid = await bcrypt.compare(password, user.password);

    if (!IsPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkToken = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
  try {
    const userId = extractId(token);
    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    const user = await User.findOne({ _id: userId });
    if (user && user.token === token) {
      req.user = user;
    } else {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
