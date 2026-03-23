

// ClientSignIn.jsx - Enhanced Split Screen Design
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../App'
import { toast } from 'react-toastify'
import { setToken } from '../../utils/helperFunction'
import { BsEyeSlashFill, BsEyeFill, BsArrowRight, BsShieldCheck, BsBuilding } from "react-icons/bs"
import { getJwtDecode } from '../../utils/helperFunction'
import { useFormik } from 'formik'
import { signInOrSignUpInitialValue, signInOrSignUpValidationSchema } from '../../utils/validations/auth/userAuthValidation'
import { clientSignInApi } from '../../apis/auth/userAuthApi'
import '../../styles/client/ClientSignIn.css' // Import the modern CSS

export default function ClientSignIn() {
    const state = useContext(AppContext)
    const [view, setView] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const UserDetailsFormik = useFormik({
        initialValues: signInOrSignUpInitialValue,
        validationSchema: signInOrSignUpValidationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await clientSignInApi(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: true, details: details })
                        toast.success(res?.data?.message)
                        navigate("/client/dashboard")
                    }
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                console.log("signup error", error)
                setLoading(false)
            }
        }
    })

    return (
        <div className="enhanced-split-layout">

        {/* Right Side - Image Section */}
            <div className="image-section">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Claim Solution</h2>
                        <p>Submit, track, and resolve your insurance cases faster than ever before</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Fast claim processing</span>
                            </div>
                            <div className="image-feature">
                                <BsBuilding />
                                <span>24/7 case tracking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side - Form Section */}
            <div className="form-section">
                <div className="form-content-wrapper">
                    {/* Logo/Brand */}
                    <div className="brand-wrapper">
                        <div className="brand-logo">
                            <img src="/Images/icons/company-logo.png" height={60} alt="Claim solution" loading="lazy" />
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="welcome-text">
                        <h1>Welcome back</h1>
                        <p>Sign in to access your insurance dashboard and manage your cases</p>
                    </div>

                    {/* Sign In Form */}
                    <form onSubmit={UserDetailsFormik.handleSubmit} className="signin-form-enhanced">
                        <div className="input-field-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={UserDetailsFormik.values?.email}
                                onChange={UserDetailsFormik.handleChange}
                                onBlur={UserDetailsFormik.handleBlur}
                                placeholder="name@example.com"
                                className={UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email ? 'error-input' : ''}
                            />
                            {UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email && (
                                <span className="error-message">{UserDetailsFormik?.errors?.email}</span>
                            )}
                        </div>

                        <div className="input-field-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={view ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={UserDetailsFormik.values?.password}
                                    onChange={UserDetailsFormik.handleChange}
                                    onBlur={UserDetailsFormik.handleBlur}
                                    placeholder="Enter your password"
                                    className={UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password ? 'error-input' : ''}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setView(!view)}
                                >
                                    {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                </button>
                            </div>
                            {UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password && (
                                <span className="error-message">{UserDetailsFormik?.errors?.password}</span>
                            )}
                        </div>

                        <div className="form-options-enhanced">
                            <div></div>
                            <Link to="/client/forget password" className="forgot-password-link">
                                Forgot password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            className="signin-button-enhanced"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    Sign in
                                    <BsArrowRight className="button-icon" />
                                </>
                            )}
                        </button>

                        <div className="signup-prompt-enhanced">
                            Don't have an account? <Link to="/client/signup">Create an account</Link>
                        </div>
                    </form>
                </div>
            </div>

            
        </div>
    )
}