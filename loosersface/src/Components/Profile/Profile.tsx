import React, { startTransition, useEffect, useRef, useState } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { isJSDocReturnTag } from 'typescript';
import { connectStorageEmulator } from 'firebase/storage';
import {  deleteUserFailure, deleteUserSuccess, signOutUserFailure, signOutUserStart,signOutUserSuccess} from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

//import { RootState } from '../../redux/store';


type UserState= {
  currentUser: {
      _id: string; 
      avatar: any;
      username : string,
       email : string,
       password : number,
      
       // Adjust the type of _id according to your application
      // Other properties of the user object
  } | null;
  error: string | null;
  loading: boolean;
  // Adjust the type of avatar according to your application
  // Other properties if any
}

// Assuming that you have a RootState interface that combines all slices
type RootState= {
  user: UserState;
  // Other slices if any
}

type showlist ={
     _id : number,
    imageurl : string[],
    title : string,
    description : string,
    price : number,
    category : string,
    subcategory : string,
    typee :  string,
}[]

type updata = {
   username : string,
   email : string,
   password : string,
   avatar : string
}[]



export default function Profile() {
  const {currentUser} = useSelector((state : RootState)=>state.user)
  const[errorlisting,setErrorlisting] = useState(true);
  const[errorupdate,setErrorupdate] = useState(true);
  const [showlisting,setShowlisting] = useState<showlist>([]);
  const [updatedata,setUpdatedata] = useState<updata>([])
  const [fileimage ,setFileimage] = useState<void | undefined>(undefined);
  const fileref = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const handlesignout= async ()=>{
        
    try{
      dispatch(signOutUserStart())
      const respons = await fetch("api/auth/signout");
      const data = await respons.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    }catch(err){
     dispatch(deleteUserFailure);
    }
  }

  const handleshowlisting= async()=>{
    try{
       if(!currentUser) {
        console.log("currentUser is null") 
       return;
      }
      console.log("currentuser-id",currentUser._id);
      const respons  = await fetch(`api/user/listings/${currentUser._id}`)
      
      if(!respons.ok){
        console.error(`HTTP error! Status: ${respons.status}`);
        return;
      }
     
       const data = await respons.json();
       
       if(data.success === false){
             setErrorlisting(false)
             console.error(data.message)
            return;
       } 
       console.log("Received data:", data);
       setShowlisting(data);
  

    }catch(err){
      
      console.error(err)
      
      setErrorlisting(false)
    }
  }

  const handledata = (e :  React.ChangeEvent<HTMLInputElement>)=>{
    const {id,value} = e.currentTarget
         setUpdatedata({
            ...updatedata,
            [id] : value,
         })
  }


  const handlesubmitupdate= async ()=>{
    try{
         
      if(!currentUser){
        console.log("currentUser is null")
      }
      console.log("currentuser-id",currentUser && currentUser._id);
      const options={
           method : "POST",
           headers : {
            'content-type' : 'application/json'
           },
           body : JSON.stringify(updatedata)
      }

      const respons = await fetch(`api/user/update/${currentUser?._id}`,options);

      if(!respons.ok){
        console.error(`HTTP error! Status: ${respons.status}`)
      }

      const data = await respons.json();
      
        

      if(data.success === false){
        console.log(data.message)
        setErrorupdate(false)
      }
       console.log("updated data :",data)
      
        
    }catch(err){
      console.log(err);
      setErrorupdate(false)
    }
  }

 useEffect(()=>{
    console.log("showlisting",showlisting)
 },[showlisting])

 useEffect(()=>{

  handlesubmitupdate();
      
 },[]) 

 const listingdeletehandler= async (e : React.MouseEvent<HTMLButtonElement, MouseEvent>,listingid : number)=>{

          try{
            const options = {
               method : "DELETE",
            }
            const respons = await fetch(`/api/list/delete/${listingid}`,options);  
            const data = await respons.json();

            if(data.success === false){
              data.error(data.message);
              return
            }
            setShowlisting((prev)=>prev.filter((list)=> list._id !== listingid));
          }catch(err){
            console.log(err)
          }
        
 }

 const listingedithandler=(e : React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{

 }
  
 useEffect(()=>{
      if(!fileimage){
         console.log("profile updated image does not exist")
      }else{
        updataprofileimage(fileimage);
      }
 },[fileimage])

 const updataprofileimage=(fileimage : string)=>{
     
 }
 


 console.log('updatedata-',updatedata)
 console.log('fileimage-',fileimage)
  return (
    <div>

<div>
        <input onChange={()=>updataprofileimage} type='file'ref={fileref} hidden/>
        </div>
      
      <div className='inputfields'>
        
        
      <div>
           <img className='rounded-full h-20 w-20 mb-5 object-cover' onClick={()=> setFileimage(fileref.current?.click())} src={currentUser && currentUser.avatar} alt='Profile Image' /> 
      </div>
         <div>
          <input type="text"  onChange={handledata} defaultValue={ currentUser?.username} className='inputfield' id='username' placeholder='username'/>
         </div>
         <div>
          <input type="email" defaultValue={ currentUser?.email}  onChange={handledata} className='inputfield ' id='email' placeholder='email'/>
         </div>
         <div>
          <input type="password"  onChange={handledata} className='inputfield' placeholder='password' id='password' min={1}/>
         </div>
      </div>
      <div className='buttons'>

       
       <div>
        <button className="butn butn1" onClick={handlesubmitupdate} >Update</button>
        </div>
        <div className='text-red-700'>
          {errorupdate && errorupdate ? '' :'problem occurs during updating data' }
        </div>

      <Link to={"/create-list"}>
      <div>
        <button className='butn butn2'>Create-list</button>
        </div>
      </Link>
       
       <div className='inbutton'>
      <div>
        <button className='butn butn3'>Delete account</button>
        </div>
      <div>
        <button onClick={handlesignout} className='butn butn4'>sign out</button>
        </div>
      </div>
      </div>

      <div className='listcontainer'>
      <div className='showlist' >
        <button className='butn butn5' onClick={handleshowlisting}>show listing</button>
        </div>
        <div className='text-red-700'>
          {errorlisting && errorlisting ? '' :'Error Showing Listings' }
        </div>
        </div>
        <div>
          {showlisting && showlisting.length > 0 && 
          <div className='cards' > 
          {/* <h1 className='text-center my-8 text-xl font-semibold '> Your Listing</h1> */}
            {showlisting.map((listing,index)=>{
             return(
              <div key={listing._id} className='listshow'>
                 <div >
                  <Link  to={`/Api/user/listings/${currentUser?._id}`}>
                    <img  src={listing?.imageurl?.[0]} alt='no image in listing'/>
                  </Link>
                 </div>
                 <div>
                  <Link to={`/Api/user/listings/${currentUser?._id}`}>
                    <div className='titlee'>{listing.title}</div>
                   </Link>
                 </div>
                 <div className='description'>{listing.description}</div>
                 <div className='price'>${listing.price}</div>
                 <div  className='editdelete text-red-700'><button className='deletebtn' onClick={(e)=>listingdeletehandler(e,listing._id)}>Delete</button>
                 <Link to={`/update-list/${listing._id}`}>
                 <button className='editbtn text-green-700' onClick={listingedithandler}>Edit</button>
                 </Link></div>
                 </div>
             )

              
                    })
                  }</div>
            }
        </div>
      
    </div>
  )
}
