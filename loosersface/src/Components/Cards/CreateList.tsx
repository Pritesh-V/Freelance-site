import React, { useEffect, useState } from 'react'
import './CreateList.css'
import { resolve } from 'path';
import { ref ,getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app ,storage } from '../../Firebase';
import { initializeApp } from 'firebase/app';
import { useSelector } from 'react-redux/es/hooks/useSelector';

//import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';



type UserState= {
    currentUser: {
        _id: string; // Adjust the type of _id according to your application
        // Other properties of the user object
    } | null;
    error: string | null;
    loading: boolean;
    avatar: any; // Adjust the type of avatar according to your application
    // Other properties if any
}

// Assuming that you have a RootState interface that combines all slices
type RootState= {
    user: UserState;
    // Other slices if any
}


type formdataa = {
    imageurl : string[],
    title : string,
    description : string,
    price : number,
    category : string,
    subcategory : string,
    typee :  string,
}


export default function CreateList() {
    const [files,setFiles]= useState<FileList | null>(null);
    const [loading,setLoading] = useState<boolean | undefined>(undefined);
    const [error ,setError] = useState<string | null >(null);
    const [uploding , setUploding] = useState(false);
    const {currentUser} = useSelector((state : RootState)=>state.user)
    const navigate = useNavigate();
    const [formdata,setformdata] = useState<formdataa>({
        imageurl : [],
        title : "",
        description : "",
        price : 0,
        category : "",
        subcategory : "",
        typee : "creator",

    })
    const [imageuploaderror , setimageuploaderror] = useState<boolean | string>(false)





    const imageuploadbutton= async()=>{
       
            
            if(files && files.length  > 0 && files.length  < 7 ){
                setimageuploaderror(true);
                setUploding(true)
                const promises = [];
                for(let i=0;i<files.length;i++){
                    promises.push(storeimage(files[i]))
                 }
                 
                 try {
                    console.log("promises",promises)
                    
                     await Promise.all(promises as Promise<string | undefined>[]).then((urls)=>{
                           const filterdurls = urls.filter((url) =>url !== undefined) as [] ;
                        setformdata({
                            ...formdata,
                            imageurl: formdata.imageurl.concat(filterdurls)
                          });
                         setimageuploaderror(false)
                         setUploding(false)
                    }).catch((err)=>{
                        setimageuploaderror("image upload failed")
                    })
                   
              
               setimageuploaderror(true)
                     
                  } catch (error) {
                    
                    console.error("some problem occured during data fetching")
                  }
                }else{
                    setimageuploaderror("you can add only 6 images");
                }
                
        
      
    }
    



    

    const storeimage= async (file :  File )=>{
        

            if (file instanceof File) {
                return new Promise<string | undefined>( async (resolve,reject)=>{
                    
                    const storage =  getStorage(app);
                
                    const filename = new Date().getTime()+file.name
                    
                    const storageref = ref(storage,filename);
                    const uploadtask = uploadBytesResumable(storageref,file);
                    
                        
                       await uploadtask;
                       console.log('image Uploded')

                     uploadtask.on('state_changed',
                   
                    (snapshot)=>{const progres =
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log(`uploade is ${progres} done`)},

                    (err)=>{
                        
                        reject(err)
        
                    },
                    
                   async ()=>{
                    try {
                        await getDownloadURL(uploadtask.snapshot.ref).then((downloadURL)=>{
                            if(typeof downloadURL === "string"){
                                resolve(downloadURL)
                            }
                            else{
                                console.error('getDownloadURL returned undefined');
                                resolve(undefined);
                            }
                        })
                    
                        
                        
                    }catch(err){
                        console.log(err)
                        reject(err)
                    }
                     
                   },
                    
                    )
                })
                } else {
                  
                  console.error('you can upload maximum six image');
                }
        
  }
    
   






    const imagechange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    
        e.target.files && setFiles(e.target.files);
    }

    // useEffect(()=>{
    //     console.log('formdata:', formdata);
       
    // },[formdata])

    // useEffect(()=>{
    //     imageuploadbutton();
    //     console.log("files",files);
        
    // },[files])

  const removeimghandler=(urlindex : string)=>{
    console.log(urlindex);
    setformdata({
        ...formdata,
        imageurl : formdata.imageurl.filter((index)=>{
            return index !== urlindex
        })
    });
  }

    const handleclick=(e : React.MouseEvent<HTMLSelectElement, MouseEvent>)=>{
       
           const {id,value} = e.currentTarget;
           
           setformdata({
               ...formdata,
               [id] :value
           })
    }
    const handlechange=(e : React.ChangeEvent<HTMLInputElement>)=>{
           
           const {id ,value ,checked,type} = e.target
           
           
           setformdata({
            ...formdata,
            [e.target.id] :  e.target.value 
        })

        if(e.target.type === "category"){
            setformdata({
                ...formdata,
                [e.target.id] :  e.target.value
            })
        }

        if(formdata.typee === 'designer' || formdata.typee === 'creator'){
            
            setformdata({
                ...formdata,
               typee : e.target.id
            })
            
           }
           
           if(e.target.type === "text" || e.target.type === "number" || e.target.type === "textarea"){
               
            setformdata({
                ...formdata,
                [e.target.id] : e.target.value 
            })
           }
          
           

           
    }
    
    const submithandler = async(e : React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault()
        try{
            if(formdata.imageurl.length <1 ) return setError("atleast upload one image");
            
            
            setLoading(true); 
            if(!currentUser  ){
                console.error("current user is null");
                return;
            }
            console.log("currentuser-id",currentUser._id);
            const options = {
                method : "POST",
                headers : {
                    'content-type' : 'application/json',
                },
                body : JSON.stringify({
                    ...formdata,
                    userRef : currentUser._id
                })
            }
            
            const res = await  fetch('/api/list/create',options);
            const data =  await res.json()
            console.log(data);
            
            if(data.success === false){
                setLoading(false)
                setError(data.message)
                return ;
            }

            setLoading(false)
            setError(null);
            navigate(`/listing-page/${data._id}`)
        }catch(err){
            console.log((err as Error).message)
            
        }
    }
    
  return (
    <div>
       <h1 className='headingtext'>Create Listing</h1>
       <form>
        <div>
            <div className='inputfeild'>
            
            <div>
                <input type="text" onChange={handlechange} id='title' placeholder='title'/>
            </div>
            <div>
                <input type="textarea" onChange={handlechange} id='description' placeholder='description'/>
            </div>
            <div>
                <input type="number" onChange={handlechange} id='price' placeholder='price' min={1}/>
            </div>
            </div>
            <div className='multiple' >
                <div>
                <select  id="category" onClick={handleclick} name="category"  placeholder='category'>
                
                 <option value="Graphic & Design">Graphic & Design</option>
                 <option value="Video & animation">Video & animation</option>
                 <option value="Music & audio">Music & audio</option> 
                 </select>
                </div>
                <div>
                    <select  id='subcategory'  onClick={handleclick}  name='category' >
                    <option value="" disabled>Select a category</option>
                        <option value='Logo Design'>Logo Design</option>
                        <option value='Cartoon Animation'>Cartoon Animation</option>
                        <option value='Audio'>Audio</option>
                    </select>
                </div>

            </div>
            <div className='check'>
            <div>
                    <input required id='designer' value={formdata.typee} checked={formdata && formdata.typee === 'designer'} onChange={handlechange} type="checkbox" />
                    <span>designer</span>
                </div>
                <div>
                    <input required id='creator' value={formdata.typee} checked={formdata && formdata.typee === 'creator'} onChange={handlechange} type="checkbox" />
                    <span>creator</span>
                </div>
            </div>
            <div className='types'>
                <div>
                    <input required onChange={imagechange} type='file' accept='image/*' multiple/>
                </div>
                <div>
                    <button  disabled={uploding} onClick={imageuploadbutton} type='button'>{uploding ? "Uploading..." :"Upload" }</button>
                </div>
                 
            </div>
            <div className='text-red-700 text-sm text-center '>{imageuploaderror && imageuploaderror}</div>
               <div className='seeimage'>{
                    formdata && formdata?.imageurl.length > 0  ? (formdata.imageurl.map((url :string,index)=>(
                         
                            <div key={url}className='seeimagein'>
                                <img key={index} src={url} className='h-20 w-40' alt='Listing image'></img>
                                <button  onClick={()=>removeimghandler(url)} className='text-red-700' type='button'>Delete</button>
                                </div>
                    ))) : (
                            <div>no image to display</div>
                         )

                    }</div> 
                          
                          
                        
                   
                
                    
            <div className='buttonn'>
                
                <button  onClick={submithandler} className='button1'>{loading ? "Loading..." : "Create-List"}</button>
                </div>
                <div className='err'>{error && <span className='text-red-700 text-sm'>{error}</span>}</div>
                
        </div>
       </form>
        
    </div>
  )
}
