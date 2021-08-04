const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");

const ExpressError = require("./utils/ExpressError");
const path = require("path");

const methodOverride = require("method-override");

const venues = require("./routes/venues");
const reviews = require("./routes/reviews");

mongoose.connect("mongodb://localhost:27017/badminton-venue", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "badsecret",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));

// Venues routes
app.use("/venues", venues);

app.get("/", (req, res) => {
  res.render("home");
});

// Reviews routes
app.use("/venues/:id/reviews", reviews);

// Errors/catch all other
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen("3000", () => {
  console.log("Listening on 3000");
});
