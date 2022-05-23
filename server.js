// only purpose is to start the server
const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const exphbs = require('express-handlebars')
const helpers = require('./utils/helpers');
// pass the helpers to the existing exphbs.create() statement
const hbs = exphbs.create({helpers});


const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
//connects the session to the sequelize database
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

//express middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//built-in Express.js middleware function 
//that can take all of the contents of a folder and serve them as static assets.
app.use(express.static(path.join(__dirname, 'public')));

//turn on routes
app.use(routes);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//turn on connection to db and server
//sequelize.sync() to establish the connection
//force:false can prevent dropping and recreating all the database on startup
//force: true can let the connection to sync with the model definitions and associations
//note: only change to true when there are association changes
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
