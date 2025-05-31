import "react-image-upload/dist/index.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDateToISO } from "../../utils/helperFunction";
import { toast } from 'react-toastify'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader";
import { validateUploadFile } from "../../utils/helperFunction";
import { checkPhoneNo, checkNumber } from "../../utils/helperFunction";
import { useFormik } from "formik";
import { empJoiningFormInitialValues, empJoiningFormValidationSchema } from "../../utils/validation";
import PhoneInput from "react-phone-input-2";
import AddNewCaseDocsModal from "./Modal/addNewCaseDoc";

export default function EmpJoiningForm({ getEmpJoiningFormApi, addOrUpdateJoiningFormApi, imageUpload, id, attachementUpload }) {
    const param = useParams()
    const imgRef = useRef()
    const [loading, setLoading] = useState(false)
    const [uploadPhoto, setUploadPhoto] = useState({ status: 0, loading: false, message: "" })
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [uploadingDocs, setUploadingDocs] = useState(false)

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            const res = await addOrUpdateJoiningFormApi({...values,empId:id})
            if (res?.data?.success && res?.data) {
                getEmpJoiningDetails()
                toast.success(res?.data?.message)
                setLoading(false)
            }
        } catch (error) {
            // console.log('errsdfs',error);
            
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setLoading(false)
            } else {
                toast.error("Something went wrong")
                setLoading(false)

            }
        }
    }

    const empFormik = useFormik({
        initialValues: empJoiningFormInitialValues,
        validationSchema: empJoiningFormValidationSchema,
        onSubmit: handleSubmit
    })

    const handleBack = () => {
        if (location?.state?.filter && location?.state?.back) {
            navigate(location?.state?.back, { state: { ...location?.state, back: location?.pathname } });
        } else {
            navigate(-1)
        }
    };

    const getEmpJoiningDetails = async () => {
        try {
            setLoading(true)
            const res = await getEmpJoiningFormApi(id)
            if (res?.data?.success) {
                setLoading(false)
            }
            if(res?.data?.data){
                empFormik.setValues(res?.data?.data)
            }
        } catch (error) {
            // console.log("errr",error);
            
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    useEffect(() => {
        if (id) {
            getEmpJoiningDetails()
        }
    }, [id])

    const handleImage = (e) => {
        imgRef.current.click()
    }

    const handleUploadFile = async (file, type) => {
        try {
            setUploadPhoto({ status: 1, type, loading: true, message: "uploading..." })
            const res = await imageUpload(file)
            empFormik?.setFieldValue(type, res?.data?.url)
            setUploadPhoto({ status: 1, type, loading: false, message: "uploaded" })
            setTimeout(() => {
                setUploadPhoto({ status: 0, type, loading: false, message: "" })
            }, 3000);
        } catch (error) {
            if (error && error?.response?.data?.message) {
                setUploadPhoto({ status: 0, loading: false, type, message: error?.response?.data?.message })
            } else {
                setUploadPhoto({ status: 0, loading: false, type, message: "Failed to upload file" })
            }
        }
    }


    const handleImgOnchange = async (e, type) => {
        setUploadPhoto({ status: 0, type, loading: true, message: "" })
        const result = validateUploadFile(e.target.files, 5, "image")
        if (!result?.success) {
            setUploadPhoto({ status: 0, type, loading: false, message: result?.message })
        } else {
            handleUploadFile(result?.file, type)
        }
    }




    const handleDocsUploading = (payload) => {
        const docs = empFormik?.values?.docs || []
        empFormik?.setFieldValue("docs",[...docs,...payload?.map(ele=>{return {...ele,new:true}})])
    }

    const handleRemove = (index,type)=>{
        let list = empFormik?.values?.[type]?.filter((ele,ind)=>ind!=index)
        if(list && type){
            empFormik.setFieldValue(type,list)
        }
    }

    const handleAdd =(type)=>{
        let obj;
        if(type=="educationalDetails"){
        obj = { degree: "", university: "", from: "", to: "", percentage: "", specialization: "" }
        } else if(type=="employmentDetails"){
            obj = { organization: "", designation: "", from: "", to: "", annualCTC: "" }
        }else if(type=="familyDetails"){
            obj = { name: "", relation: "", occupation: "", dateOfBirth: "" }
        }else if(type=="professionalReferences"){
            obj = { name: "", organization: "", designation: "", contactNo: "" }
        }
        
        if(obj){
            empFormik.setFieldValue(type,[...empFormik.values?.[type],obj])
        }
    }
// console.log("sdfsd",empFormik?.values?.telephone);

    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        <IoArrowBackCircleOutline className="fs-3" onClick={handleBack} style={{ cursor: "pointer" }} />
                        <div className="d-flex flex align-items-center gap-1">
                            <span>Joining Form</span>
                        </div>
                    </div>
                </div>
                <div className="m-2 m-md-5">
                    <div className="container-fluid color-4 p-0">
                        <div>
                            {/* <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                                <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                    <div className="d-flex flex-column  align-items-center justify-content-center">
                                        <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} onClick={handleImage}>
                                            {empFormik?.values?.profileImg ? <img src={getCheckStorage(empFormik?.values?.profileImg)} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} /> : <BsCameraFill className="h2 text-white " />}
                                            <input type="file" name="profileImg" ref={imgRef} id="profileImg" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                        </div>
                                        {uploadPhoto.message && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-10">
                                </div>

                            </div> */}


                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                <div className="border-3 border-primary border-bottom py-2">
                                    <h6 className="text-primary fs-3">Form</h6>
                                </div>
                                <div className="mt-5 row">
                                    <div className="row">
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="name" className="form-label">Full name </label>
                                        <input type="text" className="form-control" id="name" name="name" value={empFormik?.values?.name} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} aria-describedby="name" />
                                        {empFormik?.touched?.name && empFormik?.errors?.name && <span className="text-danger">{empFormik?.errors?.name}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="fatherName" className="form-label">Father name</label>
                                        <input type="text" name="fatherName" value={empFormik?.values?.fatherName} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className={`form-control`} placeholder="" />
                                        {empFormik?.touched?.fatherName && empFormik?.errors?.fatherName && <span className="text-danger">{empFormik?.errors?.fatherName}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="correspondenceAddress" className="form-label">Correspondence address</label>
                                        <input type="text" name="correspondenceAddress" value={empFormik?.values?.correspondenceAddress} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className={`form-control`} placeholder="" />
                                        {empFormik?.touched?.correspondenceAddress && empFormik?.errors?.correspondenceAddress && <span className="text-danger">{empFormik?.errors?.correspondenceAddress}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="permanentAddress" className="form-label">Permanent address</label>
                                        <input type="text" name="permanentAddress" value={empFormik?.values?.permanentAddress} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className={`form-control`} placeholder="" />
                                        {empFormik?.touched?.permanentAddress && empFormik?.errors?.permanentAddress && <span className="text-danger">{empFormik?.errors?.permanentAddress}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="telephone" className="form-label">telephone</label>
                                        <input type="text" name="telephone" value={empFormik?.values?.telephone} onChange={(e)=>checkPhoneNo(e?.target?.value) && empFormik.handleChange(e)} onBlur={empFormik?.handleBlur} className={`form-control`} placeholder="" />
                                        {empFormik?.touched?.telephone && empFormik?.errors?.telephone && <span className="text-danger">{empFormik?.errors?.telephone}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="email" className="form-label">Email </label>
                                        <input type="text" className="form-control" id="email" name="email" value={empFormik?.values?.email} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} aria-describedby="email" />
                                        {empFormik?.touched?.email && empFormik?.errors?.email && <span className="text-danger">{empFormik?.errors?.email}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="mobileNo" className="form-label">Mobile No</label>
                                        <PhoneInput
                                            country={'in'}
                                            containerClass="w-100"
                                            inputClass={`w-100  ${empFormik?.touched?.mobile && empFormik?.errors?.mobile && "border-danger"}`}
                                            placeholder="+91 12345-67890*"
                                            onlyCountries={['in']}
                                            value={empFormik?.values?.mobile} onChange={phone => phone.startsWith(+91) ? empFormik.setFieldValue("mobile", phone) : empFormik.setFieldValue("mobile", +91 + phone)} />
                                        {empFormik?.touched?.mobile && empFormik?.errors?.mobile && <span className="text-danger">{empFormik?.errors?.mobile}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="dateOfBirth" className="form-label">Date Of birth</label>
                                        <input type="date" name="dateOfBirth" value={empFormik?.values?.dateOfBirth ? formatDateToISO(empFormik?.values?.dateOfBirth) : ''} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="dateOfBirth" aria-describedby="dateOfBirth" />
                                        {empFormik?.touched?.dateOfBirth && empFormik?.errors?.dateOfBirth && <span className="text-danger">{empFormik?.errors?.dateOfBirth}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="maritalStatus" className="form-label">Marital status</label>
                                        <select className="form-select" name="maritalStatus" value={empFormik?.values?.maritalStatus} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} id="maritalStatus" aria-label="Default select example">
                                            <option value="">--select marital status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="separated">Separated</option>
                                        </select>
                                        {empFormik?.touched?.maritalStatus && empFormik?.errors?.maritalStatus && <span className="text-danger">{empFormik?.errors?.maritalStatus}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="panCardNo" className="form-label">PAN card No</label>
                                        <input type="text" name="panCardNo" value={empFormik?.values?.panCardNo} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="panCardNo" aria-describedby="panCardNo" />
                                        {empFormik?.touched?.panCardNo && empFormik?.errors?.panCardNo && <span className="text-danger">{empFormik?.errors?.panCardNo}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="bloodGroup" className="form-label">Blood group</label>
                                        <select className="form-select" name="bloodGroup" value={empFormik?.values?.bloodGroup} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} id="bloodGroup" aria-label="Default select example">
                                            <option value="">--select blood group</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                        {empFormik?.touched?.bloodGroup && empFormik?.errors?.bloodGroup && <span className="text-danger">{empFormik?.errors?.bloodGroup}</span>}
                                    </div>
                                    </div>
                                    <div className="">
                                        <p className="fs-6 fw-bold">Emergency contact Details</p>
                                        <div className="row">
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="emergencyContact.name" className="form-label">Name</label>
                                        <input type="text" name="emergencyContact.name" value={empFormik?.values?.emergencyContact?.name} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="emergencyContact.name" aria-describedby="emergencyContact.name" />
                                        {empFormik?.touched?.emergencyContact?.name && empFormik?.errors?.emergencyContact?.name && <span className="text-danger">{empFormik?.errors?.emergencyContact?.name}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="emergencyContact.relation" className="form-label">Relation</label>
                                        <input type="text" name="emergencyContact.relation" value={empFormik?.values?.emergencyContact?.relation} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="emergencyContact.relation" aria-describedby="emergencyContact.relation" />
                                        {empFormik?.touched?.emergencyContact?.relation && empFormik?.errors?.emergencyContact?.relation && <span className="text-danger">{empFormik?.errors?.emergencyContact?.relation}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="emergencyContact.contactNo" className="form-label">ContactNo</label>
                                        <input type="text" name="emergencyContact.contactNo" value={empFormik?.values?.emergencyContact?.contactNo} onChange={(e)=>checkPhoneNo(e?.target?.value)  && empFormik.handleChange(e)} onBlur={empFormik?.handleBlur} className="form-control" id="emergencyContact.contactNo" aria-describedby="emergencyContact.contactNo" />
                                        {empFormik?.touched?.emergencyContact?.contactNo && empFormik?.errors?.emergencyContact?.contactNo && <span className="text-danger">{empFormik?.errors?.emergencyContact?.contactNo}</span>}
                                    </div>
                                        </div>
                                    </div>
                                    <div>
                                    <p className="fs-6 fw-bold">Educational Details</p>
                                        <div className="rounded-2 shadow overflow-auto">
                                            <div className=" table-responsive">
                                                <table className="table table-responsive table-borderless">
                                                    <thead>
                                                        <tr className="bg-primary text-white text-center">
                                                        <th scope="col" className="text-nowrap">S.No</th>
                                                            <th scope="col" className="text-nowrap">Degree</th>
                                                            <th scope="col" className="text-nowrap">University/ Institute</th>
                                                            <th scope="col" className="text-nowrap">From</th>
                                                            <th scope="col" className="text-nowrap">To</th>
                                                            <th scope="col" className="text-nowrap">Percentage/ Grade</th>
                                                            <th scope="col" className="text-nowrap" >Specialization</th>
                                                            <th scope="col" className="text-nowrap" ><div onClick={()=>handleAdd("educationalDetails")} className="btn btn-sm btn-light">+</div></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {empFormik?.values?.educationalDetails.map((item, ind) => <tr key={ind} className="border-2 border-bottom border-light text-center">
                                                            <td>{ind+1}</td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`educationalDetails[${ind}].degree`} value={empFormik?.values?.educationalDetails?.[ind]?.degree} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`educationalDetails.[${ind}].degree`} aria-describedby={`educationalDetails.[${ind}].degree`} />
                                                                    {empFormik?.touched?.educationalDetails?.[ind]?.degree && empFormik?.errors?.educationalDetails?.[ind]?.degree && <span className="text-danger">{empFormik?.errors?.educationalDetails?.[ind]?.degree}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`educationalDetails[${ind}].university`} value={empFormik?.values?.educationalDetails?.[ind]?.university} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`educationalDetails?.[${ind}]?.university`} aria-describedby={`educationalDetails?.[${ind}]?.university`} />
                                                                    {empFormik?.touched?.educationalDetails?.[ind]?.university && empFormik?.errors?.educationalDetails?.[ind]?.university && <span className="text-danger">{empFormik?.errors?.educationalDetails?.[ind]?.university}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`educationalDetails[${ind}].from`} value={empFormik?.values?.educationalDetails?.[ind]?.from} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`educationalDetails?.[${ind}]?.from`} aria-describedby={`educationalDetails?.[${ind}]?.from`} />
                                                                    {empFormik?.touched?.educationalDetails?.[ind]?.from && empFormik?.errors?.educationalDetails?.[ind]?.from && <span className="text-danger">{empFormik?.errors?.educationalDetails?.[ind]?.from}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`educationalDetails[${ind}].to`} value={empFormik?.values?.educationalDetails?.[ind]?.to} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`educationalDetails?.[${ind}]?.to`} aria-describedby={`educationalDetails?.[${ind}]?.to`} />
                                                                    {empFormik?.touched?.educationalDetails?.[ind]?.to && empFormik?.errors?.educationalDetails?.[ind]?.to && <span className="text-danger">{empFormik?.errors?.educationalDetails?.[ind]?.to}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`educationalDetails[${ind}].percentage`} value={empFormik?.values?.educationalDetails?.[ind]?.percentage} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`educationalDetails?.[${ind}]?.percentage`} aria-describedby={`educationalDetails?.[${ind}]?.percentage`} />
                                                                    {empFormik?.touched?.educationalDetails?.[ind]?.percentage && empFormik?.errors?.educationalDetails?.[ind]?.percentage && <span className="text-danger">{empFormik?.errors?.educationalDetails?.[ind]?.percentage}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`educationalDetails[${ind}].specialization`} value={empFormik?.values?.educationalDetails?.[ind]?.specialization} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`educationalDetails?.[${ind}]?.specialization`} aria-describedby={`educationalDetails?.[${ind}]?.specialization`} />
                                                                    {empFormik?.touched?.educationalDetails?.[ind]?.specialization && empFormik?.errors?.educationalDetails?.[ind]?.specialization && <span className="text-danger">{empFormik?.errors?.educationalDetails?.[ind]?.specialization}</span>}
                                                                </div>
                                                            </td>
                                                            <td>
                                                            <div className="btn btn-sm btn-danger" onClick={()=>handleRemove(ind,"educationalDetails")}>-</div>
                                                            </td>
                                                        </tr>)}
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                  
                                    <div className="mt-4">
                                    <p className="fs-6 fw-bold">Employment Details</p>
                                        <div className="rounded-2 shadow overflow-auto">
                                            <div className=" table-responsive">
                                                <table className="table table-responsive table-borderless">
                                                    <thead>
                                                        <tr className="bg-primary text-white text-center">
                                                        <th scope="col" className="text-nowrap">S.No</th>
                                                            <th scope="col" className="text-nowrap">Organization</th>
                                                            <th scope="col" className="text-nowrap">Designation</th>
                                                            <th scope="col" className="text-nowrap">From</th>
                                                            <th scope="col" className="text-nowrap">To</th>
                                                            <th scope="col" className="text-nowrap">Annual CTC</th>
                                                            <th scope="col" className="text-nowrap" ><div onClick={()=>handleAdd("employmentDetails")} className="btn btn-sm btn-light">+</div></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {empFormik?.values?.employmentDetails.map((item, ind) => <tr key={ind} className="border-2 border-bottom border-light text-center">
                                                        <td className="text-nowrap">{ind+1}</td>
                                                            
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`employmentDetails[${ind}].organization`} value={empFormik?.values?.employmentDetails?.[ind]?.organization} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`employmentDetails.[${ind}].organization`} aria-describedby={`employmentDetails.[${ind}].organization`} />
                                                                    {empFormik?.touched?.employmentDetails?.[ind]?.organization && empFormik?.errors?.employmentDetails?.[ind]?.organization && <span className="text-danger">{empFormik?.errors?.employmentDetails?.[ind]?.organization}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`employmentDetails[${ind}].designation`} value={empFormik?.values?.employmentDetails?.[ind]?.designation} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`employmentDetails?.[${ind}]?.designation`} aria-describedby={`employmentDetails?.[${ind}]?.designation`} />
                                                                    {empFormik?.touched?.employmentDetails?.[ind]?.designation && empFormik?.errors?.employmentDetails?.[ind]?.designation && <span className="text-danger">{empFormik?.errors?.employmentDetails?.[ind]?.designation}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`employmentDetails[${ind}].from`} value={empFormik?.values?.employmentDetails?.[ind]?.from} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`employmentDetails?.[${ind}]?.from`} aria-describedby={`employmentDetails?.[${ind}]?.from`} />
                                                                    {empFormik?.touched?.employmentDetails?.[ind]?.from && empFormik?.errors?.employmentDetails?.[ind]?.from && <span className="text-danger">{empFormik?.errors?.employmentDetails?.[ind]?.from}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`employmentDetails[${ind}].to`} value={empFormik?.values?.employmentDetails?.[ind]?.to} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`employmentDetails?.[${ind}]?.to`} aria-describedby={`employmentDetails?.[${ind}]?.to`} />
                                                                    {empFormik?.touched?.employmentDetails?.[ind]?.to && empFormik?.errors?.employmentDetails?.[ind]?.to && <span className="text-danger">{empFormik?.errors?.employmentDetails?.[ind]?.to}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`employmentDetails[${ind}].annualCTC`} value={empFormik?.values?.employmentDetails?.[ind]?.annualCTC} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`employmentDetails?.[${ind}]?.annualCTC`} aria-describedby={`employmentDetails?.[${ind}]?.annualCTC`} />
                                                                    {empFormik?.touched?.employmentDetails?.[ind]?.annualCTC && empFormik?.errors?.employmentDetails?.[ind]?.annualCTC && <span className="text-danger">{empFormik?.errors?.employmentDetails?.[ind]?.annualCTC}</span>}
                                                                </div>
                                                            </td>
                                                            <td>
                                                            <div className="btn btn-sm btn-danger" onClick={()=>handleRemove(ind,"employmentDetails")}>-</div>
                                                            </td>
                                                        </tr>)}
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                    <p className="fs-6 fw-bold">Family Details</p>
                                        <div className="rounded-2 shadow overflow-auto">
                                            <div className=" table-responsive">
                                                <table className="table table-responsive table-borderless">
                                                    <thead>
                                                        <tr className="bg-primary text-white text-center">
                                                        <th scope="col" className="text-nowrap">S.No</th>
                                                            <th scope="col" className="text-nowrap">Name</th>
                                                            <th scope="col" className="text-nowrap">Relation</th>
                                                            <th scope="col" className="text-nowrap">Occupation</th>
                                                            <th scope="col" className="text-nowrap">Date of birth</th>
                                                            <th scope="col" className="text-nowrap" ><div onClick={()=>handleAdd("familyDetails")} className="btn btn-sm btn-light">+</div></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {empFormik?.values?.familyDetails.map((item, ind) => <tr key={ind} className="border-2 border-bottom border-light text-center">
                                                        <td className="text-nowrap">{ind+1}</td>
                                                        
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`familyDetails[${ind}].name`} value={empFormik?.values?.familyDetails?.[ind]?.name} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`familyDetails.[${ind}].name`} aria-describedby={`familyDetails.[${ind}].name`} />
                                                                    {empFormik?.touched?.familyDetails?.[ind]?.name && empFormik?.errors?.familyDetails?.[ind]?.name && <span className="text-danger">{empFormik?.errors?.familyDetails?.[ind]?.name}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`familyDetails[${ind}].relation`} value={empFormik?.values?.familyDetails?.[ind]?.relation} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`familyDetails?.[${ind}]?.relation`} aria-describedby={`familyDetails?.[${ind}]?.relation`} />
                                                                    {empFormik?.touched?.familyDetails?.[ind]?.relation && empFormik?.errors?.familyDetails?.[ind]?.relation && <span className="text-danger">{empFormik?.errors?.familyDetails?.[ind]?.relation}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`familyDetails[${ind}].occupation`} value={empFormik?.values?.familyDetails?.[ind]?.occupation} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`familyDetails?.[${ind}]?.occupation`} aria-describedby={`familyDetails?.[${ind}]?.occupation`} />
                                                                    {empFormik?.touched?.familyDetails?.[ind]?.occupation && empFormik?.errors?.familyDetails?.[ind]?.occupation && <span className="text-danger">{empFormik?.errors?.familyDetails?.[ind]?.occupation}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="date" name={`familyDetails[${ind}].dateOfBirth`} value={empFormik?.values?.familyDetails?.[ind]?.dateOfBirth ? formatDateToISO(empFormik?.values?.familyDetails?.[ind]?.dateOfBirth) : ''} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`familyDetails?.[${ind}]?.dateOfBirth`} aria-describedby={`familyDetails?.[${ind}]?.dateOfBirth`} />
                                                                    {empFormik?.touched?.familyDetails?.[ind]?.dateOfBirth && empFormik?.errors?.familyDetails?.[ind]?.dateOfBirth && <span className="text-danger">{empFormik?.errors?.familyDetails?.[ind]?.dateOfBirth}</span>}
                                                                </div>
                                                            </td>
                                                            <td>
                                                            <div className="btn btn-sm btn-danger" onClick={()=>handleRemove(ind,"familyDetails")}>-</div>
                                                            </td>
                                                        </tr>)}
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                    
                                    <p className="fs-6 fw-bold">Professional References</p>
                                        <div className="rounded-2 shadow overflow-auto">
                                            <div className=" table-responsive">
                                                <table className="table table-responsive table-borderless">
                                                    <thead>
                                                        <tr className="bg-primary text-white text-center">
                                                        <th scope="col" className="text-nowrap">S.No</th>
                                                            <th scope="col" className="text-nowrap">Name</th>
                                                            <th scope="col" className="text-nowrap">Organization</th>
                                                            <th scope="col" className="text-nowrap">Designation</th>
                                                            <th scope="col" className="text-nowrap">Contact No</th>
                                                            <th scope="col" className="text-nowrap" ><div onClick={()=>handleAdd("professionalReferences")} className="btn btn-sm btn-light">+</div></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {empFormik?.values?.professionalReferences.map((item, ind) => <tr key={ind} className="border-2 border-bottom border-light text-center">
                                                        <td className="text-nowrap">{ind+1}</td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`professionalReferences[${ind}].name`} value={empFormik?.values?.professionalReferences?.[ind]?.name} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`professionalReferences.[${ind}].name`} aria-describedby={`professionalReferences.[${ind}].name`} />
                                                                    {empFormik?.touched?.professionalReferences?.[ind]?.name && empFormik?.errors?.professionalReferences?.[ind]?.name && <span className="text-danger">{empFormik?.errors?.professionalReferences?.[ind]?.name}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`professionalReferences[${ind}].organization`} value={empFormik?.values?.professionalReferences?.[ind]?.organization} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`professionalReferences?.[${ind}]?.organization`} aria-describedby={`professionalReferences?.[${ind}]?.organization`} />
                                                                    {empFormik?.touched?.professionalReferences?.[ind]?.organization && empFormik?.errors?.professionalReferences?.[ind]?.organization && <span className="text-danger">{empFormik?.errors?.professionalReferences?.[ind]?.organization}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`professionalReferences[${ind}].designation`} value={empFormik?.values?.professionalReferences?.[ind]?.designation} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id={`professionalReferences?.[${ind}]?.designation`} aria-describedby={`professionalReferences?.[${ind}]?.designation`} />
                                                                    {empFormik?.touched?.professionalReferences?.[ind]?.designation && empFormik?.errors?.professionalReferences?.[ind]?.designation && <span className="text-danger">{empFormik?.errors?.professionalReferences?.[ind]?.designation}</span>}
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div className="">
                                                                    <input type="text" name={`professionalReferences[${ind}].contactNo`} value={empFormik?.values?.professionalReferences?.[ind]?.contactNo} onChange={(e)=>checkPhoneNo(e?.target?.value)  && empFormik.handleChange(e)} onBlur={empFormik?.handleBlur} className="form-control" id={`professionalReferences?.[${ind}]?.contactNo`} aria-describedby={`professionalReferences?.[${ind}]?.contactNo`} />
                                                                    {empFormik?.touched?.professionalReferences?.[ind]?.contactNo && empFormik?.errors?.professionalReferences?.[ind]?.contactNo && <span className="text-danger">{empFormik?.errors?.professionalReferences?.[ind]?.contactNo}</span>}
                                                                </div>
                                                            </td>
                                                            <td>
                                                            <div className="btn btn-sm btn-danger" onClick={()=>handleRemove(ind,"professionalReferences")}>-</div>
                                                            </td>
                                                        </tr>)}
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-center mt-4">
                                        <div aria-disabled={saving || uploadPhoto.loading} className={saving || uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} onClick={empFormik.handleSubmit}>
                                            {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>}
    <AddNewCaseDocsModal uploadingDocs={uploadingDocs} setUploadingDocs={setUploadingDocs} handleCaseDocsUploading={handleDocsUploading} attachementUpload={attachementUpload} type={"docEmp"}/>
    </>)
}