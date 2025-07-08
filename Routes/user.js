const express =  require("express");
const User = require("../Models/User.js");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

//Sign Up : merged both get and post signup
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));

//log-in : merged both get and post login
router.route("/login")
.get(userController.renderLogInForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),wrapAsync(userController.logIn));


//Log Out
router.get("/logout",userController.logOut);
module.exports = router;