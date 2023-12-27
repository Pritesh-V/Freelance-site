import React, { useEffect, useState } from 'react'
import { Link, useNavigate , useLocation } from 'react-router-dom'
import "./Header.css";
import { useSelector } from 'react-redux/es/hooks/useSelector';
//import { RootState } from '../../redux/store';

type UserState= {
  currentUser: {
      _id: string;
       username : string;
       avatar : string; 
  };
  error: string | null;
  loading: boolean;
  avatar: any; 
}

// Assuming that you have a RootState interface that combines all slices
type RootState= {
  user: UserState;
  // Other slices if any
}

export default function Header() {
    const {currentUser} = useSelector((state : RootState)=>state.user);
    const [searchTerm ,setSearchTerm] = useState<string>('');
   const navigate = useNavigate();
   const location = useLocation();
  // console.log('searchTerm-',searchTerm);
    const handlesubmit = (e : React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      const urlparams = new URLSearchParams(window.location.search);
      urlparams.set('searchTerm',searchTerm);
      const searchQuery = urlparams.toString();
      navigate(`/search?${searchQuery}`)
      console.log("urlparams-",urlparams)
      
    }

    useEffect(()=>{
      const urlparams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlparams.get('searchTerm');
      if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl);
      }
    },[location.search])
  return (
    <form onSubmit={handlesubmit}>
    <div className='Header'>
      
    <div>Loosersface</div>
    <input type='search' className='searchinput' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder='search'/>
    <Link to={"/"}>
    <div>Home</div>
    </Link>
    
    <div>About</div>
    <div>Explore</div>
    <div>Elements</div>
    
    <Link to={currentUser ? "/profile" : "/sign-in"}>
    {currentUser? (<img className='rounded-full h-10 w-10 object-cover' src={currentUser.avatar} alt='profile'></img>):(<div>Sign in</div>)}
    </Link>
    
    
    
    </div>
    </form>
  )
}
