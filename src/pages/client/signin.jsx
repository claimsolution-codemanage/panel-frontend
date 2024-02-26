import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../App'
import { toast } from 'react-toastify'
import { clientSignIn } from '../../apis'
import { setToken } from '../../utils/helperFunction'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { getJwtDecode } from '../../utils/helperFunction'
import { useFormik } from 'formik'
import * as yup from 'yup'


export default function ClientSignIn() {
    const state = useContext(AppContext)
    const [data, setData] = useState({ email: "", password: "" })
    const [view, setView] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }


    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await clientSignIn(data)
            if (res?.data?.success) {
                const token = res?.headers["x-auth-token"]
                if (token) {
                    setToken(token)
                    const details = getJwtDecode(token)
                    state?.setMyAppData({ isLogin: true, details: details })
                    toast.success(res?.data?.message)
                    navigate("/client/dashboard")
                    // console.log("client sign up", res);
                }
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

    const UserDetailsFormik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: yup.object().shape({
            email: yup.string().email("Enter valid Email").required("Please enter your Email"),
            password: yup.string().required("Please enter your Password"),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await clientSignIn(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: true, details: details })
                        toast.success(res?.data?.message)
                        navigate("/client/dashboard")
                        // console.log("client sign up", res);
                    }
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



    return (
        <>
            <div className=" py-5">
                <div className="container-px-5">
                    <div className="">
                        <div className="row p-0">
                            <div className="col-sm-12 col-md-6 p-0">
                                <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                            </div>
                            <div className="col-md-6 col-sm-12 p-0  bg-color-7 color-4">
                                <div className="px-3 py-3 px-md-5 py-md-5">
                                    <div className="h2 fw-bold text-center mb-5">Sign In</div>
                                    <div className="text"></div>
                                    <form onSubmit={UserDetailsFormik.handleSubmit} className='aligin-items-center d-flex justify-content-center'>
                                        <div className="w-75">
                                            <div className="mb-3 mt-3">
                                                <input type="email" className={`form-control ${UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email && "border-danger"}`} name='email' value={UserDetailsFormik.values?.email} onChange={UserDetailsFormik.handleChange} id="email" placeholder="Your Email" />
                                                {UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.email}</span>
                                                ) : null}
                                            </div>

                                            <div className="mb-3 mt-3">
                                                <div className={`d-flex flex aligin-items-center form-control ${UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password && "border-danger"} justify-content-center`}>
                                                    <input type={view ? "text" : "password"} className="w-100 border-0" name='password' style={{ outline: 'none' }} value={UserDetailsFormik.values?.password} onChange={UserDetailsFormik.handleChange} id="password" placeholder="Your Password" />
                                                    <span className='fs-6' style={{ cursor: 'pointer' }} onClick={() => setView(!view)}>
                                                        {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                                    </span>
                                                </div>
                                                {UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.password}</span>
                                                ) : null}
                                            </div>
                                            <div className="form-check">
                                                <label className="float-end" >
                                                    <Link to='/client/forget password' className="text-decoration-underline">Forgot Password?</Link>
                                                </label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-2">
                                                <Link to="/client/signup" className=''>Don't have an account? signup</Link>
                                            </div>
                                            <div className="mt-5">
                                                <button aria-disabled={loading} type="submit" className={`btn btn-primary color-1 w-100 ${loading && "disabled"}`} >  {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>SignIn </span>} </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}