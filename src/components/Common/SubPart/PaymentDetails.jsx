import React, { useState, useRef } from 'react';
import { checkNumber, formatDateToISO } from '../../../utils/helperFunction';
import { toast } from 'react-toastify';
import DocumentPreview from '../../DocumentPreview';
import { FaTrash, FaCloudUploadAlt, FaFileImage, FaFilePdf } from 'react-icons/fa';
import { MdAttachFile } from 'react-icons/md';

export default function PaymentDetails({ formik, attachementUpload }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleResetForm = () => {
        const resetFields = ["paymentMode", "dateOfPayment", "utrNumber", "bankName", "chequeNumber", "chequeDate", "transactionDate", "amount"];
        resetFields?.forEach(ele => {
            formik.setFieldValue(ele, "");
        });
    };

    const attachments = formik?.values?.attachments || [];

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // Rule 1: Max 5 files
        if (attachments.length + files.length > 5) {
            toast.error(`You can only upload up to 5 attachments. You currently have ${attachments.length}.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const allowedTypes = ["jpg", "jpeg", "png", "gif", "bmp", "jfif", "webp", "pdf"];
        const invalidTypeFiles = [];
        const oversizedFiles = [];

        files.forEach(file => {
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!allowedTypes.includes(ext)) {
                invalidTypeFiles.push(file.name);
            }
            // Rule 2: Max 10MB per file
            if (file.size > 10 * 1024 * 1024) {
                oversizedFiles.push(file.name);
            }
        });

        if (invalidTypeFiles.length > 0) {
            toast.error("Invalid file format. Only Image and PDF files are allowed.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (oversizedFiles.length > 0) {
            toast.error("File size exceeds 10MB limit. Please choose smaller files.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (!attachementUpload) {
            toast.error("Attachment upload service is unavailable.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setUploading(true);
        try {
            const newUrls = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                const ext = file.name.split('.').pop()?.toLowerCase();
                const fileType = ext === 'pdf' ? 'pdf' : 'image';

                const res = await attachementUpload(fileType, formData);
                if (res?.data?.url) {
                    newUrls.push(res.data.url);
                } else {
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            if (newUrls.length > 0) {
                formik.setFieldValue("attachments", [...attachments, ...newUrls]);
                toast.success(`${newUrls.length} file(s) attached successfully.`);
            }
        } catch (error) {
            console.error("Error uploading attachment:", error);
            const msg = error?.response?.data?.message || "Failed to upload payment attachment.";
            toast.error(msg);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveAttachment = (indexToRemove) => {
        const updated = attachments.filter((_, idx) => idx !== indexToRemove);
        formik.setFieldValue("attachments", updated);
        toast.info("Attachment removed.");
    };

    return (
        <div>
            <div className="row g-3">
                {/* Payment Mode */}
                <div className="col-12 col-md-6">
                    <label htmlFor="paymentMode" className={`form-label fw-semibold ${formik?.touched?.paymentMode && formik?.errors?.paymentMode ? "text-danger" : ""}`}>
                        Payment Mode *
                    </label>
                    <select
                        name="paymentMode"
                        className={`form-select ${formik?.touched?.paymentMode && formik?.errors?.paymentMode ? "is-invalid" : ""}`}
                        value={formik?.values?.paymentMode}
                        onChange={(e) => { handleResetForm(); formik.handleChange(e); }}
                    >
                        <option value="">Select Payment Mode</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Web">Web</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Net Banking">Net Banking</option>
                    </select>
                    {formik?.touched?.paymentMode && formik?.errors?.paymentMode ? (
                        <div className="invalid-feedback">{formik?.errors?.paymentMode}</div>
                    ) : null}
                </div>

                {/* Date of Payment */}
                <div className="col-12 col-md-6">
                    <label htmlFor="dateOfPayment" className={`form-label fw-semibold ${formik?.touched?.dateOfPayment && formik?.errors?.dateOfPayment ? "text-danger" : ""}`}>
                        Date of Payment *
                    </label>
                    <input
                        type="date"
                        className={`form-control ${formik?.touched?.dateOfPayment && formik?.errors?.dateOfPayment ? "is-invalid" : ""}`}
                        id="dateOfPayment"
                        name="dateOfPayment"
                        value={formik?.values?.dateOfPayment ? formatDateToISO(formik?.values?.dateOfPayment) : ""}
                        onChange={formik.handleChange}
                    />
                    {formik?.touched?.dateOfPayment && formik?.errors?.dateOfPayment ? (
                        <div className="invalid-feedback">{formik?.errors?.dateOfPayment}</div>
                    ) : null}
                </div>

                {/* UPI Fields */}
                {formik?.values?.paymentMode === "UPI" && (
                    <div className="col-12">
                        <label htmlFor="utrNumber" className={`form-label fw-semibold ${formik?.touched?.utrNumber && formik?.errors?.utrNumber ? "text-danger" : ""}`}>
                            UTR Number *
                        </label>
                        <input
                            type="text"
                            className={`form-control ${formik?.touched?.utrNumber && formik?.errors?.utrNumber ? "is-invalid" : ""}`}
                            id="utrNumber"
                            name="utrNumber"
                            value={formik?.values?.utrNumber}
                            onChange={formik.handleChange}
                            placeholder="Enter UTR Number"
                        />
                        {formik?.touched?.utrNumber && formik?.errors?.utrNumber ? (
                            <div className="invalid-feedback">{formik?.errors?.utrNumber}</div>
                        ) : null}
                    </div>
                )}

                {/* Cheque Fields */}
                {formik?.values?.paymentMode === "Cheque" && (
                    <>
                        <div className="col-12 col-md-6">
                            <label htmlFor="bankName" className={`form-label fw-semibold ${formik?.touched?.bankName && formik?.errors?.bankName ? "text-danger" : ""}`}>
                                Bank Name *
                            </label>
                            <input
                                type="text"
                                className={`form-control ${formik?.touched?.bankName && formik?.errors?.bankName ? "is-invalid" : ""}`}
                                id="bankName"
                                name="bankName"
                                value={formik?.values?.bankName}
                                onChange={formik.handleChange}
                                placeholder="Enter Bank Name"
                            />
                            {formik?.touched?.bankName && formik?.errors?.bankName ? (
                                <div className="invalid-feedback">{formik?.errors?.bankName}</div>
                            ) : null}
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="chequeNumber" className={`form-label fw-semibold ${formik?.touched?.chequeNumber && formik?.errors?.chequeNumber ? "text-danger" : ""}`}>
                                Cheque Number *
                            </label>
                            <input
                                type="text"
                                className={`form-control ${formik?.touched?.chequeNumber && formik?.errors?.chequeNumber ? "is-invalid" : ""}`}
                                id="chequeNumber"
                                name="chequeNumber"
                                value={formik?.values?.chequeNumber}
                                onChange={formik.handleChange}
                                placeholder="Enter Cheque Number"
                            />
                            {formik?.touched?.chequeNumber && formik?.errors?.chequeNumber ? (
                                <div className="invalid-feedback">{formik?.errors?.chequeNumber}</div>
                            ) : null}
                        </div>

                        <div className="col-12">
                            <label htmlFor="chequeDate" className={`form-label fw-semibold ${formik?.touched?.chequeDate && formik?.errors?.chequeDate ? "text-danger" : ""}`}>
                                Cheque Date *
                            </label>
                            <input
                                type="date"
                                className={`form-control ${formik?.touched?.chequeDate && formik?.errors?.chequeDate ? "is-invalid" : ""}`}
                                id="chequeDate"
                                name="chequeDate"
                                value={formik?.values?.chequeDate ? formatDateToISO(formik?.values?.chequeDate) : ""}
                                onChange={formik.handleChange}
                            />
                            {formik?.touched?.chequeDate && formik?.errors?.chequeDate ? (
                                <div className="invalid-feedback">{formik?.errors?.chequeDate}</div>
                            ) : null}
                        </div>
                    </>
                )}

                {/* Net Banking Fields */}
                {formik?.values?.paymentMode === "Net Banking" && (
                    <>
                        <div className="col-12 col-md-6">
                            <label htmlFor="bankName" className={`form-label fw-semibold ${formik?.touched?.bankName && formik?.errors?.bankName ? "text-danger" : ""}`}>
                                Bank Name *
                            </label>
                            <input
                                type="text"
                                className={`form-control ${formik?.touched?.bankName && formik?.errors?.bankName ? "is-invalid" : ""}`}
                                id="bankName"
                                name="bankName"
                                value={formik?.values?.bankName}
                                onChange={formik.handleChange}
                                placeholder="Enter Bank Name"
                            />
                            {formik?.touched?.bankName && formik?.errors?.bankName ? (
                                <div className="invalid-feedback">{formik?.errors?.bankName}</div>
                            ) : null}
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="utrNumber" className={`form-label fw-semibold ${formik?.touched?.utrNumber && formik?.errors?.utrNumber ? "text-danger" : ""}`}>
                                UTR Number *
                            </label>
                            <input
                                type="text"
                                className={`form-control ${formik?.touched?.utrNumber && formik?.errors?.utrNumber ? "is-invalid" : ""}`}
                                id="utrNumber"
                                name="utrNumber"
                                value={formik?.values?.utrNumber}
                                onChange={formik.handleChange}
                                placeholder="Enter UTR Number"
                            />
                            {formik?.touched?.utrNumber && formik?.errors?.utrNumber ? (
                                <div className="invalid-feedback">{formik?.errors?.utrNumber}</div>
                            ) : null}
                        </div>

                        <div className="col-12">
                            <label htmlFor="transactionDate" className={`form-label fw-semibold ${formik?.touched?.transactionDate && formik?.errors?.transactionDate ? "text-danger" : ""}`}>
                                Transaction Date *
                            </label>
                            <input
                                type="date"
                                className={`form-control ${formik?.touched?.transactionDate && formik?.errors?.transactionDate ? "is-invalid" : ""}`}
                                id="transactionDate"
                                name="transactionDate"
                                value={formik?.values?.transactionDate ? formatDateToISO(formik?.values?.transactionDate) : ""}
                                onChange={formik.handleChange}
                            />
                            {formik?.touched?.transactionDate && formik?.errors?.transactionDate ? (
                                <div className="invalid-feedback">{formik?.errors?.transactionDate}</div>
                            ) : null}
                        </div>
                    </>
                )}

                {/* Amount */}
                <div className="col-12">
                    <label htmlFor="amount" className={`form-label fw-semibold ${formik?.touched?.amount && formik?.errors?.amount ? "text-danger" : ""}`}>
                        Amount *
                    </label>
                    <input
                        type="text"
                        className={`form-control ${formik?.touched?.amount && formik?.errors?.amount ? "is-invalid" : ""}`}
                        id="amount"
                        name="amount"
                        value={formik?.values?.amount}
                        onChange={(e) => checkNumber(e) && formik.handleChange(e)}
                        placeholder="Enter Amount"
                    />
                    {formik?.touched?.amount && formik?.errors?.amount ? (
                        <div className="invalid-feedback">{formik?.errors?.amount}</div>
                    ) : null}
                </div>

                {/* Attachments Upload Section */}
                <div className="col-12 border-top pt-3 mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                            <MdAttachFile className="text-primary fs-5" />
                            <span>Payment Attachments ({attachments.length}/5)</span>
                        </label>
                        <span className="badge bg-light text-secondary border">Max 10MB per file (Image/PDF)</span>
                    </div>

                    {/* File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,.pdf"
                        multiple
                        hidden
                    />

                    {/* Upload Drop Zone / Button */}
                    {attachments.length < 5 && (
                        <div
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            className="border-2 border-dashed rounded-3 p-3 text-center bg-light transition-all mb-3"
                            style={{ cursor: uploading ? 'not-allowed' : 'pointer', borderStyle: 'dashed' }}
                        >
                            {uploading ? (
                                <div className="d-flex align-items-center justify-content-center gap-2 py-2">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Uploading...</span>
                                    </div>
                                    <span className="fw-semibold text-primary">Uploading attachment(s)...</span>
                                </div>
                            ) : (
                                <div className="py-2">
                                    <FaCloudUploadAlt className="fs-2 text-primary mb-1" />
                                    <p className="mb-0 fw-semibold text-dark small">Click to upload payment receipts or proof</p>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Supported: PNG, JPG, JPEG, PDF (Max 10MB)</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attachments List / Grid */}
                    {attachments.length > 0 && (
                        <div className="row g-2 mt-1">
                            {attachments.map((url, index) => (
                                <div key={index} className="col-6 col-sm-4 col-md-3">
                                    <div className="card h-100 border rounded-3 overflow-hidden bg-white position-relative shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(index)}
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1 d-flex align-items-center justify-content-center z-3"
                                            style={{ width: 24, height: 24 }}
                                            title="Delete Attachment"
                                        >
                                            <FaTrash size={10} />
                                        </button>

                                        <div className="p-1 bg-light d-flex align-items-center justify-content-center" style={{ height: '110px' }}>
                                            <DocumentPreview url={url} height="100px" maxWidth="100%" />
                                        </div>

                                        <div className="p-1.5 text-center bg-white border-top">
                                            <span className="small text-muted d-block text-truncate">Attachment #{index + 1}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
