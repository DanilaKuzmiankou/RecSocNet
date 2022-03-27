require("dotenv").config();
const express = require("express");
const sequelize = require("./DB");
const cors = require("cors");
const router = require("./routes/Routes");
const models = require("./models/Models");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT);
  } catch (e) {
    console.log(e);
  }
};

start();
