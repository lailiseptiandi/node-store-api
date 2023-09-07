const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const appRoute = require('./src/routes/router_api');
app.use('/api/v1', appRoute);


app.listen(port, () => {
    console.log('Server Started at host http://'+host+':'+port);
});