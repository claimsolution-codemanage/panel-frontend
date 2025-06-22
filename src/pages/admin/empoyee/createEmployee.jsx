import 'react-phone-input-2/lib/style.css'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import { empDepartmentOptions, empDesignationOptions } from "../../../utils/constant"
import { adminGetNormalEmployee,adminCreateNewEmployee } from "../../../apis"
import { addEmpInitialValue, addEmpValidationSchema } from "../../../utils/validation"
import { useFormik } from "formik"
import FormInputField from "../../../components/Common/form/FormInput"
import FormEmpSelect from "../../../components/Common/form/FormEmpSelect"
import FormSelectField from "../../../components/Common/form/FormSelectField"
import FormPhoneInputField from "../../../components/Common/form/FormPhoneInput"


export default function AdminCreateNewEmployee() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSumbit = async (values) => {
        setLoading(true)
        const payload = {
            ...values,
            headEmpId:values?.headEmpId?.value,
            managerId:values?.managerId?.value,
        }
        try {
            const res = await adminCreateNewEmployee(payload)
            if (res?.data?.success) {
                navigate("/admin/dashboard")
                toast.success(res?.data?.message)
                setLoading(false)
            }
            setLoading(false)
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            setLoading(false)
        }
    }

    const formik = useFormik({
        initialValues:addEmpInitialValue,
        validationSchema:addEmpValidationSchema,
        onSubmit:handleSumbit
    })


    const handleEmpOptionsList = (limit = 10, page = 1, inputValue = "") => {
        return adminGetNormalEmployee(limit, page, inputValue, true)
    }

    return (<>
        <div className="">
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
                    <div className="d-flex flex align-items-center gap-1">
                        <span>Add New Employee</span>
                        {/* <span><LuPcCase /></span> */}
                    </div>
                </div>
            </div>
            <div className="row p-0 m-0 py-3">
                <div className="col-12 p-0">
                    <div className="color-4 mx-auto p-5 w-75">
                        <div className="align-items-center bg-color-1 p-5 rounded-2 row shadow m-0">
                            <div className="border-3 border-primary border-bottom py-2">
                                <h6 className="text-primary text-center h3">Add New Employee</h6>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 mt-3">
                                <FormInputField name="fullName" type="text" label="Full name" formik={formik} handleOnChange={(e,name)=>formik.handleChange(e)}/>
                                <FormInputField name="email" type="email" label="Email" formik={formik} handleOnChange={(e,name)=>formik.handleChange(e)}/>
                                <FormInputField name="empId" type="text" label="Employee ID" formik={formik} handleOnChange={(e,name)=>formik.handleChange(e)}/>
                                <FormInputField name="branchId" type="text" label="Employee branch ID" formik={formik} handleOnChange={(e,name)=>formik.handleChange(e)}/>
                                <FormPhoneInputField name="mobileNo" label="Phone" formik={formik} handleOnChange={(e,name)=>formik.setFieldValue(name,e)}/>
                                <FormSelectField name="type" label="Department" options={empDepartmentOptions} formik={formik} handleOnChange={(e,name)=>formik.handleChange(e)}/>
                                <FormSelectField name="designation" label="Designation" options={empDesignationOptions} formik={formik} handleOnChange={(e,name)=>formik.handleChange(e)}/>
                                <FormEmpSelect getEmpList={handleEmpOptionsList} name="managerId" label="Manager of employee"  formik={formik} handleOnChange={(e,name)=>formik.setFieldValue(name,e)}/>
                                <FormEmpSelect getEmpList={handleEmpOptionsList} name="headEmpId" label="Head of employee"  formik={formik} handleOnChange={(e,name)=>formik.setFieldValue(name,e)}/>
                            </div>
                            <div className="d-flex  justify-content-center">
                                <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary w-100 ${loading && "disabled"}`} onClick={formik.handleSubmit}>
                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add Employee</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>)
}