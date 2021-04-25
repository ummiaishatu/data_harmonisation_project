if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
//init app
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserSchema = require('./models/User');
const UsersRoutes = require('./routes/users');
const HomeRoutes = require('./routes/route'); 
const LogoutRoutes = require('./routes/logout');
const FileRoutes = require('./routes/files');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const db = mongoose.connection; 
//connection.on("error", console.error.bind(console, "connection error:")); 
db.on('error', error => console.error(error))
db.once("open", () => {
    console.log("DATABASE CONNECTED!!");
});

//getting rid of global errors
mongoose.Promise = global.Promise;

//Middleware 
//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '-'
}));

//public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/uploads'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(express.json());

const sessionConfig = {
    name: 'project',
    secret: 'thisshouldbeasecret!',
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true, 
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 60,
        maxAge: 1000 * 60 * 60 * 24 * 60
    }
}


app.use(session(sessionConfig)) 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserSchema.authenticate()));

passport.serializeUser(UserSchema.serializeUser());
passport.deserializeUser(UserSchema.deserializeUser());

app.use((req, response, next ) => {
    //console.log(request.session);
    response.locals.currentUser = req.user;
    response.locals.success = req.flash('success');
    response.locals.error = req.flash('error');
    next();
});

app.use('/', HomeRoutes);
app.use('/', UsersRoutes);
app.use('/', LogoutRoutes);
app.use('/', FileRoutes);

app.get('/', (request, response) => {
    response.render('home')
});


app.all('*', (request, response, next) => {
    next(new expressError('PAGE NOT FOUND', 404));
});

app.use((error, request, response, next) => {
    const {statusCode = 500, message = 'SOMETHING WENT WRONG!!!'} = error;
    if(!error.message) error.message = 'SOMETHING WENT WRONG!!!'
    response.status(statusCode).render('error', {error});
});



const port = 3000;
// starts the server 
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}!!!!`);
})

