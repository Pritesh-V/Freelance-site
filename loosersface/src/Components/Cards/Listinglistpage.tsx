import { useEffect, useState } from 'react'
import { Navigate, NavigationType, useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation , Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { delay } from '@reduxjs/toolkit/dist/utils';
import './Listinglistpage.css'
import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import Contact from './Contact';


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


type lists = {
    _id : number,
    imageurl : string[],
    title : string,
    description : string,
    price : number,
    category : string,
    subcategory : string,
    typee :  string,
    userRef : string


}
export default function Listinglistpage() {
    const {currentUser} = useSelector((state : RootState)=>state.user);
    const [contact,setContact] = useState(false);
    SwiperCore.use([Navigation,Autoplay])
const [listing,setListing] = useState<lists>({
    _id: 0,
    imageurl: [],
    title: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
    typee: '',
    userRef : ' '
});
const [loading ,setLoading] = useState(false);
const [error,setError] = useState(false)
    const params = useParams(); 
    useEffect(()=>{
           const fetchlisting= async ()=>{
            setLoading(true)
                try{
                    const respons = await fetch(`/api/list/get/${params.id}`)
               const data  = await respons.json();
                 
                
               if(data.success === false){
                  console.error(data.message);
                  setError(true)
                  setLoading(false)
                  return;
               }
               setLoading(false)
               setListing(data);
               setError(false)
               console.log(data);
                }catch(err){
                 setError(true);
                 setLoading(false);
                }
               
           }

           fetchlisting();
    },[params.id])
  return (

    <div>
        <div>
            <div>
        {loading && <h1 className='text-center my-7 text-2xl'>Loading...</h1>}
        {error && <h1 className='text-center my-7 text-2xl' >Something went Wrong</h1>}
        </div>
        { listing && !loading && !error && <div>
        <Swiper navigation autoplay={{delay:3000}} loop={true} speed={3000}>
             { listing.imageurl.map((url)=>(
                  <SwiperSlide key={url}>
                        <div className='h-[500px]' style={{background : `url(${url}) center no-repeat` ,backgroundSize:'cover'}}></div>
                  </SwiperSlide>
             ))}
        </Swiper>
        </div>
       }
    </div>
    <div className='details'>
       <div className='image'>
        <img className='rounded-full h-10 w-10 object-cover' src={currentUser && currentUser.avatar}/>
        <div>{currentUser && currentUser.username}</div>
        </div>
    <div className='title'>
     {listing && listing?.title} 
       </div>
       <div className='categorys'>
         {listing && listing?.category} - {listing && listing?.subcategory}
       </div>
       <div className='typee'>
        {listing && listing?.typee}
       </div> 
       <div className='descripton'>
        Discription - <span>{listing && listing?.description}</span>
       </div>
       <div className='price'>${listing && listing?.price}</div>
       <div>
       <div className='contactuser'>
         {listing && currentUser && listing.userRef !== currentUser._id && !contact && <div className='contactbutn'>
             <button onClick={()=>setContact(true)}className='conbtn'>Contact Owner</button>
            </div>}
       
       <div>
         {contact && <Contact list={listing}/>}
       </div>
       </div>
       </div>
        
       </div>
    </div>
  )
}
