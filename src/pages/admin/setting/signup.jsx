import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { AppContext } from "../../../App"
import { useContext } from "react"
import { adminSignup } from "../../../apis"
import { toast } from 'react-toastify'
import { useFormik } from "formik"
import * as yup from 'yup'
import {checkPhoneNo} from '../../../utils/helperFunction'


export default function AdminSignUp() {
    const state = useContext(AppContext)
    //    const [data,setData] =useState({fullName:"",email:"",mobileNo:"",key:""})
    const [data, setData] = useState({ fullName: "", email: "", mobileNo: "" })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const adminFormik = useFormik({
        initialValues:{
            fullName: "",
            email: "", 
            mobileNo: "",
        },
        validationSchema:yup.object().shape({
            fullName: yup.string().required("FullName is required"),
            email: yup.string().email().required("Email is required"),
            mobileNo: yup.string().required("Mobile no is required"),

        }),
        onSubmit:async(values)=>{
            setLoading(true)
            try {
                const res = await adminSignup(values)
                if (res?.data?.success) {
                    toast.success(res?.data?.message)
                    navigate("/admin/signin")
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("signup error", error);
                setLoading(false)
            }
        }
    })


    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await adminSignup(data)
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                navigate("/admin/signin")
                setLoading(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            // console.log("signup error", error);
            setLoading(false)
        }
    }

    return (<>
        <div className="container-fluid py-5">
            <div className="container-px-5">
                <div className="">
                    <div className="row p-0">
                        <div className="col-12 col-md-6">
                            <img src="/Images/home/sign-up.png" className="rounded-3 " alt="signup" />
                        </div>
                        <div className="col-12 col-md-6 bg-color-7 color-4">
                            <div className="mx-auto p-5">
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                        <h1 className="text-center color-4">Admin Sign Up</h1>
                                        <form onSubmit={adminFormik.handleSubmit} className="form w-100">
                                            <div className="mb-3">
                                                <input type="text" name="fullName" value={adminFormik?.values?.fullName} onChange={adminFormik.handleChange} className={`form-control ${adminFormik.touched.fullName && adminFormik.errors.fullName && "border-danger"}`} placeholder="Your FullName" id="name" />
                                                <p className="text-danger">{adminFormik.touched.fullName && adminFormik.errors.fullName}</p>
                            
                                            </div>
                                            <div className="mb-3">
                                                <input type="email" name="email" value={adminFormik?.values?.email} onChange={adminFormik.handleChange} className={`form-control ${adminFormik.touched.email && adminFormik.errors.email && "border-danger"}`} placeholder="Email Id" id="email" />
                                                <p className="text-danger">{adminFormik.touched.email && adminFormik.errors.email}</p>
                                            
                                            </div>

                                            <div className="mb-3">
                                                <input type="text" name="mobileNo" value={adminFormik?.values?.mobileNo} onChange={(e)=>checkPhoneNo(e?.target?.value) && adminFormik.handleChange(e)} className={`form-control ${adminFormik.touched.mobileNo && adminFormik.errors.mobileNo && "border-danger"}`} placeholder="Phone No." id="mobileNo." />
                                                <p className="text-danger">{adminFormik.touched.mobileNo && adminFormik.errors.mobileNo}</p>
                                           
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-2 mb-4">
                                                <Link to="/admin/signin">Already have an account? signin</Link>
                                            </div>
                                            <div className="d-flex  justify-content-center">
                                                <button type="submit" aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary w-100 ${loading && "disabled"}`}>
                                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>SignUp </span>}
                                                </button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>)
}