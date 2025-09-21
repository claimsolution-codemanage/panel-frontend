import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { partnerResetPasswordApi } from '../../apis/auth/partnerAuthApi'


export default function PartnerResetPassword(){
   const [data,setData] =useState({password:"",confirmPassword:""})
   const [loading,setLoading] = useState(false)
   const [view,setView] = useState(false)
   const navigate = useNavigate()
   const param = useParams()

   const handleOnchange =(e)=>{
    const {name,value}= e.target
       setData({...data,[name]:value})
   }


   const handleSumbit =async (e)=>{
    e.preventDefault()
    setLoading(true)
    if(param?.verifyToken){
        try {
            const res = await partnerResetPasswordApi(data,param?.verifyToken)
            if(res?.data?.success){
                toast.success(res?.data?.message)       
                    navigate("/partner/signin")
                setLoading(false)
            }
    } catch (error) {
                if(error && error?.response?.data?.message){
                    toast.error(error?.response?.data?.message)
                }else{
                    toast.error("Something went wrong")
                }
            // console.log("signup error",error);
        setLoading(false)
    }
    setLoading(false)
    }
   }



    return(
        <>
            <div className="container-fluid py-5">
                <div className="container-px-5">
                    <div className="card bg-color-2">
                        <div className="row m-0 p-0">
                            <div className="col-sm-12 col-md-6 p-0">
                                <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                            </div>
                            <div className="col-sm-12 col-md-6 bg-color-7 color-4 p-0">
                                <div className="py-5">
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                        
                                    <div className="h2 fw-bold">Reset password</div>
                                    <div className="text"></div>
                                    <div className="mb-3 mt-3">
                                        {/* <label for="email" className="form-label">Email: </label> */}
                                        <input type="password" className="form-control" name='password' value={data.password} onChange={handleOnchange} id="password" placeholder="Your Password" />
                                    </div>
                                    <div className="mb-3 mt-3">
                                        <div className='d-flex flex aligin-items-center form-control justify-content-center'>
                                        <input type= {view ? "text" :"password" } className="w-100 border-0" style={{outline:'none'}} name='confirmPassword' value={data.confirmPassword} onChange={handleOnchange} id="password" placeholder="Confirm Password"/>
                                             <span className='fs-6' style={{cursor:'pointer'}} onClick={()=>setView(!view)}>
                                                {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                             </span>
                                            </div>
                                    </div>
          
                 
                                    <div class="form-check mt-2 pb-5">
                                        <label class="float-end" >
                                        <Link to="/partner/signin" className=''>Remember your password? signin</Link>
                                        </label>
                                    </div>
                                    <div className="mt-5">
                                        <button aria-disabled={loading} type="submit" class={`btn btn-primary color-1 w-100 ${loading && "disabled"}`} onClick={handleSumbit}>  {loading ? <span className="spinner-border spinner-border-sm"  role="status" aria-hidden={true}></span> : <span>Reset Password </span>} </button>
                                    </div>
                                    </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}