const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/db")  // changed from review_app to db
  .then(() => {
    console.log("db is connected!");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex);
  });
