const app = require("./app");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
