const Keycloak = require('keycloak-connect');
const session = require('express-session');
const express = require('express')

// creating session objec to store user sessions in cookie
var memoryStore = new session.MemoryStore();
// var keycloak = new Keycloak({ store: memoryStore });


// initilaize keycloak with express session storage
var keycloak = new Keycloak({ store: memoryStore });

const app = express();

// add session to app
app.use(session({
    secret: 'BeALongSecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// add keycloak as a middlewaee to the app
app.use(keycloak.middleware());

// protect test route with the keycloak
app.get('/test', keycloak.protect(),  (req, res) =>  {
    res.send("OK")
});

// protect special route with the realm role 'special'
app.get('/special', keycloak.protect('realm:special'),  (req, res) =>  {
    res.send("OK")
});


app.get('/', (req, res) => [
    res.send("OK")
])

// add keycloak as middleware with logout configuration to delete user sessions on logout
app.use('/logout', keycloak.middleware({ logout: '/' }));


app.listen(3000, function () {
    console.log('Listening at http://localhost:3000');
});