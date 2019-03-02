module.exports=function(req,res,next){
    if(req.isAuthenticated()){
        res.redirect("/home");
    }else{
        next()
    }
}