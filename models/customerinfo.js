var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var addcustomer=new Schema({
    name:{type:String,required:true},
    address:{type:String,required:true},
    phone:{type:String,required:true},
    phone2:{type:String,required:true}
   
});
module.exports=mongoose.model('customerinfo',addcustomer);