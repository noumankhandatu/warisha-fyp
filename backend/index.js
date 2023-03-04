const express = require("express");
const PORT = 9000;
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { key } = require("./envkey");

// our schema imported here
app.use(cors());

// our database connection
mongoose
  .connect(key)
  .then(() => {
    console.log("mongodb connected to server");
  })
  .catch((err) => {
    console.log("mongodb isnt connected to server");
  });
// user scehma imported
require("./model/index.js");

// this is middleware
app.use(express.json());

// this is how we use routers in nodejs
app.use(require("./routes/index"));

app.listen(PORT, () => {
  console.log("started port 9000");
});
