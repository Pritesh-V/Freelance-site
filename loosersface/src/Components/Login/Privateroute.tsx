import React from 'react'
import { Outlet,Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { RootState } from '../../redux/store';

export default function Privateroute() {
    const {currentUser} = useSelector((state : RootState)=>state.user);
  return (
    <div>
        {currentUser? <Outlet/> : <Navigate to={"/sign-in"}/>}
    </div>
  )
}
