if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const { Deta } = require('deta'); // import Deta

// Initialize
const deta = Deta(process.env.DETA_KEY);
// This how to connect to or create a database.
const db = deta.Base('attendance')

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
function initialize(passport){
    const authenticateUser = async (username, password, done) => {
        const user = await db.get(username)
        if(user == null){
            console.log('No user found')
            return done(null, false, {message : "Username not found."})
        }
        try{
            console.log(user.password.slice(2, -1))
            if (await bcrypt.compare(password, user.password.slice(2, -1))){
                console.log('Logged in Successfully')
                console.log(user)
                return done(null, user)
            }
            else{
                console.log('Incorrect password')
                return done(null, false, {message: "Incorrect Password."})
            }
        }
        catch (e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user, done) =>  done(null, user.key))
    passport.deserializeUser(async (key, done) => {
        try {
          const user = await db.get(key);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      });
}
module.exports = initialize