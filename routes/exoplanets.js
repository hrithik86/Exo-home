var express=require("express");
var router=express.Router();
var Exoplanet=require("../models/exoplanet");


//Exoplanets ROUTES

router.get("/exoplanets",function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Exoplanet.find({ "name": regex }, function(err, foundExoplanet) {
           if(err) {
               console.log(err);
           } else {
              res.render("exoplanets/index.ejs", { exoplanets: foundExoplanet });
           }
       }); 
    }
    
    else{
        Exoplanet.find({},function(err,allExoplanets){
            if(err){
                console.log(err);
            }
            else{
                res.render("exoplanets/index.ejs",{exoplanets:allExoplanets});        
            }
        });
    }     
});

router.get("/exoplanets/new",isLoggedIn,function(req,res){
    res.render("exoplanets/new.ejs"); 
});

router.post("/exoplanets",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var year=req.body.year;
    var detectionmethod=req.body.detectionmethod;
    var eccentricity=req.body.eccentricity;
    var perioddays=req.body.perioddays;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newExoplanet={name:name,year:year,image:image,detectionmethod:detectionmethod,eccentricity:eccentricity,perioddays:perioddays,description:desc,author:author} 
    Exoplanet.create(newExoplanet,function(err,exoplanet){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/exoplanets");
        }
    });
    
});

router.get("/exoplanets/:id",function(req,res){
    Exoplanet.findById(req.params.id).populate("comments").exec(function(err,foundExoplanet){
        if(err){
            console.log(err);
        }
        else{console.log(foundExoplanet);
            res.render("exoplanets/show.ejs",{exoplanet: foundExoplanet});
        }
    });
});
//EDIT
router.get("/exoplanets/:id/edit",checkExoplanetOwnership,function(req,res){
        Exoplanet.findById(req.params.id,function(err,foundExoplanet){
            if (err){
                console.log(err);
                res.redirect("/exoplanets");
            }else{
                res.render("exoplanets/edit.ejs",{exoplanet:foundExoplanet});
            }
        });
});

//UPDATE
router.put("/exoplanets/:id",checkExoplanetOwnership,function(req,res){
    updatedExoplanet={
        name:req.body.name,
        year:req.body.year,
        image:req.body.image,
        description:req.body.description,
        detectionmethod:req.body.detectionmethod,
        eccentricity:req.body.eccentricity,
        perioddays:req.body.perioddays
    }    
    Exoplanet.findByIdAndUpdate(req.params.id,updatedExoplanet,function(err,updatedExoplanet){
        if(err){
            console.log(err);
            res.redirect("/exoplanets");
        }else{
            res.redirect("/exoplanets/" + req.params.id);
        }
    })
});
//DESTROY
router.delete("/exoplanets/:id",checkExoplanetOwnership,function(req,res){
    Exoplanet.findByIdAndDelete(req.params.id,function(err){
        if (err){
            res.redirect("/exoplanets");
        }else{
            res.redirect("/exoplanets");
        }
    })
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
    }

function checkExoplanetOwnership(req,res,next){
    if(req.isAuthenticated()){
        Exoplanet.findById(req.params.id,function(err,foundExoplanet){
            if (err){
                req.flash("error","Exoplanet not found");
                console.log(err);
                res.redirect("back");
            }else{
                if(foundExoplanet.author.id.equals(req.user._id)){
                    req.flash("")
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;