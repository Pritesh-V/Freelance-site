import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import Header from '../Home/Header';



export default function Signup() {
    const[name,setName] = useState({});
    const[Loading ,setLoading] = useState<boolean | undefined>(undefined);
    const [error ,setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
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

      setLoading(true);
      let options ={
           
        method : "Post",
        headers : {
         "content-type" : "application/json",
        },
        body  : JSON.stringify(name),
   }
   
   let p = await fetch("/api/auth/signup", options)

   
   const data = await p.json();
   console.log("this is data aboject")
   console.log(data);

   if(data.success === false){
    setLoading(false)
    setError(data.message);
    
    return;
   }
   setLoading(false)
   setError(null)
   navigate('/sign-in');
  

  

    }catch(err : any){
      setLoading(false)
      setError((err as Error).message)
      console.log(`catch-error ${err}`);
    }
    
  
   setLoading(false);
    
    
      
      
}


    
  return (
    <div className='containerr'>
        <div className='headertext'>
            Sign Up
        </div>
        <form className='inercontainer' onSubmit={submithandler}>
          <div className='inputs'>
            <div className='input'>
            <img src='profile.png' alt='profile'/>
        <input type='text' placeholder='username' id='username' onChange={clickhandler}></input>
            </div>
        <div className='input'>
        <img src='email.png' alt='email'/>
        <input type='email' placeholder='email id' id='email' onChange={clickhandler}></input>
        </div>
        <div className='input'>
        <img src='password-code.png' alt='password'/>
        <input type='password' placeholder='password' id='password' onChange={clickhandler}></input>
        </div>
        </div>
        <button disabled={Loading} className='button12'>{Loading? "Loading..." :"Sign Up"}</button>
         {error && <span className='text-red-700'>error message-{error}</span>}
          
        
        </form>
        
        
    </div>
  )
}

