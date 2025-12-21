import { Link, useNavigate } from "react-router-dom"
import { partnerType } from "../../utils/constant"
import { useState } from "react"
import { AppContext } from "../../App"
import { useContext } from "react"
import { toast } from 'react-toastify'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { setToken } from "../../utils/helperFunction"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useFormik } from 'formik'
import { partnerSignUpInitialValue, partnerSignUpValidationSchema } from "../../utils/validations/auth/partnerAuthValidation"
import { partnersignUpApi } from "../../apis/auth/partnerAuthApi"


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
                        navigate("/partner/email otp verify")
                    }
                    setDisable(false)
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
                                <div className="h2 fw-bold text-center">SignUp</div>
                                {/* <div className="text text-center text-primary mb-5">Required 2-steps verification*</div> */}
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                        <form onSubmit={UserDetailsFormik.handleSubmit} className="form w-100">
                                            <div className="mb-3">
                                                <input type="text" name="fullName" value={UserDetailsFormik?.values?.fullName} onChange={UserDetailsFormik.handleChange} className={`form-control ${UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName && "border-danger"}`} placeholder="Your FullName*" id="name" aria-describedby="nameHelp" />
                                                {UserDetailsFormik?.touched?.fullName && UserDetailsFormik?.errors?.fullName ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.fullName}</span>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <input type="email" name="email" value={UserDetailsFormik?.values?.email} onChange={UserDetailsFormik.handleChange} className={`form-control ${UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email && "border-danger"}`} placeholder="Email Id*" id="email" aria-describedby="emailHelp" />
                                                {UserDetailsFormik?.touched?.email && UserDetailsFormik?.errors?.email ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.email}</span>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                {/* <label for="mobileNo." className="form-label">Phone No.</label> */}
                                                {/* <input type="number" name="mobileNo" value={data.mobileNo} onChange={handleOnchange} className="form-control" placeholder="Phone No." id="mobileNo." aria-describedby="mobileNoHelp" /> */}
                                                <PhoneInput
                                                    country={'in'}
                                                    containerClass="w-100"
                                                    inputClass={`w-100  ${UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo && "border-danger"}`}
                                                    // autoFormat={true}
                                                    placeholder="+91 12345-67890*"
                                                    onlyCountries={['in']}
                                                    value={UserDetailsFormik.values.mobileNo} onChange={phone => phone.startsWith(+91) ? UserDetailsFormik.setFieldValue("mobileNo",phone ) : UserDetailsFormik.setFieldValue("mobileNo",+91 + phone)} />
                                                  {UserDetailsFormik?.touched?.mobileNo && UserDetailsFormik?.errors?.mobileNo ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.mobileNo}</span>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <select className={`form-select  ${UserDetailsFormik?.touched?.workAssociation && UserDetailsFormik?.errors?.workAssociation && "border-danger"}`} name="workAssociation" value={UserDetailsFormik?.values?.workAssociation} onChange={UserDetailsFormik.handleChange} aria-label="Default select example">
                                                    <option>--select Partner Type*</option>
                                                    {partnerType?.map(partner => <option key={partner} value={partner}>{partner}</option>)}
                                                </select>
                                                {UserDetailsFormik?.touched?.workAssociation && UserDetailsFormik?.errors?.workAssociation ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.workAssociation}</span>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <input type="text" name="areaOfOperation" value={UserDetailsFormik?.values.areaOfOperation} onChange={UserDetailsFormik.handleChange} className={`form-control ${UserDetailsFormik?.touched?.areaOfOperation && UserDetailsFormik?.errors?.areaOfOperation && "border-danger"}`} placeholder="Area of Operation*" id="areaOfOperation" />
                                                {UserDetailsFormik?.touched?.areaOfOperation && UserDetailsFormik?.errors?.areaOfOperation ? (
                                                    <span className="text-danger">{UserDetailsFormik?.errors?.areaOfOperation}</span>
                                                ) : null}
                                            </div>
                                         
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
                                                <button type="submit" aria-disabled={disable}  disabled={disable || !UserDetailsFormik?.values?.agreement} className={disable || !UserDetailsFormik?.values?.agreement ? "btn btn-primary disabled w-100" : "btn btn-primary w-100"}> {disable ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>SignUp </span>} </button>
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