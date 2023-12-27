import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../../Firebase';
import { json } from 'stream/consumers';
import {useDispatch} from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import './Oauth.css'
export default function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const googleclickhandler= async ()=>{
        try{

            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth,provider);

            let options = {
                method : "POST",
                headers : {
                  "content-type" : "application/json"
               },
               body : JSON.stringify({username : result.user.displayName,email: result.user.email, photo : result.user.photoURL})

            }
            
            const  p = await fetch("/api/auth/google",options);
            
            const data = await p.json();
            dispatch(signInSuccess(data));
            navigate("/");

        }catch(err){
            console.log("Could Not Sign With Google ",err)
        }

    }
  return (
    <div>
        <button className='btn' onClick={googleclickhandler} type='button'>Continue With Google</button>
    </div>
  )
}
