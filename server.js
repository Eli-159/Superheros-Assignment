// Inports the required libraries and other files.
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
require('dotenv').config();

const Database = require('./models/database.js');
app.locals.database = new Database();

const ReqQue = require('./models/req-que.js');
app.locals.reqQue = new ReqQue(10);


const securityRoutes = require('./routes/security.js')
const apiRoutes = require('./routes/api/index.js');
const pageRoutes = require('./routes/pages/index.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(cookieParser());

app.use('/', securityRoutes);

app.use('/api', apiRoutes);
app.use('/', pageRoutes);



// Begins listening for incoming requests.
app.listen(process.env.PORT);