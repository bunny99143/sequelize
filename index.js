require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');

sequelize.sync().then((result)=>{
            console.log("DB Connected");
         })
         .catch((err)=>{
            console.log("error")
         })

require('./startup/routes')(app);

app.listen(3000,()=> console.log("3000 host is ready..."));