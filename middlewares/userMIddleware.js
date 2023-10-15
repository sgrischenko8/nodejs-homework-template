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

exports.throwPatchSubscriptionError = (req, res, next) => {
  const { error } = userValidator.updateSubscriptionValidator.validate(
    req.body
  );

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  next();
};

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "tmp");
  },
  filename: (req, file, callback) => {
    const extension = file.mimetype.split("/")[1];

    callback(null, `${req.user.id}-${Date.now()}.${extension}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(
      res.status(400).json({
        message: "Incorrect type of image. Please, upload image-file!",
      })
    );
  }
};

exports.uploadUserAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatarURL");

exports.checkAbsenceFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Please, upload file!",
    });
  }

  next();
};

exports.resizeUserAvatar = async (req, res, next) => {
  const avatar = await Jimp.read(req.file.path);
  avatar.resize(250, 250).write(req.file.path.replace("tmp", "public/avatars"));

  unlink(req.file.path, (err) => {
    if (err) throw err;
  });
  next();
};

exports.checkVerificationToken = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const verificatedUser = await User.findOne({ verificationToken });

    if (!verificatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = verificatedUser;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkVerification = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user.verify !== true) {
      return res.status(401).json({
        message: "Access denied",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkResendVerificationRequest = async (req, res, next) => {
  const { error } = userValidator.resendVerificationRequestValidator.validate(
    req.body
  );
  if (error?.message === '"email" is required') {
    return res.status(400).json({
      message: "missing required field email",
    });
  }
  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user.verify === true) {
      return res.status(400).json({
        message: "Verification has already been passed",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
