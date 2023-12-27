//import React from 'react'
import { errorhandler } from './error.js';
import jwt from 'jsonwebtoken';
// for using token data i hava to install npm i cookie-parser
// and import cookieParser  in index.js and use in app.use()
export const verifytoken =(req,res,next)=>{
          
         
    const token = req.cookies.accesstoken;

    if(!token) return next(errorhandler(401,"Unauthorized"));

  jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
    if(err)  { 

     return next(errorhandler(403,"forbidden - token is not there"));
               
    }
       req.user = user;
       next();
  });
    
}
