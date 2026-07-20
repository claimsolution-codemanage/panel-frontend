import { Link, useNavigate } from "react-router-dom"
import { partnerType } from "../../utils/constant"
import { useState, useContext } from "react"
import { AppContext } from "../../App"
import { toast } from 'react-toastify'
import { BsEyeSlashFill, BsEyeFill, BsShieldCheck, BsBuilding, BsPerson, BsEnvelope, BsLock, BsBriefcase, BsGeoAlt } from "react-icons/bs"
import { setToken } from "../../utils/helperFunction"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useFormik } from 'formik'
import { partnerSignUpInitialValue, partnerSignUpValidationSchema } from "../../utils/validations/auth/partnerAuthValidation"
import { partnersignUpApi } from "../../apis/auth/partnerAuthApi"
import '../../styles/partner/signIn.css'

export default function SignUp() {
    const state = useContext(AppContext)
    const [disable, setDisable] = useState(false)
    const [view, setView] = useState(false)
    const navigate = useNavigate()

    const UserDetailsFormik = useFormik({
        initialValues: partnerSignUpInitialValue,
        validationSchema: partnerSignUpValidationSchema,
        onSubmit: async (values) => {
            setDisable(true)
            try {
                const res = await partnersignUpApi(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        toast.success(res?.data?.message)
                        navigate("/partner/verify-otp")
                    }
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
            } finally {
                setDisable(false)
            }
        }
    })

    return (
        <div className="signin-container">
            <div className="signin-wrapper">
                {/* Left Side - Partner Form Section */}
                <div className="signin-form-section">
                    <div className="form-wrapper py-4">
                        {/* Logo/Brand */}
                        <div className="text-center mb-4">
                            <img src="/Images/icons/company-logo.png" height={55} alt="Claim Solution" loading="lazy" />
                        </div>

                        <div className="form-header text-center text-md-start">
                            <h2 className="form-title">Partner Registration</h2>
                            <p className="form-subtitle">Fill in the details to join our partner network</p>
                        </div>

                        <form onSubmit={UserDetailsFormik.handleSubmit} className="signin-form">
                            {/* Full Name */}
                            <div className="form-group">
                                <label htmlFor="fullName" className="form-label">Full Name*</label>
                                <div className="input-wrapper">
                                    <BsPerson className="input-icon" />
                                    <input
                                        type="text"
                                        className={`form-input ${UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName ? "input-error" : ""}`}
                                        name="fullName"
                                        id="fullName"
                                        placeholder="John Doe"
                                        value={UserDetailsFormik?.values?.fullName}
                                        onChange={UserDetailsFormik.handleChange}
                                        onBlur={UserDetailsFormik.handleBlur}
                                    />
                                </div>
                                {UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.fullName}</span>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address*</label>
                                <div className="input-wrapper">
                                    <BsEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        className={`form-input ${UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email ? "input-error" : ""}`}
                                        name="email"
                                        id="email"
                                        placeholder="partner@company.com"
                                        value={UserDetailsFormik?.values?.email}
                                        onChange={UserDetailsFormik.handleChange}
                                        onBlur={UserDetailsFormik.handleBlur}
                                    />
                                </div>
                                {UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.email}</span>
                                )}
                            </div>

                            {/* Mobile Number with PhoneInput */}
                            <div className="form-group">
                                <label htmlFor="mobileNo" className="form-label">Mobile Number*</label>
                                <PhoneInput
                                    country={'in'}
                                    containerClass="phone-input-container w-100"
                                    inputClass={`form-input py-4 rounded-3 w-100 ${UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo ? "input-error" : ""}`}
                                    placeholder="+91 12345 67890"
                                    onlyCountries={['in']}
                                    value={UserDetailsFormik.values.mobileNo}
                                    onChange={phone => phone.startsWith('+91') ? UserDetailsFormik.setFieldValue("mobileNo", phone) : UserDetailsFormik.setFieldValue("mobileNo", '+91' + phone)}
                                    onBlur={() => UserDetailsFormik.setFieldTouched("mobileNo", true)}
                                />
                                {UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.mobileNo}</span>
                                )}
                            </div>

                            {/* Work Association / Partner Type */}
                            <div className="form-group">
                                <label htmlFor="workAssociation" className="form-label">Partner Type*</label>
                                <div className="input-wrapper">
                                    <BsBriefcase className="input-icon" />
                                    <select
                                        className={`form-input ${UserDetailsFormik?.touched?.workAssociation && UserDetailsFormik?.errors?.workAssociation ? "input-error" : ""}`}
                                        name="workAssociation"
                                        id="workAssociation"
                                        value={UserDetailsFormik?.values?.workAssociation}
                                        onChange={UserDetailsFormik.handleChange}
                                        onBlur={UserDetailsFormik.handleBlur}
                                    >
                                        <option value="">-- Select Partner Type --</option>
                                        {partnerType?.map(partner => (
                                            <option key={partner} value={partner}>{partner}</option>
                                        ))}
                                    </select>
                                </div>
                                {UserDetailsFormik?.touched?.workAssociation && UserDetailsFormik?.errors?.workAssociation && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.workAssociation}</span>
                                )}
                            </div>

                            {/* Area of Operation */}
                            <div className="form-group">
                                <label htmlFor="areaOfOperation" className="form-label">Area of Operation*</label>
                                <div className="input-wrapper">
                                    <BsGeoAlt className="input-icon" />
                                    <input
                                        type="text"
                                        className={`form-input ${UserDetailsFormik?.touched?.areaOfOperation && UserDetailsFormik?.errors?.areaOfOperation ? "input-error" : ""}`}
                                        name="areaOfOperation"
                                        id="areaOfOperation"
                                        placeholder="City / Region"
                                        value={UserDetailsFormik?.values?.areaOfOperation}
                                        onChange={UserDetailsFormik.handleChange}
                                        onBlur={UserDetailsFormik.handleBlur}
                                    />
                                </div>
                                {UserDetailsFormik?.touched?.areaOfOperation && UserDetailsFormik?.errors?.areaOfOperation && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.areaOfOperation}</span>
                                )}
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password*</label>
                                <div className="input-wrapper">
                                    <BsLock className="input-icon" />
                                    <input
                                        type={view ? "text" : "password"}
                                        className={`form-input ${UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password ? "input-error" : ""}`}
                                        name="password"
                                        id="password"
                                        placeholder="Create a strong password"
                                        value={UserDetailsFormik?.values?.password}
                                        onChange={UserDetailsFormik.handleChange}
                                        onBlur={UserDetailsFormik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setView(!view)}
                                    >
                                        {view ? <BsEyeFill size={18} /> : <BsEyeSlashFill size={18} />}
                                    </button>
                                </div>
                                {UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password && (
                                    <span className="error-message">{UserDetailsFormik?.errors?.password}</span>
                                )}
                            </div>

                            {/* Agreement Checkbox */}
                            <div className="form-check my-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agreement"
                                    checked={UserDetailsFormik?.values?.agreement}
                                    onChange={(e) => UserDetailsFormik?.setFieldValue("agreement", e.target.checked)}
                                />
                                <label className="form-check-label ms-1" htmlFor="agreement">
                                    I agree with the <Link to="/partner/service-agreement" target="_blank" style={{ color: '#667eea', fontWeight: 600 }}>Service Agreement</Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`submit-button ${disable || !UserDetailsFormik?.values?.agreement ? "disabled" : ""}`}
                                disabled={disable || !UserDetailsFormik?.values?.agreement}
                            >
                                {disable ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <span>Sign Up</span>
                                )}
                            </button>

                            {/* Sign In Link */}
                            <div className="signup-link">
                                <span>Already have an account?</span>
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
                            <p>Become a partner to streamline claim resolutions and expand your network</p>
                            <div className="image-features">
                                <div className="image-feature">
                                    <BsShieldCheck />
                                    <span>Verified Partnership</span>
                                </div>
                                <div className="image-feature">
                                    <BsBuilding />
                                    <span>Expanded Reach</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}