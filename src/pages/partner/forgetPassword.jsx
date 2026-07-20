import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BsEnvelope, BsShieldCheck, BsBuilding } from "react-icons/bs"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { partnerForgetPasswordApi } from '../../apis/auth/partnerAuthApi'
import '../../styles/partner/signIn.css'

export default function PartnerForgetPassword() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const partnerFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: yup.object().shape({
            email: yup.string().email("Invalid email address").required("Email is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await partnerForgetPasswordApi(values)
                if (res?.data?.success) {
                    toast.success(res?.data?.message || "Reset link sent to your registered email!")
                } else {
                    toast.error(res?.data?.message || "Request failed")
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
            } finally {
                setLoading(false)
            }
        }
    })

    return (
        <div className="signin-container">
            <div className="signin-wrapper">
                {/* Left Side - Form Section */}
                <div className="signin-form-section">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2 className="form-title">Forgot Password</h2>
                            <p className="form-subtitle">Enter your registered partner email address to receive password recovery instructions</p>
                        </div>

                        <form onSubmit={partnerFormik.handleSubmit} className="signin-form">
                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address*</label>
                                <div className="input-wrapper">
                                    <BsEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        className={`form-input ${partnerFormik?.touched?.email && partnerFormik?.errors?.email ? "input-error" : ""}`}
                                        name="email"
                                        id="email"
                                        placeholder="partner@company.com"
                                        value={partnerFormik?.values?.email}
                                        onChange={partnerFormik.handleChange}
                                        onBlur={partnerFormik.handleBlur}
                                    />
                                </div>
                                {partnerFormik?.touched?.email && partnerFormik?.errors?.email && (
                                    <span className="error-message">{partnerFormik?.errors?.email}</span>
                                )}
                            </div>

                            <div className="form-options">
                                <div></div>
                                <Link to="/partner/signin" className="forgot-link">
                                    Remember password? Sign In
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`submit-button ${loading ? "disabled" : ""}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>
                                        <span>Sending Link...</span>
                                    </>
                                ) : (
                                    <span>Send Reset Link</span>
                                )}
                            </button>

                            {/* Sign In Link */}
                            <div className="signup-link">
                                <span>Back to</span>
                                <Link to="/partner/signin">Sign In</Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side - Image Showcase */}
                <div className="image-section">
                    <div className="image-overlay-enhanced">
                        <div className="image-content">
                            <h2>Claim Solution</h2>
                            <p>Recover your partner account and get back to managing your cases securely</p>
                            <div className="image-features">
                                <div className="image-feature">
                                    <BsShieldCheck />
                                    <span>Secure Recovery</span>
                                </div>
                                <div className="image-feature">
                                    <BsBuilding />
                                    <span>Instant Verification</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}