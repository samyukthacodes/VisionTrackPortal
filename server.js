if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require('express')
const app = express()


const { Deta } = require('deta'); // import Deta

// Initialize
const deta = Deta(process.env.DETA_KEY);
// This how to connect to or create a database.
const db = deta.Base('attendance')

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride= require('method-override')
const initializePassport = require('./passport-config')

initializePassport(passport, key => db.get(key))

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(express.static(__dirname+'/public'));

app.use(session({secret:process.env.SESSION_SECRET,
    resave: false,
    saveIninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/',checkAuthenticated, (req, res) => {
    console.log(req.user.name)
    console.log(req.user.present_dates)
    res.render('index.ejs', {name: req.user.name, datesPresent: req.user.present_dates})
    
})  
app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
  })
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

app.listen(3000)