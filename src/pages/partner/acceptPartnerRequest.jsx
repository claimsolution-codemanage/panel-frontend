import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { AppContext } from "../../App"
import { useContext } from "react"
import { toast } from 'react-toastify'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { setToken } from "../../utils/helperFunction"
import 'react-phone-input-2/lib/style.css'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { getJwtDecode } from "../../utils/helperFunction"
import { partnerSignUpWithRequestApi } from "../../apis/auth/partnerAuthApi"


export default function AcceptPartnerRequest() {
    const state = useContext(AppContext)
    const [disable, setDisable] = useState(false)
    const [view, setView] = useState(false)
    const navigate = useNavigate()
    const param = useParams()

    const UserDetailsFormik = useFormik({
        initialValues: {
        password: "",agreement: false,    
        },
        validationSchema: yup.object().shape({
            password: yup.string().min(8,"Password must have minimum 8 character").required("Please enter your Password"),
            agreement:yup.bool()
        }),
        onSubmit: async (values) => {
            setDisable(true)
            try {
                const res = await partnerSignUpWithRequestApi({...values,tokenId:param?.tokenId})
                if (res?.data?.success) {
                    const token = res?.headers["x-auth-token"]
                    if (token) {
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: false, details: details })
                        toast.success(res?.data?.message)
                        navigate("/partner/dashboard")
                        setDisable(false)
                    }else{
                        toast.error("Failed to signup")
                    }
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("signup error", error);
                setDisable(false)
            }
        }
    })

    return (<>
        <div className="container-fluid p-0 mt-auto mt-md-5">
            <div className="container-px-5 p-0">
                <div className="container-fluid">
                    <div className="row p-0 m-0">
                        <div className="col-12 col-md-6">
                            <img src="/Images/home/sign-up.png" alt="card image" className='img-fluid h-100' />
                        </div>
                        <div className="col-md-6 col-sm-12 p-0  bg-color-7 color-4">
                            <div className="mx-auto px-2 px-md-0 py-5">
                                <div className="h2 fw-bold text-center">Partner request</div>
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                        <form onSubmit={UserDetailsFormik.handleSubmit} className="form w-100">
                                            <div className=" mt-3">
                                                <div className="mb-3 mt-3">
                                                    <div className={`d-flex flex aligin-items-center form-control ${UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password && "border-danger"} justify-content-center`}>
                                                        <input type={view ? "text" : "password"} className="w-100 border-0" name='password' style={{ outline: 'none' }} value={UserDetailsFormik?.values?.password} onChange={UserDetailsFormik.handleChange} id="password" placeholder="Password*" />
                                                        <span className='fs-6' style={{ cursor: 'pointer' }} onClick={() => setView(!view)}>
                                                            {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                                        </span>
                                                    </div>
                                                    {UserDetailsFormik?.touched?.password && UserDetailsFormik?.errors?.password ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.password}</span>
                                                ) : null}
                                                </div>
                                                <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value={UserDetailsFormik?.values?.agreement} onChange={(e)=>UserDetailsFormik?.setFieldValue("agreement",!UserDetailsFormik?.values?.agreement)} id="defaultCheck1" />
                                                <label class="form-check-label" for="defaultCheck1">
                                                    <Link to={"/partner/service agreement"} target="_blank">Agree with service agreement</Link> 
                                                </label>
                                            </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-2">
                                                <Link to="/partner/signin">Already have an account? Signin</Link>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-4">
                                                <button type="submit" aria-disabled={disable}  disabled={disable || !param?.tokenId || !UserDetailsFormik?.values?.agreement} className={disable || !param?.tokenId || !UserDetailsFormik?.values?.agreement ? "btn btn-primary disabled w-100" : "btn btn-primary w-100"}> {disable ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Accept-request </span>} </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>)
}