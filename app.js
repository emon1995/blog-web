const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Import route
const authRouter = require("./routes/authRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// Setup View Engine
app.set("view engine", "ejs");
app.set("views", "views");

// middleware array
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
];
app.use(middleware);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

mongoose
  .connect("mongodb://localhost:27017/test-new", { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((e) => {
    return console.log(e);
  });
