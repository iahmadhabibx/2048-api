require("dotenv").config();

const req = require("express/lib/request");
const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION_STRING)
.then(res => console.log("DB Connected"))
.catch(err=> console.log("Error while connecting to Database"));