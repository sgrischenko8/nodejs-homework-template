const mongoose = require("mongoose");

const { genSalt, hash, compare } = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: {
        values: ["starter", "pro", "business"],
        message: "{VALUE} is not supported",
      },
      default: "starter",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: { type: String },
  },

  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");
    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  }

  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});
userSchema.methods.checkPassword = (candidate, hashedPassword) =>
  compare(candidate, hashedPassword);

const User = mongoose.model("User", userSchema);

module.exports = User;
