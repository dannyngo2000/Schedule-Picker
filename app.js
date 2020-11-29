const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

const config = require("./config/database");
const app = express();
const users = require("./routes/users");

//Connecting to database
const db = mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected To MongoDB DataBase");
  })
  .catch((err) => {
    console.log("DataBase Connection Error " + err);
  });

/** mongoose.connection.on("connected", () => {
  console.log("Connected to the database" + config.database);
}); **/
//PORT NUM
const PORT = 3000;

//Using CORS
app.use(cors());

//Body parser
app.use(bodyParser.json());

app.use("/users", users);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set static folder

app.use(express.static(path.join(__dirname, "public")));

//Route
app.get("/", (req, res, next) => {
  res.send("Hio");
});

//Server running
app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
});
