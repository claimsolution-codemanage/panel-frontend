import "../../../styles/auth.css"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../../App'
import { toast } from 'react-toastify'
import { employeSignIn } from '../../../apis'
import { setToken } from '../../../utils/helperFunction'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { getJwtDecode } from '../../../utils/helperFunction'
import { useFormik } from "formik"
import * as yup from 'yup'
import { motion } from "framer-motion";


export default function EmployeeSignIn() {
    const state = useContext(AppContext)
    const [data, setData] = useState({ email: "", password: "" })
    const [view, setView] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const employeeFormik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object().shape({
            email: yup.string().email().required("Email is required"),
            password: yup.string().required("Password is required"),

        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await employeSignIn(values)
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: true, details: details })
                        if (details?.empType == "assistant") {
                            navigate("/employee/dashboard")
                        } else {
                            navigate("/employee/dashboard")
                        }
                        toast.success(res?.data?.message)
                    }
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("signup error",error);
                setLoading(false)
            }
        }
    })


    return (
        <>
            <div className="auth-root">

                {/* LEFT – Image / Brand Section */}
                <motion.div
                    className="auth-left"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        src="/Images/auth/employee/signin_1.png"
                        alt="Team Portal"
                    />

                    <div className="auth-left-overlay">
                        <h1>Team Portal</h1>
                        <p>Secure workspace of our organization</p>
                    </div>
                </motion.div>

                {/* RIGHT – Glass Login */}
                <motion.div
                    className="auth-right"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="glass-card">
                        <h2>Welcome Back</h2>
                        <p className="subtitle">
                            Sign in to continue
                        </p>

                        <form onSubmit={employeeFormik.handleSubmit}>

                            {/* Email */}
                            <div className="field">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder=" "
                                    value={employeeFormik.values.email}
                                    onChange={employeeFormik.handleChange}
                                />
                                <label>Email Address</label>
                                <p className="text-warning">{employeeFormik?.touched?.email && employeeFormik?.errors?.email}</p>

                            </div>

                            {/* Password */}
                            <div>
                                <div className="field password p-0 m-0">
                                    <input
                                        type={view ? "text" : "password"}
                                        name="password"
                                        placeholder=" "
                                        value={employeeFormik.values.password}
                                        onChange={employeeFormik.handleChange}
                                    />
                                    <label>Password</label>

                                    <span
                                        className="eye"
                                        onClick={() => setView(!view)}
                                    >
                                        {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                    </span>
                                </div>
                                <p className="text-warning p-0 m-0">{employeeFormik?.touched?.password && employeeFormik?.errors?.password}</p>
                            </div>


                            <div className="forgot">
                                <Link to="/employee/forget-password">
                                    Forgot password?
                                </Link>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={loading}
                                className="auth-button"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

