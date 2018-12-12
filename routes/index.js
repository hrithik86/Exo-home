var express=require("express");
var router=express.Router();
var User=require("../models/user");
var passport=require("passport");

router.get("/",function(req,res){
    res.render("landing.ejs");
  });
    
router.get("/about",function(req,res){
    res.render("about.ejs");
})  ;
  
  //==================
  //AUTH ROUTES
  //==================
  
  router.get("/register",function(req,res){
      res.render("register.ejs");
  })
  
  router.post("/register",function(req,res){
      var newUser=new User({username:req.body.username});
      User.register(newUser,req.body.password,function(err,user){
          if(err){
            req.flash("error",err.message);  
            return res.render("register.ejs");
          }
          passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Exoplanet "+ user.username);
            res.redirect("/exoplanets");
          })
      })
  });
  
  router.get("/login",function(req,res){
      res.render("login.ejs");
  })
  
  router.post("/login",passport.authenticate("local",{
      successRedirect:"/exoplanets",
      failureRedirect:"/login"
  }),function(req,res){
      
  });
  
  router.get("/logout",function(req,res){
    req.logout(); 
    req.flash("success","logged you out");
    res.redirect("/exoplanets");
  });

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    }
  
module.exports=router;