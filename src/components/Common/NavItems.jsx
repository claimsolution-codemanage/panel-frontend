import React from 'react'
import { Link } from 'react-router-dom'

export const NavItems = ({active,path,name,icon,disable}) => {
  return (
    <>
    {disable ? 
    <div className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white-50`}  >
    {icon}
     <div className=''>{name}</div>
     </div> 
    : <Link to={path} className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${active && "active_item"}`}  >
   {icon}
    <div className=''>{name}</div>
    </Link> }
   
    </>
  )
}
