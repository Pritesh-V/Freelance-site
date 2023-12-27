import React, { useEffect, useState } from 'react'
import'./Searchpage.css';
import { useParams ,useNavigate,useLocation, Link} from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation , Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';

type listingdata ={
    _id : number,
    imageurl : string[],
    title : string,
    description : string,
    price : number,
    category : string,
    subcategory : string,
    typee :  string,
    userRef : string
}[]
export default function Searchpage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading ,setLoading] = useState(false);
    const [listing,setListing] = useState<listingdata>();
      SwiperCore.use([Navigation,Autoplay]);
   

    const [sidebardata , setSidebardata] = useState({
        searchTerm : '',
        category : 'all',
        subcategory : 'all',
        sort : 'created_at',
        order : 'desc'
    })
   
    const handlechange=(e : React.ChangeEvent<HTMLSelectElement> )=>{

        const  {id,value} = e.target;
        if(e.target.id === 'category'){
            setSidebardata({
                ...sidebardata,
                category: value,
               
             })

           }
        if(e.target.id === 'subcategory'){
            setSidebardata({
                ...sidebardata,
                subcategory : value,
               
             })

           }

           if(e.target.id === 'sort_order'){
                 const sort = e.target.value.split('_')[0] || 'created_at';
                 const order = e.target.value.split('_')[1] || 'desc';

                 setSidebardata({...sidebardata,sort,order
                })
           }
          
        
         
    }

    const handlesearchchange =(e : React.ChangeEvent<HTMLInputElement>)=>{
        const {id,value} = e.target;
          if(e.target.id === "searchTerm"){
            setSidebardata({
                ...sidebardata,
                 searchTerm : e.target.value,
             })
          }    
    }

    const handlesubmit=(e :  React.FormEvent<HTMLFormElement>)=>{
          e.preventDefault();
         const useParams = new URLSearchParams();
         useParams.set('searchTerm',sidebardata.searchTerm);
         useParams.set('category',sidebardata.category);
         useParams.set('subcategory',sidebardata.subcategory);
         useParams.set('sort',sidebardata.sort);
         useParams.set('order',sidebardata.order);
         const searchQuery = useParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    useEffect(()=>{
        const useParams = new URLSearchParams(location.search);
        const searchTermFromUrl = useParams.get('searchTerm');
        const categoryFromUrl = useParams.get('category');
        const subcategoryFromUrl = useParams.get('subcategory');
        const sortFromUrl =  useParams.get('sort');
        const orderFromUrl = useParams.get('order');
        
        if(searchTermFromUrl ||
            categoryFromUrl ||
            subcategoryFromUrl ||
            sortFromUrl ||
            orderFromUrl ){
            setSidebardata({...sidebardata,
                searchTerm : searchTermFromUrl || '',
                category : categoryFromUrl || 'all',
                subcategory : subcategoryFromUrl || 'all',
                sort : sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            })
        }

        const fetchquery = async ()=>{
            try{
               setLoading(true);
               const searchQuery = useParams.toString();
               const respons = await fetch(`/api/list/search?${searchQuery}`);
               const data = await respons.json();
               if(data.success === false){
                 console.error(data.message)
                 setLoading(false);
               }
               setListing(data);
               //console.log("data",data)
               setLoading(false)
                
            }catch(err){
                console.log(err);
                setLoading(false);
            }
        }
        fetchquery();
    },[location.search])
    console.log('sidebardata',sidebardata);
    console.log("searchpage",listing)
    
  return (
    <div>
        {/* sortings  */}
        <form onSubmit={handlesubmit} className='formcon' >
            <div className='formfield'>
            <div className='formf field1'>
                <label>search :</label>
                <input value={sidebardata.searchTerm} onChange={handlesearchchange} id="searchTerm" type='search' placeholder='search'/>
            </div>
            <div className='formf field1'>
                <label>category :</label>
                <select value={sidebardata.category}  onChange={handlechange} id='category'>
                    <option value="Graphic & Design">Graphic & Design</option>
                    <option value="Video & animation">Video & animation</option>
                    <option value="Music & audio">Music & Audio</option>
                </select>
            </div>
            <div className='formf field1'>
                <label>subcategory :</label>
                <select value={sidebardata.subcategory} onChange={handlechange} id='subcategory'>
                    <option value='Logo Design'>Logo Design</option>
                    <option value='Cartoon Animation'>Cartoon Animation</option>
                    <option value='Audio'>Audio</option>
                </select>
            </div>
            <div className='formf field1'>
                <label>sort :</label>
                <select  onChange={handlechange} id='sort_order'>
                    <option value={'regularprice_desc'}>Price high to low</option>
                    <option value={'regularprice_asc'}>Price low to high</option>
                    <option value={'createdAt_desc'}>Latest</option>
                    <option value={'createdAt_asc'}>Oldest</option>
                </select>
            </div>
            </div>
            <div className='search'>
                <button className='searchbtn'>Search</button>
            </div>
        </form>
        {/* listing cards */}
        <div>
            {/* <div>{listing && listing.length}</div> */}
            <div className='card'>{listing && listing.length > 0 && listing.map((list,index)=>{
                return (
                    <div className='inercard'  key={index}>
                        <div className='image'>
                        <Swiper autoplay={{delay : 100000}} loop={true} speed={1} >
                        {list.imageurl.map((image,index)=>{
                            return(<div key={index}>
                                <SwiperSlide key={image}><Link to={`/listing-page/${list._id}`}><div><img className='imag' src={image}></img></div></Link></SwiperSlide>
                                
                            </div>)
                        })}
                        </Swiper>
                        </div>
                        <div>
                        <div className='ml-3 text-2xl mt-3 mb-3' key={index}>{list.title}</div>
                        <div className='ml-3 text-sm mt-2 mb-2'>{list.description}</div>
                        <div className='ml-3  mt-2 mb-2'>${list.price}</div>
                        </div>
                    </div>

                    
                    
                )
            })}</div>
        </div>
    </div>
  )
}
