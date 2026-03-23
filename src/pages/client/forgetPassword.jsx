// ClientForgetPassword.jsx - Modern Redesign
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { clientForgetPasswordApi } from '../../apis/auth/userAuthApi'
import { BsArrowRight, BsEnvelope, BsShieldCheck, BsArrowLeft, BsKey, BsMailbox } from 'react-icons/bs'
import { MdMarkEmailRead } from 'react-icons/md'
import '../../styles/client/ClientForgetPassword.css'

export default function ClientForgetPassword() {
    const [data, setData] = useState({ email: "" })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate()

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!data.email) {
            toast.error("Please enter your email address")
            return
        }
        
        setLoading(true)
        try {
            const res = await clientForgetPasswordApi(data)
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setSubmitted(true)
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

    return (
        <div className="enhanced-split-layout forgot-layout">
                       {/* Right Side - Image Section */}
            <div className="image-section forgot-image">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Need help with your password?</h2>
                        <p>Don't worry, it happens to everyone. We'll help you get back into your account quickly and securely</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsEnvelope />
                                <span>Reset link sent to email</span>
                            </div>
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Secure password recovery</span>
                            </div>
                            <div className="image-feature">
                                <BsKey />
                                <span>Create a new password</span>
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
                                height={70} 
                                alt="Claim Solution" 
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {!submitted ? (
                        <>
                            {/* Welcome Text */}
                            <div className="welcome-text-centered">
                                <div className="forgot-icon-wrapper">
                                    <BsKey className="forgot-icon" />
                                </div>
                                <h1>Forgot password?</h1>
                                <p>Enter your registered email address and we'll send you a link to reset your password</p>
                            </div>

                            {/* Forgot Password Form */}
                            <form onSubmit={handleSubmit} className="forgot-form-enhanced">
                                <div className="input-field-group">
                                    <label htmlFor="email">
                                        <BsEnvelope className="input-icon" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleOnchange}
                                        onBlur={(e) => {
                                            if (!e.target.value) {
                                                toast.error("Please enter your email address")
                                            }
                                        }}
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        className={data.email && !data.email.includes('@') ? 'error-input' : ''}
                                    />
                                    {data.email && !data.email.includes('@') && (
                                        <span className="error-message">Please enter a valid email address</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="reset-button-enhanced"
                                    disabled={loading || !data.email}
                                >
                                    {loading ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        <>
                                            <MdMarkEmailRead className="reset-icon" />
                                            <span>Send Reset Link</span>
                                            <BsArrowRight className="button-icon" />
                                        </>
                                    )}
                                </button>

                                {/* Back to Sign In */}
                                <div className="back-to-signin">
                                    <Link to="/client/signin">
                                        <BsArrowLeft className="back-icon" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="welcome-text-centered">
                                <div className="success-icon-wrapper">
                                    <MdMarkEmailRead className="success-icon" />
                                </div>
                                <h1>Check your email</h1>
                                <p>We've sent a password reset link to</p>
                                <div className="sent-email">
                                    <BsEnvelope className="email-icon" />
                                    <span>{data.email}</span>
                                </div>
                                <div className="instruction-text">
                                    <p>Click the link in the email to reset your password. If you don't see it, check your spam folder.</p>
                                </div>
                            </div>

                            <div className="success-actions">
                                <button 
                                    onClick={() => setSubmitted(false)} 
                                    className="resend-button-success"
                                >
                                    <BsMailbox className="resend-icon" />
                                    Didn't receive email? Try again
                                </button>

                                <Link to="/client/signin" className="back-to-signin-success">
                                    <BsArrowLeft className="back-icon" />
                                    Return to Sign In
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Security Note */}
                    <div className="security-note">
                        <BsShieldCheck className="security-icon" />
                        <span>We'll never share your email with anyone else</span>
                    </div>
                </div>
            </div>

 
        </div>
    )
}