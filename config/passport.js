const User     =require("../models/user");
const LocalStrategy     =require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports=function(passport){
    passport.use(new LocalStrategy({
        usernameField:"email",
        passwordField:"password"
    },function(usernameField,passwordField,done){
        User.findOne({ 'local.email': usernameField }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { 
            return done(null, false); }
          if (!user.validPassword(passwordField)) { return done(null, false); }
          return done(null, user);
        });
      }));
    
      passport.use(new FacebookStrategy({
        clientID: 605374846576731,
        clientSecret: 'c3927f6f5b5cbd99e24f0523e72d6ca9',
        callbackURL: "https://boiling-springs-44996.herokuapp.com/auth/facebook/callback",
        profileFields: ['id','email']
      },
      async function(accessToken,refreshToken, profile, done) {
          console.log("Acces token",accessToken);
          console.log("Email",profile.emails[0].value);
        User.findOne({"facebook.id":profile.id}, function(err, user) {
          if (err) { return done(err); }  
          if(user){
              return done(null,user);
          }
          else{
              const user = new User();
                user.facebook.id=profile.id;
                user.facebook.email=profile.emails[0].value;
                user.save(function(err,user){
                    if(err){
                        return done(err,false);
                    }
                    return done(null,user)
                })
            
          }
          
        });
      }
    ));
    passport.use(new GoogleStrategy({
        clientID: '350897290049-rmc4tgn52jsrtvospvv0jpj9vqfsrtsv.apps.googleusercontent.com',
        clientSecret: '8U-birc3NUKnHtCe2s3tGp2f',
        callbackURL: "https://boiling-springs-44996.herokuapp.com/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
          console.log(profile)
        User.findOne({"google.id":profile.id}, function(err, user) {
            if (err) { return done(err); }  
            if(user){
                return done(null,user);
            }
            else{
                const user = new User();
                  user.google.id=profile.id;
                  user.google.email=profile.emails[0].value;
                  user.save(function(err,user){
                      if(err){
                          return done(err,false);
                      }
                      return done(null,user)
                  })
              
            }
            
          });
      }
    )); 
}