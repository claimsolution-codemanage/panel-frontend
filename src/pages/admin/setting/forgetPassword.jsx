import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BsArrowRight, BsShieldCheck, BsBuilding } from "react-icons/bs"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { adminForgetPassword } from '../../../apis'
import '../../../styles/client/ClientSignIn.css'

export default function AdminForgetPassword() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const adminFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: yup.object().shape({
            email: yup.string().email("Invalid email address").required("Email is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await adminForgetPassword(values)
                if (res?.data?.success) {
                    toast.success(res?.data?.message || "Password reset instructions sent to your email!")
                } else {
                    toast.error(res?.data?.message || "Failed to process request")
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
                        <h1>Forgot Password</h1>
                        <p>Enter your registered email address below to receive password recovery instructions</p>
                    </div>

                    {/* Forgot Password Form */}
                    <form onSubmit={adminFormik.handleSubmit} className="signin-form-enhanced">
                        <div className="input-field-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={adminFormik.values.email}
                                onChange={adminFormik.handleChange}
                                onBlur={adminFormik.handleBlur}
                                placeholder="admin@example.com"
                                className={adminFormik.touched.email && adminFormik.errors.email ? 'error-input' : ''}
                            />
                            {adminFormik.touched.email && adminFormik.errors.email && (
                                <span className="error-message">{adminFormik.errors.email}</span>
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
                                    Send Reset Link
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
                        <p>Reset and recover your admin access safely and securely</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Encrypted Link</span>
                            </div>
                            <div className="image-feature">
                                <BsBuilding />
                                <span>24/7 Security Sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}