var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var addvehicletbl=new Schema({
    name:{type:String,required:true},
    rate_type:{type:String,required:true},
    rate:{type:String,required:true},
   
});
module.exports=mongoose.model('vehicle',addvehicletbl);