const express = require("express");
const appserver = express();
const bodyparser = require("body-parser");
const userRouter = require('./Controllers/User.Controller');
const loginrouter=require('./Controllers/Login.Controller')
// INJECT MIDDLE WARES
appserver.use(bodyparser.json());

// INJECT
appserver.use('/usercredits',loginrouter)
appserver.use('/usercredits', userRouter);

module.exports = appserver;