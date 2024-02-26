import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../App'
import {toast} from 'react-toastify'
import { employeSignIn } from '../../apis'
import { setToken } from '../../utils/helperFunction'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { getJwtDecode } from '../../utils/helperFunction'
import { useFormik } from "formik"
import * as yup from 'yup'

export default function EmployeeSignIn(){
    const state = useContext(AppContext)
   const [data,setData] =useState({email:"",password:""})
   const [view,setView] = useState(false)
   const [loading,setLoading] = useState(false)
   const navigate = useNavigate()

//    console.log("state",state);
   const handleOnchange =(e)=>{
    const {name,value}= e.target
       setData({...data,[name]:value})
   }


   const handleSumbit =async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
        const res = await employeSignIn(data)
        if(res?.data?.success){
            const token =  res?.headers["x-auth-token"]
            if(token){
                setToken(token)
                const details = getJwtDecode(token)
                state?.setMyAppData({isLogin:true,details:details})
                if(details?.empType=="assistant"){
                    navigate("/employee/dashboard")
                }else{
                    navigate("/employee/dashboard")
                }
                toast.success(res?.data?.message)
                // console.log("employee sign in",res);
            }
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

   const employeeFormik = useFormik({
    initialValues:{
        email: "", 
        password: ""
    },
    validationSchema:yup.object().shape({
        email: yup.string().email().required("Email is required"),
        password: yup.string().required("Password is required"),

    }),
    onSubmit:async(values)=>{
        setLoading(true)
        try {
            const res = await employeSignIn(values)
            if(res?.data?.success){
                const token =  res?.headers["x-auth-token"]
                if(token){
                    setToken(token)
                    const details = getJwtDecode(token)
                    state?.setMyAppData({isLogin:true,details:details})
                    if(details?.empType=="assistant"){
                        navigate("/employee/dashboard")
                    }else{
                        navigate("/employee/dashboard")
                    }
                    toast.success(res?.data?.message)
                    // console.log("employee sign in",res);
                }
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
})



    return(
        <>
            <div className="container-fluid py-5">
                <div className="container-px-5">
                    <div className="">
                        <div className="row p-0">
                            <div className="col-sm-12 col-md-6 p-0">
                                <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                            </div>
                            <div className="col-md-6 col-sm-12 p-0  bg-color-7 color-4">
                                <div className="p-5">
                                    <div className="h2 fw-bold text-center mb-5">Sign In</div>
                                    <div className="text"></div>
                                    <div className='aligin-items-center d-flex justify-content-center'>
                                    <form onSubmit={employeeFormik.handleSubmit} className="w-75">
                                    <div className="mb-3 mt-3">
                                        <input type="email" className={`form-control ${employeeFormik?.touched?.email && employeeFormik?.errors?.email && "border-danger"}`} name='email' value={employeeFormik?.values?.email} onChange={employeeFormik?.handleChange} id="email" placeholder="Your email" />
                                        <p className="text-danger">{employeeFormik?.touched?.email && employeeFormik?.errors?.email}</p>
                                    
                                    </div>
                                    
                                    <div className="mb-3 mt-3">
                                            <div className={`d-flex flex aligin-items-center form-control justify-content-center ${employeeFormik?.touched?.password && employeeFormik?.errors?.password && "border-danger"}`}>
                                        <input type= {view ? "text" :"password" } className="w-100 border-0" name='password' style={{outline:'none'}} value={employeeFormik?.values?.password} onChange={employeeFormik?.handleChange} id="password" placeholder="Your password" />
                                             <span className='fs-6' style={{cursor:'pointer'}} onClick={()=>setView(!view)}>
                                                {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                             </span>
                                            </div>
                                        <p className="text-danger">{employeeFormik?.touched?.password && employeeFormik?.errors?.password}</p>
                                    </div>
                                    <div className="form-check">
                                        <label className="float-end" >
                                            <Link to='/employee/forget password' className="text-decoration-underline">Forgot password?</Link>
                                        </label>
                                    </div>
                                    {/* <div className="d-flex align-items-center justify-content-center mt-2">
                                    <Link to="/client/signup" className=''>Don't have account? signup</Link>
                                         </div> */}
                                    <div className="mt-5">
                                        <button aria-disabled={loading} type="submit" className={`btn btn-primary color-1 w-100 ${loading && "disabled"}`}>  {loading ? <span className="spinner-border spinner-border-sm"  role="status" aria-hidden={true}></span> : <span>SignIn </span>} </button>
                                    </div>
                                    </form>
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