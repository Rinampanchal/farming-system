var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var feedbackSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true},
   
});
module.exports=mongoose.model('feed',feedbackSchema);