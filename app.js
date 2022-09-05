require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const config = require("config");

// Import route
const authRouter = require("./routes/authRoute");
const dashboardRoute = require("./routes/dashboardRoute");

// Import Middleware
const { bindUserWithRequest } = require("./middleware/authMiddleware");
const setLocalsMiddleware = require("./middleware/setLocalsMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

// CONNECT DB URL
const MONGO_URL = `mongodb+srv://${config.get("db-username")}:${config.get("db-password")}@cluster0.tlkrt.mongodb.net/test-new?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "mySessions",
  expires: 1000 * 60 * 60 * 2,
});

console.log(config.get("name"));

// config
// const config = require("./config/config");
// if(app.get("env").toLowerCase() === "development"){
//   console.log(config.dev.name);
// }else{
//   console.log(config.prod.name);
// }


// env
if (app.get("env").toLowerCase() === "development") {
  app.use(morgan("dev"));
}

// Setup View Engine
app.set("view engine", "ejs");
app.set("views", "views");

// middleware array
const middleware = [
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get("secret") || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocalsMiddleware(),
  flash(),
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
