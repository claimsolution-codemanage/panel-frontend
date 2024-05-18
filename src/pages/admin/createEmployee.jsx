import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { adminCreateNewEmployee } from "../../apis"
import { toast } from 'react-toastify'
import { LuPcCase } from 'react-icons/lu'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { employeeType,employeeDesignation } from "../../utils/constant"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


export default function AdminCreateNewEmployee() {
    const [data, setData] = useState({ fullName: "", email: "",empId:"" ,branchId:"",mobileNo: "" ,type:"",designation:"" })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    // const state = useContext(AppContext)

    const hangleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await adminCreateNewEmployee(data)
            // console.log("/admin/dashboard",res);
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
            // console.log("adminResetPassword error", error);
            setLoading(false)
        }
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
                            <div className="">
                                <div className="my-3">
                                    {/* <label htmlFor="fullName" className="form-label">Full Name</label> */}
                                    <input type="text" name="fullName" placeholder="Full Name" value={data.fullName} onChange={hangleOnchange} className="form-control" id="password" />
                                </div>
                                <div className="mb-3">
                                    {/* <label htmlFor="email" className="form-label">Email</label> */}
                                    <input type="email" name="email" placeholder = "Email" value={data.email} onChange={hangleOnchange} className="form-control"  />
                                </div>
                                <div className="my-3">
                                    <input type="text" name="empId" placeholder="Employee ID" value={data.empId} onChange={hangleOnchange} className="form-control" id="empId" />
                                </div>
                                <div className="my-3">
                                    <input type="text" name="branchId" placeholder="Employee branch ID" value={data.branchId} onChange={hangleOnchange} className="form-control" id="branchId" />
                                </div>
                                
                        <div className="mb-3">
                           <PhoneInput
                                    country={'in'}
                                    containerClass="w-100"
                                    inputClass="w-100"
                                    // autoFormat={true}
                                    placeholder="+91 12345-67890"
                                    onlyCountries={['in']}
                                   value={data.mobileNo} onChange={phone => phone.startsWith(+91) ? setData({...data,mobileNo:phone}) :setData({...data,mobileNo:+91+phone}) }  />
                        
                        </div>
                                <div className="mb-3">
                                    <select className="form-select" name="type" value={data.type} onChange={hangleOnchange} aria-label="Default select example">
                                        <option value="">--Select employee department</option>
                                        {employeeType?.map(employee => <option key={employee} value={employee}>{employee}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <select className="form-select" name="designation" value={data.designation} onChange={hangleOnchange} aria-label="Default select example">
                                        <option value="">--Select employee designation</option>
                                        {employeeDesignation?.map(designation => <option key={designation} value={designation}>{designation}</option>)}
                                    </select>
                                </div>
                                <div className="d-flex  justify-content-center">
                                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary w-100 ${loading && "disabled"}`} onClick={handleSumbit}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add Employee</span>}
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