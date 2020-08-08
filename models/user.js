var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var Schema=mongoose.Schema;

var userSchema=new Schema({
    CustomerName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    gender:{type:String},
    Contact:{type:Number,required:true},
    address:{type:String,required:true},
    userType:{type:Number}
});

userSchema.methods.encryptPassword=function(password)
{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};

userSchema.methods.validPassword=function(password)
{
    return bcrypt.compareSync(password,this.password);
};
module.exports=mongoose.model('User',userSchema);
