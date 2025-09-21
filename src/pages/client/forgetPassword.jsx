import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { clientForgetPasswordApi } from '../../apis/auth/userAuthApi'


export default function ClientForgetPassword(){
   const [data,setData] =useState({email:""})
   const [loading,setLoading] = useState(false)
   const navigate = useNavigate()

   const handleOnchange =(e)=>{
    const {name,value}= e.target
       setData({...data,[name]:value})
   }


   const handleSumbit =async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
        const res = await clientForgetPasswordApi(data)
        if(res?.data?.success){
            toast.success(res?.data?.message)
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
   }



    return(
        <>
            <div className="container-fluid py-5">
                <div className="container-px-5">
                    <div className="bg-color-2">
                        <div className="row m-0 p-0">
                            <div className="col-sm-12 col-md-6 p-0">
                                <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                            </div>
                            <div className="col-sm-12 col-md-6 bg-color-7 color-4 p-0">
                                <div className="p-5">
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                    <div className="h2 fw-bold text-center">Forgot Password</div>
                                    <div className="text text-center text-primary">Mail will be sending on your register primary mail address</div>

                                    <div className="mt-5">
                                        <input type="email" className="form-control" name='email' value={data.email} onChange={handleOnchange} id="email" placeholder="Your Register Email" />
                                    </div>
                                         <div class="form-check mt-2 pb-5">
                                        <label class="float-end" >
                                        <Link to="/client/signin" className=''>Remember your password? signin</Link>
                                        </label>
                                    </div>
                                    <div className="mt-5">
                                        <button aria-disabled={loading} type="submit" class={`btn btn-primary color-1 w-100 ${loading && "disabled"}`} onClick={handleSumbit}>  {loading ? <span className="spinner-border spinner-border-sm"  role="status" aria-hidden={true}></span> : <span>Forgot Password </span>} </button>
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