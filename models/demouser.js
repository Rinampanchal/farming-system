var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var adduserschema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    company:{type:String,required:true},
    company_phone1:{type:String,required:true},
    file:{type:String,required:true}
   
});
module.exports=mongoose.model('edituser',adduserschema);