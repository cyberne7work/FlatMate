const express = require("express");
const mongoose  = require("mongoose");
const bodyparser    =require("body-parser");
const methodOverride    = require("method-override");
const session           =require("express-session");
const passport          =require("passport");
const LocalStrategy     =require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const cookieParser      =require("cookie-parser");
const MongoStore = require('connect-mongo')(session);
const Expense     =require("./models/expense");
const User     =require("./models/user");
const Flat      =require("./models/flat");
const morgan    =require('morgan')
const Mates      =require("./models/mate")
const expenseRouter    =require("./routes/expenseRoute");
const mateRouter    =require("./routes/mate");
const flatRouter    =require("./routes/flat");
const authRouter    =require("./routes/authentication");
const flash         =require("connect-flash");
const redirectLogin =require("./middleware/rediretlogin");
const redirectHome =require("./middleware/redirectHome");

const index   =express();

// Database
const db="vishal:cyberne7work@ds117469.mlab.com:17469/flatmate";
mongoose.connect("mongodb://vishal:cyberne7work@ds117469.mlab.com:17469/flatmate",{ useNewUrlParser: true })
    .then(()=>{console.log("Connected to Database")})
    .catch((err)=>{console.log(err.message)});


// Middileware Handlingç
index.use(express.static("public"));
index.use(methodOverride("_method"));
index.use(morgan('dev')); // log every request to the console
index.use(cookieParser()); // read cookies (needed for auth)
index.use(bodyparser(
    {extended:true}
)); // get information from html forms
index.use(flash());

index.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
index.use(session({
secret: 'ilovescotchscotchyscotchscotch',
resave:false,
saveUninitialized:false,
store:new MongoStore({ mongooseConnection: mongoose.connection }),
})); // session secret
index.use(passport.initialize());
index.use(passport.session());

index.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next()
})

passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField:"password"
},function(usernameField,passwordField,done){
    User.findOne({ 'local.email': usernameField }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
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

  passport.serializeUser(
      function(user,done){
          done(null,user);
      }
  );
  passport.deserializeUser(
      function(user,done){
          done(null,user);
      }
  );

// Route Handler
index.use("/user",expenseRouter);
index.use("/user",authRouter);
index.use("/mate",mateRouter);
index.use("/flat",flatRouter);



index.get('/auth/facebook',
  passport.authenticate('facebook',{ scope:  ['public_profile', 'email'] })
);
index.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/login' }));
index.get('/auth/google',passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read' ] }));
 index.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),
 function(req, res) {
// Successful authentication, redirect home.
res.redirect('/');
});

index.get("/home",redirectLogin,async (req,res)=>{
    let a = 0;
    let allexp=[];
    const expense = await Expense.find({flatid:req.user._id});
    for (let index = expense.length-1; index>0;  index--) {  
        allexp.push(expense[index]);
    }
    console.log(allexp.length)
    const amount = expense.forEach(exp=>{
        a=a+exp.expamount;
    })
    const mate = await Mates.find({mateid:req.user._id});
    const flat = await Flat.findOne({flatid:req.user._id});
        if(!flat){
            const newFlat = new Flat();
            newFlat.flatid=req.user._id;
            const result=await newFlat.save();
            return res.render("home",{total:a,user:mate,expense:allexp,flatinfo:result});
        }
        
    res.render("home",{total:a,user:mate,expense:allexp,flatinfo:flat});
});

index.get("/",redirectHome,async (req,res)=>{
    res.render("login");
});
index.get("/login",redirectHome,async (req,res)=>{
    res.render("login");
});






const port = process.env.PORT || 3000;

// Listing Server
index.listen(port,(err,done)=>{
    if(err) return console.log(err);
    console.log("Server is Started");
});