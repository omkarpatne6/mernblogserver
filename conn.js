const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/blogsDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to the db successfully");
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = mongoose;