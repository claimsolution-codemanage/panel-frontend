import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { adminResetPassword } from "../../apis"
import { toast } from 'react-toastify'
import { LuPcCase, LuUploadCloud } from 'react-icons/lu'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import Loader from "../../components/Common/loader"
import { FaFilePdf, FaFileImage } from 'react-icons/fa6'
import { IoMdAdd } from 'react-icons/io'
import { adminGetSettingDetails, adminUpdateSettingDetails, adminUploadCompanyClientTls, adminUploadCompanyPartnerTls } from "../../apis"
import { useRef } from "react"
import { storage } from "../../utils/firebase"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';
import ViewDocs from "../../components/Common/ViewDocs"
import { checkPhoneNo } from "../../utils/helperFunction"
import { useContext } from "react"
import { AppContext } from "../../App"

export default function AdminAccountSetting() {
    const [data, setData] = useState({ password: "", confirmPassword: "" })
    const [setting, setSetting] = useState({ fullName: "", email: "", mobileNo: "", consultantFee: "",})
    const [loading, setLoading] = useState(false)
    const [uploadTls, setUploadTls] = useState({ status: 0, type: "", loading: false, message: "" })
    const [settingLoader, setSettingLoader] = useState(false)
    const [resetPasswordLoader, setResetPasswordLoader] = useState(false)
    const [seeDocs,setSeeDocs] = useState({status:false,details:{}})
    const [view, setView] = useState(false)
    const clientTlsRef = useRef(null)
    const partnerTlsRef = useRef(null)
    const navigate = useNavigate()
    const stateContext = useContext(AppContext)

    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleSettingOnchange = (e) => {
        const { name, value } = e.target;
        setSetting({ ...setting, [name]: value })
    }


    const handleSumbit = async (e) => {
        e.preventDefault()
        setResetPasswordLoader(true)
        try {
            const res = await adminResetPassword(data)
            // console.log("/admin/dashboard",res);
            setData({ password: "", confirmPassword: "" })
            if (res?.data?.success) {
                // navigate("/admin/dashboard")
                toast.success(res?.data?.message)
                setResetPasswordLoader(false)
            }
            setResetPasswordLoader(false)
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            // console.log("adminResetPassword error", error);
            setResetPasswordLoader(false)
        }
    }

    const handleSetting = async (e) => {
        e.preventDefault()
        setSettingLoader(true)
        try {
            const res = await adminUpdateSettingDetails(setting)
            // console.log("/admin/dashboard",res);
            if (res?.data?.success) {
                // navigate("/admin/dashboard")
                toast.success(res?.data?.message)
                setSettingLoader(false)
            }
            setSettingLoader(false)
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            // console.log("adminResetPassword error", error);
            setSettingLoader(false)
        }
    }


    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const res = await adminGetSettingDetails()
                // console.log("adminGetSettingDetails", res?.data?.data);
                if (res?.data?.success && res?.data?.data) {
                    setSetting({
                        // ...res?.data?.data,
                        consultantFee: res?.data?.data?.consultantFee,
                        email: res?.data?.data?.email,
                        fullName: res?.data?.data?.fullName,
                        mobileNo: res?.data?.data?.mobileNo,
                        // partnerTlsUrl: res?.data?.data?.partnerTlsUrl,
                        // clientTlsUrl: res?.data?.data?.clientTlsUrl
                    })
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("allAdminPartner error", error);
            }
        } fetch()
    }, [])

    const handleTls = async (e, type) => {
        setUploadTls({ status: 0,type: type, loading: true, message: "" })
        const file = e.target.files[0];
        if (file) {
            // Check the file type
            const allowedTypes = ['application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setUploadTls({ status: 0, type: type, loading: false, message: "file must be pdf" })
                return;
            }
            // Check the file size (1MB = 1024 * 1024 bytes)
            const maxSize = 5 * 1024 * 1024; // 100kB
            if (file.size > maxSize) {
                setUploadTls({ status: 0, type: type, loading: false, message: "Image size must be less than 5MB" })
                return;
            }
            handleUploadFile(file, type)
        } else {
            setUploadPhoto({ status: 0, type: type, loading: false, message: "file not select" })
        }
    }

    const handleUploadFile = (file, type) => {
        setUploadTls({ status: 1, type: type, loading: true, message: "uploading..." })
        //  console.log("loading",data);
        const fileRef = ref(storage, `company/${uuidv4()}`)
        uploadBytes(fileRef, file).then(snapshot => {
            getDownloadURL(snapshot.ref).then(url => {
                // console.log("URL",type, url);
                if (type == "partnerTlsUrl") {
                    updateCompanyTls(adminUploadCompanyPartnerTls, type, { [type]: url })
                }
                if (type == "clientTlsUrl") {
                    updateCompanyTls(adminUploadCompanyClientTls, type, { [type]: url })
                }
            })
        }).catch(error => {
            // docRef.current = ""
            // console.log("error", error);
            setUploadTls({ status: 0, type: type, loading: false, message: "Failed to upload file" })
            // setLoading({status:false,code:2,type:"uploading",message:"Failed to upload file"})
        })
    }

    const updateCompanyTls = async (updateUploadTls, type, data) => {
        try {
            const res = await updateUploadTls(data)
            // console.log("/admin/dashboard",res);
            if (res?.data?.success) {
                // navigate("/admin/dashboard")
                toast.success(res?.data?.message)
                setSetting({
                    // ...res?.data?.data,
                    consultantFee: res?.data?.data?.consultantFee,
                    email: res?.data?.data?.email,
                    fullName: res?.data?.data?.fullName,
                    mobileNo: res?.data?.data?.mobileNo,
                    partnerTlsUrl: res?.data?.data?.partnerTlsUrl,
                    clientTlsUrl: res?.data?.data?.clientTlsUrl
                })
                setUploadTls({ status: 0, type: type, loading: false, message: "" })
            }
            setUploadTls({ status: 0, type: type, loading: false, message: "" })
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            // console.log("adminResetPassword error", error);
            setUploadTls({ status: 0, type: type, loading: false, message: "" })
        }

    }

    // console.log("setting", setting);
    return (<div>
        {loading ? <Loader /> :
        <div>
            {seeDocs.status ? <ViewDocs hide={()=>setSeeDocs({status:false,details:{}})} details={seeDocs} type="View TLS"/> :
            <div className="">
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
                        <div className="d-flex flex align-items-center gap-1">
                            <span>Account setting</span>
                            {/* <span><LuPcCase /></span> */}
                        </div>
                    </div>
                </div>
                <div className="row m-0 py-4">
                    <div className="col-12 p-0">
                        <div className="color-4 mx-auto  w-75">
                            <div className="align-items-center bg-color-1 p-5 rounded-2 row shadow m-0">
                                <div className="border-3 border-primary border-bottom ">
                                    <h6 className="text-primary text-center h3">Admin account Setting</h6>
                                </div>
                                <div className="">
                                    <div className="my-3">
                                        <label htmlFor="fullName" className="form-label">Full Name</label>
                                        <input type="text" name="fullName" value={setting.fullName} onChange={handleSettingOnchange} className="form-control" />
                                    </div>
                                    <div className="my-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" name="email" value={setting.email} disabled="true" className="form-control" />
                                    </div>
                                    <div className="my-3">
                                        <label htmlFor="mobileNo" className="form-label">Mobile No.</label>
                                        <input type="text" name="mobileNo" onWheel={true} value={setting.mobileNo} onChange={(e)=>checkPhoneNo(e?.target?.value) && handleSettingOnchange(e)} className="form-control" />
                                    </div>
                                    {stateContext?.myAppData?.details?.superAdmin &&
                                    <div className="my-3">
                                        <label htmlFor="consultantFee" className="form-label">Consultant Fees</label>
                                        <input type="tel" name="consultantFee" value={setting.consultantFee} onChange={(e)=>stateContext?.myAppData?.details?.superAdmin && handleSettingOnchange(e)} className="form-control" />
                                    </div>}
                                 
                                    <div className="d-flex mt-5  justify-content-center">
                                        <div aria-disabled={settingLoader} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary w-100 ${settingLoader && "disabled"}`} onClick={handleSetting}>
                                            {settingLoader ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Update Setting</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row m-0 py-4">
                    <div className="col-12 p-0">
                        <div className="color-4 mx-auto  w-75">
                            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                <div className="border-3 border-primary border-bottom py-2 mb-5">
                                    <div className="d-flex gap-3 justify-content-center text-primary text-center h3">
                                        <span>Company TLS</span>
                                    </div></div>

                                <div className="d-flex  gap-5 px-5  align-items-center">
                                    <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                        <div style={{ cursor: "pointer" }} onClick={()=>setSeeDocs({status:true,details:{docURL:setting.clientTlsUrl,docType:"pdf"}})} className="d-flex flex-column p-4 justify-content-center align-items-center">
                                            <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                <FaFilePdf />
                                            </div>
                                            <p className="text-capitalize">partner</p>
                                        </div>
                                        <div style={{ cursor: "pointer" }} onClick={() => !uploadTls.loading && partnerTlsRef.current.click()} className="d-flex align-items-center py-2 justify-content-center bg-dark gap-3 w-100 text-primary">
                                            <input type="file" name="partnerTlsUrl" ref={partnerTlsRef} onChange={(e) => handleTls(e, "partnerTlsUrl")} hidden={true} />
                                            <span className={`${uploadTls.status == 0 ? "text-danger" : "text-success"}`}>{uploadTls.type == "partnerTlsUrl" && uploadTls.message}</span>
                                            <span  ><LuUploadCloud className="fs-5" /></span>
                                        </div>
                                    </div>
                                    <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                        <div style={{ cursor: "pointer" }} onClick={()=>setSeeDocs({status:true,details:{docURL:setting.clientTlsUrl,docType:"pdf"}})} className="d-flex flex-column p-4 justify-content-center align-items-center">
                                            <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                <FaFilePdf />
                                            </div>
                                            <p className="text-capitalize">Client</p>
                                        </div>
                                        <div style={{ cursor: "pointer" }} onClick={() => !uploadTls.loading &&  clientTlsRef.current.click()} className="d-flex align-items-center py-2 justify-content-center bg-dark gap-3 w-100 text-primary">
                                            <input type="file" name="clientTlsUrl" ref={clientTlsRef} onChange={(e) => handleTls(e, "clientTlsUrl")} hidden={true} />
                                            <span className={`${uploadTls.status == 0 ? "text-danger" : "text-success"}`}>{uploadTls.type == "clientTlsUrl" && uploadTls.message}</span>
                                            <span  ><LuUploadCloud className="fs-5" /></span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div> */}



                <div className="row m-0 py-4">
                    <div className="col-12 p-0">
                        <div className="color-4 mx-auto  w-75">
                            <div className="align-items-center bg-color-1 p-5 rounded-2 row shadow m-0">
                                <div className="border-3 border-primary border-bottom">
                                    <h6 className="text-primary text-center h3">Reset Password</h6>
                                </div>
                                <div className="">
                                    <div className="my-3">
                                        <label htmlFor="email" className="form-label">Password</label>
                                        <input type="password" name="password" value={data.password} onChange={handleOnchange} className="form-control" placeholder="" id="password" />
                                    </div>
                                    <div className="mb-3 mt-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Passwod</label>
                                        <div className='d-flex flex aligin-items-center form-control justify-content-center'>
                                            <input type={view ? "text" : "password"} className="w-100 border-0" name="confirmPassword" value={data.confirmPassword} onChange={handleOnchange} style={{ outline: 'none' }} />
                                            <span className='fs-6' style={{ cursor: 'pointer' }} onClick={() => setView(!view)}>
                                                {view ? <BsEyeFill /> : <BsEyeSlashFill />}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-5  justify-content-center">
                                        <div aria-disabled={resetPasswordLoader} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary w-100 ${resetPasswordLoader && "disabled"}`} onClick={handleSumbit}>
                                            {resetPasswordLoader ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Reset Password</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            </div>}

    </div>)
}