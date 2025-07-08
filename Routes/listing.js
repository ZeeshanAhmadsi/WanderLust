const express =  require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');//we added extra dot because we are going inside parent directory
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const listingController = require("../controllers/listings.js");

//merged index and create route using router route because there path are same
router.route("/")
.get(wrapAsync(listingController.searchlisting))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));


// New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));


//merged show, update and delete route using router route because there path are same
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));



module.exports = router;