const express = require("express");
const mongoose  = require("mongoose");
const bodyparser    =require("body-parser");
const methodOverride    = require("method-override");
const session           =require("express-session");
const passport          =require("passport");
const LocalStrategy     =require("passport-local").Strategy;
const cookieParser      =require("cookie-parser");
const MongoStore = require('connect-mongo')(session);
const Expense     =require("./models/expense");
const User     =require("./models/user");
const morgan    =require('morgan')
const Flat      =require("./models/flat")
const expenseRouter    =require("./routes/expenseRoute");
const userRouter    =require("./routes/user");
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
    Flat.findOne({ 'local.email': usernameField }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(passwordField)) { return done(null, false); }
      return done(null, user);
    });
  }))
  passport.serializeUser(
      function(flat,done){
          done(null,flat);
      }
  );
  passport.deserializeUser(
      function(flat,done){
          done(null,flat);
      }
  );

// Route Handler
index.use("/user",expenseRouter);
index.use("/user",authRouter);
index.use("/user",userRouter);




index.get("/home",redirectLogin,async (req,res)=>{
    let a = 0;
    const expense =await Expense.find({});
    const amount = expense.forEach(exp=>{
         a=a+ exp.expamount;
    })
    const user = await User.find({});
    res.render("home",{expense:expense,total:a,user:user});
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