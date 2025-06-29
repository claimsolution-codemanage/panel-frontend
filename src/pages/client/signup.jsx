import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../App'
import { toast } from 'react-toastify'
import { clientSignUp } from '../../apis'
import { setToken } from '../../utils/helperFunction'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { getJwtDecode } from '../../utils/helperFunction'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useFormik } from 'formik'
import { Helmet } from "react-helmet";
import { clientSignUpInitialValue, clientSignUpValidationSchema } from '../../utils/validation'


export default function ClientSignUp() {
    const state = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(false)
    const navigate = useNavigate()

    const UserDetailsFormik = useFormik({
        initialValues: clientSignUpInitialValue,
        validationSchema: clientSignUpValidationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await clientSignUp(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: false, details: details })
                        toast.success(res?.data?.message)
                        navigate("/client/email otp verify")
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
            <Helmet>
                <link rel="canonical" href="http://claimsolution.in/client/signup" />
            </Helmet>
            <div className="py-5 mt-auto mt-md-0">
                <div className="container-px-5 ">
                    <div className="">
                        <div className="row m-0 p-0">
                            <div className="col-sm-12 col-md-6 px-0">
                                <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                            </div>
                            <form onSubmit={UserDetailsFormik.handleSubmit} className="col-sm-12 col-md-6 px-0 bg-color-7 color-4">
                                <div className="py-5 px-2 px-md-0">
                                    <div className="h2 fw-bold text-center">SignUp</div>
                                    {/* <div className="text text-center text-primary">Required 2-steps verification*</div> */}

                                    <div className='aligin-items-center d-flex justify-content-center'>
                                        <div className="w-75">
                                            <div className="mb-3 mt-3">
                                                <input type="text" className={`form-control ${UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName && "border-danger"}`} name='fullName' value={UserDetailsFormik?.values?.fullName} onChange={UserDetailsFormik?.handleChange} id="fullName" placeholder="Your Full Name" />
                                                {UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.fullName}</span>
                                                ) : null}
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <input type="email" className={`form-control ${UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email && "border-danger"}`} name='email' value={UserDetailsFormik?.values?.email} onChange={UserDetailsFormik?.handleChange} id="email" placeholder="Email" />
                                                {UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.email}</span>
                                                ) : null}
                                            </div>

                                            <div className="mb-3 mt-3">
                                                <PhoneInput
                                                    country={'in'}
                                                    containerClass="w-100"
                                                    inputClass={`w-100  ${UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo && "border-danger"}`}
                                                    // autoFormat={true}
                                                    placeholder="+91 12345-67890"
                                                    onlyCountries={['in']}
                                                    value={UserDetailsFormik?.values?.mobileNo} onChange={phone => phone.startsWith(+91) ? UserDetailsFormik.setFieldValue("mobileNo", phone) : UserDetailsFormik.setFieldValue("mobileNo", +91 + phone)} />
                                                {UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.mobileNo}</span>
                                                ) : null}
                                            </div>
                                            <div className=" mt-3">
                                                <div className="mb-3 mt-3">
                                                    <div className={`d-flex flex aligin-items-center form-control ${UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password && "border-danger"}  justify-content-center`}>
                                                        <input type={view ? "text" : "password"} className="w-100 border-0" name='password' style={{ outline: 'none' }} value={UserDetailsFormik?.values?.password} onChange={UserDetailsFormik?.handleChange} id="password" placeholder="Password" />
                                                        <span className='fs-6' style={{ cursor: 'pointer' }} onClick={() => setView(!view)}>
                                                            {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                                        </span>
                                                    </div>
                                                    {UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password ? (
                                                        <span className="text-danger">{UserDetailsFormik?.errors?.password}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value={UserDetailsFormik?.values?.agreement} onChange={(e) => UserDetailsFormik.setFieldValue("agreement", !UserDetailsFormik?.values?.agreement)} id="defaultCheck1" />
                                                <label class="form-check-label" for="defaultCheck1">
                                                    <Link to={"/client/service agreement"} target="_blank">Agree with service agreement</Link>
                                                </label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-4">
                                                <Link to="/client/signin">Already have an account? Signin</Link>
                                            </div>
                                            <div className="mt-5">
                                                <button aria-disabled={loading} disabled={loading || !UserDetailsFormik?.values?.agreement} type="submit" className={`btn btn-primary color-1 w-100 ${(loading || !UserDetailsFormik?.values?.agreement) && "disabled"}`}>  {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>SignUp </span>} </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}