import {  allStateOptions, empDepartmentOptions, empDesignationOptions, genderOptions } from "../../utils/constant"
import "react-image-upload/dist/index.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BsCameraFill } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../Common/loader";
import { validateUploadFile } from "../../utils/helperFunction";
import { getCheckStorage } from "../../utils/helperFunction";
import { useFormik } from "formik";
import { empInitialValues, empValidationSchema } from "../../utils/validation";
import DocumentPreview from "../DocumentPreview";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import AddNewCaseDocsModal from "../Common/Modal/addNewCaseDoc";
import FormInputField from "../Common/form/FormInput";
import FormPhoneInputField from "../Common/form/FormPhoneInput";
import FormSelectField from "../Common/form/FormSelectField";
import FormDateInputField from "../Common/form/FormDateInputField";
import FormNumberInputField from "../Common/form/FormNumberInputField";
import FormEmpSelectField from "../Common/form/FormEmpSelect";

export default function EditEmployeeComp({ getProfile, updateProfile,getEmpListApi, imageUpload, id, attachementUpload,joiningFormUrl }) {
    const param = useParams()
    const imgRef = useRef()
    const [loading, setLoading] = useState(true)
    const [uploadPhoto, setUploadPhoto] = useState({ status: 0, loading: false, message: "" })
    const navigate = useNavigate()
    const location = useLocation()
    const [uploadingDocs, setUploadingDocs] = useState(false)

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            const payload = {
            ...values,
            headEmpId:values?.headEmpId?.value,
            managerId:values?.managerId?.value,
        }
            const res = await updateProfile(id, payload)
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
                let headEmpDetails = res?.data?.data?.headEmpDetails
                let managerDetails = res?.data?.data?.managerDetails
                
                if(headEmpDetails) empFormik.setFieldValue("headEmpId",{label:`${headEmpDetails?.fullName} | ${headEmpDetails?.branchId} | ${headEmpDetails?.type} | ${headEmpDetails?.designation}`,value:headEmpDetails?._id})
                if(managerDetails) empFormik.setFieldValue("managerId",{label:`${managerDetails?.fullName} | ${managerDetails?.branchId} | ${managerDetails?.type} | ${managerDetails?.designation}`,value:managerDetails?._id})

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

    const handleRemoveDoc =(id)=>{
        const filterDoc = empFormik?.values?.docs.filter((item,ind)=>ind!=id)
        empFormik?.setFieldValue("docs",filterDoc)
    }

    const handleDocsUploading = (payload) => {
        const docs = empFormik?.values?.docs || []
        empFormik?.setFieldValue("docs",[...docs,...payload?.map(ele=>{return {...ele,new:true}})])
    }

    const handleEmpOptionsList = (limit = 10, page = 1, inputValue = "") => {
        return getEmpListApi(limit, page, inputValue, true)
    }

    console.log("emp",empFormik?.values);
    

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
                                </div>

                            </div>


                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                <div className="border-3 border-primary border-bottom py-2">
                                    <h6 className="text-primary fs-3">Profile Details</h6>
                                </div>
                                <div className="mt-5 row row-cols-1 row-cols-md-3">
                                    <FormInputField name="fullName" type="text" label="Full name" formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormInputField name="email" type="email" label="Email" disable={true} formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormPhoneInputField name="mobileNo" label="Mobile No" formik={empFormik} handleOnChange={(e, name) => empFormik.setFieldValue(name, e)} />
                                    <FormInputField name="branchId" type="text" label="Employee branch ID" formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormSelectField name="type" label="Department" options={empDepartmentOptions} formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormSelectField name="designation" label="Designation" options={empDesignationOptions} formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormEmpSelectField getEmpList={handleEmpOptionsList} name="managerId" label="Manager of employee" formik={empFormik} handleOnChange={(e, name) => empFormik.setFieldValue(name, e)} />
                                    <FormEmpSelectField getEmpList={handleEmpOptionsList} name="headEmpId" label="Head of employee" formik={empFormik} handleOnChange={(e, name) => empFormik.setFieldValue(name, e)} />
                                    <FormInputField name="bankName" type="text" label="Bank name"  formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormInputField name="bankBranchName" type="text" label="Bank branch name"  formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormInputField name="bankAccountNo" type="text" label="Bank account no."  formik={empFormik} handleOnChange={(e, name) => !isNaN(e?.target?.value) && empFormik.handleChange(e)} />
                                    <FormInputField name="panNo" type="text" label="PAN no"  formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormDateInputField name="dob" type="date" label="DOB"  formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormSelectField name="gender" label="Gender" options={genderOptions} formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormInputField name="district" type="text" label="District"  formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormInputField name="city" type="text" label="City"  formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormInputField name="address" type="text" label="Address"  formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormNumberInputField name="pinCode" type="text" label="Pincode" digit={6} formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
                                    <FormSelectField name="state" label="State" options={allStateOptions} formik={empFormik} handleOnChange={(e, name) => empFormik.handleChange(e)} />
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
                                        <div onClick={empFormik.handleSubmit} aria-disabled={loading || uploadPhoto.loading} className={loading || uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} >
                                            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
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