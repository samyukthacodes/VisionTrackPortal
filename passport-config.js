


const LocalStrategy = required('passport-local').Strategy

function initializePassport(passport){
    const authenticateUser = (username, password, done) => {
        user = db.get(username)
        if(user == null){
            return done(null, false, {message : "Username not found."})
        }
        try{
            if(password == user.password){
                return done(null, user)
            }
            else{
                return done(null, false, {message: "Incorrect Password."})
            }
        }
        catch (e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy( {usernameField: 'username'}), authenticateUser)
    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})
}