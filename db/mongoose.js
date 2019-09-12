const mongoose = require("mongoose");

const connectionURL = "mongodb://127.0.0.1:27017/mern-auth";

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("connected to DB successfully");
  })
  .catch(err => {
    console.log(err);
  });
