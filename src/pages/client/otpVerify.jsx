// ClientOtpVerify.jsx - Modern Redesign
import OtpInput from 'react-otp-input';
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../utils/helperFunction';
import { AppContext } from "../../App"
import { useContext } from "react"
import { getJwtDecode } from '../../utils/helperFunction';
import { MdMailLock, MdAccessTime, MdRefresh, MdVerified } from 'react-icons/md'
import { BsShieldCheck, BsArrowRight, BsEnvelope } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { clientResendOtp } from '../../apis';
import { clientEmailVerifyApi } from '../../apis/auth/userAuthApi';
import '../../styles/client/ClientOtpVerify.css' // Import the modern CSS


export default function ClientOtpVerify() {
    const state = useContext(AppContext)
    const [otp, setOtp] = useState('');
    const [disable, setDisable] = useState(false)
    const [resendOtp, setResendOtp] = useState({
        loading: false,
        message: "resend otp",
        timerStart: false,
        minutes: 1,
        second: 30
    })
    const navigate = useNavigate()

    const handleVerify = async (e) => {
        e.preventDefault()
        if (otp.length === 6) {
            setDisable(true)
            try {
                const res = await clientEmailVerifyApi({ otp: otp })
                if (res?.data?.success) {
                    setOtp("")
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: true, details: details })
                        toast.success(res?.data?.message)
                        navigate("/client/dashboard")
                        setDisable(false)
                    }
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                setDisable(false)
            }
        }
    }

    useEffect(() => {
        if (resendOtp.timerStart) {
            const interval = setInterval(() => {
                if (resendOtp.second > 0) {
                    setResendOtp({ ...resendOtp, second: resendOtp.second - 1 })
                }

                if (resendOtp.second === 0) {
                    if (resendOtp.minutes === 0) {
                        clearInterval(interval)
                        setResendOtp({
                            loading: false,
                            message: "resend otp",
                            timerStart: false,
                            minutes: 1,
                            second: 30
                        })
                    } else {
                        setResendOtp({ ...resendOtp, second: 59, minutes: resendOtp?.minutes - 1 })
                    }
                }
            }, 1000);

            return () => {
                clearInterval(interval)
            }
        }
    }, [resendOtp.timerStart, resendOtp.minutes, resendOtp.second])

    const handleResentOtp = async () => {
        setResendOtp({ ...resendOtp, loading: true, message: "sending..." })
        try {
            const res = await clientResendOtp()
            if (res?.status === 200 && res?.data?.success) {
                toast.success(res?.data?.message)
                setResendOtp({ ...resendOtp, loading: false, message: "", timerStart: true })
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            setResendOtp({ ...resendOtp, loading: false, message: "" })
        }
    }

    return (
        <div className="enhanced-split-layout otp-layout">
                        {/* Right Side - Image Section */}
            <div className="image-section otp-image">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Account verification</h2>
                        <p>For your security, we require email verification to verify your email</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <MdMailLock />
                                <span>Email verification required</span>
                            </div>
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Enhanced account security</span>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side - OTP Form Section */}
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
                        <div className="otp-icon-wrapper">
                            <MdMailLock className="otp-icon" />
                        </div>
                        <h1>Verify your email</h1>
                        <p>We've sent a 6-digit verification code to your registered email address</p>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleVerify} className="otp-form-enhanced">
                        <div className="otp-input-container">
                            <OtpInput
                                shouldAutoFocus={true}
                                inputType="tel"
                                value={otp}
                                onChange={(otp) => setOtp(otp)}
                                numInputs={6}
                                containerStyle="otp-input-container-style"
                                inputStyle={`otp-input-style ${otp.length === 6 ? 'completed' : ''}`}
                                renderInput={(props) => <input {...props} />}
                            />
                        </div>

                        {/* Resend OTP Section */}
                        <div className="resend-otp-section">
                            {resendOtp?.timerStart ? (
                                <div className="timer-display">
                                    <MdAccessTime className="timer-icon" />
                                    <span>Resend code in {resendOtp?.minutes}:{resendOtp.second.toString().padStart(2, '0')}s</span>
                                </div>
                            ) : (
                                <div className="resend-button-wrapper">
                                    <span className="resend-label">Didn't receive the code?</span>
                                    <button
                                        type="button"
                                        onClick={handleResentOtp}
                                        disabled={resendOtp.loading}
                                        className="resend-button"
                                    >
                                        {resendOtp.loading ? (
                                            <span className="spinner-small"></span>
                                        ) : (
                                            <>
                                                <MdRefresh className="resend-icon" />
                                                <span>{resendOtp.message}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            className="verify-button-enhanced"
                            disabled={disable || resendOtp.loading || otp.length !== 6}
                        >
                            {disable ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    <MdVerified className="verify-icon" />
                                    <span>Verify Account</span>
                                    <BsArrowRight className="button-icon" />
                                </>
                            )}
                        </button>

                        {/* Back to Sign In */}
                        <div className="back-to-signin">
                            <Link to="/client/signin">
                                <BsEnvelope className="back-icon" />
                                Back to Sign In
                            </Link>
                        </div>
                    </form>

                    {/* Security Note */}
                    <div className="security-note">
                        <BsShieldCheck className="security-icon" />
                        <span>Secure verification process</span>
                    </div>
                </div>
            </div>
        </div>
    )
}