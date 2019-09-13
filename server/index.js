require('dotenv').config();
const express = require('express');
const { setup } = require('radiks-server');

const app = express();

setup({
    mongoDBUrl: process.env.MONGO_DB_URL
}).then(RadiksController => {
    app.use('/radiks', RadiksController);
});

app.get("/", (req, res) => {
    res.send('Wazzzaaaa');
})

app.listen(process.env.PORT || 5000);
