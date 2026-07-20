import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BsArrowRight, BsShieldCheck, BsBuilding } from "react-icons/bs"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { adminSignup } from '../../../apis'
import { checkPhoneNo } from '../../../utils/helperFunction'
import '../../../styles/client/ClientSignIn.css'

export default function AdminSignUp() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const adminFormik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            mobileNo: "",
        },
        validationSchema: yup.object().shape({
            fullName: yup.string().required("Full name is required"),
            email: yup.string().email("Invalid email address").required("Email is required"),
            mobileNo: yup.string().required("Mobile number is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await adminSignup(values)
                if (res?.data?.success) {
                    toast.success(res?.data?.message || "Admin account created successfully!")
                    navigate("/admin/signin")
                } else {
                    toast.error(res?.data?.message || "Registration failed")
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
                        <h1>Admin Registration</h1>
                        <p>Create your administrative account to manage insurance cases and team members</p>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={adminFormik.handleSubmit} className="signin-form-enhanced">
                        <div className="input-field-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={adminFormik.values.fullName}
                                onChange={adminFormik.handleChange}
                                onBlur={adminFormik.handleBlur}
                                placeholder="Enter your full name"
                                className={adminFormik.touched.fullName && adminFormik.errors.fullName ? 'error-input' : ''}
                            />
                            {adminFormik.touched.fullName && adminFormik.errors.fullName && (
                                <span className="error-message">{adminFormik.errors.fullName}</span>
                            )}
                        </div>

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
                            <label htmlFor="mobileNo">Phone Number</label>
                            <input
                                type="text"
                                id="mobileNo"
                                name="mobileNo"
                                value={adminFormik.values.mobileNo}
                                onChange={(e) => checkPhoneNo(e?.target?.value) && adminFormik.handleChange(e)}
                                onBlur={adminFormik.handleBlur}
                                placeholder="Enter phone number"
                                className={adminFormik.touched.mobileNo && adminFormik.errors.mobileNo ? 'error-input' : ''}
                            />
                            {adminFormik.touched.mobileNo && adminFormik.errors.mobileNo && (
                                <span className="error-message">{adminFormik.errors.mobileNo}</span>
                            )}
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
                                    Sign up
                                    <BsArrowRight className="button-icon" />
                                </>
                            )}
                        </button>

                        <div className="signup-prompt-enhanced">
                            Already have an account? <Link to="/admin/signin">Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Image Section */}
            <div className="image-section">
                <div className="image-overlay-enhanced">
                    <div className="image-content">
                        <h2>Claim Solution</h2>
                        <p>Join the administrative network to oversee insurance claim workflows effortlessly</p>
                        <div className="image-features">
                            <div className="image-feature">
                                <BsShieldCheck />
                                <span>Role-Based Access</span>
                            </div>
                            <div className="image-feature">
                                <BsBuilding />
                                <span>Full Dashboard Sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}