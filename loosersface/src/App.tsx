import React from 'react';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Signup from './Components/Login/Signup';
import Signin from './Components/Login/Signin'
import Home from './Components/Home/Home';
import Privateroute from './Components/Login/Privateroute';
import Profile from './Components/Profile/Profile';
import Header from './Components/Home/Header';
import CreateList from './Components/Cards/CreateList';
import UpdateList from './Components/Cards/UpdateList';
import Listinglistpage from './Components/Cards/Listinglistpage';
import Searchpage from './Components/Explore/Searchpage';



function App() {
  return (
      <div>
      <BrowserRouter>
      <Header/>
      <Routes> 
      <Route path='/' element={<Home/>}/>
      <Route path='/search' element={<Searchpage/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<Signup/>}/>
      <Route path='/listing-page/:id' element={<Listinglistpage/>} />
      <Route element={<Privateroute/>}>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/create-list' element={<CreateList/>}/>
      <Route path='/update-list/:id'  element={<UpdateList/>}/>
      </Route>
      
      
      
      
        
        
      </Routes>
      </BrowserRouter>
     
      </div>
      
      
    
  );
}

export default App;
