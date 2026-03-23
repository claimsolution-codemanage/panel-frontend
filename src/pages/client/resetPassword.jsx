// ClientResetPassword.jsx - Modern Redesign
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BsEyeSlashFill, BsEyeFill, BsArrowRight, BsShieldCheck, BsArrowLeft, BsCheckCircle, BsLock } from "react-icons/bs"
import { MdVpnKey, MdPassword } from 'react-icons/md'
import { clientResetPasswordApi } from '../../apis/auth/userAuthApi'
import '../../styles/client/ClientResetPassword.css'

export default function ClientResetPassword() {
    const [data, setData] = useState({ password: "", confirmPassword: "" })
    const [loading, setLoading] = useState(false)
    const [viewPassword, setViewPassword] = useState(false)
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const navigate = useNavigate()
    const param = useParams()

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        
        // Check password strength
        if (name === 'password') {
            checkPasswordStrength(value)
        }
        
        // Check if passwords match
        if (name === 'confirmPassword' || (name === 'password' && data.confirmPassword)) {
            const match = name === 'password' ? value === data.confirmPassword : data.password === value
            setPasswordsMatch(match)
        }
    }

    const checkPasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (password.match(/[a-z]+/)) strength++
        if (password.match(/[A-Z]+/)) strength++
        if (password.match(/[0-9]+/)) strength++
        if (password.match(/[$@#&!]+/)) strength++
        setPasswordStrength(strength)
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return ''
        if (passwordStrength <= 2) return 'Weak'
        if (passwordStrength <= 3) return 'Fair'
        if (passwordStrength <= 4) return 'Good'
        return 'Strong'
    }

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return '#ef4444'
        if (passwordStrength <= 3) return '#f59e0b'
        if (passwordStrength <= 4) return '#3b82f6'
        return '#10b981'
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        
        if (passwordStrength < 3) {
            toast.error("Please use a stronger password")
            return
        }
        
        setLoading(true)
        if (param?.verifyToken) {
            try {
                const res = await clientResetPasswordApi(data, param?.verifyToken)
                if (res?.data?.success) {
                    toast.success(res?.data?.message)
                    navigate("/client/signin")
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
            setLoading(false)
        }
    }

    return (
        <div className="enhanced-split-layout reset-layout">
                        {/* Right Side - Image Section */}
            <div className="image-section reset-image">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Password reset</h2>
                        <p>Create a strong, unique password to keep your account secure</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>End-to-end encryption</span>
                            </div>
                            <div className="image-feature">
                                <BsLock />
                                <span>Secure password storage</span>
                            </div>
                            <div className="image-feature">
                                <BsCheckCircle />
                                <span>Instant access after reset</span>
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

                    {/* Welcome Text */}
                    <div className="welcome-text-centered">
                        <div className="reset-icon-wrapper">
                            <MdVpnKey className="reset-icon" />
                        </div>
                        <h1>Create new password</h1>
                        <p>Your new password must be different from previously used passwords</p>
                    </div>

                    {/* Reset Password Form */}
                    <form onSubmit={handleSubmit} className="reset-form-enhanced">
                        {/* New Password Field */}
                        <div className="input-field-group">
                            <label htmlFor="password">
                                <BsLock className="input-icon" />
                                New Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={viewPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleOnchange}
                                    onBlur={() => {
                                        if (data.password && passwordStrength < 3) {
                                            toast.info("For better security, use a stronger password")
                                        }
                                    }}
                                    placeholder="Enter your new password"
                                    autoComplete="new-password"
                                    className={data.password && passwordStrength < 3 ? 'error-input' : ''}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setViewPassword(!viewPassword)}
                                >
                                    {viewPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {data.password && (
                                <div className="password-strength">
                                    <div className="strength-bar-container">
                                        <div 
                                            className="strength-bar" 
                                            style={{ 
                                                width: `${(passwordStrength / 5) * 100}%`,
                                                backgroundColor: getPasswordStrengthColor()
                                            }}
                                        ></div>
                                    </div>
                                    <div className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                                        {getPasswordStrengthText()} password
                                    </div>
                                    <div className="strength-requirements">
                                        <div className={`requirement ${data.password.length >= 8 ? 'met' : ''}`}>
                                            <BsCheckCircle /> At least 8 characters
                                        </div>
                                        <div className={`requirement ${/[a-z]/.test(data.password) ? 'met' : ''}`}>
                                            <BsCheckCircle /> Lowercase letter
                                        </div>
                                        <div className={`requirement ${/[A-Z]/.test(data.password) ? 'met' : ''}`}>
                                            <BsCheckCircle /> Uppercase letter
                                        </div>
                                        <div className={`requirement ${/[0-9]/.test(data.password) ? 'met' : ''}`}>
                                            <BsCheckCircle /> Number
                                        </div>
                                        <div className={`requirement ${/[$@#&!]/.test(data.password) ? 'met' : ''}`}>
                                            <BsCheckCircle /> Special character ($@#&!)
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="input-field-group">
                            <label htmlFor="confirmPassword">
                                <MdPassword className="input-icon" />
                                Confirm Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={viewConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleOnchange}
                                    placeholder="Confirm your new password"
                                    autoComplete="new-password"
                                    className={!passwordsMatch && data.confirmPassword ? 'error-input' : ''}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                                >
                                    {viewConfirmPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                                </button>
                            </div>
                            {!passwordsMatch && data.confirmPassword && (
                                <span className="error-message">Passwords do not match</span>
                            )}
                            {passwordsMatch && data.confirmPassword && data.confirmPassword.length > 0 && (
                                <span className="success-message">
                                    <BsCheckCircle /> Passwords match
                                </span>
                            )}
                        </div>

                        {/* Reset Password Button */}
                        <button 
                            type="submit" 
                            className="reset-button-enhanced"
                            disabled={loading || !data.password || !data.confirmPassword || !passwordsMatch || passwordStrength < 3}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    <MdVpnKey className="reset-icon" />
                                    <span>Reset Password</span>
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

                    {/* Security Note */}
                    <div className="security-note">
                        <BsShieldCheck className="security-icon" />
                        <span>Your password is encrypted and secure</span>
                    </div>
                </div>
            </div>


        </div>
    )
}