const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override'); 
const flash = require('connect-flash');
const session = require('express-session');
var moment = require('moment');


const app = express();


// Passport Config
require('./config/passport')(passport);

// DB configuration
const db = require('./config/keys').MongoURI;


//connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true})
   .then(() => console.log('Connected to MongoDB...'))
   .catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set('layout','./layouts/layout');
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public' ));

//Bodyparser middleware
app.use(express.urlencoded({ extended: false }));


// Express session
app.use(
   session({
     secret: 'secret',
     resave: true,
     saveUninitialized: true
   })
 );

 app.use(methodOverride("_method"));;
 // Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());


 //global variables
 app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
 });


//Routes
app.use('/', require('./routes/index'));

//login/register routes
app.use('/users', require('./routes/users'));

//products routes
app.use('/products', require('./routes/product'));

//category routes
app.use('/products', require('./routes/category'));

//Issue/return routes
app.use('/products', require('./routes/issue'));

//Employee routes
app.use('/products', require('./routes/employee'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));