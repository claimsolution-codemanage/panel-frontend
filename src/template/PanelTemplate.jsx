import React from 'react'

export default function PanelTemplate({children}) {
  return (
    <div className="">
    <div className="d-flex flex-col align-items-center justify-content-center" style={{height:'100vh'}}>
    {children}
   </div>
    </div>
  )
}
