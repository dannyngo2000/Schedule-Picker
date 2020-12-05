const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const storage = require("node-persist");
const config = require("./config/database");
const app = express();
const users = require("./routes/users");
const api = require("./routes/api");
let similarity = require("string-similarity");
//Connecting to database

const db = mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);
app.use("/users", users);
app.use("/api", api);
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
