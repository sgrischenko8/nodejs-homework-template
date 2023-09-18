const fs = require("fs/promises");
const { contactsPath } = require("../models/contacts");
const { createContactValidator } = require("../utils/contactValidator");

exports.checkContactId = async (req, res, next) => {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const { id } = req.params;
    const contact = contacts.find((item) => item.id === id);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    req.contact = contact;

    next();
  } catch (error) {
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

exports.throwError = (req, res, next) => {
  const { error } = createContactValidator.validate(req.body);

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
