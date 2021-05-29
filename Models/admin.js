const mongoose=require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
//const Product=require('../models/product');

const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String
    },
    company:{
        type:String
    },
    appointment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Appointment'
        }
    ]});

    adminSchema.plugin(passportLocalMongoose);

    const Admin=mongoose.model('Admin',adminSchema);

    module.exports=Admin;

