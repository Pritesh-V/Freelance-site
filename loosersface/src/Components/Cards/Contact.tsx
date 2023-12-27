import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Contact.css'


type listing1 = { 
    list : {
        _id : number,
    // imageurl : string[],
     title : string,
    // description : string,
    // price : number,
    // category : string,
    // subcategory : string,
    // typee :  string,
    userRef : string
    }
    
}

type ownerr = {
    username : string,
    email : string,
    avatar : string
}


export default function Contact( {list}: listing1) {
   const [owner,setOwner] = useState<ownerr>();
   const [message ,setMessage] = useState("");

  useEffect(()=>{
    const fetchowner = async ()=>{
        try{
            const respons = await fetch(`/api/list/${list.userRef}`);
        const data = await respons.json();

        if(data.success === false){
            console.error(data.message);
            return;
        }
         setOwner(data);
        }catch(error){
            console.log(error);
        }
        
    }

    fetchowner();    

  },[list.userRef])

  const textareahandler=(e : React.ChangeEvent<HTMLTextAreaElement>)=>{
           setMessage(e.target.value)
  }

  return (
    <div className='con'>
    {/* <div>Contact {owner && owner.email}</div> */}
    <textarea id='message' className='textarea' placeholder='Enter your message here...' rows={4} onChange={textareahandler}/>
    {/* this is going to activate mail system in window */}
    <div>
    <Link   to={`mailto:${owner?.email}?subject= Regarding-${list.title}&body=${message}`}>  
    <button  className='linkm' type='button'>Send Message</button>
    </Link>
      </div>
    </div>
  )
}
