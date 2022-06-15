require("dotenv").config();
const express = require('express');
var bodyParser = require('body-parser')

const app = express();
const port = process.env.APP_PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const usersRouter = require('./api/users/user.router');
app.use('/api/v1/users', usersRouter);

app.listen(port, () => console.log(`Server is running on port : ${port}`));