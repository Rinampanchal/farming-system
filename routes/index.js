var express = require('express');
var router = express.Router();
var User=require('../models/user');
var passport=require('passport');
var csrf=require('csurf');
var csrfprotection=csrf();
var testinomial=require('../models/feedback');
var vehicle=require('../models/vehicle');
var customerinfo=require('../models/customerinfo');
var edituser=require('../models/demouser');
var expense=require('../models/expense');
router.use(csrfprotection);

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


router.post('/',function(req,res,next) {
  var Testinomial = new testinomial();
  Testinomial.name = req.body.name;
  Testinomial.email = req.body.email;
  Testinomial.message = req.body.message;
  Testinomial.save((err,doc)=>{
    if(!err){
      res.redirect('/');
    }
    else{
      console.log('Error'+err);  
    }
  });
});


router.get('/user/profile',isLoggedIn,function(req,res,next){
  var userState=req.user.userType;
  var name=req.user.CustomerName;
  console.log(res.locals.login);
  if(userState=="1")
  {
   
    User.find()
    .then(function(doc){
      res.render('user/admin',{items: doc,name:name});
    });
  }
  else{
    res.render('user/profile');
  
  }
  
 
});


router.get('/delete/:id',function(req,res,next){
  User.findByIdAndRemove(req.params.id).exec();
  res.redirect('/user/profile');
})
/*---------change password-----------------------------*/

router.get('/changepassword',function(req,res,next){ 
  User.findOne({'email':req.user.email},function(err,user){
    console.log(user);
  });
  // console.log("email"+req.user.email);
  res.render('user/userdata'); 

});








/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Shop/index',{ title: 'Farmie' });
});


router.get('/user/signin',function(req,res,next){
  var messages=req.flash('error');
 
  res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/user/signin',passport.authenticate('local.signin',{
  
  successRedirect:'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
}));

router.get('/user/signup',function(req,res,next){
  var messages=req.flash('error');
  
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/user/signup',passport.authenticate('local.signup',{
  successRedirect:'/user/signin',
  failureRedirect:'/user/signup',
  failureFlash:true
}));

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/user/signin');
}); 







router.get('/userdata',function(req,res,next){ 
  res.render('user/userdata');  
}); 
router.post('/userdata',function(req,res,next){ 
  console.log(req.body.input-password);
  
  User.findOne({'email':req.user.email},function(err,user){
    user.password=user.encryptPassword(input-password);
    user.save();
    console.log(user);
  });
  // // res.render('user/addvehicle');  
  // var uss={
  //   name:req.body.name,
  //   email:req.body.email,
  //   company:req.body.company,
  //   company_phone1:req.body.company_phone1,
  //   file:req.body.file
  // };
  // console.log(uss);
  // var insertuss = new edituser(uss);
  // insertuss.save();
  res.render('user/userdata');  
  });


router.get('/Admin',function(req,res,next){ 
  res.render('user/admin');  
}); 

router.get('/demo',function(req,res,next){ 
  var name=req.user.CustomerName;
  User.find()
  .then(function(doc){
    res.render('user/demo',{items: doc,name:name});
  });
}); 
//**************************************view Customer****************************** */
// router.get('/viewcustomer',function(req,res,next){ 
//   res.render('user/viewcustomer');  
// }); 
router.get('/viewcustomer/:id',function(req,res,next){ 

  customerinfo.findById(req.params.id,function(err,doc){
    if(!err){
      console.log(err);
      res.render('user/viewcustomer',
      {csrfToken:req.csrfToken(),
        customerinfo:doc});  

    }
  console.log("Eror   ::" +err);
}); 
});

router.get('/delete2/:id',function(req,res,next){
  customerinfo.findByIdAndRemove(req.params.id).exec();
  res.redirect('/customerinfo');
})

router.get('/updcustomer/:id',function(req,res,next){
  
  customerinfo.find({_id:req.params.id})
  .then(function(doc4){
    console.log("============================="+doc4);
    res.render('user/updatecustomer',{csrfToken:req.csrfToken(),doc:doc4});
  }); 
});
router.post('/updatecustomer',function(req,res,next){
  customerinfo.findByIdAndUpdate({_id:req.body._id},{$set:{name:req.body.name,address:req.body.address,phone:req.body.phone,phone2:req.body.phone2}},function(err,docupdated){
    if(!err){
      res.redirect('/customerinfo');
    }
  });

});



//*************************************************************************************** */



// router.get('/customerinfo',function(req,res,next){ 
//   res.render('user/customerinfo');  
// });

router.get('/invoice',function(req,res,next){ 
  res.render('user/invoice');  
});


//**********************************************expense*************************************** */
// router.get('/addexpense',function(req,res,next){ 
//   res.render('user/addexpense',{csrfToken:req.csrfToken()});  
// });

router.get('/addexpense',function(req,res,next){
  var name=req.user.CustomerName; 
  expense.find().then(function(doc){
    console.log(doc);
    console.log("doc");
  res.render('user/addexpense',{csrfToken:req.csrfToken(),itemexpense:doc,name:name});
  console.log("Expense called");
});
});
router.get('/expense',function(req,res,next){
  var name=req.user.CustomerName; 
  expense.find().then(function(doc){
    console.log(doc);
    console.log("doc");
    res.render('user/expense',{csrfToken:req.csrfToken(),itemexpense:doc,name:name});  
  }); 
});
router.post('/addexpense',function(req,res,next){ 
  var exp={
    date:req.body.date,
    amount:req.body.amount,
    payment_note:req.body.payment_note
  };
  //console.log("=================="+exp);
 var insertexp = new expense(exp);
  insertexp.save();

  res.redirect('/expense');
  console.log("+++++++++++++CLICKED");
  });
router.get('/expense',function(req,res,next){ 
  expense.find().then(function(docExpense){
    console.log(docExpense);
 
    res.render('user/expense',{csrfToken:req.csrfToken(),itemexpense:docExpense});
  });   
});

router.get('/delete1/:id',function(req,res,next){
  expense.findByIdAndRemove(req.params.id).exec();
  res.redirect('/expense');
})



router.get('/updexpense/:id',function(req,res,next){
  
  expense.find({_id:req.params.id})
  .then(function(doc4){
    console.log("============================="+doc4);
    res.render('user/updateexpense',{csrfToken:req.csrfToken(),doc:doc4});
  }); 
});
router.post('/updateexpense',function(req,res,next){
  expense.findByIdAndUpdate({_id:req.body._id},{$set:{date:req.body.date,amount:req.body.amount,payment_note:req.body.payment_note}},function(err,docupdated){
    if(!err){
      res.redirect('/expense');
    }
  });

});

//******************************************************************************************** */

router.get('/createinvoice',function(req,res,next){ 
  res.render('user/createinvoice');  
});
// router.get('/addcustomer',function(req,res,next){ 
//   res.render('user/addcustomer');  
// });

//************ add customer*******************************************
router.get('/addcustomer',function(req,res,next){ 
  var name=req.user.CustomerName; 
  customerinfo.find().then(function(doc){
  res.render('user/addcustomer',{csrfToken:req.csrfToken(),itemCustomer:doc,name:name});   
});
});
router.get('/customerinfo',function(req,res,next){ 
  var name=req.user.CustomerName; 
  customerinfo.find().then(function(doc){
  res.render('user/customerinfo',{csrfToken:req.csrfToken(),itemCustomer:doc,name:name});  
}); 
});
router.post('/addcustomer',function(req,res,next){ 
// res.render('user/addvehicle');  
var cus={
  name:req.body.name,
  address:req.body.address,
  phone:req.body.phone,
  phone2:req.body.phone2
};
console.log(cus);
var insertcus = new customerinfo(cus);
insertcus.save();
res.redirect('/customerinfo');
});


//**************************************************************** *




router.get('/addinvoice',function(req,res,next){ 
  var name=req.user.CustomerName;
  customerinfo.find().then(function(doc){
    res.render('user/addinvoice',{csrfToken:req.csrfToken(),itemCustomer:doc,name:name});  
  }); 
});





//**********************addvehicle**************************
router.get('/addvehicle',function(req,res,next){
  var name=req.user.CustomerName; 
  vehicle.find().then(function(doc){
    console.log(doc);
    console.log("doc");
    res.render('user/addvehicle',{csrfToken:req.csrfToken(),item1:doc,name:name});   
});
});
router.get('/vehicle',function(req,res,next){
  var name=req.user.CustomerName; 
  vehicle.find().then(function(doc){
    console.log(doc);
    console.log("doc");
    res.render('user/vehicle',{csrfToken:req.csrfToken(),item1:doc,name:name});  
  }); 
});
router.post('/addvehicle',function(req,res,next){ 
  // res.render('user/addvehicle');  
  var veh={
    name:req.body.name,
    rate_type:req.body.rate_type,
    rate:req.body.rate
  };
  var insertveh = new vehicle(veh);
  insertveh.save();
  res.redirect('/vehicle');
});

router.get('/vehicle/delete/:id',function(req,res,next){
  vehicle.findByIdAndRemove(req.params.id).exec();
  res.redirect('/vehicle');
});


router.get('/upd/:id',function(req,res,next){
  
  vehicle.find({_id:req.params.id})
  .then(function(doc4){
    console.log("============================="+doc4);
    res.render('user/updatevehicle',{csrfToken:req.csrfToken(),doc:doc4});
  }); 
});
router.post('/updatevehicle',function(req,res,next){
  vehicle.findByIdAndUpdate({_id:req.body._id},{$set:{name:req.body.name,rate:req.body.rate}},function(err,docupdated){
    if(!err){
      res.redirect('/vehicle');
    }
  });

});

//**********************************************************************


// router.get('/vehicle/delete/:id',function(req,res,next){
//   vehicle.findByIdAndRemove(req.params.id).exec();
//   res.redirect('/user/vehicle');
// })


















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





