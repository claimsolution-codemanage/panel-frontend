import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { adminSignin } from "../../../apis"
import { setToken, getJwtDecode } from "../../../utils/helperFunction"
import { toast } from 'react-toastify'
import { AppContext } from "../../../App"
import { useContext } from "react"
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { useFormik } from "formik"
import * as yup from 'yup'

export default function AdminSignIn() {
    const [data, setData] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(false)
    const navigate = useNavigate()
    const state = useContext(AppContext)

    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }
   
    const adminFormik = useFormik({
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
                const res = await adminSignin(values)
                // console.log("/admin/dashboard", res);
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        // setheader()
                        setToken(token)
                        const details = getJwtDecode(token)
                        // console.log("details", details);
                        if (details?.role == "Admin") {
                            state?.setMyAppData({ isLogin: true, details: details })
                            // navigate("/partner/dashboard");
                            navigate("/admin/dashboard")
                            toast.success(res?.data?.message)
                            // console.log("navigate", "/admin/dashboard");
                        }
    
                    }
                    setLoading(false)
                }
                setLoading(false)
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
            const res = await adminSignin(data)
            // console.log("/admin/dashboard", res);
            if (res?.data?.success) {
                const token = res?.headers["x-auth-token"]
                if (token) {
                    // setheader()
                    setToken(token)
                    const details = getJwtDecode(token)
                    // console.log("details", details);
                    if (details?.role == "Admin") {
                        state?.setMyAppData({ isLogin: true, details: details })
                        // navigate("/partner/dashboard");
                        navigate("/admin/dashboard")
                        toast.success(res?.data?.message)
                        // console.log("navigate", "/admin/dashboard");
                    }

                }
                setLoading(false)
            }
            setLoading(false)
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
                        <div className="col-sm-12 col-md-6 p-0">
                            <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                        </div>
                        <div className="col-md-6 col-sm-12 p-0  bg-color-7 color-4">
                            <div className="mx-auto p-5">
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                        <h1 className="text-center mb-2">Admin SignIn</h1>
                                        <form onSubmit={adminFormik.handleSubmit} className="">
                                            <div className="my-3">
                                                <input type="email" name="email" value={adminFormik.values.email} onChange={adminFormik.handleChange} className={`form-control ${adminFormik.touched.email && adminFormik.errors.email && "border-danger"}`} placeholder="Your Email" id="email" aria-describedby="emailHelp" />
                                                <p className="text-danger">{adminFormik.touched.email && adminFormik.errors.email}</p>
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <div className={`d-flex flex aligin-items-center form-control justify-content-center ${adminFormik.touched.password && adminFormik.errors.password && "border-danger"}`}>
                                                    <input type={view ? "text" : "password"} className="w-100 border-0" name='password' style={{ outline: 'none' }} value={adminFormik.values.password} onChange={adminFormik.handleChange} id="password" placeholder="Your password" />
                                                    <span className='fs-6' style={{ cursor: 'pointer' }} onClick={() => setView(!view)}>
                                                        {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                                    </span>
                                                </div>
                                                <p className="text-danger">{adminFormik.touched.password && adminFormik.errors.password}</p>
                                            </div>
                                            <div className="form-check">
                                                <label className="float-end" >
                                                    <Link to='/admin/forget password' className="text-decoration-underline">Forgot Password?</Link>
                                                </label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-2">
                                                <Link to="/admin/signup">Don't have an account? signup</Link>
                                            </div>
                                            <div className="d-flex  justify-content-center">
                                                <button type="submit" aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary w-100 mt-5 ${loading && "disabled"}`}>
                                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>SignIn </span>}
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