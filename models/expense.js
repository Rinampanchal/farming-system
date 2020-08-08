var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var addexpense=new Schema({
    date:{type:String,required:true},
    amount:{type:String,required:true},
    payment_note:{type:String,required:true}
});
module.exports=mongoose.model('expense',addexpense);