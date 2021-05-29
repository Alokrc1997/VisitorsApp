const mongoose=require('mongoose');


const visitorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    entry:{
        type:Date,
        default:Date.now
    },
    exit:{
        type:Date
    },
    mobile:{
        type:String,
        required:true,
        minLength:10,
        maxLength:10
    },
    email:{
        type:String
    },
    purpose:{
        type:String
    },
    status:{
        type:String,
        default:'active'
    }
});

const visitorModel=mongoose.model('Appointment',visitorSchema);

module.exports=visitorModel;