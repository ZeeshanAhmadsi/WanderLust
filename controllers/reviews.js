const Listing = require("../Models/Listing.js");
const Review = require("../Models/Review.js");


module.exports.createReview = async(req,res)=>{
// console.log(req.params.id);
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
newReview.author = req.user._id;
// console.log(newReview.author);author id gets printed
listing.reviews.push(newReview);
await listing.save();
await newReview.save();
// console.log("Review was saved");
// res.send("review saved");
req.flash("success","Successfully new review created");
res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
let {id,reviewId} = req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success","Review deleted successfully");
res.redirect(`/listings/${id}`);
};