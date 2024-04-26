import { allState } from "../../utils/constant"
import "react-image-upload/dist/index.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPartnerProfile, employeeGetPartnerById, employeeUpdatePartnerProfile, employeeUpdatePartnerBankingDetails } from "../../apis";
import { formatDateToISO } from "../../utils/helperFunction";
import { BsCameraFill } from 'react-icons/bs'
import { adminGetPartnerById, adminUpdatePartnerProfile, adminUpdatePartnerBankingDetails } from "../../apis";
import { toast } from 'react-toastify'
import { partnerType } from "../../utils/constant";
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader";
import { partnerImageUpload, employeeImageUpload, adminImageUpload } from "../../apis/upload";
import { validateUploadFile } from "../../utils/helperFunction";
import { API_BASE_IMG } from "../../apis/upload";
import { checkPhoneNo, checkNumber } from "../../utils/helperFunction";
import { getCheckStorage } from "../../utils/helperFunction";

export default function EditPartnerProfileComp({ getPartner, updateProfile, updateBanking, id, imageUpload, role }) {
    const param = useParams()
    const kycPhotoRef = useRef()
    const kycAadhaarRef = useRef()
    const kycAadhaarBackRef = useRef()
    const kycPanRef = useRef()
    const [bankInfoImg, setBankInfoImg] = useState({ cancelledChequeImg: "", gstCopyImg: "", })
    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        bankAccountNo: "",
        bankBranchName: "",
        gstNo: "",
        panNo: "",
        ifscCode: "",
        upiId: "",
        cancelledChequeImg: "",
        gstCopyImg: "",
    })
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

    })
    const imgRef = useRef()
    const [loading, setLoading] = useState(true)
    const [uploadPhoto, setUploadPhoto] = useState({ status: 0, loading: false, message: "" })
    const [saving, setSaving] = useState(false)
    const [uploadBankDetailsPhoto, setUploaBankDetailsdPhoto] = useState({ type: "", status: 0, loading: false, message: "" })
    const gstRef = useRef()
    const chequeRef = useRef()
    const navigate = useNavigate()

    console.log("bankDetails", bankDetails);

    useEffect(() => {
        if (id) {
            async function fetch() {
                setLoading(true)
                try {
                    const res = await getPartner(id)
                    // console.log("partner",res?.data?.data?.profile);
                    if (res?.data?.success && res?.data?.data?.profile) {

                        setData({ ...res?.data?.data?.profile })
                        setBankDetails({ ...res?.data?.data?.bankingDetails })
                        if (res?.data?.data?.bankingDetails) {
                            setBankInfoImg({ cancelledChequeImg: res?.data?.data?.bankingDetails?.cancelledChequeImg, gstCopyImg: res?.data?.data?.bankingDetails?.gstCopyImg, })
                        }
                        setLoading(false)

                    }
                } catch (error) {
                    if (error && error?.response?.data?.message) {
                        toast.error(error?.response?.data?.message)
                    } else {
                        toast.error("Something went wrong")
                    }
                }
            } fetch()
        }
    }, [id])

    const handleImage = (e) => {
        imgRef.current.click()
    }

    const handleUploadFile = async (file, type) => {
        try {

            // console.log("files efs", file);
            setUploadPhoto({ status: 1,type, loading: true, message: "uploading..." })
            const res = await imageUpload(file)
            // setData((data) => ({ ...data, profilePhoto: res?.data?.url }))
            setData((data) => ({ ...data, [type]: res?.data?.url }))
            setUploadPhoto({ status: 1,type, loading: false, message: "uploaded" })
            setTimeout(() => {
                setUploadPhoto({ status: 0,type, loading: false, message: "" })
            }, 3000);
        } catch (error) {
            if (error && error?.response?.data?.message) {
                setUploadPhoto({ status: 0, loading: false,type, message: error?.response?.data?.message })
            }else{
                setUploadPhoto({ status: 0, loading: false,type, message: "Failed to upload file" })
            }

            // console.log("upload error:", error);
        }
    }


    const handleImgOnchange = async (e, type) => {
        setUploadPhoto({ status: 0, type, loading: true, message: "" })
        const result = validateUploadFile(e.target.files, 5, "image")
        if (!result?.success) {
            setUploadPhoto({ status: 0, type, loading: false, message: result?.message })
        } else {
            // console.log("result?.file", result?.file);
            handleUploadFile(result?.file, type)
        }
    }



    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleOnsubmit = async (e) => {
        e.preventDefault()
        // console.log("data",data);
        setLoading(true)
        try {
            const res = await updateProfile(id, data)
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

    const handlebankDetailsOnchange = (e) => {
        const { name, value } = e.target
        setBankDetails({ ...bankDetails, [name]: value })
    }

    console.log("uploading", uploadBankDetailsPhoto);

    const handleBankDetailsUploadFile = async (file, type) => {
        try {

            // console.log("files efs", file);
            setUploaBankDetailsdPhoto({ status: 1, loading: true, type, message: "uploading..." })
            const res = await imageUpload(file)

            setBankInfoImg((preval) => ({ ...preval, [type]: res?.data?.url }))
            setUploaBankDetailsdPhoto({ status: 1, loading: false, type, message: "uploaded" })
            setTimeout(() => {
                setUploaBankDetailsdPhoto({ status: 0, loading: false, message: "" })
            }, 3000);
        } catch (error) {
            if (error && error?.response?.data?.message) {
                setUploaBankDetailsdPhoto({ status: 0, loading: false,type, message: error?.response?.data?.message })
            } else {
                setUploaBankDetailsdPhoto({ status: 0, loading: false,type, message: "Failed to upload file" })
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




    const handleBankDetailsOnsubmit = async (e) => {
        e.preventDefault()
        // console.log("data", data);
        setSaving(true)
        try {
            const res = await updateBanking(id, { ...bankDetails, ...bankInfoImg })
            // console.log("partner", res?.data);
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
                        <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
                        <div className="d-flex flex align-items-center gap-1">
                            <span>Edit Profile</span>
                            {/* <span><LuPcCase /></span> */}
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
                                            {data.profilePhoto ? <img src={getCheckStorage(data.profilePhoto)} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} /> : <BsCameraFill className="h2 text-white " />}
                                            <input type="file" name="profilePhoto" ref={imgRef} id="profilePhoto" hidden={true} onChange={(e) => handleImgOnchange(e,e?.target?.name)} />
                                        </div>
                                        {uploadPhoto.message && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-10">
                                    <h5 className="mt-3">About</h5>
                                    <div className="mb-3 col-12 w-75">
                                        {/* <label for="mobileNo." className="form-label">About you</label> */}
                                        <textarea class="form-control w-100" name="about" value={data.about} onChange={handleOnchange} placeholder="About yourself" rows={5} cols={5} ></textarea>
                                    </div>
                                </div>

                            </div>


                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                <div className="border-3 border-primary border-bottom py-2">
                                    <h6 className="text-primary fs-3">Profile Details</h6>
                                </div>
                                <div className="mt-5 row">
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="name" className="form-label">Name*</label>
                                        <input type="text" className="form-control" id="consultantName" name="consultantName" value={data.consultantName} disabled={role?.toLowerCase() === "partner"} onChange={(e) => role?.toLowerCase() !== "partner" && handleOnchange(e)}
                                            aria-describedby="consultantName" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="consultantCode" className="form-label">Consultant Code</label>
                                        <input type="text" name="consultantCode" value={data.consultantCode} disabled={true} className="form-control" id="consultantCode" aria-describedby="consultantCode" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="associateWithUs" className="form-label">Associate with us</label>
                                        <input type="date" name="associateWithUs" value={data.associateWithUs ? formatDateToISO(data.associateWithUs) : ''} disabled={true} className="form-control" id="associateWithUs" aria-describedby="associateWithUs" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="primaryEmail" className="form-label">Primary Email Id</label>
                                        <input type="email" name="primaryEmail" value={data.primaryEmail} disabled={true} className="form-control" id="primaryEmail" aria-describedby="primaryEmail" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="alternateEmail" className="form-label">Alternative Email Id</label>
                                        <input type="email" name="alternateEmail" value={data.alternateEmail} onChange={handleOnchange} className="form-control" id="alternateEmail" aria-describedby="alternateEmail" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="primaryMobileNo" className="form-label">Primary Mobile No</label>
                                        <input type="text" name="primaryMobileNo" value={data.primaryMobileNo} onChange={(e) => checkPhoneNo(e?.target?.value, 12) && role?.toLowerCase() !== "partner" && handleOnchange(e)} disabled={role?.toLowerCase() === "partner"} className="form-control" id="primaryMobileNo" aria-describedby="primaryMobileNo" />
                                    </div>


                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="alternateMobileNo" className="form-label">Alternative Mobile No</label>
                                        <input type="te;" name="alternateMobileNo" value={data.alternateMobileNo} onChange={(e) => checkPhoneNo(e?.target?.value) && handleOnchange(e)} className="form-control" id="alternateMobileNo" aria-describedby="alternateMobileNo" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="whatsupNo" className="form-label">Whatsapp No</label>
                                        <input type="tel" name="whatsupNo" value={data.whatsupNo} onChange={(e) => checkPhoneNo(e?.target?.value) && handleOnchange(e)} className="form-control" id="whatsupNo" aria-describedby="whatsupNo" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="dob" className="form-label">DOB</label>
                                        <input type="date" name="dob" value={data.dob ? formatDateToISO(data.dob) : ''} onChange={handleOnchange} className="form-control" id="dob" aria-describedby="dob" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="panNo" className="form-label">PAN No</label>
                                        <input type="text" name="panNo" value={data.panNo} onChange={handleOnchange} className="form-control" id="panNo" aria-describedby="panNo" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="aadhaarNo" className="form-label">Aadhaar No</label>
                                        <input type="text" name="aadhaarNo" value={data.aadhaarNo} onChange={(e) => checkNumber(e) && handleOnchange(e)} className="form-control" id="aadhaarNo" aria-describedby="aadhaarNo" />
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="gender" className="form-label">Gender</label>
                                        <select className="form-select" name="gender" value={data.gender} onChange={handleOnchange} id="gender" aria-label="Default select example">
                                            <option value="">--select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="areaOfOperation" className="form-label">Area of Operation</label>
                                        <input type="text" name="areaOfOperation" value={data.areaOfOperation} onChange={handleOnchange} className="form-control" id="areaOfOperation" aria-describedby="areaOfOperation" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="areaOfOperation" className="form-label">Work Association</label>
                                        <select className="form-select" name="workAssociation" value={data.workAssociation} onChange={handleOnchange} aria-label="Default select example">
                                            <option>--select Partner Type</option>
                                            {partnerType?.map(partner => <option key={partner} value={partner}>{partner}</option>)}
                                        </select>
                                    </div>

                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="district" className="form-label">District</label>
                                        <input type="text" name="district" value={data.district} onChange={handleOnchange} className="form-control" id="district" aria-describedby="district" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="city" className="form-label">City</label>
                                        <input type="text" name="city" value={data.city} onChange={handleOnchange} className="form-control" id="city" aria-describedby="city" />
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="state" className="form-label">State</label>
                                        <select className="form-select" name="state" value={data.state} onChange={handleOnchange} id="state" aria-label="Default select example">
                                            <option value="">--select state</option>
                                            {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3 col-12 col-md-4">
                                        <label for="pinCode" className="form-label">Pincode</label>
                                        <input type="text" name="pinCode" value={data.pinCode} onChange={(e) => checkNumber(e) && handleOnchange(e)} className="form-control" id="pinCode" aria-describedby="pinCode" />
                                    </div>
                                  
                                    <div className="border-3 border-primary border-bottom py-2">
                                        <h6 className="text-primary  fs-3">KYC Details</h6>
                                    </div>
                                    <div className="m-0 row row-cols-12 row-cols-md-4">
                                        <div className="my-3 d-flex gap-2 flex-column">
                                            <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                <label htmlFor="kycPhoto" className="form-label text-break">Photo {(uploadPhoto.message && uploadPhoto.type == "kycPhoto") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                <div className='btn btn-primary' onClick={() => kycPhotoRef.current.click()}>Upload</div>
                                            </div>
                                            {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(data?.kycPhoto) ? getCheckStorage(data?.kycPhoto) : "/Images/upload.jpeg"} alt="kycPhoto" />}
                                            <input type="file" name="kycPhoto" ref={kycPhotoRef} id="kycPhoto" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                        </div>
                                        <div className="my-3 d-flex gap-2 flex-column">
                                            <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                <label htmlFor="kycAadhaar" className="form-label text-break">Aadhaar Front {(uploadPhoto.message && uploadPhoto.type == "kycAadhaar") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                <div className='btn btn-primary' onClick={() => kycAadhaarRef.current.click()}>Upload</div>
                                            </div>
                                            {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(data?.kycAadhaar) ? getCheckStorage(data?.kycAadhaar) : "/Images/upload.jpeg"} alt="kycAadhaar" />}
                                            <input type="file" name="kycAadhaar" ref={kycAadhaarRef} id="kycAadhaar" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                        </div>
                                        <div className="my-3 d-flex gap-2 flex-column">
                                            <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                <label htmlFor="kycAadhaarBack" className="form-label text-break">Aadhaar Back{(uploadPhoto.message && uploadPhoto.type == "kycAadhaarBack") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                <div className='btn btn-primary' onClick={() => kycAadhaarBackRef.current.click()}>Upload</div>
                                            </div>
                                            {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(data?.kycAadhaarBack) ? getCheckStorage(data?.kycAadhaarBack) : "/Images/upload.jpeg"} alt="kycAadhaarBack" />}
                                            <input type="file" name="kycAadhaarBack" ref={kycAadhaarBackRef} id="kycAadhaarBack" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                        </div>
                                        <div className="my-3 d-flex gap-2 flex-column">
                                            <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                <label htmlFor="kycPan" className="form-label text-break">PAN Card{(uploadPhoto.message && uploadPhoto.type == "kycPan") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                <div className='btn btn-primary' onClick={() => kycPanRef.current.click()}>Upload</div>
                                            </div>
                                            {<img style={{ height: '200px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(data?.kycPan) ? getCheckStorage(data?.kycPan) : "/Images/upload.jpeg"} alt="kycPan" />}
                                            <input type="file" name="kycPan" ref={kycPanRef} id="kycPan" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                        </div>
                                    </div>
                                    


                                    <div className="d-flex  justify-content-center">
                                        <div aria-disabled={loading || uploadPhoto.loading} className={loading || uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} onClick={handleOnsubmit}>
                                            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}

                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* edit bank details */}
                            {role?.toLowerCase()!=="partner" && 
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
                                                        <input type="text" className="form-control" id="bankName" name="bankName" value={bankDetails?.bankName} onChange={handlebankDetailsOnchange} />
                                                        {/* <div id="nameHelp" className="form-text text-danger">We'll never share your email with anyone else.</div> */}
                                                    </div>
                                                    <div className="mb-3 col-12 col-md-4">
                                                        <label for="bankAccountNo" className="form-label">Bank Account No*</label>
                                                        <input type="text" className="form-control" id="bankAccountNo" name="bankAccountNo" value={bankDetails?.bankAccountNo} onChange={(e) => checkNumber(e) && handlebankDetailsOnchange(e)} />
                                                    </div>
                                                    <div className="mb-3 col-12 col-md-4">
                                                        <label for="bankBranchName" className="form-label">Bank Branch Name*</label>
                                                        <input type="text" className="form-control" id="bankBranchName" name="bankBranchName" value={bankDetails?.bankBranchName} onChange={handlebankDetailsOnchange} />
                                                    </div>
                                                    <div className="mb-3 col-12 col-md-4">
                                                        <label for="gstNo" className="form-label">GST No</label>
                                                        <input type="text" className="form-control" id="gstNo" name="gstNo" value={bankDetails?.gstNo} onChange={handlebankDetailsOnchange} />
                                                    </div>
                                                    <div className="mb-3 col-12 col-md-4">
                                                        <label for="panNo" className="form-label">PAN NO*</label>
                                                        <input type="text" className="form-control" id="panNo" name="panNo" value={bankDetails?.panNo} onChange={handlebankDetailsOnchange} />
                                                    </div>
                                                    <div className="mb-3 col-12 col-md-4">
                                                        <label for="panNo" className="form-label">IFSC Code*</label>
                                                        <input type="text" className="form-control" id="ifscCode" name="ifscCode" value={bankDetails?.ifscCode} onChange={handlebankDetailsOnchange} />
                                                    </div>
                                                    <div className="mb-3 col-12 col-md-4">
                                                        <label for="panNo" className="form-label">UPI ID/ Number</label>
                                                        <input type="text" className="form-control" id="upiId" name="upiId" value={bankDetails?.upiId} onChange={handlebankDetailsOnchange} />
                                                    </div>

                                                </div>
                                                <div className="row row-cols-1 row-cols-2">
                                                    <div className="mb-3 d-flex flex-column">
                                                        <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                            <label for="chequeImg" className="form-label">Cancelled Cheque {(uploadBankDetailsPhoto.message && uploadBankDetailsPhoto.type == "cancelledChequeImg") && <span className={uploadBankDetailsPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadBankDetailsPhoto.message}</span>}</label>
                                                            <div className='btn btn-primary' onClick={() => chequeRef.current.click()}>Upload</div>
                                                        </div>
                                                        {<img style={{ height: 250, }} className="border rounded-2" src={bankInfoImg?.cancelledChequeImg ? getCheckStorage(bankInfoImg?.cancelledChequeImg) : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                                        <input type="file" name="chequeImg" ref={chequeRef} id="profilePhoto" hidden={true} onChange={(e) => handleBankDetailsImgOnchange(e, "cancelledChequeImg")} />
                                                    </div>

                                                    <div className="mb-3 d-flex flex-column">
                                                        <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                            <label for="gstImg" className="form-label">GST Copy {(uploadBankDetailsPhoto.message && uploadBankDetailsPhoto.type == "gstCopyImg") && <span className={uploadBankDetailsPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadBankDetailsPhoto.message}</span>}</label>
                                                            <div className='btn btn-primary' onClick={() => gstRef.current.click()}>Upload</div>
                                                        </div>

                                                        {<img style={{ height: 250, }} className="border rounded-2" src={bankInfoImg?.gstCopyImg ? getCheckStorage(bankInfoImg?.gstCopyImg) : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                                        <input type="file" name="gstImg" ref={gstRef} id="profilePhoto" hidden={true} onChange={(e) => handleBankDetailsImgOnchange(e, "gstCopyImg")} />
                                                    </div>
                                                </div>
                                                <div className="d-flex  justify-content-center">
                                                    <div aria-disabled={loading || uploadBankDetailsPhoto.loading} className={loading || uploadBankDetailsPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} onClick={handleBankDetailsOnsubmit}>
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