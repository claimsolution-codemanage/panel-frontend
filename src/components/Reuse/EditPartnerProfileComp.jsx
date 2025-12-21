import { allState } from "../../utils/constant"
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDateToISO } from "../../utils/helperFunction";
import { BsCameraFill } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { partnerType } from "../../utils/constant";
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader";
import { validateUploadFile } from "../../utils/helperFunction";
import { checkPhoneNo, checkNumber } from "../../utils/helperFunction";
import { getCheckStorage } from "../../utils/helperFunction";
import { useFormik } from "formik";
import { partnerBankInitialValue, partnerBankValidationSchema, partnerProfileInitialValue, partnerProfileValidationSchema } from "../../utils/validation";

export default function EditPartnerProfileComp({ getPartner, updateProfile, updateBanking, id, imageUpload, role }) {
    const param = useParams()
    const kycPhotoRef = useRef()
    const kycAadhaarRef = useRef()
    const kycAadhaarBackRef = useRef()
    const kycPanRef = useRef()
    const imgRef = useRef()
    const [loading, setLoading] = useState(true)
    const [uploadPhoto, setUploadPhoto] = useState({ status: 0, loading: false, message: "" })
    const [saving, setSaving] = useState(false)
    const [uploadBankDetailsPhoto, setUploaBankDetailsdPhoto] = useState({ type: "", status: 0, loading: false, message: "" })
    const gstRef = useRef()
    const chequeRef = useRef()
    const navigate = useNavigate()
    const location = useLocation()

    const handleBack = () => {
        if (location?.state?.filter && location?.state?.back) {
            navigate(location?.state?.back, { state: { ...location?.state, back: location?.pathname } });
        } else {
            navigate(-1)
        }
    };

    const dataFormik = useFormik({
        initialValues: partnerProfileInitialValue,
        validationSchema: partnerProfileValidationSchema,
        onSubmit: (values) => handleOnsubmit(values),
    });

    const bankFormik = useFormik({
        initialValues: partnerBankInitialValue,
        validationSchema: partnerBankValidationSchema,
        onSubmit: (values) => handleBankDetailsOnsubmit(values),
    });


    const fetchPartnerDetails = async () => {
        setLoading(true)
        try {
            const res = await getPartner(id)
            if (res?.data?.success && res?.data?.data?.profile) {
                dataFormik.setValues(res?.data?.data?.profile)
                bankFormik.setValues(res?.data?.data?.bankingDetails)
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
            fetchPartnerDetails()
        }
    }, [id])

    const handleImage = (e) => {
        imgRef.current.click()
    }

    const handleUploadFile = async (file, type) => {
        try {
            setUploadPhoto({ status: 1, type, loading: true, message: "uploading..." })
            const res = await imageUpload(file)
            dataFormik.setFieldValue(type, res?.data?.url)
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

    const handleOnsubmit = async (values) => {
        setLoading(true)
        try {
            const res = await updateProfile(id, values)
            if (res?.data?.success && res?.data) {
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

    const handleBankDetailsUploadFile = async (file, type) => {
        try {
            setUploaBankDetailsdPhoto({ status: 1, loading: true, type, message: "uploading..." })
            const res = await imageUpload(file)

            // setBankInfoImg((preval) => ({ ...preval, [type]: res?.data?.url }))
            bankFormik.setFieldValue(type, res?.data?.url)
            setUploaBankDetailsdPhoto({ status: 1, loading: false, type, message: "uploaded" })
            setTimeout(() => {
                setUploaBankDetailsdPhoto({ status: 0, loading: false, message: "" })
            }, 3000);
        } catch (error) {
            if (error && error?.response?.data?.message) {
                setUploaBankDetailsdPhoto({ status: 0, loading: false, type, message: error?.response?.data?.message })
            } else {
                setUploaBankDetailsdPhoto({ status: 0, loading: false, type, message: "Failed to upload file" })
            }
        }
    }

    const handleBankDetailsImgOnchange = async (e, type) => {
        const file = e.target.files[0];
        setUploaBankDetailsdPhoto({ status: 0, loading: true, type, message: "" })
        const result = validateUploadFile(e.target.files, 10, "image")
        if (!result?.success) {
            setUploaBankDetailsdPhoto({ status: 0, loading: false, type, message: result?.message })
        } else {
            handleBankDetailsUploadFile(result?.file, type)
        }
    }




    const handleBankDetailsOnsubmit = async (values) => {
        setSaving(true)
        try {
            const res = await updateBanking(id, { ...values })
            if (res?.data?.success && res?.data) {
                toast.success(res?.data?.message)
                setSaving(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setSaving(false)
            } else {
                toast.error("Something went wrong")
                setSaving(false)

            }
        }
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
                    </div>

                </div>
                <div className="m-2 m-md-5">
                    <div className="container-fluid color-4 p-0">
                        <div>
                            <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                                <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                    <div className="d-flex flex-column  align-items-center justify-content-center">
                                        <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} onClick={handleImage}>
                                            {dataFormik?.values?.profilePhoto ? <img src={getCheckStorage(dataFormik?.values?.profilePhoto)} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} /> : <BsCameraFill className="h2 text-white " />}
                                            <input type="file" name="profilePhoto" ref={imgRef} id="profilePhoto" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                        </div>
                                        {uploadPhoto.message && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-10">
                                    <h5 className="mt-3">About</h5>
                                    <div className="mb-3 col-12 w-75">
                                        <textarea class="form-control w-100" name="about" value={dataFormik?.values?.about} onBlur={dataFormik?.handleBlur} onChange={dataFormik?.handleChange} placeholder="About yourself" rows={5} cols={5} ></textarea>
                                    </div>
                                </div>

                            </div>

                            {/* profile details */}
                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                <div className="border-3 border-primary border-bottom py-2">
                                    <h6 className="text-primary fs-3">Profile Details</h6>
                                </div>
                                <div className="mt-5 row">
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="name" className="form-label">Name*</label>
                                        <input type="text" className="form-control" id="consultantName" name="consultantName" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.consultantName} disabled={role?.toLowerCase() === "partner"} onChange={(e) => role?.toLowerCase() !== "partner" && dataFormik.handleChange(e)}
                                            aria-describedby="consultantName" />
                                        {dataFormik?.touched?.consultantName && dataFormik?.errors?.consultantName && <p className="text-danger">{dataFormik?.errors?.consultantName}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="consultantCode" className="form-label">Consultant Code</label>
                                        <input type="text" name="consultantCode" value={dataFormik?.values?.consultantCode} onBlur={dataFormik?.handleBlur} disabled={true} className="form-control" id="consultantCode" aria-describedby="consultantCode" />
                                        {dataFormik?.touched?.consultantCode && dataFormik?.errors?.consultantCode && <p className="text-danger">{dataFormik?.errors?.consultantCode}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="associateWithUs" className="form-label">Associate with us</label>
                                        <input type="date" name="associateWithUs" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.associateWithUs ? formatDateToISO(dataFormik?.values?.associateWithUs) : ''} disabled={true} className="form-control" id="associateWithUs" aria-describedby="associateWithUs" />
                                        {dataFormik?.touched?.associateWithUs && dataFormik?.errors?.associateWithUs && <p className="text-danger">{dataFormik?.errors?.associateWithUs}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="primaryEmail" className="form-label">Primary Email Id</label>
                                        <input type="email" name="primaryEmail" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.primaryEmail} disabled={true} className="form-control" id="primaryEmail" aria-describedby="primaryEmail" />
                                        {dataFormik?.touched?.primaryEmail && dataFormik?.errors?.primaryEmail && <p className="text-danger">{dataFormik?.errors?.primaryEmail}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="alternateEmail" className="form-label">Alternative Email Id</label>
                                        <input type="email" name="alternateEmail" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.alternateEmail} onChange={dataFormik?.handleChange} className="form-control" id="alternateEmail" aria-describedby="alternateEmail" />
                                        {dataFormik?.touched?.alternateEmail && dataFormik?.errors?.alternateEmail && <p className="text-danger">{dataFormik?.errors?.alternateEmail}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="primaryMobileNo" className="form-label">Primary Mobile No</label>
                                        <input type="text" name="primaryMobileNo" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.primaryMobileNo} onChange={(e) => checkPhoneNo(e?.target?.value, 12) && role?.toLowerCase() !== "partner" && dataFormik.handleChange(e)} disabled={role?.toLowerCase() === "partner"} className="form-control" id="primaryMobileNo" aria-describedby="primaryMobileNo" />
                                        {dataFormik?.touched?.primaryMobileNo && dataFormik?.errors?.primaryMobileNo && <p className="text-danger">{dataFormik?.errors?.primaryMobileNo}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="alternateMobileNo" className="form-label">Alternative Mobile No</label>
                                        <input type="te;" name="alternateMobileNo" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.alternateMobileNo} onChange={(e) => checkPhoneNo(e?.target?.value) && dataFormik.handleChange(e)} className="form-control" id="alternateMobileNo" aria-describedby="alternateMobileNo" />
                                        {dataFormik?.touched?.alternateMobileNo && dataFormik?.errors?.alternateMobileNo && <p className="text-danger">{dataFormik?.errors?.alternateMobileNo}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="whatsupNo" className="form-label">Whatsapp No</label>
                                        <input type="tel" name="whatsupNo" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.whatsupNo} onChange={(e) => checkPhoneNo(e?.target?.value) && dataFormik.handleChange(e)} className="form-control" id="whatsupNo" aria-describedby="whatsupNo" />
                                        {dataFormik?.touched?.whatsupNo && dataFormik?.errors?.whatsupNo && <p className="text-danger">{dataFormik?.errors?.whatsupNo}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="dob" className="form-label">DOB</label>
                                        <input type="date" name="dob" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.dob ? formatDateToISO(dataFormik?.values?.dob) : ''} onChange={dataFormik?.handleChange} className="form-control" id="dob" aria-describedby="dob" />
                                        {dataFormik?.touched?.dob && dataFormik?.errors?.dob && <p className="text-danger">{dataFormik?.errors?.dob}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="aadhaarNo" className="form-label">Aadhaar No</label>
                                        <input type="text" name="aadhaarNo" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.aadhaarNo} onChange={(e) => checkPhoneNo(e?.target?.value, 12) && dataFormik.handleChange(e)} className="form-control" id="aadhaarNo" aria-describedby="aadhaarNo" />
                                        {dataFormik?.touched?.aadhaarNo && dataFormik?.errors?.aadhaarNo && <p className="text-danger">{dataFormik?.errors?.aadhaarNo}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="gender" className="form-label">Gender</label>
                                        <select className="form-select" name="gender" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.gender} onChange={dataFormik?.handleChange} id="gender" aria-label="Default select example">
                                            <option value="">--select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {dataFormik?.touched?.gender && dataFormik?.errors?.gender && <p className="text-danger">{dataFormik?.errors?.gender}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="areaOfOperation" className="form-label">Area of Operation</label>
                                        <input type="text" name="areaOfOperation" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.areaOfOperation} onChange={dataFormik?.handleChange} className="form-control" id="areaOfOperation" aria-describedby="areaOfOperation" />
                                        {dataFormik?.touched?.areaOfOperation && dataFormik?.errors?.areaOfOperation && <p className="text-danger">{dataFormik?.errors?.areaOfOperation}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="areaOfOperation" className="form-label">Work Association</label>
                                        <select className="form-select" name="workAssociation" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.workAssociation} onChange={dataFormik?.handleChange} aria-label="Default select example">
                                            <option>--select Partner Type</option>
                                            {partnerType?.map(partner => <option key={partner} value={partner}>{partner}</option>)}
                                        </select>
                                        {dataFormik?.touched?.workAssociation && dataFormik?.errors?.workAssociation && <p className="text-danger">{dataFormik?.errors?.workAssociation}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="district" className="form-label">District</label>
                                        <input type="text" name="district" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.district} onChange={dataFormik?.handleChange} className="form-control" id="district" aria-describedby="district" />
                                        {dataFormik?.touched?.district && dataFormik?.errors?.district && <p className="text-danger">{dataFormik?.errors?.district}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="city" className="form-label">City</label>
                                        <input type="text" name="city" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.city} onChange={dataFormik?.handleChange} className="form-control" id="city" aria-describedby="city" />
                                        {dataFormik?.touched?.city && dataFormik?.errors?.city && <p className="text-danger">{dataFormik?.errors?.city}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="address" className="form-label">Address</label>
                                        <input type="text" name="address" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.address} onChange={dataFormik?.handleChange} className="form-control" id="address" aria-describedby="address" />
                                        {dataFormik?.touched?.address && dataFormik?.errors?.address && <p className="text-danger">{dataFormik?.errors?.address}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="state" className="form-label">State</label>
                                        <select className="form-select" name="state" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.state} onChange={dataFormik?.handleChange} id="state" aria-label="Default select example">
                                            <option value="">--select state</option>
                                            {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                                        </select>
                                        {dataFormik?.touched?.state && dataFormik?.errors?.state && <p className="text-danger">{dataFormik?.errors?.state}</p>}
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="pinCode" className="form-label">Pincode</label>
                                        <input type="text" name="pinCode" onBlur={dataFormik?.handleBlur} value={dataFormik?.values?.pinCode} onChange={(e) => checkPhoneNo(e?.target?.value, 6) && dataFormik.handleChange(e)} className="form-control" id="pinCode" aria-describedby="pinCode" />
                                        {dataFormik?.touched?.pinCode && dataFormik?.errors?.pinCode && <p className="text-danger">{dataFormik?.errors?.pinCode}</p>}
                                    </div>

                                    <div>
                                        <div className="border-3 border-primary border-bottom py-2">
                                            <h6 className="text-primary  fs-3">Professional Details</h6>
                                        </div>
                                        <div className="row row-cols-1 row-cols-md-3">
                                            <div className="mb-3">
                                                <label for="companyName" className="form-label">Working Company Name</label>
                                                <input type="text" name="companyName" value={dataFormik?.values?.companyName} onChange={dataFormik?.handleChange} onBlur={dataFormik?.handleBlur} className="form-control" id="companyName" aria-describedby="companyName" />
                                                {dataFormik?.touched?.companyName && dataFormik?.errors?.companyName && <p className="text-danger">{dataFormik?.errors?.companyName}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label for="companyAddress" className="form-label">working company address</label>
                                                <input type="text" name="companyAddress" value={dataFormik?.values?.companyAddress} onChange={dataFormik?.handleChange} onBlur={dataFormik?.handleBlur} className="form-control" id="companyAddress" aria-describedby="companyAddress" />
                                                {dataFormik?.touched?.companyAddress && dataFormik?.errors?.companyAddress && <p className="text-danger">{dataFormik?.errors?.companyAddress}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label for="officalContactNo" className="form-label">Offical contact no.</label>
                                                <input type="text" name="officalContactNo" value={dataFormik?.values?.officalContactNo} onChange={(e) => checkPhoneNo(e?.target?.value, 10) && dataFormik.handleChange(e)} onBlur={dataFormik?.handleBlur} className="form-control" id="officalContactNo" aria-describedby="officalContactNo" />
                                                {dataFormik?.touched?.officalContactNo && dataFormik?.errors?.officalContactNo && <p className="text-danger">{dataFormik?.errors?.officalContactNo}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label for="officalEmailId" className="form-label">Offical email id</label>
                                                <input type="email" name="officalEmailId" value={dataFormik?.values?.officalEmailId} onChange={dataFormik?.handleChange} onBlur={dataFormik?.handleBlur} className="form-control" id="officalEmailId" aria-describedby="officalEmailId" />
                                                {dataFormik?.touched?.officalEmailId && dataFormik?.errors?.officalEmailId && <p className="text-danger">{dataFormik?.errors?.officalEmailId}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* kyc details */}
                                    <div>
                                        <div className="border-3 border-primary border-bottom py-2">
                                            <h6 className="text-primary  fs-3">KYC Details</h6>
                                        </div>
                                        <div className="m-0 row row-cols-12 row-cols-md-4">
                                            <div className="my-3 d-flex gap-2 flex-column">
                                                <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                    <label htmlFor="kycPhoto" className="form-label text-break">Photo {(uploadPhoto.message && uploadPhoto.type == "kycPhoto") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                    <div className='btn btn-primary' onClick={() => kycPhotoRef.current.click()}>Upload</div>
                                                </div>
                                                {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(dataFormik?.values?.kycPhoto) ? getCheckStorage(dataFormik?.values?.kycPhoto) : "/Images/upload.jpeg"} alt="kycPhoto" />}
                                                <input type="file" name="kycPhoto" ref={kycPhotoRef} id="kycPhoto" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                            </div>
                                            <div className="my-3 d-flex gap-2 flex-column">
                                                <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                    <label htmlFor="kycAadhaar" className="form-label text-break">Aadhaar Front {(uploadPhoto.message && uploadPhoto.type == "kycAadhaar") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                    <div className='btn btn-primary' onClick={() => kycAadhaarRef.current.click()}>Upload</div>
                                                </div>
                                                {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(dataFormik?.values?.kycAadhaar) ? getCheckStorage(dataFormik?.values?.kycAadhaar) : "/Images/upload.jpeg"} alt="kycAadhaar" />}
                                                <input type="file" name="kycAadhaar" ref={kycAadhaarRef} id="kycAadhaar" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                            </div>
                                            <div className="my-3 d-flex gap-2 flex-column">
                                                <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                    <label htmlFor="kycAadhaarBack" className="form-label text-break">Aadhaar Back{(uploadPhoto.message && uploadPhoto.type == "kycAadhaarBack") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                    <div className='btn btn-primary' onClick={() => kycAadhaarBackRef.current.click()}>Upload</div>
                                                </div>
                                                {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(dataFormik?.values?.kycAadhaarBack) ? getCheckStorage(dataFormik?.values?.kycAadhaarBack) : "/Images/upload.jpeg"} alt="kycAadhaarBack" />}
                                                <input type="file" name="kycAadhaarBack" ref={kycAadhaarBackRef} id="kycAadhaarBack" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                            </div>
                                            <div className="my-3 d-flex gap-2 flex-column">
                                                <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                    <label htmlFor="kycPan" className="form-label text-break">PAN Card{(uploadPhoto.message && uploadPhoto.type == "kycPan") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                    <div className='btn btn-primary' onClick={() => kycPanRef.current.click()}>Upload</div>
                                                </div>
                                                {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(dataFormik?.values?.kycPan) ? getCheckStorage(dataFormik?.values?.kycPan) : "/Images/upload.jpeg"} alt="kycPan" />}
                                                <input type="file" name="kycPan" ref={kycPanRef} id="kycPan" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex  justify-content-center">
                                        <div onClick={dataFormik.handleSubmit} aria-disabled={loading || uploadPhoto.loading} className={loading || uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "}>
                                            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* edit bank details */}
                            {role?.toLowerCase() !== "partner" &&
                                <div className="">
                                    <div className="container-fluid color-4 p-0">
                                        <div className="color-4 bg-color-7">
                                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                <div className="border-3 border-primary border-bottom py-2">
                                                    <h6 className="text-primary  fs-3">Banking Details</h6>
                                                </div>
                                                <div>
                                                    <div className="row mt-5">
                                                        <div className="mb-3 col-12 col-md-4">
                                                            <label for="bankName" className="form-label">Bank Name*</label>
                                                            <input type="text" className="form-control" id="bankName" name="bankName" value={bankFormik?.values?.bankName} onChange={bankFormik?.handleChange} onBlur={bankFormik?.handleBlur} />
                                                            {bankFormik?.touched?.bankName && bankFormik?.errors?.bankName && <p className="text-danger">{bankFormik?.errors?.bankName}</p>}
                                                        </div>
                                                        <div className="mb-3 col-12 col-md-4">
                                                            <label for="bankAccountNo" className="form-label">Bank Account No*</label>
                                                            <input type="text" className="form-control" id="bankAccountNo" name="bankAccountNo" value={bankFormik?.values?.bankAccountNo} onChange={(e) => checkNumber(e) && bankFormik?.handleChange(e)} onBlur={bankFormik?.handleBlur} />
                                                            {bankFormik?.touched?.bankAccountNo && bankFormik?.errors?.bankAccountNo && <p className="text-danger">{bankFormik?.errors?.bankAccountNo}</p>}
                                                        </div>
                                                        <div className="mb-3 col-12 col-md-4">
                                                            <label for="bankBranchName" className="form-label">Bank Branch Name*</label>
                                                            <input type="text" className="form-control" id="bankBranchName" name="bankBranchName" value={bankFormik?.values?.bankBranchName} onChange={bankFormik?.handleChange} onBlur={bankFormik?.handleBlur} />
                                                            {bankFormik?.touched?.bankBranchName && bankFormik?.errors?.bankBranchName && <p className="text-danger">{bankFormik?.errors?.bankBranchName}</p>}
                                                        </div>
                                                        <div className="mb-3 col-12 col-md-4">
                                                            <label for="gstNo" className="form-label">GST No</label>
                                                            <input type="text" className="form-control" id="gstNo" name="gstNo" value={bankFormik?.values?.gstNo} onChange={bankFormik?.handleChange} onBlur={bankFormik?.handleBlur} />
                                                            {bankFormik?.touched?.gstNo && bankFormik?.errors?.gstNo && <p className="text-danger">{bankFormik?.errors?.gstNo}</p>}
                                                        </div>
                                                        <div className="mb-3 col-12 col-md-4">
                                                            <label for="panNo" className="form-label">PAN NO*</label>
                                                            <input type="text" className="form-control" id="panNo" name="panNo" value={bankFormik?.values?.panNo} onChange={bankFormik?.handleChange} onBlur={bankFormik?.handleBlur} />
                                                            {bankFormik?.touched?.panNo && bankFormik?.errors?.panNo && <p className="text-danger">{bankFormik?.errors?.panNo}</p>}
                                                        </div>
                                                        <div className="mb-3 col-12 col-md-4">
                                                            <label for="panNo" className="form-label">IFSC Code*</label>
                                                            <input type="text" className="form-control" id="ifscCode" name="ifscCode" value={bankFormik?.values?.ifscCode} onChange={bankFormik?.handleChange} onBlur={bankFormik?.handleBlur} />
                                                            {bankFormik?.touched?.ifscCode && bankFormik?.errors?.ifscCode && <p className="text-danger">{bankFormik?.errors?.ifscCode}</p>}
                                                        </div>
                                                        <div className="mb-3 col-12 col-md-4">
                                                            <label for="panNo" className="form-label">UPI ID/ Number</label>
                                                            <input type="text" className="form-control" id="upiId" name="upiId" value={bankFormik?.values?.upiId} onChange={bankFormik?.handleChange} onBlur={bankFormik?.handleBlur} />
                                                            {bankFormik?.touched?.upiId && bankFormik?.errors?.upiId && <p className="text-danger">{bankFormik?.errors?.upiId}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="row row-cols-1 row-cols-2">
                                                        <div className="mb-3 d-flex flex-column">
                                                            <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                                <label for="chequeImg" className="form-label">Cancelled Cheque {(uploadBankDetailsPhoto.message && uploadBankDetailsPhoto.type == "cancelledChequeImg") && <span className={uploadBankDetailsPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadBankDetailsPhoto.message}</span>}</label>
                                                                <div className='btn btn-primary' onClick={() => chequeRef.current.click()}>Upload</div>
                                                            </div>
                                                            {<img style={{ height: 250, }} className="border rounded-2" src={bankFormik?.values?.cancelledChequeImg ? getCheckStorage(bankFormik?.values?.cancelledChequeImg) : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                                            <input type="file" name="chequeImg" ref={chequeRef} id="profilePhoto" hidden={true} onChange={(e) => handleBankDetailsImgOnchange(e, "cancelledChequeImg")} />
                                                            {bankFormik?.touched?.chequeImg && bankFormik?.errors?.chequeImg && <p className="text-danger">{bankFormik?.errors?.chequeImg}</p>}

                                                        </div>

                                                        <div className="mb-3 d-flex flex-column">
                                                            <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                                <label for="gstImg" className="form-label">GST Copy {(uploadBankDetailsPhoto.message && uploadBankDetailsPhoto.type == "gstCopyImg") && <span className={uploadBankDetailsPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadBankDetailsPhoto.message}</span>}</label>
                                                                <div className='btn btn-primary' onClick={() => gstRef.current.click()}>Upload</div>
                                                            </div>

                                                            {<img style={{ height: 250, }} className="border rounded-2" src={bankFormik?.values?.gstCopyImg ? getCheckStorage(bankFormik?.values?.gstCopyImg) : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                                            <input type="file" name="gstImg" ref={gstRef} id="profilePhoto" hidden={true} onChange={(e) => handleBankDetailsImgOnchange(e, "gstCopyImg")} />
                                                            {bankFormik?.touched?.gstImg && bankFormik?.errors?.gstImg && <p className="text-danger">{bankFormik?.errors?.gstImg}</p>}

                                                        </div>
                                                    </div>
                                                    <div className="d-flex  justify-content-center">
                                                        <div onClick={bankFormik.handleSubmit} aria-disabled={loading || uploadBankDetailsPhoto.loading} className={loading || uploadBankDetailsPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "}>
                                                            {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>}

                        </div>
                    </div>
                </div>
            </div>}
    </>)
}