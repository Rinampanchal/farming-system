var passport=require('passport');
var User=require('../models/user');
var LocalStrategy=require('passport-local').Strategy;


passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});
passport.use('local.signup',new LocalStrategy({
   
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','Invalid Password').notEmpty().isLength({min:4});
    var errors=req.validationErrors();
    if(errors)
    {
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }
    User.findOne({'email':email},function(err,user){
        if(err)
        {
            return done(err);
        }
        if(user){
           return done(null,false,{message:'Email is already in use.'});
        }
        var newUser=new User();
        newUser.CustomerName=req.body.name;
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
        newUser.gender=req.body.gender; //  req.body.Name of the textbox
        newUser.Contact=req.body.contact;
        newUser.address=req.body.address;
        newUser.userType=2;
        newUser.save(function(err,result){
                if(err){
                    return done(err);
                }
                return done(null,newUser);
                
        });
    });
}));

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email','Invalid Email').notEmpty();
    req.checkBody('password','Invalid Password').notEmpty();
    var errors=req.validationErrors();
    if(errors)
    {
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }

    User.findOne({'email':email},function(err,user,req,res){
        if(err)
        {
            return done(err);
        }
       
        
        if(!user){
           return done(null,false,{message:'No user found!'});
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:'Wrong Password'});
        }
        return done(null,user);
    
    });
}));    