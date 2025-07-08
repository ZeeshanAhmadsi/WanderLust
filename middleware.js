const {listingSchema,reviewSchema} = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');
const Listing = require("./Models/Listing.js");
const Review = require("./Models/Review.js");

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
    
}

module.exports.isLoggedIn  =(req,res,next)=>{
    // console.log(req);
    // console.log(req.path,"...",req.originalUrl);
    //     console.log(req.user);
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            req.flash("error","please login to continue");
            return res.redirect("/login");
        }
        next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
 let listing = await Listing.findById(id);
 if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listings");
    return res.redirect(`/listings/${id}`);
 }
 next();
};


module.exports.isAuthor = async(req,res,next)=>{
let {id,reviewId} = req.params;
let review = await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permission to delete");
    return res.redirect(`/listings/${id}`);
}
next();
}