const { validator } = require("../utils");

const Contact = require("../models/contactModel");

exports.listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findOne({ _id: id });

    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
    next(error);
  }
};

exports.addContact = async (req, res, next) => {
  const { value } = validator.createContactValidator.validate(req.body);

  try {
    const newContact = await Contact.create(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

exports.removeContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Contact.findByIdAndRemove({ _id: id });

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  const { value } = validator.createContactValidator.validate(req.body);
  const { name, email, phone, favorite } = value;

  const { id } = req.params;

  try {
    const currentContact = await Contact.findByIdAndUpdate(
      { _id: id },
      req.body,
      { name, email, phone, favorite }
    );
    const updatedContact = Object.assign(currentContact, value);
    res.status(201).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

exports.updateStatusContact = async (req, res, next) => {
  const { value } = validator.updateContactStatusValidator.validate(req.body);
  const { favorite } = value;

  const { contactId } = req.params;

  try {
    const currentContact = await Contact.findByIdAndUpdate(
      { _id: contactId },
      req.body,
      { favorite: favorite }
    );
    const updatedContact = Object.assign(currentContact, value);
    res.status(201).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
