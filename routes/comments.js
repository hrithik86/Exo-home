var express=require("express");
var router=express.Router();
var Exoplanet=require("../models/exoplanet");
var Comment=require("../models/comment");

//COMMENTS ROUTES
router.get("/exoplanets/:id/comments/new",isLoggedIn,function(req,res){
    Exoplanet.findById(req.params.id,function(err,exoplanet){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new.ejs",{exoplanet:exoplanet});
        }

    })
});

router.post("/exoplanets/:id/comments",isLoggedIn,function(req,res){
    Exoplanet.findById(req.params.id,function(err,exoplanet){
        if(err){
            console.log(err);
            res.redirect("/exoplanets");
        }
        else{
            var comment={
                text:req.body.text,    
            }
            Comment.create(comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    exoplanet.comments.push(comment);
                    exoplanet.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/exoplanets/"+exoplanet._id);
                }
            });
        }

    })
});
//Comment edit route
router.get("/exoplanets/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit.ejs",{exoplanet_id:req.params.id,comment:foundComment});
        }
    })
    
})
//comment update
router.put("/exoplanets/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
            Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
                if(err){
                    res.redirect("back");
                }else{
                    res.redirect("/exoplanets/"+req.params.id);
                }
            });
    });

router.delete("/exoplanets/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted");
            res.redirect("/exoplanets/"+req.params.id);
        }
    })
})
    
    function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
    }

    function checkCommentOwnership(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if (err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                    else{req.flash("error","You don't have the permission to do that");
                        res.redirect("back");
                    }
                }
            });
        }
        else{req.flash("error","You need to be logged in to do that");
            res.redirect("back");
        }
    }
    

module.exports=router;