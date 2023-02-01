require("dotenv").config();
const express = require("express");
const sequelize = require("./DB");
const cors = require("cors");
const router = require("./routes/Routes");
const models = require("./models/Models");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: true,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api', router)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'), function(error) {
      if (error) {
        res.status(500).send(error)
      }
    })
  })
}

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT)
    console.log('Server started at port ' + PORT)
  } catch (e) {
    console.log('Server error: ' + e)
  }
}

start();