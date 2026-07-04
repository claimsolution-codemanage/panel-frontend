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
import '../../styles/partner/signIn.css' // We'll create this CSS file

export default function SignIn() {
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()
    const [view, setView] = useState(false)
    const state = useContext(AppContext)

    const UserDetailsFormik = useFormik({
        initialValues: signInOrSignUpInitialValue,
        validationSchema: partnerSignInValidationSchema,
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
                setDisable(false)
            }
        }
    })

    return (
        <div className="signin-container">
            <div className="signin-wrapper">
                {/* Left Side - Branding/Image */}

                <div className="image-section">
                    <div className="image-overlay-enhanced">
                        <div className="image-content">
                            {/* <h1 className="brand-title">Welcome Back</h1> */}
                            <h2>Claim Solution</h2>
                            <p>Sign in to access your partner dashboard</p>

                        </div>
                    </div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className="signin-form-section">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2 className="form-title">Partner Sign In</h2>
                            <p className="form-subtitle">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={UserDetailsFormik.handleSubmit} className="signin-form">
                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 6.5L12 13.5L2 6.5M2 6.5L12 3.5L22 6.5M2 6.5V18.5C2 19.0304 2.21071 19.5391 2.58579 19.9142C2.96086 20.2893 3.46957 20.5 4 20.5H20C20.5304 20.5 21.0391 20.2893 21.4142 19.9142C21.7893 19.5391 22 19.0304 22 18.5V6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                        type="email"
                                        className={`form-input ${UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email ? "input-error" : ""}`}
                                        name='email'
                                        value={UserDetailsFormik.values?.email}
                                        onChange={UserDetailsFormik.handleChange}
                                        onBlur={UserDetailsFormik.handleBlur}
                                        id="email"
                                        placeholder="john.doe@company.com"
                                    />
                                </div>
                                {UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.email}</span>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C15.3137 2 18 4.68629 18 8V10C18 13.3137 15.3137 16 12 16C8.68629 16 6 13.3137 6 10V8C6 4.68629 8.68629 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 16V18C6 20.2091 7.79086 22 10 22H14C16.2091 22 18 20.2091 18 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                        type={view ? "text" : "password"}
                                        className={`form-input ${UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password ? "input-error" : ""}`}
                                        name='password'
                                        value={UserDetailsFormik.values?.password}
                                        onChange={UserDetailsFormik.handleChange}
                                        onBlur={UserDetailsFormik.handleBlur}
                                        id="password"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setView(!view)}
                                        aria-label={view ? "Hide password" : "Show password"}
                                    >
                                        {view ? <BsEyeFill size={18} /> : <BsEyeSlashFill size={18} />}
                                    </button>
                                </div>
                                {UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.password}</span>
                                )}
                            </div>

                            {/* Options Row */}
                            <div className="">
                                <Link to='/partner/forget password' className="forgot-link float-end">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`submit-button ${disable ? "disabled" : ""}`}
                                disabled={disable}
                            >
                                {disable ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {/* Sign Up Link */}
                            <div className="signup-link">
                                <span>Don't have an account?</span>
                                <Link to="/partner/signup">Create Account</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}