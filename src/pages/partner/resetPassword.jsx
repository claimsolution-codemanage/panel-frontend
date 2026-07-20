import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BsEyeSlashFill, BsEyeFill, BsLock, BsShieldCheck, BsBuilding } from "react-icons/bs"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { partnerResetPasswordApi } from '../../apis/auth/partnerAuthApi'
import '../../styles/partner/signIn.css'

export default function PartnerResetPassword() {
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(false)
    const [viewConfirm, setViewConfirm] = useState(false)
    const navigate = useNavigate()
    const param = useParams()

    const partnerFormik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        validationSchema: yup.object().shape({
            password: yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
            confirmPassword: yup.string()
                .oneOf([yup.ref('password'), null], "Passwords must match")
                .required("Please confirm your password")
        }),
        onSubmit: async (values) => {
            if (!param?.verifyToken) {
                toast.error("Invalid or missing verification token")
                return
            }
            setLoading(true)
            try {
                const res = await partnerResetPasswordApi(values, param?.verifyToken)
                if (res?.data?.success) {
                    toast.success(res?.data?.message || "Password reset successfully!")
                    navigate("/partner/signin")
                } else {
                    toast.error(res?.data?.message || "Password reset failed")
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
                            <h2 className="form-title">Reset Password</h2>
                            <p className="form-subtitle">Enter your new partner password to update your account credentials</p>
                        </div>

                        <form onSubmit={partnerFormik.handleSubmit} className="signin-form">
                            {/* New Password */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">New Password*</label>
                                <div className="input-wrapper">
                                    <BsLock className="input-icon" />
                                    <input
                                        type={view ? "text" : "password"}
                                        className={`form-input ${partnerFormik?.touched?.password && partnerFormik?.errors?.password ? "input-error" : ""}`}
                                        name="password"
                                        id="password"
                                        placeholder="Enter new password"
                                        value={partnerFormik?.values?.password}
                                        onChange={partnerFormik.handleChange}
                                        onBlur={partnerFormik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setView(!view)}
                                    >
                                        {view ? <BsEyeFill size={18} /> : <BsEyeSlashFill size={18} />}
                                    </button>
                                </div>
                                {partnerFormik?.touched?.password && partnerFormik?.errors?.password && (
                                    <span className="error-message">{partnerFormik?.errors?.password}</span>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Confirm New Password*</label>
                                <div className="input-wrapper">
                                    <BsLock className="input-icon" />
                                    <input
                                        type={viewConfirm ? "text" : "password"}
                                        className={`form-input ${partnerFormik?.touched?.confirmPassword && partnerFormik?.errors?.confirmPassword ? "input-error" : ""}`}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Re-enter new password"
                                        value={partnerFormik?.values?.confirmPassword}
                                        onChange={partnerFormik.handleChange}
                                        onBlur={partnerFormik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setViewConfirm(!viewConfirm)}
                                    >
                                        {viewConfirm ? <BsEyeFill size={18} /> : <BsEyeSlashFill size={18} />}
                                    </button>
                                </div>
                                {partnerFormik?.touched?.confirmPassword && partnerFormik?.errors?.confirmPassword && (
                                    <span className="error-message">{partnerFormik?.errors?.confirmPassword}</span>
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
                                        <span>Resetting Password...</span>
                                    </>
                                ) : (
                                    <span>Reset Password</span>
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
                            <p>Update your credentials to maintain maximum protection for your partner portal</p>
                            <div className="image-features">
                                <div className="image-feature">
                                    <BsShieldCheck />
                                    <span>Encrypted Credentials</span>
                                </div>
                                <div className="image-feature">
                                    <BsBuilding />
                                    <span>Instant Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}