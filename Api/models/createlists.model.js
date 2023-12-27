import mongoose from "mongoose";

const listingschema = new mongoose.Schema({
         title : {
            type : String,
            required: true
         },

         description : {
            type : String,
            required : true
         },

         price : {
            type : Number,
            required : true
         },

         imageurl : {
            type : Array,
            default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            //required : true
         },

         userRef : {
            type : String,
            required : true,
         },

         category : {
            type : String,
            required : true
         },
         subcategory : {
            type : String,
            required : true
         },

         typee : {
            type : String,
            required : true,

         },

},{timestamps : true});

const  Listing = mongoose.model('Listing',listingschema);

export default Listing;