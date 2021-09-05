const express = require('express');
const exphbs = require('express-handlebars');

const session = require('express-session')
const MySqlStore = require('express-mysql-session');
const {database} = require('./keys');
const flash = require('connect-flash');

const passport = require('passport');
const path = require('path');

const morgan = require('morgan'); //debug


//initializations
const app = express();
require('./lib/passport');

/* -------------------------------- settings -------------------------------- */
// For server
app.set('port', process.env.PORT || 4000);

// Handlebars
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middleware
app.use(session({
    secret: 'playscriptcardsMysqlSession',
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Globar Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.editor = req.editor;
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/news', require('./routes/news'));
app.use('/articles-manager', require('./routes/articles-manager'));
app.use('/articles-manager', require('./routes/articles-manager-auth'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});