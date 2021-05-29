const express=require('express');
const router=express.Router();
const appointmentModel=require('../Models/appointment');
const passport=require('passport');
const Admin=require('../Models/admin');
const sgmail=require('@sendgrid/mail')
sgmail.setApiKey(process.env.SENDGRID_API_KEY);
router.get('/',(req,res)=>{
    res.render('home');
});

router.get('/appointment',(req,res)=>{
    res.render('appointment');
})

router.post('/appointment',async(req,res)=>{
    try{
     const appoint=await  appointmentModel.create(req.body);
     const admin=req.user;
     admin.appointment.push(appoint);
     await admin.save();
     const msg={
         to:req.body.email,
         from:req.user.email,
         subject:'Confirmation Mail',
         text:"Your appointment is successfully scheduled"
     }
     sgmail.send(msg);
    
    res.redirect('/show/active');
    }catch(e)
    {
        console.log(e);
    }

});

router.get('/show/:status',async(req,res)=>{
    const a=await Admin.findById(req.user._id).populate('appointment');
    res.render('show',{a:a.appointment,status:req.params.status});
})

router.get('/checkout/:id',async(req,res)=>{
      let d=new Date()
      let a=await appointmentModel.findByIdAndUpdate(req.params.id,{status:'completed',exit:d});
      res.redirect('/show/active');
})

router.get('/login',(req,res)=>{
    res.render('login');
})


router.post('/login',
  passport.authenticate('local', 
  {
    failureRedirect: '/login',
    failureFlash: true }),
    (req,res)=>{
        console.log("success login");
        req.flash("success","Welcome Back");
        res.redirect('/');

    });


    // router.get('/register',(req,res)=>{
    //     res.render('register');
    // });


    router.post('/register',async(req,res)=>{
        try{
           
            const admin=new Admin({email:req.body.email,username:req.body.username,phone:req.body.phone,company:req.body.company});
             await Admin.register(admin,req.body.password);
            req.flash("success","Registration Successfull");
            res.redirect('/login');
    
        }catch(e){
           // req.flash("error",e.message);
            console.log(e);
            res.redirect('/register');
        }
    
    });
    router.get('/logout',(req,res)=>{
        req.logOut();
        req.flash("success","Loged Out Successfully");
        res.redirect('/login');
    })




module.exports=router;