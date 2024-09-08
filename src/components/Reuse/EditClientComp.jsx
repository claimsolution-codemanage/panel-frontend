import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../App'
import { toast } from 'react-toastify'
import { setToken } from '../../utils/helperFunction'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useEffect } from 'react'
import { getJwtDecode } from '../../utils/helperFunction';
import { allState } from '../../utils/constant'
import { formatDateToISO } from '../../utils/helperFunction'
import { useRef } from 'react'
import { BsCameraFill } from 'react-icons/bs'
import Loader from '../Common/loader'
import { validateUploadFile } from '../../utils/helperFunction'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { checkPhoneNo, checkNumber,getCheckStorage } from '../../utils/helperFunction'



export default function EditClient({ id, getClient, updateClient,uploadImg ,role }) {
    const state = useContext(AppContext)
    // console.log("state",state?.myAppData?.details?.role);
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const [uploadPhoto, setUploadPhoto] = useState({ status: 0,type:"", loading: false, message: "" })
    const imgRef = useRef()
    const kycPhotoRef = useRef()
    const kycAadhaarRef = useRef()
    const kycAadhaarBackRef = useRef()
    const kycPanRef = useRef()

    const UserProfileFormik = useFormik({
        initialValues: {
            profilePhoto: "",
            consultantName: "",
            consultantCode: "",
            associateWithUs: "",
            fatherName: "",
            primaryEmail: "",
            alternateEmail: "",
            primaryMobileNo: "",
            whatsupNo: "",
            alternateMobileNo: "",
            panNo: "",
            aadhaarNo: "",
            dob: "",
            gender: "",
            address: "",
            state: "",
            district: "",
            city: "",
            pinCode: "",
            about: "",
            kycPhoto: "",
            kycAadhaar: "",
            kycAadhaarBack: "",
            kycPan: "",
        },
        validationSchema: yup.object().shape({
            profilePhoto: yup.string(),
            consultantName: yup.string().required("Please Enter your Name").min(3, "Consultant Name must have minimum 3 characters"),
            consultantCode: yup.string().required("Please Enter your Consultant Id"),
            associateWithUs: yup.date().required("Please Enter your Associate With Us date"),
            fatherName: yup.string(),
            primaryEmail: yup.string().email("Please enter valid email").required("Please Enter your Email Id"),
            alternateEmail: yup.string().email("Please enter valid email"),
            primaryMobileNo: yup.string().min(12, "MobileNo must have minimum 12 characters").max(12, "MobileNo must have maximum 12 characters").required("Please enter your MobileNo."),
            whatsupNo: yup.string().min(10, "Whatsup No must have minimum 10 characters").max(10, "Whatsup No must have maximum 10 characters"),
            alternateMobileNo: yup.string().min(10, "Alternate MobileNo must have minimum 10 characters").max(10, "Alternate MobileNo must have maximum 10 characters"),
            dob: yup.date().nullable(),
            address: yup.string(),
            state: yup.string(),
            city: yup.string(),
            pinCode: yup.string(),
            about: yup.string().max(250, "About must have maximum 250 characters"),
            kycPhoto: yup.string(),
            kycAadhaar: yup.string(),
            kycAadhaarBack: yup.string(),
            kycPan: yup.string(),
        }),
        onSubmit: async (values) => {
            setSaving(true)
            try {
                const payload = {
                    ...values,primaryMobileNo:`${values?.primaryMobileNo}`, aadhaarNo: `${values?.aadhaarNo}` 
                }
                if(payload?.kycAadhar){
                    delete payload?.kycAadhar
                }
                const res = role?.toLowerCase() === "client" ?  
                await updateClient({ ...payload}) : 
                await updateClient(id,{ ...payload})
                if (res?.data?.success) {
                    if (role === "client" && res?.data?.token) {
                        const token = res?.data?.token;
                        setToken(token)
                        const details = getJwtDecode(token)
                        state?.setMyAppData({ isLogin: true, details: details })
                    }
                    toast.success(res?.data?.message)
                    navigate(-1)
                    setSaving(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                setSaving(false)
            }
        }
    })



    useEffect(() => {
        setLoading(true)
        if (id) {
            async function fetch() {
                try {
                    const res = await getClient(id)
                    if (res?.data?.success && res?.data?.data) {
                        if(role?.toLowerCase()=="client" && res?.data?.data?.isProfileCompleted){
                            navigate(-1)
                        }else{
                        }
                        UserProfileFormik.setValues({ ...res?.data?.data?.profile })
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

    const handleUploadFile = async (file,type) => {
        try {
            setUploadPhoto({ status: 1, loading: true,type, message: "uploading..." })
            const res = await uploadImg(file)
            UserProfileFormik.setFieldValue(type, res?.data?.url)
            setUploadPhoto({ status: 1, loading: false,type, message: "uploaded" })
            setTimeout(() => {
                setUploadPhoto({ status: 0, loading: false,type:"", message: "" })
            }, 3000);
        } catch (error) {
            setUploadPhoto({ status: 0, loading: false,type, message: "Failed to upload file" })
        }
    }

    const handleImgOnchange = async (e,type) => {
        setUploadPhoto({ status: 0, loading: true, message: "" })
        const result = validateUploadFile(e.target.files, 5, "image")
        if (!result?.success) {
            setUploadPhoto({ status: 0, loading: false,type, message: result?.message })
        } else {
            // console.log("result?.file", result?.file);
            handleUploadFile(result?.file,type)
        }
    }

    const handleBack = () => {
        if(location?.state?.filter && location?.state?.back){
            navigate(location?.state?.back,{state:{...location?.state,back:location?.pathname}});
        }else{
            navigate(-1)
        }
      };

    return (
        <>
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
                            <form onSubmit={UserProfileFormik.handleSubmit} className="">
                                <div>
                                    <div className="">
                                        <div className="">
                                            <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                                                <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                                    <div className="d-flex flex-column  align-items-center justify-content-center">
                                                        <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} onClick={handleImage}>
                                                            {UserProfileFormik?.values?.profilePhoto ? <img src={getCheckStorage(UserProfileFormik?.values?.profilePhoto) ? getCheckStorage(UserProfileFormik?.values?.profilePhoto) : "/Images/upload.jpeg"} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} /> : <BsCameraFill className="h2 text-white " />}
                                                            <input type="file" name="profilePhoto" ref={imgRef} id="profilePhoto" hidden={true} onChange={(e)=>handleImgOnchange(e,"profilePhoto")} />
                                                        </div>
                                                        {uploadPhoto.message && uploadPhoto.type=="profilePhoto" && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-10">
                                                    <h5 className={`mt-3 ${UserProfileFormik?.errors?.about && "text-danger"}`}>About</h5>
                                                    <div className="mb-3 col-12 w-75">
                                                        {/* <label htmlFor="mobileNo." className={`form-label ${UserProfileFormik?.errors?.consultantName && "text-danger"}`}>About you</label> */}
                                                        <textarea className={`form-control w-100  ${UserProfileFormik?.errors?.about && "border-danger"}`} name="about" value={UserProfileFormik.values.about} onChange={UserProfileFormik.handleChange} placeholder="About yourself" rows={5} cols={5} ></textarea>
                                                        {UserProfileFormik?.touched?.about && UserProfileFormik?.errors?.about ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.about}</span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                <div className="border-3 border-primary border-bottom py-2">
                                                    <h6 className="text-primary text-center fs-3">Profile Details</h6>
                                                </div>
                                                <div className="m-0 row row-cols-12 row-cols-md-3 p-md-5">
                                                    <div className="mb-3 ">
                                                        <label htmlFor="name" className={`form-label ${UserProfileFormik?.touched?.consultantName && UserProfileFormik?.errors?.consultantName && "text-danger"}`}>Name*</label>
                                                        <input type="text" className={`form-control ${UserProfileFormik?.touched?.consultantName && UserProfileFormik?.errors?.consultantName && "border-danger"} `} id="consultantName" name="consultantName" onChange={(e)=>role!="client" && UserProfileFormik.handleChange(e)} value={UserProfileFormik.values.consultantName} disabled={role=="client"}
                                                        />
                                                        {UserProfileFormik?.touched?.consultantName && UserProfileFormik?.errors?.consultantName ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.consultantName}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="name" className={`form-label ${UserProfileFormik?.touched?.fatherName && UserProfileFormik?.errors?.fatherName && "text-danger"}`}>Father's Name</label>
                                                        <input type="text" className={`form-control ${UserProfileFormik?.touched?.fatherName && UserProfileFormik?.errors?.fatherName && "border-danger"} `} name="fatherName" value={UserProfileFormik.values.fatherName} onChange={UserProfileFormik.handleChange} />
                                                        {UserProfileFormik?.touched?.fatherName && UserProfileFormik?.errors?.fatherName ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.fatherName}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="consultantCode" className={`form-label ${UserProfileFormik?.touched?.consultantCode && UserProfileFormik?.errors?.consultantCode && "text-danger"}`}>Customer Code</label>
                                                        <input type="text" name="consultantCode" value={UserProfileFormik?.values?.consultantCode} disabled={true} className={`form-control ${UserProfileFormik?.touched?.consultantCode && UserProfileFormik?.errors?.consultantCode && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.consultantCode && UserProfileFormik?.errors?.consultantCode ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.consultantCode}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="associateWithUs" className={`form-label ${UserProfileFormik?.touched?.associateWithUs && UserProfileFormik?.errors?.associateWithUs && "text-danger"}`}>Associate with us</label>
                                                        <input type="date" name="associateWithUs" value={UserProfileFormik?.values?.associateWithUs ? formatDateToISO(UserProfileFormik.values.associateWithUs) : ''} disabled={true} className={`form-control ${UserProfileFormik?.touched?.associateWithUs && UserProfileFormik?.errors?.associateWithUs && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.associateWithUs && UserProfileFormik?.errors?.associateWithUs ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.associateWithUs}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="primaryEmail" className={`form-label ${UserProfileFormik?.touched?.primaryEmail && UserProfileFormik?.errors?.primaryEmail && "text-danger"}`}>Email Id</label>
                                                        <input type="email" name="primaryEmail" value={UserProfileFormik?.values?.primaryEmail} disabled={true} className={`form-control ${UserProfileFormik?.touched?.primaryEmail && UserProfileFormik?.errors?.primaryEmail && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.primaryEmail && UserProfileFormik?.errors?.primaryEmail ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.primaryEmail}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="primaryMobileNo" className={`form-label ${UserProfileFormik?.touched?.primaryMobileNo && UserProfileFormik?.errors?.primaryMobileNo && "text-danger"}`}>Mobile No</label>
                                                        <input type="number" name="primaryMobileNo" value={UserProfileFormik?.values?.primaryMobileNo} disabled={role=="client"} onChange={(e) => role!="client" && checkPhoneNo(e?.target?.value,12) && UserProfileFormik.handleChange(e)} className={`form-control ${UserProfileFormik?.touched?.primaryMobileNo && UserProfileFormik?.errors?.primaryMobileNo && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.primaryMobileNo && UserProfileFormik?.errors?.primaryMobileNo ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.primaryMobileNo}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="whatsupNo" className={`form-label ${UserProfileFormik?.touched?.whatsupNo && UserProfileFormik?.errors?.whatsupNo && "text-danger"}`}>Whatsapp No</label>
                                                        <input type="text" name="whatsupNo" value={UserProfileFormik?.values?.whatsupNo} onChange={(e) => checkPhoneNo(e?.target?.value) && UserProfileFormik.handleChange(e)} className={`form-control ${UserProfileFormik?.touched?.whatsupNo && UserProfileFormik?.errors?.whatsupNo && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.whatsupNo && UserProfileFormik?.errors?.whatsupNo ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.whatsupNo}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="dob" className={`form-label ${UserProfileFormik?.touched?.dob && UserProfileFormik?.errors?.dob && "text-danger"}`}>DOB</label>

                                                        <input type="date" name="dob" value={UserProfileFormik?.values?.dob ? formatDateToISO(UserProfileFormik?.values?.dob) : ''} onChange={UserProfileFormik.handleChange} className={`form-control ${UserProfileFormik?.touched?.dob && UserProfileFormik?.errors?.dob && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.dob && UserProfileFormik?.errors?.dob ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.dob}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="district" className={`form-label ${UserProfileFormik?.touched?.address && UserProfileFormik?.errors?.address && "text-danger"}`}>Address</label>
                                                        <input type="text" name="address" value={UserProfileFormik?.values?.address} onChange={UserProfileFormik.handleChange} className={`form-control ${UserProfileFormik?.touched?.address && UserProfileFormik?.errors?.address && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.address && UserProfileFormik?.errors?.address ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.address}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="city" className={`form-label ${UserProfileFormik?.touched?.city && UserProfileFormik?.errors?.city && "text-danger"}`}>City</label>
                                                        <input type="text" name="city" value={UserProfileFormik?.values?.city} onChange={UserProfileFormik.handleChange} className={`form-control ${UserProfileFormik?.touched?.city && UserProfileFormik?.errors?.city && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.city && UserProfileFormik?.errors?.city ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.city}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="state" className={`form-label ${UserProfileFormik?.touched?.state && UserProfileFormik?.errors?.state && "text-danger"}`}>State</label>
                                                        <select className={`form-select ${UserProfileFormik?.touched?.state && UserProfileFormik?.errors?.state && "border-danger"} `} name="state" value={UserProfileFormik?.values?.state} onChange={UserProfileFormik.handleChange}>
                                                            <option value="">--select state</option>
                                                            {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                                                        </select>
                                                        {UserProfileFormik?.touched?.state && UserProfileFormik?.errors?.state ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.state}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3 ">
                                                        <label htmlFor="pinCode" className={`form-label ${UserProfileFormik?.touched?.pinCode && UserProfileFormik?.errors?.pinCode && "text-danger"}`}>Pincode</label>
                                                        <input type="text" name="pinCode" value={UserProfileFormik?.values?.pinCode} onChange={(e) => checkPhoneNo(e?.target?.value,6) && UserProfileFormik.handleChange(e)} className={`form-control ${UserProfileFormik?.touched?.pinCode && UserProfileFormik?.errors?.pinCode && "border-danger"} `} />
                                                        {UserProfileFormik?.touched?.pinCode && UserProfileFormik?.errors?.pinCode ? (
                                                            <span className="text-danger">{UserProfileFormik?.errors?.pinCode}</span>
                                                        ) : null}
                                                    </div>
                                                    </div>
                                                    <div className="border-3 border-primary border-bottom py-2">
                                                    <h6 className="text-primary text-center fs-3">KYC Details</h6>
                                                </div>
                                                <div className="m-0 row row-cols-12 row-cols-md-4 p-md-5">
                                                    <div className="mb-3 d-flex gap-2 flex-column">
                                                        <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                        <label htmlFor="kycPhoto" className="form-label text-break">Photo {(uploadPhoto.message && uploadPhoto.type == "kycPhoto") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                        <div className='btn btn-primary' onClick={() => kycPhotoRef.current.click()}>Upload</div>
                                                        </div>
                                                        {<img style={{height:'200px'}} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(UserProfileFormik?.values?.kycPhoto) ? getCheckStorage(UserProfileFormik?.values?.kycPhoto) : "/Images/upload.jpeg"} alt="kycPhoto" />}
                                                        <input type="file" name="kycPhoto" ref={kycPhotoRef} id="kycPhoto" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                                    </div>
                                                    <div className="mb-3 d-flex gap-2 flex-column">
                                                        <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                        <label htmlFor="kycAadhar" className="form-label text-break">Aadhaar Front {(uploadPhoto.message && uploadPhoto.type == "kycAadhaar") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                        <div className='btn btn-primary' onClick={() => kycAadhaarRef.current.click()}>Upload</div>
                                                        </div>
                                                        {<img style={{height:'200px'}} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(UserProfileFormik?.values?.kycAadhaar) ? getCheckStorage(UserProfileFormik?.values?.kycAadhaar) : "/Images/upload.jpeg"} alt="kycAadhar" />}
                                                        <input type="file" name="kycAadhaar" ref={kycAadhaarRef} id="kycAadhaar" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                                    </div>
                                                    <div className="mb-3 d-flex gap-2 flex-column">
                                                        <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                        <label htmlFor="kycAadhaarBack" className="form-label text-break">Aadhaar Back {(uploadPhoto.message && uploadPhoto.type == "kycAadhaarBack") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                        <div className='btn btn-primary' onClick={() => kycAadhaarBackRef.current.click()}>Upload</div>
                                                        </div>
                                                        {<img style={{height:'200px'}} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(UserProfileFormik?.values?.kycAadhaarBack) ? getCheckStorage(UserProfileFormik?.values?.kycAadhaarBack) : "/Images/upload.jpeg"} alt="kycAadhar" />}
                                                        <input type="file" name="kycAadhaarBack" ref={kycAadhaarBackRef} id="kycAadhaarBack" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                                    </div>
                                                    <div className="mb-3 d-flex gap-2 flex-column">
                                                        <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                        <label htmlFor="kycPan" className="form-label text-break">PAN Card{(uploadPhoto.message && uploadPhoto.type == "kycPan") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                        <div className='btn btn-primary' onClick={() => kycPanRef.current.click()}>Upload</div>
                                                        </div>
                                                        {<img style={{height:'200px'}} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(UserProfileFormik?.values?.kycPan) ? getCheckStorage(UserProfileFormik?.values?.kycPan) : "/Images/upload.jpeg"} alt="kycPan" />}
                                                        <input type="file" name="kycPan" ref={kycPanRef} id="kycPan" hidden={true} onChange={(e) => handleImgOnchange(e, e?.target?.name)} />
                                                    </div>
                                                </div>
                                                    <div className="d-flex w-100 justify-content-center">
                                                        <button type='submit' aria-disabled={loading || uploadPhoto.loading} className={loading || uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} >
                                                            {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                                                        </button>
                                                    </div>
                                               
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>}
        </>
    )
}