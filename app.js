const express = require('express');
const path = require('path');
const mysql = require("mysql");
const expbs = require('express-handlebars');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');


dotenv.config({ path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.static('upload'));


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());
// FilesUpload
app.use(fileupload());

app.set('view engine', 'hbs');

db.connect ( (error) => {
    if (error){
        console.log(error)
    } else {
        console.log("MYSQL Connected..")
    }
});

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log('listening at 3000')
});

