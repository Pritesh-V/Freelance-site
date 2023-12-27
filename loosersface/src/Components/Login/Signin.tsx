import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useDispatch ,useSelector} from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../../redux/user/userSlice';
import Oauth from './Oauth';


type UserState = {
  loading: boolean;
  error: string | null;
  // other user-related properties...
}
type RootState = {
  user: UserState;
  // other slices of the state...
}

export default function Signin() {
    const[name,setName] = useState({});
   const {loading,error} = useSelector((state : RootState)=>state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
const clickhandler=(event:React.ChangeEvent<HTMLInputElement>)=>{
  const {id,value} = event.target
  setName({
     ...name,
     [id] : value,
        
  })

}

console.log(name);

const submithandler = async ( event : React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
 
    try {

      dispatch(signInStart());
      let options ={
           
        method : "Post",
        headers : {
         "content-type" : "application/json",
        },
        body  : JSON.stringify(name),
        
   }
   
   let p = await fetch("/api/auth/sign-in", options)

   
   const data = await p.json();
   console.log("this is data aboject")
   console.log(data);

   if(data.success === false){
    dispatch(signInFailure(data.message));
    
    return;
   }
   dispatch(signInSuccess(data));
   navigate('/');
  

  

    }catch(err : any){
      dispatch(signInFailure(err.message));
      console.log(`catch-error ${err}`);
    }
    
  
   
    
    
      
      
}


    
  return (
    <div className='container1'>
        <div className='headertext1'>
            Sign in
        </div>
        <form className='inercontainer1' onSubmit={submithandler}>
          <div className='inputs1'>
           
        <div className='input1'>
        <img  src='email.png' alt='email'/>
        <input type='email' placeholder='email id' id='email' onChange={clickhandler}></input>
        </div>
        <div className='input1'>
        <img  src='password-code.png' alt='password'/>
        <input type='password' placeholder='password' id='password' onChange={clickhandler}></input>
        </div>
        </div>
        <button disabled={loading} className='button11'>{loading? "Loading..." :"Sign in"}</button>
        <Oauth/>
        <div className='account'>
        <p className='para'>Have an account ?</p>
        <Link to={'/sign-up'}>
           <span className='text-blue-500 m-2'>Sign Up</span>
        </Link>
         {error && <span className='text-red-700'>error message-{error}</span>}
         </div>
          
        
        </form>
        
        
    </div>
  )
}

