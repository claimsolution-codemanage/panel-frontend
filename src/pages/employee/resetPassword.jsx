import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { adminResetPassword } from "../../apis"

import { setToken,getJwtDecode } from "../../utils/helperFunction"
import {toast} from 'react-toastify'
import { AppContext } from "../../App"
import { useContext } from "react"
import { LuPcCase } from 'react-icons/lu'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import Loader from "../../components/Common/loader"
import { employeResetPassword} from "../../apis"

export default function EmployeeResetPassword(){
    const [data,setData] =useState({password:"",confirmPassword:""})
    const [setting,setSetting] = useState({fullName:"",email:"",mobileNo:"",consultantFee:""})
    const [loading,setLoading] = useState(false)
    const [settingLoader,setSettingLoader]= useState(false)
    const [resetPasswordLoader,setResetPasswordLoader]= useState(false)
    const [view,setView] = useState(false)
    const navigate = useNavigate()
    // const state = useContext(AppContext)

    const handleOnchange= (e)=>{
        const {name,value}= e.target;
        setData({...data,[name]:value})
    }

    const handleSumbit =async (e)=>{
        e.preventDefault()
        setResetPasswordLoader(true)
        try {
            const res = await employeResetPassword(data)
            // console.log("/admin/dashboard",res);
            if(res?.data?.success){
                navigate("/employee/dashboard")
                toast.success(res?.data?.message)
                setResetPasswordLoader(false)
            }
            setResetPasswordLoader(false)
    } catch (error) {
                if(error && error?.response?.data?.message){
                    toast.error(error?.response?.data?.message)
                }else{
                    toast.error("Something went wrong")
                }
            // console.log("adminResetPassword error",error);
            setResetPasswordLoader(false)
        }
    }

    return(<>
      {loading ? <div className="d-flex align-items-center justify-content-center" style={{height:'90vh'}}><Loader/></div>  : 
        <div className="">
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
          {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/employee/dashboard")} style={{ cursor: "pointer" }} /> */}
          <div className="d-flex flex align-items-center gap-1">
            <span>Reset Password</span>
            {/* <span><LuPcCase /></span> */}
          </div>
        </div>
      </div>
            <div className="row m-0 py-5">
                <div className="col-12 p-0">
                    <div className="color-4 mx-auto  w-75">
                <div className="align-items-center bg-color-1 p-5 rounded-2 row shadow m-0">
                <div className="border-3 border-primary border-bottom py-2">
                            <h6 className="text-primary text-center h1">Reset Password</h6>
                            </div>
                    <div className="">
                        <div className="my-3">
                            <label  htmlFor="email" className="form-label">Password</label>
                            <input type="password" name="password" value={data.password} onChange={handleOnchange} className="form-control" placeholder="" id="password"  />
                        </div>
                        <div className="mb-3 mt-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Passwod</label>
                                            <div className='d-flex flex aligin-items-center form-control justify-content-center'>
                                        <input type= {view ? "text" :"password" } className="w-100 border-0" name="confirmPassword" value={data.confirmPassword} onChange={handleOnchange}  style={{outline:'none'}} />
                                             <span className='fs-6' style={{cursor:'pointer'}} onClick={()=>setView(!view)}>
                                                {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                             </span>
                                            </div>
                                    </div>
                        <div className="d-flex mt-5  justify-content-center">
                        <div aria-disabled={resetPasswordLoader} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary w-100 ${resetPasswordLoader && "disabled"}`} onClick={handleSumbit}>
                         {resetPasswordLoader ? <span className="spinner-border spinner-border-sm"  role="status" aria-hidden={true}></span> : <span>Reset Password</span>} 
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>}

    </>)
}