const passport= require('passport');
const localStrategy= require('passport-local').Strategy;

const User= require('../models/users');

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
    const user= await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) =>{

    const user= await User.findOne({email:email});

    if(user) { 
        return done(null, false, req.flash('signupMessage', 'The email is already taken') ); 
    } else {
        const newUser= new User();
        newUser.email= email;
        newUser.password= newUser.encryptPassword(password);
        await newUser.save();
        console.log(newUser)
        done(null, newUser);

    }
}));

passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done)=> {
    const user= await User.findOne({email:email});
    if (!user){
        return done(null, false, req.flash("signinMessage", "No User Found"));
    } if (!user.comparePassword(password)){
        return done(null, false, req.flash("signinMessage", "Incorrect password"));
    }
    done(null, user);
}));