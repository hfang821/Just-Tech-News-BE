// only purpose is to start the server
const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const exphbs = require('express-handlebars')
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

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
