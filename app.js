const express=require('express');
const app=express();
const passport=require('passport');
require('dotenv').config();
const Admin=require('./Models/admin');
const LocalStrategy=require('passport-local');
const flash=require('connect-flash');
const session=require('express-session');
const path=require('path');
const visitorRoute=require('./Routes/visitorRoute');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));



const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, 
    {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify:false
    })
    .then(()=>{
        console.log('DB connected')
    })
    .catch((err)=>{
        console.log('Error connecting db');
    });


    const sessionConfig={
        secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
    }

    app.use(session(sessionConfig));
    app.use(flash());


    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(Admin.authenticate()));
    passport.serializeUser(Admin.serializeUser());
    passport.deserializeUser(Admin.deserializeUser());

    app.use((req,res,next)=>{
        res.locals.success=req.flash('success');
        res.locals.error=req.flash('error');
        res.locals.currentUser=req.user;
        next();
    })


app.use(visitorRoute);






app.listen(process.env.PORT || 3000,()=>{
    console.log('Server Running at port 3000');
})