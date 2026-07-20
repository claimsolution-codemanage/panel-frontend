import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BsEyeSlashFill, BsEyeFill, BsArrowRight, BsShieldCheck, BsBuilding } from "react-icons/bs"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { adminResetForgetPassword } from '../../../apis'
import '../../../styles/client/ClientSignIn.css'

export default function AdminResetForgetPassword() {
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(false)
    const [viewConfirm, setViewConfirm] = useState(false)
    const navigate = useNavigate()
    const param = useParams()

    const adminFormik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        validationSchema: yup.object().shape({
            password: yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
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
                const res = await adminResetForgetPassword(values, param?.verifyToken)
                if (res?.data?.success) {
                    toast.success(res?.data?.message || "Password reset successfully!")
                    navigate("/admin/signin")
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
        <div className="enhanced-split-layout">
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
                        <h1>Reset Password</h1>
                        <p>Enter your new password below to update your administrator credentials</p>
                    </div>

                    {/* Reset Password Form */}
                    <form onSubmit={adminFormik.handleSubmit} className="signin-form-enhanced">
                        <div className="input-field-group">
                            <label htmlFor="password">New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={view ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={adminFormik.values.password}
                                    onChange={adminFormik.handleChange}
                                    onBlur={adminFormik.handleBlur}
                                    placeholder="Enter new password"
                                    className={adminFormik.touched.password && adminFormik.errors.password ? 'error-input' : ''}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setView(!view)}
                                >
                                    {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                </button>
                            </div>
                            {adminFormik.touched.password && adminFormik.errors.password && (
                                <span className="error-message">{adminFormik.errors.password}</span>
                            )}
                        </div>

                        <div className="input-field-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={viewConfirm ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={adminFormik.values.confirmPassword}
                                    onChange={adminFormik.handleChange}
                                    onBlur={adminFormik.handleBlur}
                                    placeholder="Re-enter new password"
                                    className={adminFormik.touched.confirmPassword && adminFormik.errors.confirmPassword ? 'error-input' : ''}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setViewConfirm(!viewConfirm)}
                                >
                                    {viewConfirm ? <BsEyeFill /> : <BsEyeSlashFill />}
                                </button>
                            </div>
                            {adminFormik.touched.confirmPassword && adminFormik.errors.confirmPassword && (
                                <span className="error-message">{adminFormik.errors.confirmPassword}</span>
                            )}
                        </div>

                        <div className="form-options-enhanced">
                            <div></div>
                            <Link to="/admin/signin" className="forgot-password-link">
                                Remember your password? Sign in
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
                                    Reset Password
                                    <BsArrowRight className="button-icon" />
                                </>
                            )}
                        </button>

                        <div className="signup-prompt-enhanced">
                            Back to <Link to="/admin/signin">Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Image Section */}
            <div className="image-section">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Claim Solution</h2>
                        <p>Set a new password to keep your administrator portal fully protected</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Password Security</span>
                            </div>
                            <div className="image-feature">
                                <BsBuilding />
                                <span>Instant Portal Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}