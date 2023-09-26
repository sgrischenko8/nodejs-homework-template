const { validator } = require("../utils");

const Contact = require("../models/contactModel");

exports.checkContactId = async (req, res, next) => {
  try {
    const { id, contactId } = req.params;

    const contact = await Contact.findOne({ _id: id || contactId });

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    next();
  } catch (error) {
    if (error.reason) {
      return res.status(404).json({ message: "Not found" });
    }
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkAbsenceBody = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      next();
      return;
    }

    if (req.body) {
      return res
        .status(400)
        .json({ message: "This request not allowed to includes body" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkAbsenceBodyInPut = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.checkAbsenceBodyInPatch = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.throwError = (req, res, next) => {
  const { error } = validator.createContactValidator.validate(req.body);

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

exports.throwPatchError = (req, res, next) => {
  const { error } = validator.updateContactStatusValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  next();
};
