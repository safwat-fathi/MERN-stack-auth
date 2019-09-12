require("./db/mongoose"); /* connect to our database */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.port || 5000;
// connect to user routes
const userRouter = require("./routes/users");

const app = express();

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
app.use(userRouter);

app.listen(port, () => {
  console.log(`Server up & running on on port ${port}`);
});
