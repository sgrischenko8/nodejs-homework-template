const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { createContactValidator } = require("../utils/contactValidator");

const { contactsPath } = require("../models/contacts");

exports.listContacts = async (req, res, next) => {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await JSON.parse(await fs.readFile(contactsPath));
    const result = data.find((contact) => contact.id === id);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
    next(error);
  }
};

exports.addContact = async (req, res, next) => {
  const { value } = createContactValidator.validate(req.body);

  const { name, email, phone } = value;

  try {
    const data = await JSON.parse(await fs.readFile(contactsPath));
    const newContact = { id: nanoid(), name, email, phone };
    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

exports.removeContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await JSON.parse(await fs.readFile(contactsPath));
    const index = data.findIndex((contact) => contact.id === id);
    if (index === -1) {
      return null;
    }
    const [result] = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  const { value } = createContactValidator.validate(req.body);
  const { name, email, phone } = value;

  const { id } = req.params;

  try {
    const data = await JSON.parse(await fs.readFile(contactsPath));
    const [contact] = data.filter((el) => el.id === id);
    contact.name = name;
    contact.email = email;
    contact.phone = phone;

    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};
