import Listing from '../models/createlists.model.js'
import User from '../models/user.model.js';
import { errorhandler } from '../utils/error.js';

export const Createlist = async (req,res,next)=>{
     console.log(req.body);
     try{
        const listing = await Listing.create(req.body);
      res.status(201).json(listing);
     }catch(err){
        next(err);
    
     }
     
}


export const deletelist= async (req,res,next)=>{
   const listing = await Listing.findById(req.params.id);
   if(!listing){
      return next(errorhandler(404,"Listing not found"));
   }
   if(req.user.id !== listing.userRef){   
      return next(errorhandler(401,"you can only delete you own listing"));
   }

   try{
      await Listing.findByIdAndDelete(req.params.id);
     res.status(200).json("List is Deleted successfully")
   }catch(err){
      next(err)
   }

}



export const updatelist = async (req,res,next)=>{
       const listing = await Listing.findById(req.params.id);
       if(!listing){
               return next(errorhandler(404,"Listing not found"));
       }

       if(req.user.id !== listing.userRef){
         return next(errorhandler(401,"you can only update your own listing"))
       }

       try{
        
          const updatelists = await Listing.findByIdAndUpdate(req.params.id,req.body,{new :true});
          res.status(200).json("User has been Updated")
          console.log(updatelists);
       }catch(err){
         next(err)
       }
}


export const getlist= async (req,res,next)=>{
   try{
     const listing = await Listing.findById(req.params.id);
     
     if(!listing){
      return next(errorhandler(404,"Listing not found"));
     }
 res.status(200).json(listing);
}catch(err){

   next(err)
}

}

export const getuser= async (req,res,next)=>{

   try{ 

      const getUSER = await User.findById(req.params.id);
      if(!getUSER){ return next(errorhandler(404,'user not found'))};
      const{password : pass ,...rest} = getUSER._doc;
      res.status(200).json(rest);
   }catch(err){
      next(err)
   }
      
}


export const getlistss = async (req,res,next)=>{
   
   console.log("start");
   try{
     
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = parseInt(req.query.startIndex) || 0;
      
      let category = req.query.category;
      console.log('category-',category);
    if(category === undefined || category === 'all'){
       category = { $in :['Grahpic & Design','Video & animation','Music & audio']};
    }
    
      let subcategory = req.query.subcategory;
      console.log('subcategory-',subcategory);
    if(subcategory === undefined || subcategory === 'all'){
       subcategory = { $in : ['Logo Design','Cartoon Animation','Audio']}
    }
    

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';
    
    const listing = await Listing.find({
         title : { $regex : searchTerm, $options: 'i'},
         category,subcategory,
    }).sort({
         [sort] : order
    }).limit(limit).skip(startIndex);
    console.log('listing',listing);
    return  res.status(200).json(listing);

   }catch(err){
      //console.log("1");s
    next(err);
      return res.status(500).json({ error: 'Internal Server Error---------' });
   }
}