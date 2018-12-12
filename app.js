var express=require("express"),
    app=express(),
    flash=require("connect-flash"),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    Exoplanet=require("./models/exoplanet"),
    User=require("./models/user"),
    methodOverride=require("method-override"),
    Comment=require("./models/comment"),
    passport=require("passport"),
    LocalStrategy=require("passport-local");

var exoplanetRoutes=require("./routes/exoplanets"),
    commentRoutes=require("./routes/comments"),
    indexRoutes=require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//Passport configuration
app.use(require("express-session")({
    secret:"rusty is the cutest dog",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
res.locals.currentUser=req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success");
next();
});

//connecting to mongodb
// mongoose.connect("mongodb://localhost/exoplanet");
mongoose.connect("mongodb://hrithik:exoplanet12345@ds117093.mlab.com:17093/exohome");


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    }

app.use(exoplanetRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT,function(){
   console.log("the exoplanet server has started"); 
});