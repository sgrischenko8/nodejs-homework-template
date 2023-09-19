const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./env" });

const contactsRouter = require("./routes/api/contactRouter");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// middlewares------------------
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
//--------------------------

app.use("/api/contacts", contactsRouter);
app.all("*", (req, res) => {
  res.status(404).json({ message: "Bad request. Page not found" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
