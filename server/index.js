require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setup } = require('radiks-server');

var whitelist = ['http://localhost:3000', 'https://socialli.st', 'http://127.0.0.1:3000'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

const app = express();

app.use(cors(corsOptions));

app.use(function(req, res, next) {
    res.setHeader(`can't-be-evil`, true);
    next();
});

setup({
    mongoDBUrl: process.env.MONGO_DB_URL,
    maxLimit: 1000000
}).then(RadiksController => {
    app.use('/radiks', RadiksController);
});

app.get("/", (req, res) => {
    res.send('Wazzzaaaa');
});

app.listen(process.env.PORT || 5000);
