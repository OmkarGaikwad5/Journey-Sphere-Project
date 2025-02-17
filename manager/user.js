const User = require("../Models/user.js");


module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next) =>{
    try {
     let {username,email,password} = req.body;
     const newUser = new User({username,email});
     const registeredUser = await User.register(newUser,password);
     req.login(registeredUser,(err) =>{
         if(err) {
             next(err);
         }
         req.flash("success","Welcome To Journey Sphere");
         res.redirect("/listings");
     })
    } catch (err) {
     req.flash("error",err.message);
     res.redirect("/signup");
    }
 };

 module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) =>{
        
    req.flash("success","You Logged in successfully !!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) =>{
    req.logOut((err) =>{
        if(err) {
            return next(err);
         };
         req.flash("success","Logged Out Successfully");
         res.redirect("/listings");
    })
};
