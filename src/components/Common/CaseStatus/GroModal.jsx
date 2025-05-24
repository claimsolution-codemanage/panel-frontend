import React, { useEffect, useState } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import PaymentDetails from "../SubPart/PaymentDetails";
import { groInitialValues, groValidationSchema } from "../../../utils/validation";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { formatDateToISO } from "../../../utils/helperFunction";

const GROFormModal = ({ caseId, show, close, getCaseById, groDetails, createOrUpdateApi, attachementUpload }) => {
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState({ status: false, id: null })

    const handleSubmit = async (values) => {
        setSaving(true)
        try {
            const res = await createOrUpdateApi({ ...values, caseId, type: "gro" })
            toast.success(res?.data?.message)
            if (getCaseById) { getCaseById() }
            close()
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        }
        setSaving(false)
    }

    const formik = useFormik({
        initialValues: groInitialValues,
        validationSchema: groValidationSchema,
        onSubmit: handleSubmit
    });

    const handleFileClick = (ele) => {
        document.getElementById(ele)?.click()
    }

    const uploadAttachmentFile = async (file, type, id) => {
        setLoading({ status: true, id, })
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await attachementUpload(type, formData)
            if (res?.data?.success) {
                formik.setFieldValue(id, res?.data?.url)
                setLoading({ status: false, id })
                toast.success(res?.data?.message)
                setTimeout(() => {
                    setLoading({ status: false, id: null });
                }, 1000);

            }
        } catch (error) {
            console.log(error);

            toast.error(error?.response?.data?.message || "Something went wrong")
            setLoading({ status: false, id: null })
        }
    }


    const handleAttachment = async (e, id) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            const file = files[0];
            const fileName = file.name;
            const maxSize = 150 * 1024 * 1024; // 150MB

            // Validate file size
            if (file.size > maxSize) {
                toast.error("File must be less than 150MB")
                return;
            }

            // Get file extension and type
            let fileType = "";
            const fileExtension = fileName.split(".").pop().toLowerCase();

            // Determine file type if MIME is missing
            if (!fileType) {
                if (["mp3", "wav", "ogg", "amr", "aac"].includes(fileExtension)) {
                    fileType = "audio";
                } else if (["mp4", "avi"].includes(fileExtension)) {
                    fileType = "video";
                } else if (["doc", "docx"].includes(fileExtension)) {
                    fileType = "word";
                } else if (["xls", "xlsx"].includes(fileExtension)) {
                    fileType = "excel";
                } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension)) {
                    fileType = "image";
                } else if (fileExtension === "pdf") {
                    fileType = "pdf";
                }
            }
            // Match file type with allowed MIME types
            const isFileSupported = fileType
            if (isFileSupported) {
                uploadAttachmentFile(file, fileType, id);
            } else {
                toast.error("File format not supported. Supported formats: image, audio, pdf, video, Word, Excel.")
            }
        } else {
            toast.error("Please select a file")
        }
    };

    useEffect(() => {
        if (groDetails) {
            formik.setValues(groDetails)
            const { paymentDetailsId = {} } = groDetails
            const updateKeys = ["paymentMode", "dateOfPayment", "utrNumber", "bankName", "chequeNumber", "chequeDate", "transactionDate", "amount"]
            updateKeys?.forEach(ele => {
                formik.setFieldValue(ele, paymentDetailsId[ele] || "")
            })
        }
    }, [groDetails])

    const handleClearApproval = ()=>{
        formik.setFieldValue("approved",false)
        formik.setFieldValue("approvalDate","")
        formik.setFieldValue("approvedAmount","")
        formik.setFieldValue("approvalLetter","")
        formik.setFieldValue("approvalLetterPrivate",false)
    }

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className="">
                    <h2 className="text-center text-primary">GRO Form</h2>
                    <FormikProvider value={formik}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="row">
                                <div className="col-md-4">
                                    <div>
                                        <input type="checkbox" id="specialCase" name="specialCase" checked={formik?.values?.specialCase} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        <label htmlFor="specialCase" className="ms-2">Special Case</label>
                                    </div>
                                    {formik.touched.specialCase && formik.errors.specialCase && (
                                        <div className="text-danger">{formik.errors.specialCase}</div>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Partner Fee (%)</label>
                                    <input type="text" className="form-control" name="partnerFee"  value={formik?.values?.partnerFee ||""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.partnerFee && formik.errors.partnerFee && (
                                        <div className="text-danger">{formik.errors.partnerFee}</div>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Consultant Fee (%)</label>
                                    <input type="text" className="form-control" name="consultantFee" value={formik?.values?.consultantFee} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.consultantFee && formik.errors.consultantFee && (
                                        <div className="text-danger">{formik.errors.consultantFee}</div>
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">GRO Filing Date</label>
                                <input type="date" className="form-control" name="groFilingDate" value={formik?.values?.groFilingDate ? formatDateToISO(formik?.values?.groFilingDate) : ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                {formik.touched.groFilingDate && formik.errors.groFilingDate && (
                                    <div className="text-danger">{formik.errors.groFilingDate}</div>
                                )}
                            </div>
                            {/* GRO Filing Date */}


                            {/* Status Updates */}
                            <div className="card shadow mt-3">
                                <div className="card-header bg-primary text-white d-flex justify-content-between">
                                    <span>Status</span>
                                    <button type="button" className="btn btn-light btn-sm" onClick={() => formik.setFieldValue("groStatusUpdates", [...formik.values.groStatusUpdates, { status: "", remarks: "", date: "", isPrivate: false, attachment: "" }])}>
                                        + Add Status
                                    </button>
                                </div>
                                <div className="card-body overflow-auto">
                                    <FieldArray name="groStatusUpdates">
                                        {({ remove }) => (
                                            <>
                                                {formik.values.groStatusUpdates.map((ele, index) => (
                                                    <div className="row mb-2" key={index}>
                                                        <div className="col-md-3 mb-2 mb-md-0">
                                                            <input type="text" placeholder="Status" className="form-control" name={`groStatusUpdates.${index}.status`} value={ele?.status} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            {formik.touched.groStatusUpdates?.[index]?.status && formik.errors.groStatusUpdates?.[index]?.status && (
                                                                <div className="text-danger">{formik.errors.groStatusUpdates?.[index]?.status}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 mb-2 mb-md-0">
                                                            <input type="text" placeholder="remarks" className="form-control" name={`groStatusUpdates.${index}.remarks`} value={ele?.remarks} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            {formik.touched.groStatusUpdates?.[index]?.remarks && formik.errors.groStatusUpdates?.[index]?.remarks && (
                                                                <div className="text-danger">{formik.errors.groStatusUpdates?.[index]?.remarks}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 mb-2 mb-md-0">
                                                            <input type="date" placeholder="Date" className="form-control w-100" name={`groStatusUpdates.${index}.date`} value={ele?.date ? formatDateToISO(ele?.date) : ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            {formik.touched.groStatusUpdates?.[index]?.date && formik.errors.groStatusUpdates?.[index]?.date && (
                                                                <div className="text-danger">{formik.errors.groStatusUpdates?.[index]?.date}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 mb-2 mb-md-0">
                                                            <div className="d-flex gap-2">
                                                                <input type="checkbox" className="" id="isPrivate" name={`groStatusUpdates.${index}.isPrivate`} value={ele?.isPrivate} checked={ele?.isPrivate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                <div>
                                                                    <input type="file" id={`groStatusUpdates.${index}.attachment`} hidden={true} className="form-control" onChange={(e) => handleAttachment(e, `groStatusUpdates.${index}.attachment`)} />
                                                                    <button className="btn btn-primary" disabled={loading?.id == `groStatusUpdates.${index}.attachment`} onClick={() => handleFileClick(`groStatusUpdates.${index}.attachment`)}>{loading?.id == `groStatusUpdates.${index}.attachment` ? "Uploading" : (ele?.attachment ? "attachment" : "Upload")}</button>
                                                                    {formik.touched.groStatusUpdates?.[index]?.attachment && formik.errors.groStatusUpdates?.[index]?.attachment && (
                                                                        <div className="text-danger">{formik.errors.groStatusUpdates?.[index]?.attachment}</div>
                                                                    )}
                                                                </div>
                                                                <div className="">
                                                                    <button type="button" className="btn btn-danger" onClick={() => remove(index)}>  - </button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>
                                </div>
                            </div>

                            {/* Query Handling */}
                            <div className="card shadow mt-3 ">
                                <div className="card-header bg-primary text-white d-flex justify-content-between">
                                    <span>Query</span>
                                    <button type="button" className="btn btn-light btn-sm" onClick={() => formik.setFieldValue("queryHandling", [...formik.values.queryHandling, { date: "", remarks: "", isPrivate: false, attachment: "" }])}>
                                        + Add Query
                                    </button>
                                </div>
                                <div className="card-body overflow-auto">
                                    <FieldArray name="queryHandling">
                                        {({ remove }) => (
                                            <>
                                                {formik.values.queryHandling.map((ele, index) => (
                                                    <div className="row mb-2" key={index}>
                                                        <div className="col-md-5 mb-2 mb-md-0">
                                                            <input type="text" placeholder="remarks" className="form-control" name={`queryHandling.${index}.remarks`} value={ele?.remarks} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            {formik.touched.queryHandling?.[index]?.remarks && formik.errors.queryHandling?.[index]?.remarks && (
                                                                <div className="text-danger">{formik.errors.queryHandling?.[index]?.remarks}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-4 mb-2 mb-md-0">
                                                            <input type="date" className="form-control" name={`queryHandling.${index}.date`} value={ele?.date ? formatDateToISO(ele?.date) : ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            {formik.touched.queryHandling?.[index]?.date && formik.errors.queryHandling?.[index]?.date && (
                                                                <div className="text-danger">{formik.errors.queryHandling?.[index]?.date}</div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-3 mb-2 mb-md-0">
                                                            <div className="d-flex gap-2">
                                                                <input type="checkbox" className="" id="isPrivate" name={`queryHandling.${index}.isPrivate`} value={ele?.isPrivate} checked={ele?.isPrivate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                <div>
                                                                    <input type="file" id={`queryHandling.${index}.attachment`} hidden={true} className="form-control" onChange={(e) => handleAttachment(e, `queryHandling.${index}.attachment`)} />
                                                                    <button className="btn btn-primary" disabled={loading?.id == `queryHandling.${index}.attachment`} onClick={() => handleFileClick(`queryHandling.${index}.attachment`)}>{loading?.id == `queryHandling.${index}.attachment` ? "Uploading" : (ele?.attachment ? "attachment" : "Upload")}</button>
                                                                    {formik.touched.queryHandling?.[index]?.attachment && formik.errors.queryHandling?.[index]?.attachment && (
                                                                        <div className="text-danger">{formik.errors.queryHandling?.[index]?.attachment}</div>
                                                                    )}
                                                                </div>
                                                                <button type="button" className="btn btn-danger" onClick={() => remove(index)}> - </button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>
                                </div>
                            </div>

                            {/* Query reply Handling */}
                            <div className="card shadow mt-3">
                                <div className="card-header bg-primary text-white d-flex justify-content-between">
                                    <span>Query Reply</span>
                                    <button type="button" className="btn btn-light btn-sm" onClick={() => formik.setFieldValue("queryReply", [...formik.values.queryReply, { date: "", remarks: "", byMail: true, byCourier: false, isPrivate: false, attachment: "" }])}>
                                        + Add Reply
                                    </button>
                                </div>
                                <div className="card-body overflow-auto">
                                    <FieldArray name="queryReply">
                                        {({ remove }) => (
                                            <>
                                                {formik.values.queryReply.map((ele, index) => (
                                                    <div className="row mb-2" key={index}>
                                                        <div className="col-md-3 mb-2 mb-md-0">
                                                            <input type="date" className="form-control" name={`queryReply.${index}.date`} value={ele?.date ? formatDateToISO(ele?.date) : ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            {formik.touched.queryReply?.[index]?.date && formik.errors.queryReply?.[index]?.date && (
                                                                <div className="text-danger">{formik.errors.queryReply?.[index]?.date}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3  mb-2 mb-md-0">
                                                            <input type="text" placeholder="remarks" className="form-control" name={`queryReply.${index}.remarks`} value={ele?.remarks} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            {formik.touched.queryReply?.[index]?.remarks && formik.errors.queryReply?.[index]?.remarks && (
                                                                <div className="text-danger">{formik.errors.queryReply?.[index]?.remarks}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3  mb-2 mb-md-0">
                                                            <div className="d-flex  gap-2">
                                                                <div>
                                                                    <input type="radio" name={`sendby-${index}`} id="byMail" checked={ele?.byMail} onChange={(e) => formik?.setFieldValue(`queryReply.${index}.byMail`, e?.target?.checked)} />
                                                                    <label htmlFor="byMail" className="ms-2">Mail</label>
                                                                    <input type="radio" name={`sendby-${index}`} id="byCourier" checked={ele?.byCourier} onChange={(e) => formik?.setFieldValue(`queryReply.${index}.byCourier`, e?.target?.checked)} />
                                                                    <label htmlFor="byCourier" className="ms-2">Courier</label>
                                                                </div>
                                                                <div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3  mb-2 mb-md-0">
                                                            <div className="d-flex gap-2">
                                                                <input type="checkbox" className="" id="isPrivate" name={`queryReply.${index}.isPrivate`} value={ele?.isPrivate} checked={ele?.isPrivate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                <div>
                                                                    <input type="file" id={`queryReply.${index}.attachment`} hidden={true} className="form-control" onChange={(e) => handleAttachment(e, `queryReply.${index}.attachment`)} />
                                                                    <button className="btn btn-primary" disabled={loading?.id == `queryReply.${index}.attachment`} onClick={() => handleFileClick(`queryReply.${index}.attachment`)}>{loading?.id == `queryReply.${index}.attachment` ? "Uploading" : (ele?.attachment ? "attachment" : "Upload")}</button>
                                                                    {formik.touched.queryReply?.[index]?.attachment && formik.errors.queryReply?.[index]?.attachment && (
                                                                        <div className="text-danger">{formik.errors.queryReply?.[index]?.attachment}</div>
                                                                    )}
                                                                </div>
                                                                <div className="">
                                                                    <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                                                                        -
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>
                                </div>
                            </div>

                            {/* Approval Section */}
                            <div className="card shadow mt-3">
                                <div className="card-header bg-primary text-white">Approval</div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <input type="checkbox" id="approved" name={`approved`} value={formik?.values?.approved} checked={formik?.values?.approved} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        <label htmlFor="approved" className="ms-2">Approved</label>
                                    </div>
                                    {formik.values.approved && (
                                        <div className="d-flex gap-2">
                                            <div>
                                                <label className="form-label">Approval Date</label>
                                                <input type="date" className="form-control mb-3" name={`approvalDate`} value={formik?.values?.approvalDate ? formatDateToISO(formik?.values?.approvalDate) : ""} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {formik.touched.approvalDate && formik.errors.approvalDate && (
                                                    <div className="text-danger">{formik.errors.approvalDate}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="form-label">Approved Amount</label>
                                                <input type="text" className="form-control mb-3" name={`approvedAmount`} value={formik?.values?.approvedAmount} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {formik.touched.approvedAmount && formik.errors.approvedAmount && (
                                                    <div className="text-danger">{formik.errors.approvedAmount}</div>
                                                )}
                                            </div>
                                            <div className="d-flex gap-2 align-items-center w-auto h-auto">
                                                <input type="checkbox" className="" id="approvalLetterPrivate" name={`approvalLetterPrivate`} value={formik?.values?.approvalLetterPrivate} checked={formik?.values?.approvalLetterPrivate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                <div>
                                                    <label className="form-label">Approval Letter</label>
                                                    <input type="file" id={"approvalLetter"} hidden={true} className="form-control" onChange={(e) => handleAttachment(e, "approvalLetter")} />
                                                </div>
                                                <div>
                                                    <div className="btn btn-primary" disabled={loading?.id == "approvalLetter"} onClick={() => handleFileClick("approvalLetter")}>{loading?.id == "approvalLetter" ? "Uploading" : (formik?.values?.approvalLetter ? "attachment" : "Upload")}</div>
                                                    {formik.touched.approvalLetter && formik.errors.approvalLetter && (
                                                        <div className="text-danger">{formik.errors.approvalLetter}</div>
                                                    )}
                                                </div>
                                            <div onClick={handleClearApproval} className="btn btn-primary w-auto h-auto">Clear</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Settlement Section */}
                            <div className="card shadow mt-3">
                                <div className="card-header bg-primary text-white">Settlement Details</div>
                                <div className="card-body">
                                    <div className="col-md-4">
                                        <input type="checkbox" id="isSettelment" name="isSettelment" value={formik?.values?.isSettelment} checked={formik?.values?.isSettelment} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        <label htmlFor="isSettelment" className="ms-2">Settelment</label>
                                    </div>
                                    {formik?.values?.isSettelment && <PaymentDetails formik={formik} />}

                                </div>
                            </div>
                        </form>
                    </FormikProvider>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={saving} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${saving && "disabled"}`} onClick={formik.handleSubmit}>
                        {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                    </div>
                </div>
                <Button disabled={saving} onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GROFormModal;
