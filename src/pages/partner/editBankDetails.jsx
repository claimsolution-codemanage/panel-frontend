import React, { useEffect, useRef, useState } from 'react';
import { getPartnerBankingDetails } from "../../apis";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { updatePartnerBankingDetails } from '../../apis';
import Loader from '../../components/Common/loader';
import { validateUploadFile } from '../../utils/helperFunction';
import { partnerImageUpload } from '../../apis/upload';
import { checkNumber } from "../../utils/helperFunction";
import { getCheckStorage } from '../../utils/helperFunction';
import { partnerBankInitialValue, partnerBankValidationSchema } from '../../utils/validation';
import { useFormik } from 'formik';


export default function EditBankingDetails() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [uploadPhoto, setUploadPhoto] = useState({ type: "", status: 0, loading: false, message: "" })

    const gstRef = useRef()
    const chequeRef = useRef()

    const handleBankDetailsOnsubmit = async (values) => {
        setSaving(true)
        try {
            const res = await updatePartnerBankingDetails("id", values)
            if (res?.data?.success && res?.data) {
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

    const bankFormik = useFormik({
        initialValues: partnerBankInitialValue,
        validationSchema: partnerBankValidationSchema,
        onSubmit: (values) => handleBankDetailsOnsubmit(values),
    });


    const fetchBankDetails = async () => {
        setLoading(true)
        try {
            const res = await getPartnerBankingDetails()
            if (res?.data?.success && res?.data?.data?.bankingDetails) {
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
        fetchBankDetails()
    }, [])


    const handleUploadFile = async (file, type) => {
        try {
            setUploadPhoto({ status: 1, loading: true, type, message: "uploading..." })
            const res = await partnerImageUpload(file)
            bankFormik.setFieldValue(type, res?.data?.url)
            setUploadPhoto({ status: 1, loading: false, type, message: "uploaded" })
            setTimeout(() => {
                setUploadPhoto({ status: 0, loading: false, message: "" })
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
        const file = e.target.files[0];
        setUploadPhoto({ status: 0, loading: true, message: "" })
        const result = validateUploadFile(e.target.files, 10, "image")
        if (!result?.success) {
            setUploadPhoto({ status: 0, loading: false, type, message: result?.message })
        } else {
            handleUploadFile(result?.file, type)
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
                        </div>
                    </div>
                </div>

                <div className="m-2 m-md-5">
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
                                                    <label for="chequeImg" className="form-label">Cancelled Cheque {(uploadPhoto.message && uploadPhoto.type == "cancelledChequeImg") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                    <div className='btn btn-primary' onClick={() => chequeRef.current.click()}>Upload</div>
                                                </div>
                                                {<img style={{ height: 250, }} className="border rounded-2" src={bankFormik?.values?.cancelledChequeImg ? getCheckStorage(bankFormik?.values?.cancelledChequeImg) : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                                <input type="file" name="chequeImg" ref={chequeRef} id="profilePhoto" hidden={true} onChange={(e) => handleImgOnchange(e, "cancelledChequeImg")} />
                                                {bankFormik?.touched?.chequeImg && bankFormik?.errors?.chequeImg && <p className="text-danger">{bankFormik?.errors?.chequeImg}</p>}

                                            </div>

                                            <div className="mb-3 d-flex flex-column">
                                                <div className='d-flex gap-2 align-items-center justify-content-between'>
                                                    <label for="gstImg" className="form-label">GST Copy {(uploadPhoto.message && uploadPhoto.type == "gstCopyImg") && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}</label>
                                                    <div className='btn btn-primary' onClick={() => gstRef.current.click()}>Upload</div>
                                                </div>

                                                {<img style={{ height: 250, }} className="border rounded-2" src={bankFormik?.values?.gstCopyImg ? getCheckStorage(bankFormik?.values?.gstCopyImg) : "/Images/upload.jpeg"} alt="gstcopyImg" />}
                                                <input type="file" name="gstImg" ref={gstRef} id="profilePhoto" hidden={true} onChange={(e) => handleImgOnchange(e, "gstCopyImg")} />
                                                {bankFormik?.touched?.gstImg && bankFormik?.errors?.gstImg && <p className="text-danger">{bankFormik?.errors?.gstImg}</p>}

                                            </div>
                                        </div>
                                        <div className="d-flex  justify-content-center">
                                            <div onClick={bankFormik.handleSubmit} aria-disabled={loading || uploadPhoto.loading} className={loading || uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "}>
                                                {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                                            </div>
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