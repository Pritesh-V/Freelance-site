import { errorhandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";
import Listing from "../models/createlists.model.js";

export const test=(req,res)=>{
    console.log("i am test");
    res.json({message : "Hello i am server api  of user .."});
}


export const UpdateUser= async (req,res,next)=>{
    if(req.user.id !== req.params.id) {
    return next(errorhandler(401,"you can only update your own account"));};

    try{
        if(req.body.password){

            req.body.password = bcryptjs.hashSync(req.body.password,10);
         }
         const updateuser = await User.findByIdAndUpdate(req.params.id,{
            $set :{
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar
            }
         },{new : true});

        const {password,...rest} = updateuser._doc;
        res.status(200).json(rest);
    }catch(err){
        next(err)

    }

}








export const userlisting= async (req,res,next)=>{
       if(req.user.id === req.params.id){
        try{
            const listing = await Listing.find({userRef : req.params.id});
            if(!listing) return next(errorhandler(404,'Listing not found'))
            res.status(200).json(listing);
        }catch(err){
           return next(errorhandler(401,"you can only view your own listings!"))
        }
       }else{
        console.error("user id and pramas id are not equal")
       }
}