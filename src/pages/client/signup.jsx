// ClientSignUp.jsx - Modern Redesign
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../App'
import { toast } from 'react-toastify'
import { setToken } from '../../utils/helperFunction'
import { 
    BsEyeSlashFill, 
    BsEyeFill, 
    BsArrowRight, 
    BsPerson, 
    BsEnvelope, 
    BsTelephone, 
    BsLock,
    BsShieldCheck,
    BsFileText
} from "react-icons/bs"
import { getJwtDecode } from '../../utils/helperFunction'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useFormik } from 'formik'
import { clientSignUpInitialValue, clientSignUpValidationSchema } from '../../utils/validations/auth/userAuthValidation'
import { clientSignUpApi } from '../../apis/auth/userAuthApi'
import '../../styles/client/ClientSignUp.css' // Import the modern CSS


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
                const res = await clientSignUpApi(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: false, details: details })
                        toast.success(res?.data?.message)
                        navigate("/client/email otp verify")
                    }
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                setLoading(false)
            }
        }
    })

    return (
        <div className="enhanced-split-layout signup-layout">
                    {/* Right Side - Image Section */}
            <div className="image-section signup-image">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Start your journey with us</h2>
                        <p>Create an account to submit, track, and resolve your insurance cases quickly and efficiently</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Secure platform</span>
                            </div>
                            <div className="image-feature">
                                <BsFileText />
                                <span>Easy case submission</span>
                            </div>
                            <div className="image-feature">
                                <BsTelephone />
                                <span>24/7 support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side - Form Section */}
            <div className="form-section">
                <div className="form-content-wrapper">
                    {/* Logo/Brand - Centered */}
                    <div className="brand-wrapper-centered">
                        <div className="brand-logo-centered">
                            <img 
                                src="/Images/icons/company-logo.png" 
                                height={60} 
                                alt="Claim Solution" 
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="welcome-text-centered">
                        <h1>Create an account</h1>
                        <p>Join us to start managing your insurance cases efficiently</p>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={UserDetailsFormik.handleSubmit} className="signup-form-enhanced">
                        {/* Full Name Field */}
                        <div className="input-field-group">
                            <label htmlFor="fullName">
                                <BsPerson className="input-icon" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={UserDetailsFormik?.values?.fullName}
                                onChange={UserDetailsFormik?.handleChange}
                                onBlur={UserDetailsFormik?.handleBlur}
                                placeholder="John Doe"
                                className={UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName ? 'error-input' : ''}
                            />
                            {UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName && (
                                <span className="error-message">{UserDetailsFormik?.errors?.fullName}</span>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="input-field-group">
                            <label htmlFor="email">
                                <BsEnvelope className="input-icon" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={UserDetailsFormik?.values?.email}
                                onChange={UserDetailsFormik?.handleChange}
                                onBlur={UserDetailsFormik?.handleBlur}
                                placeholder="name@company.com"
                                className={UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email ? 'error-input' : ''}
                            />
                            {UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email && (
                                <span className="error-message">{UserDetailsFormik?.errors?.email}</span>
                            )}
                        </div>

                        {/* Mobile Number Field with PhoneInput */}
                        <div className="input-field-group">
                            <label htmlFor="mobileNo">
                                <BsTelephone className="input-icon" />
                                Mobile Number
                            </label>
                            <PhoneInput
                                country={'in'}
                                containerClass="phone-input-container"
                                inputClass={`phone-input-field ${UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo ? 'error-input' : ''}`}
                                buttonClass="phone-dropdown-button"
                                placeholder="+91 12345 67890"
                                onlyCountries={['in', 'us', 'gb', 'au', 'ca']}
                                value={UserDetailsFormik?.values?.mobileNo}
                                onChange={phone => {
                                    if (phone.startsWith('91')) {
                                        UserDetailsFormik.setFieldValue("mobileNo", phone)
                                    } else {
                                        UserDetailsFormik.setFieldValue("mobileNo", '91' + phone)
                                    }
                                }}
                                onBlur={() => UserDetailsFormik.setFieldTouched("mobileNo", true)}
                            />
                            {UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo && (
                                <span className="error-message">{UserDetailsFormik?.errors?.mobileNo}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="input-field-group">
                            <label htmlFor="password">
                                <BsLock className="input-icon" />
                                Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={view ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={UserDetailsFormik?.values?.password}
                                    onChange={UserDetailsFormik?.handleChange}
                                    onBlur={UserDetailsFormik?.handleBlur}
                                    placeholder="Create a strong password"
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

                        {/* Agreement Checkbox */}
                        <div className="agreement-checkbox">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={UserDetailsFormik?.values?.agreement}
                                    onChange={(e) => UserDetailsFormik.setFieldValue("agreement", e.target.checked)}
                                />
                                <span>
                                    I agree to the 
                                    <Link to="/client/service agreement" target="_blank" className="agreement-link">
                                        <BsFileText className="inline-icon" />
                                        Service Agreement
                                    </Link>
                                </span>
                            </label>
                        </div>

                        {/* Sign Up Button */}
                        <button 
                            type="submit" 
                            className="signup-button-enhanced"
                            disabled={loading || !UserDetailsFormik?.values?.agreement}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    Create Account
                                    <BsArrowRight className="button-icon" />
                                </>
                            )}
                        </button>

                        {/* Sign In Link */}
                        <div className="signin-prompt-enhanced">
                            Already have an account? <Link to="/client/signin">Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>

    
        </div>
    )
}