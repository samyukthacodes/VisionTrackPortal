if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require('express')
const app = express()
    

const { Deta } = require('deta'); // import Deta

// Initialize
const deta = Deta(process.env.DETA_KEY);
// This how to connect to or create a database.
const db = deta.Base('attendance');
const initializePassport = require('./passport-config')
initializePassport(passport)

const initializePassport = require('./passport-config');
const passport = require("passport");
initializePassport(passport)

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({secret:process.env.SESSION_SECRET,
    resave: false,
    saveIninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.render('index.ejs')
    console.log(item)
})
app.post('/login', passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
}))

app.get('/', (req, res) => {
    res.render('index.ejs')
    console.log(item)
})

app.listen(3000)