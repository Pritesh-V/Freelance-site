import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";




export const signup = async (req,res,next)=>{
    console.log(req.body);
   
    console.log("data fetched from browser");
    
    const {username,email,password} = req.body
    const decrptedpassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:decrptedpassword});

    try{
        await newUser.save();
    res.status(201).json("user created successfully");

    }
    catch(error){
        next(error);
    }
          
    
    
};


export const signin = async (req,res,next)=>{
    console.log(req.body);
    console.log("data fetched from browser");
       
       const {email,password} = req.body
       try{

         const validuser = await User.findOne({email});
         
         if(!validuser) return next(errorhandler(404,"user not found"));
         const validpassword =  bcryptjs.compareSync(password,validuser.password);
         if(!validpassword) return next(errorhandler(404,"wrong credentials !"));
         const {password:pass ,...rest} = validuser._doc
        const token = jwt.sign({id : validuser._id},process.env.JWT_SECRET);
        res.cookie("accesstoken",token,{httponly:true})
        .status(200)
        .json(rest)
        console.log("token-",token)

       }catch(err){
        next(err);

       }
}



export const google = async (req,res,next)=>{
    console.log(req.body);
     const {email,photo,username} = req.body;
    console.log("data fetched from google");
    try{
         const user = await User.findOne({email : req.body.email});
         //if(!user) return next(errorhandler(404,"user not found in google"));
        if(user){
            console.log("enter in if block");
            const token = jwt.sign({id : user._id},process.env.JWT_SECRET);
            const {password:pass ,...rest} = user._doc;
            res.cookie("accesstoken",token,{httponly:true})
            .status(200)
            .json(rest)
        }
        else{
            console.log("enter in else block");
            const genratepassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            
            const hashpassword = bcryptjs.hashSync(genratepassword,10);
            console.log("2")
            //const hashusername = username.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4);
            console.log("2")
            const newUser = new User({username,email,password:hashpassword,avatar : photo});
            

            try{
                
                 await newUser.save();
        console.log("user is created succesfully")
    

    }
    catch(error){
        console.log(error)
        next(errorhandler(404,"user not created"));
    }
           
            
            console.log("5")
            const token = jwt.sign({id : newUser._id},process.env.JWT_SECRET);
            console.log("6")
            const {password : pass , ...rest} = newUser._doc;
            console.log("7")
            res.cookie("accesstoken",token,{httponly : true})
            .status(200)
            .json(rest);
            console.log("finish the else block");
        }
        }catch(err){
        next(errorhandler(404,"google catch error"));

    }
} 




export const signout= async(res,req,next)=>{
    try{
        res.clearCookie("accesstoken");
      res.status(200).json("User has been logged out !");
    }catch(err){
        next(err);
    }
      
}