import React, { useEffect, useRef, useState } from 'react';
import { getPartnerBankingDetails } from "../../apis";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { imageUpload,updatePartnerBankingDetails } from '../../apis';
import Loader from '../../components/Common/loader';
import { validateUploadFile } from '../../utils/helperFunction';
import { partnerImageUpload } from '../../apis/upload';
import { API_BASE_IMG } from '../../apis/upload';
import { checkPhoneNo,checkNumber } from "../../utils/helperFunction";


export default function EditBankingDetails() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [saving,setSaving] = useState(false)
    const [uploadPhoto, setUploadPhoto] = useState({ type: "", status: 0, loading: false, message: "" })
    const gstRef = useRef()
    const chequeRef = useRef()

    const [data, setData] = useState({
        bankName: "",
        bankAccountNo: "",
        bankBranchName: "",
        gstNo: "",
        panNo: "",
        ifscCode:"",
        upiId:"",
        cancelledChequeImg: "",
        gstCopyImg: "",
    })



    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const res = await getPartnerBankingDetails()
                // console.log("bankingDetails", res?.data?.data?.bankingDetails);
                if (res?.data?.success && res?.data?.data?.bankingDetails) {
                    setData({...data, ...res?.data?.data?.bankingDetails })
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("bankingDetails error", error);
            }
        } fetch()
    }, [])

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    // const handleUploadFile = (file, type) => {
    //     setUploadPhoto({ status: 1, loading: true, message: "uploading..." })
    //     //  console.log("loading",data);
    //     const fileRef = ref(storage, `detailsImg/${uuidv4()}`)
    //     uploadBytes(fileRef, file).then(snapshot => {
    //         getDownloadURL(snapshot?.ref).then(url => {
    //             console.log("URL", url);
    //             setData((data) => ({ ...data, [type]: url }))
    //             setUploadPhoto({ status: 1, loading: false, message: "uploaded" })
    //             setTimeout(() => {
    //                 setUploadPhoto({ status: 0, loading: false, message: "" })
    //             }, 3000);
    //         })
    //     }).catch(error => {
    //         // docRef.current = ""
    //         console.log("error", error);
    //         setUploadPhoto({ status: 0, loading: false, message: "Failed to upload file" })
    //         // setLoading({status:false,code:2,type:"uploading",message:"Failed to upload file"})
    //     })
    // }


    // const handleImgOnchange = async (e, type) => {
    //     setUploadPhoto({ status: 0, loading: true, message: "" })
    //     const file = e.target.files[0];
    //     if (file) {
    //         // Check the file type
    //         const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    //         if (!allowedTypes.includes(file.type)) {
    //             setUploadPhoto({ type: type, status: 0, loading: false, message: "Image must be jpeg, jpg, or png" })
    //             return;
    //         }
    //         // Check the file size (1MB = 1024 * 1024 bytes)
    //         const maxSize = 100 * 1000; // 1MB
    //         if (file.size > maxSize) {
    //             setUploadPhoto({ type: type, status: 0, loading: false, message: "Image size must be less than 100KB" })
    //             return;
    //         }
    //         handleUploadFile(file, type)
    //     } else {
    //         setUploadPhoto({ type: type, status: 0, loading: false, message: "Image not select" })
    //     }
    // }


    const handleUploadFile = async (file,type) => {
        try {

            // console.log("files efs", file);
            setUploadPhoto({ status: 1, loading: true, message: "uploading..." })
            const res = await partnerImageUpload(file)
            
            setData((data) => ({ ...data, [type]: res?.data?.url }))
                setUploadPhoto({ status: 1, loading: false, message: "uploaded" })
                setTimeout(() => {
                    setUploadPhoto({ status: 0, loading: false, message: "" })
                }, 3000);
        } catch (error) {
            // console.log("upload error:", error);
            // setUploadPhoto({ status: 0, loading: false, message: })
            if (error && error?.response?.data?.message) {
                // toast.error(error?.response?.data?.message)
                setUploadPhoto({ status: 0, loading: false, message: error?.response?.data?.message })
                // setUploadAttachement({ status: 2, message: error?.response?.data?.message });
                // setLoading(false)
            } else {
                // toast.error("Something went wrong")
                setUploadPhoto({ status: 0, loading: false, message: "Failed to upload file" })
                // setLoading(false)
            }
        }
    }

    const handleImgOnchange = async (e,type) => {
        const file = e.target.files[0];
        setUploadPhoto({ status: 0, loading: true, message: "" })
        const result = validateUploadFile(e.target.files, 10, "image")
        if (!result?.success) {
            setUploadPhoto({ status: 0, loading: false, message: result?.message })
        } else {
            // console.log("result?.file", result?.file);
            handleUploadFile(result?.file,type)
        }
    }


    

    const handleOnsubmit = async (e) => {
        e.preventDefault()
        // console.log("data", data);
        setSaving(true)
        try {
            const res = await updatePartnerBankingDetails(data)
            // console.log("partner", res?.data);
            if (res?.data?.success && res?.data) {
                // setData([res?.data?.data?.profile])
                toast.success(res?.data?.message)
                setSaving(false)
                navigate("/partner/banking details")
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
                        <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate('/partner/banking details')} style={{ cursor: "pointer" }} />
                        <div className="d-flex flex align-items-center gap-1">
                            <span>Edit Banking Details</span>
                            {/* <span><LuPcCase /></span> */}
                        </div>
                    </div>

                    {/* <div className="d-flex gap-1 badge bg-primary mb-1" onClick={()=>navigate("/partner/edit bank details")} style={{cursor:"pointer"}}>
                <span><CiEdit/></span>
                <span>Edit</span>
            </div> */}

                </div>

                <div className="m-2 m-md-5">
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
                                            <input type="text" className="form-control" id="bankName" name="bankName" value={data.bankName} onChange={handleOnchange} />
                                            {/* <div id="nameHelp" className="form-text text-danger">We'll never share your email with anyone else.</div> */}
                                        </div>
                                        <div className="mb-3 col-12 col-md-4">
                                            <label for="bankAccountNo" className="form-label">Bank Account No*</label>
                                            <input type="text" className="form-control" id="bankAccountNo" name="bankAccountNo" value={data.bankAccountNo} onChange={(e)=>checkNumber(e) && handleOnchange(e)} />
                                        </div>
                                        <div className="mb-3 col-12 col-md-4">
                                            <label for="bankBranchName" className="form-label">Bank Branch Name*</label>
                                            <input type="text" className="form-control" id="bankBranchName" name="bankBranchName" value={data.bankBranchName} onChange={handleOnchange} />
                                        </div>
                                        <div className="mb-3 col-12 col-md-4">
                                            <label for="gstNo" className="form-label">GST No*</label>
                                            <input type="text" className="form-control" id="gstNo" name="gstNo" value={data.gstNo} onChange={handleOnchange} />
                                        </div>
                                        <div className="mb-3 col-12 col-md-4">
                                            <label for="panNo" className="form-label">PAN NO*</label>
                                            <input type="text" className="form-control" id="panNo" name="panNo" value={data.panNo} onChange={handleOnchange} />
                                        </div>
                                        <div className="mb-3 col-12 col-md-4">
                                            <label for="panNo" className="form-label">IFSC Code*</label>
                                            <input type="text" className="form-control" id="ifscCode" name="ifscCode" value={data.ifscCode} onChange={handleOnchange} />
                                        </div>
                                        <div className="mb-3 col-12 col-md-4">
                                            <label for="panNo" className="form-label">UPI ID/ Number*</label>
                                            <input type="text" className="form-control" id="upiId" name="upiId" value={data.upiId} onChange={handleOnchange} />
                                        </div>

                                    </div>
                                    <div className="mb-3 d-flex flex-column">
                                        <label for="chequeImg" className="form-label">Cancelled Cheque {(uploadPhoto.message && uploadPhoto.type == "cancelledChequeImg") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                        {<img style={{ height: 250, cursor: "pointer" }} onClick={() => chequeRef.current.click()} className="border rounded-2" src={data.cancelledChequeImg ? `${API_BASE_IMG}/${data.cancelledChequeImg}` : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                        <input type="file" name="chequeImg" ref={chequeRef} id="profilePhoto" hidden={true} onChange={(e) => handleImgOnchange(e, "cancelledChequeImg")} />
                                    </div>

                                    <div className="mb-3 d-flex flex-column">
                                        <label for="gstImg" className="form-label">GST Copy {(uploadPhoto.message && uploadPhoto.type == "gstCopyImg") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                        {<img style={{ height: 250, cursor: "pointer" }} onClick={() => gstRef.current.click()} className="border rounded-2" src={data.gstCopyImg ? `${API_BASE_IMG}/${data.gstCopyImg}` : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                        <input type="file" name="gstImg" ref={gstRef} id="profilePhoto" hidden={true} onChange={(e) => handleImgOnchange(e, "gstCopyImg")} />
                                    </div>
                                    <div className="d-flex  justify-content-center">
                                        <div aria-disabled={loading || uploadPhoto.loading} className={loading || uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} onClick={handleOnsubmit}>
                                            {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>}
    </>)
}