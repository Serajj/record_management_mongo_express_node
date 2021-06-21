const express = require('express');

const app = express();

const mongoose = require('mongoose')
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes')
var cors = require('cors');
const { MONGODB_URL } = require('./config');

const port = process.env.PORT || 3000;
app.use(cors());

app.use(cors({
    origin: '*'
}));



app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())
app.use(bodyParser.json());


mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to database");

    return app.listen(port);
}).then(() => {

}).catch((err) => {
    console.log(err.message);
})

/***
 * 
 * Managing Routes
 * 
 * 
 *****/

var cookieParser = require('cookie-parser');
var session = require('express-session');



app.use(cookieParser());
app.use(session({
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true }
}));



app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));


app.use('/', userRoutes);

