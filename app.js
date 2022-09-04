const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import route
const authRouter = require("./routes/authRoute");
const dashboardRoute = require("./routes/dashboardRoute");

// Import Middleware
const {bindUserWithRequest} = require("./middleware/authMiddleware");
const setLocalsMiddleware = require("./middleware/setLocalsMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL =
  "mongodb+srv://emon995:emon525296@cluster0.tlkrt.mongodb.net/test-new?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "mySessions",
  expires: 1000 * 60 * 60 * 2
});

// Setup View Engine
app.set("view engine", "ejs");
app.set("views", "views");

// middleware array
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    store : store,
  }),
  bindUserWithRequest(),
  setLocalsMiddleware(),
];
app.use(middleware);

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((e) => {
    return console.log(e);
  });
