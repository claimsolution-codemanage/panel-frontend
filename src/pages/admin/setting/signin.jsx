import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AppContext } from '../../../App'
import { toast } from 'react-toastify'
import { setToken, getJwtDecode } from '../../../utils/helperFunction'
import { BsEyeSlashFill, BsEyeFill, BsArrowRight, BsShieldCheck, BsBuilding } from "react-icons/bs"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { adminSignin } from '../../../apis'
import '../../../styles/client/ClientSignIn.css'

export default function AdminSignIn() {
    const state = useContext(AppContext)
    const [view, setView] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const adminFormik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object().shape({
            email: yup.string().email("Invalid email address").required("Email is required"),
            password: yup.string().required("Password is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await adminSignin(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        if (details?.role === "Admin") {
                            state?.setMyAppData({ isLogin: true, details: details })
                            toast.success(res?.data?.message || "Sign in successful!")
                            navigate("/admin/dashboard")
                        }
                    }
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
                        <h1>Admin Sign In</h1>
                        <p>Sign in to access your administrative dashboard and manage cases</p>
                    </div>

                    {/* Sign In Form */}
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

                        <div className="input-field-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={view ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={adminFormik.values.password}
                                    onChange={adminFormik.handleChange}
                                    onBlur={adminFormik.handleBlur}
                                    placeholder="Enter your password"
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

                        <div className="form-options-enhanced">
                            <div></div>
                            <Link to="/admin/forget password" className="forgot-password-link">
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
                            Don't have an account? <Link to="/admin/signup">Create an account</Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Image Section */}
            <div className="image-section">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Claim Solution</h2>
                        <p>Administrative portal to manage insurance cases, teams, and operations</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Secure Admin Portal</span>
                            </div>
                            <div className="image-feature">
                                <BsBuilding />
                                <span>24/7 Operations Control</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}