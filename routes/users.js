var express = require('express');
var router = express.Router();

var passport=require('passport');
var csrf=require('csurf');
var csrfprotection=csrf();
router.use(csrfprotection);



router.get('/profile',isLoggedIn,function(req,res,next){
  var userState=req.user.userType;
  console.log(res.locals.login);
  if(userState==1)
  {
    res.render('user/admin');
  }
  else{
  res.render('user/profile');
  }
});
/*router.use('/',notLoggedIn,function(req,res,next){
  next();
});*/
/* GET users listing. */


router.get('/signup',function(req,res,next){
  var messages=req.flash('error');
  
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signup',passport.authenticate('local.signup',{
  
  successRedirect:'/user/profile',
  failureRedirect:'/user/signup',
  failureFlash:true
}));


router.get('/signin',function(req,res,next){
  var messages=req.flash('error');
 
  res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});
router.post('/signin',passport.authenticate('local.signin',{
  
  successRedirect:'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
}));

router.get('/logout',function(req,res,next){
  
  req.logout();
  
  res.redirect('/');
  
}); 

router.get('/admin',function(res,req,next){
  res.render('user/admin');
});

module.exports = router;
function isLoggedIn(req,res,next){
  console.log(req.user);
  console.log(req.user.userType);
  
  
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');

}
function notLoggedIn(req,res,next){
 
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}