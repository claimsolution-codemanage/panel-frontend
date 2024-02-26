import { useParams } from "react-router-dom"
import {GoQuestion} from 'react-icons/go'
import { useState } from "react";
export default function AcceptTlsView({as,handleAccept,loading}){
    const [accept,setAccept] = useState(false)
    const param = useParams()
    // console.log("param",as,param,accept);
    return(<>
       <div className="d-flex flex-column align-items-center justify-content-center" style={{height:"80vh"}}>
        <div className=' p-5 color-1 d-flex flex-column align-items-center justify-content-center'>
       <div className=' d-flex flex-column align-items-center justify-content-center'>
        <GoQuestion className='fs-1 text-primary mb-3'/>
        <h1 className="text-center">Are your agree</h1>
       </div>
       <p className="">Are you agree and accept all <span className="text-primary fs-5">claim-solution</span> terms & condition as {as} </p>
       <div className='input-group-text text-center d-flex gap-2 h-auto w-100 my-3  gap-3' style={{whiteSpace:'normal'}}>
        <input type="checkbox" name="" value={accept} onChange={()=>setAccept(!accept)} className="form-check-input"  id="" />
        <p className="h-25">Accept all terms & conditions</p> 
       </div>
       <button onClick={()=> accept && handleAccept(param?.verifyToken)} className={`btn ${(!accept || loading)  && "disabled"} btn-primary w-50`}>{loading ? <span className="spinner-border spinner-border-sm"  role="status" aria-hidden={true}></span> : <span>Save </span>}</button>
        </div> 
    </div>
    </>)
}