import { allState, employeeDesignation, employeeType } from "../../utils/constant"
import "react-image-upload/dist/index.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDateToISO } from "../../utils/helperFunction";
import { BsCameraFill } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { partnerType } from "../../utils/constant";
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../Common/loader";
import { validateUploadFile } from "../../utils/helperFunction";
import { checkPhoneNo, checkNumber } from "../../utils/helperFunction";
import { getCheckStorage } from "../../utils/helperFunction";
import { useFormik } from "formik";
import { empInitialValues, empValidationSchema } from "../../utils/validation";
import PhoneInput from "react-phone-input-2";
import DocumentPreview from "../DocumentPreview";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import AddNewCaseDocsModal from "../Common/addNewCaseDoc";

export default function EditEmployeeComp({ getProfile, updateProfile, imageUpload, id, attachementUpload,joiningFormUrl }) {
    const param = useParams()
    const [data, setData] = useState({
        profilePhoto: "",
        consultantName: "",
        consultantCode: "",
        associateWithUs: "",
        primaryEmail: "",
        alternateEmail: "",
        primaryMobileNo: "",
        alternateMobileNo: "",
        whatsupNo: "",
        panNo: "",
        aadhaarNo: "",
        dob: "",
        gender: "",
        businessName: "",
        companyName: "",
        natureOfBusiness: "",
        designation: "",
        areaOfOperation: "",
        workAssociation: "",
        state: "",
        district: "",
        city: "",
        pinCode: "",
        about: "",
        kycPhoto: "",
        kycAadhaar: "",
        kycAadhaarBack: "",
        kycPan: "",
        address: "",

    })
    const imgRef = useRef()
    const [loading, setLoading] = useState(true)
    const [uploadPhoto, setUploadPhoto] = useState({ status: 0, loading: false, message: "" })
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [uploadingDocs, setUploadingDocs] = useState(false)

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            const res = await updateProfile(id, values)
            if (res?.data?.success && res?.data) {
                getProfileDetails()
                toast.success(res?.data?.message)
                setLoading(false)
            }
        } catch (error) {
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
        initialValues: empInitialValues,
        validationSchema: empValidationSchema,
        onSubmit: handleSubmit
    })

    const handleBack = () => {
        if (location?.state?.filter && location?.state?.back) {
            navigate(location?.state?.back, { state: { ...location?.state, back: location?.pathname } });
        } else {
            navigate(-1)
        }
    };

    const getProfileDetails = async () => {
        try {
            setLoading(true)
            const res = await getProfile(id)
            if (res?.data?.success && res?.data?.data) {
                empFormik.setValues(res?.data?.data)
                setLoading(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    useEffect(() => {
        if (id) {
            getProfileDetails()
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



    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleRemoveDoc =(id)=>{
        const filterDoc = empFormik?.values?.docs.filter((item,ind)=>ind!=id)
        empFormik?.setFieldValue("docs",filterDoc)
    }

    const handleDocsUploading = (payload) => {
        const docs = empFormik?.values?.docs || []
        empFormik?.setFieldValue("docs",[...docs,...payload?.map(ele=>{return {...ele,new:true}})])
    }


    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        <IoArrowBackCircleOutline className="fs-3" onClick={handleBack} style={{ cursor: "pointer" }} />
                        <div className="d-flex flex align-items-center gap-1">
                            <span>Edit Profile</span>
                        </div>
                    </div>
                    <div className="">
                        {joiningFormUrl && <div onClick={()=>navigate(`${joiningFormUrl}/${id}`)} className="btn btn-primary">Joining Form</div>}
                        
                    </div>

                </div>
                <div className="m-2 m-md-5">
                    <div className="container-fluid color-4 p-0">
                        <div>
                            <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
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
                                    {/* <h5 className="mt-3">About</h5>
                                    <div className="mb-3 col-12 w-75">
                                        <textarea class="form-control w-100" name="about" value={empFormik?.values?.about} onChange={empFormik.handleChange} placeholder="About yourself" rows={5} cols={5} ></textarea>
                                    </div> */}
                                </div>

                            </div>


                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                <div className="border-3 border-primary border-bottom py-2">
                                    <h6 className="text-primary fs-3">Profile Details</h6>
                                </div>
                                <div className="mt-5 row">
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="fullName" className="form-label">FullName </label>
                                        <input type="text" className="form-control" id="fullName" name="fullName" value={empFormik?.values?.fullName} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} aria-describedby="fullName" />
                                        {empFormik?.touched?.fullName && empFormik?.errors?.fullName && <span className="text-danger">{empFormik?.errors?.fullName}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="email" className="form-label">Email </label>
                                        <input type="text" className="form-control" id="email" name="email" value={empFormik?.values?.email} disabled={true} aria-describedby="email" />
                                        {empFormik?.touched?.email && empFormik?.errors?.email && <span className="text-danger">{empFormik?.errors?.email}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="mobileNo" className="form-label">Mobile No</label>
                                        <PhoneInput
                                            country={'in'}
                                            containerClass="w-100"
                                            inputClass={`w-100  ${empFormik?.touched?.mobileNo && empFormik?.errors?.mobileNo && "border-danger"}`}
                                            placeholder="+91 12345-67890*"
                                            onlyCountries={['in']}
                                            value={empFormik?.values?.mobileNo} onChange={phone => phone.startsWith(+91) ? empFormik.setFieldValue("mobileNo", phone) : empFormik.setFieldValue("mobileNo", +91 + phone)} />
                                        {empFormik?.touched?.mobileNo && empFormik?.errors?.mobileNo && <span className="text-danger">{empFormik?.errors?.mobileNo}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="department" className="form-label">Department</label>
                                        <select className="form-select" name="type" value={empFormik.values?.type?.toLowerCase()} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} aria-label="Default select example">
                                            <option value="">--Select employee department</option>
                                            {employeeType?.map(employee => <option key={employee} value={employee?.toLowerCase()}>{employee}</option>)}
                                        </select>
                                        {empFormik?.touched?.type && empFormik?.errors?.type && <span className="text-danger">{empFormik?.errors?.type}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="designation" className="form-label">Designation</label>
                                        <select className="form-select" name="designation" value={empFormik.values?.designation?.toLowerCase()} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} aria-label="Default select example">
                                            <option value="">--Select employee designation</option>
                                            {employeeDesignation?.map(designation => <option key={designation} value={designation?.toLowerCase()}>{designation}</option>)}
                                        </select>
                                        {empFormik?.touched?.designation && empFormik?.errors?.designation && <span className="text-danger">{empFormik?.errors?.designation}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="bankName" className="form-label">Bank name</label>
                                        <input type="text" name="bankName" value={empFormik?.values?.bankName} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className={`form-control`} placeholder="Bank name" />
                                        {empFormik?.touched?.bankName && empFormik?.errors?.bankName && <span className="text-danger">{empFormik?.errors?.bankName}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="bankBranchName" className="form-label">Bank branch name</label>
                                        <input type="text" name="bankBranchName" value={empFormik?.values?.bankBranchName} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className={`form-control`} placeholder="Bank branch name" />
                                        {empFormik?.touched?.bankBranchName && empFormik?.errors?.bankBranchName && <span className="text-danger">{empFormik?.errors?.bankBranchName}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="bankAccountNo" className="form-label">Bank account no.</label>
                                        <input type="text" name="bankAccountNo" value={empFormik?.values?.bankAccountNo} onChange={(e) => checkNumber(e) && empFormik.handleChange(e)} className={`form-control`} placeholder="Bank account no" />
                                        {empFormik?.touched?.bankAccountNo && empFormik?.errors?.bankAccountNo && <span className="text-danger">{empFormik?.errors?.bankAccountNo}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="panNo" className="form-label">PAN no</label>
                                        <input type="text" name="panNo" value={empFormik?.values?.panNo} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className={`form-control `} placeholder="PAN no" />
                                        {empFormik?.touched?.panNo && empFormik?.errors?.panNo && <span className="text-danger">{empFormik?.errors?.panNo}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="dob" className="form-label">DOB</label>
                                        <input type="date" name="dob" value={empFormik?.values?.dob ? formatDateToISO(empFormik?.values?.dob) : ''} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="dob" aria-describedby="dob" />
                                        {empFormik?.touched?.dob && empFormik?.errors?.dob && <span className="text-danger">{empFormik?.errors?.dob}</span>}
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="gender" className="form-label">Gender</label>
                                        <select className="form-select" name="gender" value={empFormik?.values?.gender} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} id="gender" aria-label="Default select example">
                                            <option value="">--select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {empFormik?.touched?.gender && empFormik?.errors?.gender && <span className="text-danger">{empFormik?.errors?.gender}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="district" className="form-label">District</label>
                                        <input type="text" name="district" value={empFormik?.values?.district} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="district" aria-describedby="district" />
                                        {empFormik?.touched?.district && empFormik?.errors?.district && <span className="text-danger">{empFormik?.errors?.district}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="city" className="form-label">City</label>
                                        <input type="text" name="city" value={empFormik?.values?.city} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="city" aria-describedby="city" />
                                        {empFormik?.touched?.city && empFormik?.errors?.city && <span className="text-danger">{empFormik?.errors?.city}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="address" className="form-label">Address</label>
                                        <input type="text" name="address" value={empFormik?.values?.address} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} className="form-control" id="address" aria-describedby="address" />
                                        {empFormik?.touched?.address && empFormik?.errors?.address && <span className="text-danger">{empFormik?.errors?.address}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="state" className="form-label">State</label>
                                        <select className="form-select" name="state" value={empFormik?.values.state} onChange={empFormik.handleChange} onBlur={empFormik?.handleBlur} id="state" aria-label="Default select example">
                                            <option value="">--select state</option>
                                            {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                                        </select>
                                        {empFormik?.touched?.state && empFormik?.errors?.state && <span className="text-danger">{empFormik?.errors?.state}</span>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="pinCode" className="form-label">Pincode</label>
                                        <input type="text" name="pinCode" value={empFormik?.values?.pinCode} onChange={(e) => checkPhoneNo(e?.target?.value, 6) && empFormik.handleChange(e)} className="form-control" id="pinCode" aria-describedby="pinCode" />
                                        {empFormik?.touched?.pinCode && empFormik?.errors?.pinCode && <span className="text-danger">{empFormik?.errors?.pinCode}</span>}
                                    </div>

                                    <div className="mb-5">
                                <div className="border-3 border-primary border-bottom">
                                    <div className="d-flex gap-3 justify-content-center text-primary text-center fs-4">
                                        <div className="">
                                                <h6 className="text-primary  fs-3">Document</h6>
                                            </div>
                                        <span onClick={() => setUploadingDocs(true)} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                                    </div>
                                </div>
                                <div className="row row-cols-1 row-cols-md-4  align-items-center">
                                    {empFormik?.values?.docs?.map((item,ind) => <div className="p-2">
                                    <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-100 rounded-3">
                                            <div className="w-100 d-flex justify-content-between py-2">
                                                <div onClick={() => handleRemoveDoc(ind)} className="text-danger fs-5 cursor-pointer"><MdOutlineCancel /></div>
                                                <div className="dropdown float-end cursor-pointer">
                                                    <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                    <ul className="dropdown-menu">
                                                        <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.url || item?.docURL) || "#!"}`} target="_blank">View</Link></div></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        <DocumentPreview url={ item?.url || item?.docURL} />
                                        <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                            <p className="fs-5 text-break text-capitalize text-center text-wrap">{item?.docName || item?.name}</p>
                                        </div>
                                    </div>
                                    </div> 
                                    )}
                                </div>
                            </div>
                                    <div className="d-flex  justify-content-center">
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