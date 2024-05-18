import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { AppContext } from "../../App"
import { useContext } from "react"
import { salesEmployeeAddSathi } from "../../apis"
import { toast } from 'react-toastify'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useFormik } from 'formik'
import * as yup from 'yup'


export default function EmployeeAddSathiAcc() {
    const state = useContext(AppContext)
    const [disable, setDisable] = useState(false)
    const [view, setView] = useState(false)
    const navigate = useNavigate()



    const UserDetailsFormik = useFormik({
        initialValues: {
            fullName: "", email: "", mobileNo: "",},
        validationSchema: yup.object().shape({
            fullName: yup.string().required("Please enter your Full Name"),
            email: yup.string().email("Enter valid Email").required("Please enter your Email"),
            mobileNo:yup.string().required("Please enter your Mobile No."),
        }),
        onSubmit: async (values) => {
            setDisable(true)
            try {
                const res = await salesEmployeeAddSathi(values)
                if (res?.data?.success) {
                    toast.success(res?.data?.message)
                    UserDetailsFormik.resetForm()
                    setDisable(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                setDisable(false)
            }
        }
    })

    return (<>
        <div className="container-fluid p-0 mt-auto mt-md-5">
        <div className="m-md-5 p-3">
                 <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
                    <div className="row p-0 m-0">
                        <div className="col-12 p-0  bg-color-7 color-4">
                            <div className="mx-auto px-2 px-md-0 py-5">
                                <div className="h2 fw-bold text-center">Add Sathi Team</div>

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
                                            <div className="d-flex align-items-center justify-content-center mt-4">
                                                <button type="submit" aria-disabled={disable}  disabled={disable} className={disable ?  "btn btn-primary disabled w-100" : "btn btn-primary w-100"}> {disable ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add Partner </span>} </button>
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