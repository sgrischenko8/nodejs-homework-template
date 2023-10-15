const mongoose = require("mongoose");

const { genSalt, hash, compare } = require("bcrypt");

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
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});
userSchema.methods.checkPassword = (candidate, hashedPassword) =>
  compare(candidate, hashedPassword);

const User = mongoose.model("User", userSchema);

module.exports = User;
