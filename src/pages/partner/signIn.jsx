import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { setheader } from "../../apis"
import { setToken, getJwtDecode } from "../../utils/helperFunction"
import { toast } from 'react-toastify'
import { AppContext } from "../../App"
import { useContext } from "react"
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { useFormik } from 'formik'
import { partnerSignInValidationSchema, signInOrSignUpInitialValue } from "../../utils/validations/auth/partnerAuthValidation"
import { partnerSigninApi } from "../../apis/auth/partnerAuthApi"

export default function SignIn() {
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()
    const [view, setView] = useState(false)
    const state = useContext(AppContext)


    const UserDetailsFormik = useFormik({
        initialValues:signInOrSignUpInitialValue,
        validationSchema:partnerSignInValidationSchema,
        onSubmit: async (values) => {
            setDisable(true)
            try {
                const res = await partnerSigninApi(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setheader()
                        setToken(token)
                        const details = getJwtDecode(token)
                        // console.log("details", details);
                        if (details?.isLogin) {
                            state?.setMyAppData({ isLogin: true, details: details })
                            navigate("/partner/dashboard")
                            toast.success(res?.data?.message);
                        }
    
                    }
                    setDisable(false)
                }
                setDisable(false)
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("signup error", error);
                setDisable(false)
            }
        }
    })


    return (<>
      
        <div className="container-fluid p-0">
            <div className="container-px-5 p-0">
                <div className="">
                    <div className="row p-0 m-0">
                        <div className="col-12 col-md-6">
                            <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                        </div>
                        <div className="col-md-6 col-sm-12 p-1 p-md-5  bg-color-7 color-4">
                            <div className="mx-auto p-md-5">
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-100">
                                        <div className="h2 fw-bold text-center">Sign In</div>
                                        <form onSubmit={UserDetailsFormik.handleSubmit} className='aligin-items-center d-flex justify-content-center'>
                                        <div className="w-100">
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
                                                    <Link to='/partner/forget password' className="text-decoration-underline">Forgot Password?</Link>
                                                </label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-2">
                                                <Link to="/partner/signup" className=''>Don't have an account? signup</Link>
                                            </div>
                                            <div className="mt-5">
                                                <button aria-disabled={disable} type="submit" className={`btn btn-primary color-1 w-100 ${disable && "disabled"}`} >  {disable ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>SignIn </span>} </button>
                                            </div>
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