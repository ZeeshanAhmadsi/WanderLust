if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/User.js");

//now we are not using local host connection for mongo now we are using
// online cloud service like mongo atlas to store our database online
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL; 

const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use (express.static(path.join(__dirname,"/public")));


main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
// console.log("connection was successful");
// res.send("Working");
// });
 

const store = MongoStore.create({
    mongoUrl : dbUrl,//to connect with mongo database
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter : 24*3600,
});


const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

store.on("error",()=>{
    console.log("Error in Mongo Session",err);
});


app.use(session(sessionOptions));
app.use(flash());


//initializing passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
// console.log(res.locals.success);
next();
});

//demo user
// app.get("/demouser",async(req,res)=>{
// let fakeUser = new User({
// email:"student@gmail.com",
// username:"delta-student",
// });
// let registerUser = await User.register(fakeUser,"helloworld");
// res.send(registerUser);
// });



//Listing Router
app.use("/listings",listingRouter);

//Review Router
app.use("/listings/:id/reviews",reviewRouter);

//User Router
app.use("/",userRouter);

// Standard Response
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//MiddleWare for Error Handling
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("Error.ejs",{message});
});

app.listen(8080,()=>{
    console.log(`Listening to port ${8080}`);
});