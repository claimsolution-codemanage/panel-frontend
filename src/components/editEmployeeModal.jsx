import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import PhoneInput from 'react-phone-input-2';
import { employeeType,employeeDesignation } from '../utils/constant';
import * as yup from 'yup'

export default function EditEmployeeModal({ id, hide, show, handleComfirmation,details }) {
    const [loading, setLoading] = useState(false)
    console.log("details",details);

    const employeeUpdateFormik = useFormik({
        initialValues: { 
            fullName: details?.fullName, 
            type: details?.type, 
            designation: details?.designation, 
            mobileNo: details?.mobileNo,
            branchId:details?.branchId
         },
        validationSchema: yup.object().shape({
            fullName: yup.string().required("FullName is required"),
            type: yup.string().required("Employee department is required"),
            designation: yup.string().required("Employee designation is required"),
            mobileNo: yup.string().required("Employee mobile No is required"),
            branchId: yup.string().required("Employee branch ID is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await handleComfirmation(id, values)
                if (res?.data?.success) {
                    toast?.success(res?.data?.message)
                    hide()
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                setLoading(false)
            }
        }
    })



    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <form onSubmit={employeeUpdateFormik.handleSubmit} className="">
                        <div className="my-3">
                            <input type="text" name="fullName" value={employeeUpdateFormik?.values?.fullName} onChange={employeeUpdateFormik.handleChange} className={`form-control ${employeeUpdateFormik?.touched?.fullName && employeeUpdateFormik?.errors?.fullName && "error"}`} placeholder="Employee FullName" />
                            <p className="text-danger">{employeeUpdateFormik?.touched?.fullName && employeeUpdateFormik?.errors?.fullName}</p>
                        </div>
                        <div className="my-3">
                            <input type="text" name="branchId" value={employeeUpdateFormik?.values?.branchId} onChange={employeeUpdateFormik.handleChange} className={`form-control ${employeeUpdateFormik?.touched?.branchId && employeeUpdateFormik?.errors?.branchId && "error"}`} placeholder="Employee branchId" />
                            <p className="text-danger">{employeeUpdateFormik?.touched?.branchId && employeeUpdateFormik?.errors?.branchId}</p>
                        </div>

                        <div className="mb-3">
                            <PhoneInput
                                country={'in'}
                                containerClass="w-100"
                                inputClass={`w-100  ${employeeUpdateFormik?.touched?.mobileNo && employeeUpdateFormik?.errors?.mobileNo && "border-danger"}`}
                                placeholder="+91 12345-67890*"
                                onlyCountries={['in']}
                                value={employeeUpdateFormik?.values?.mobileNo} onChange={phone => phone.startsWith(+91) ? employeeUpdateFormik.setFieldValue("mobileNo", phone) : employeeUpdateFormik.setFieldValue("mobileNo", +91 + phone)} />
                            {employeeUpdateFormik?.touched?.mobileNo && employeeUpdateFormik?.errors?.mobileNo ? (
                                <span className="text-danger">{employeeUpdateFormik?.errors?.mobileNo}</span>
                            ) : null}
                        </div>
                        <div className="mb-3">
                                    <select className="form-select" name="type" value={employeeUpdateFormik.values?.type?.toLowerCase()} onChange={employeeUpdateFormik.handleChange} aria-label="Default select example">
                                        <option value="">--Select employee department</option>
                                        {employeeType?.map(employee => <option key={employee} value={employee?.toLowerCase()}>{employee}</option>)}
                                    </select>
                                    {employeeUpdateFormik?.touched?.type && employeeUpdateFormik?.errors?.type ? (
                                <span className="text-danger">{employeeUpdateFormik?.errors?.type}</span>
                            ) : null}
                                </div>
                                <div className="mb-3">
                                    <select className="form-select" name="designation" value={employeeUpdateFormik.values?.designation?.toLowerCase()} onChange={employeeUpdateFormik.handleChange} aria-label="Default select example">
                                        <option value="">--Select employee designation</option>
                                        {employeeDesignation?.map(designation => <option key={designation} value={designation?.toLowerCase()}>{designation}</option>)}
                                    </select>
                                    {employeeUpdateFormik?.touched?.designation && employeeUpdateFormik?.errors?.designation ? (
                                <span className="text-danger">{employeeUpdateFormik?.errors?.designation}</span>
                            ) : null}
                                </div>


                        <div className="d-flex gap-2 float-end">
                            <button type="submit" aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary  mt-5 ${loading && "disabled"}`}>
                                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save</span>}
                            </button>
                            <button onClick={()=>hide()} aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary  mt-5 ${loading && "disabled"}`}>
                               Close
                            </button>
                        </div>
                    </form>
                </div>

            </Modal.Body>
        </Modal>
    );
}