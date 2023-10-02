const { contactValidator } = require("../utils");

const Contact = require("../models/contactModel");

exports.listContacts = async (req, res, next) => {
  const { _id } = req.user;
  const { favorite, page, limit } = req.query;

  try {
    let contacts = [];
    if (favorite) {
      contacts = await Contact.find({ owner: _id, favorite });
    } else {
      contacts = await Contact.find({ owner: _id });
    }

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
  const { value } = contactValidator.createContactValidator.validate(req.body);
  const { _id } = req.user;

  const newContactWithOwner = req.body;
  newContactWithOwner.owner = _id;
  try {
    const newContact = await Contact.create(newContactWithOwner);

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
  const { value } = contactValidator.createContactValidator.validate(req.body);
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
  const { value } = contactValidator.updateContactStatusValidator.validate(
    req.body
  );
  const { favorite } = value;

  const { contactId } = req.params;

  try {
    const currentContact = await Contact.findByIdAndUpdate(
      { _id: contactId },
      req.body,
      { favorite }
    );
    const updatedContact = Object.assign(currentContact, value);
    res.status(201).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
