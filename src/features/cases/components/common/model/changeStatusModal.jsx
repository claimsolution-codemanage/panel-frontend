import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { caseMailMethod, caseStatus } from '../../../../../utils/constant';
import { useContext, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../../../../../components/TextEditor';
import { formatDateToISO } from '../../../../../utils/helperFunction';
import { AppContext } from '../../../../../App';
import DocumentPreview from '../../../../../components/DocumentPreview';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import { MdAttachFile } from 'react-icons/md';

const minDate = formatDateToISO(new Date(new Date().setDate(new Date().getDate() + 1)))

export default function ChangeStatusModal({ changeStatus, setChangeStatus, handleCaseStatus, getCaseById, attachementUpload }) {
    const isEdit = !!changeStatus?.details?.processId;
    const [data, setData] = useState(() => {
        const details = changeStatus?.details;
        if (isEdit) {
            return {
                caseId: details?.caseId,
                processId: details?.processId,
                status: details?.caseStatus || "",
                remark: details?.caseRemark || "",
                nextFollowUp: details?.nextFollowUp ? formatDateToISO(details?.nextFollowUp) : "",
                attachments: details?.attachments || [],
                otherDetails: details?.otherDetails ? { ...details?.otherDetails } : {},
                isCurrentStatus: details?.isCurrentStatus || false
            };
        } else {
            return {
                _id: details?._id,
                status: "",
                remark: "",
                mailMethod: "None",
                nextFollowUp: "",
                attachments: [],
                otherDetails: {}
            };
        }
    });
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)
    const state = useContext(AppContext)
    const empType = state?.myAppData?.details?.empType

    const isSalesEmp = empType?.toLowerCase() === "sales"
    const statusList = isSalesEmp ? caseStatus?.filter(item => ["Accept", "Under Expert Review", "Processing", "Query"].includes(item)) : caseStatus

    const attachments = data?.attachments || [];

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

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
                setData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, ...newUrls]
                }));
                toast.success(`${newUrls.length} file(s) attached successfully.`);
            }
        } catch (error) {
            console.error("Error uploading attachment:", error);
            const msg = error?.response?.data?.message || "Failed to upload attachment.";
            toast.error(msg);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveAttachment = (indexToRemove) => {
        const updated = attachments.filter((_, idx) => idx !== indexToRemove);
        setData(prev => ({
            ...prev,
            attachments: updated
        }));
        toast.info("Attachment removed.");
    };

    const hangleOnchange = (e) => {
        const { name, value } = e.target;
        if (name == "status") {
            setData({ ...data, [name]: value, otherDetails: {} })
        } else {
            setData({ ...data, [name]: value })
        }
    }

    const handleSumbit = async (e) => {
        setLoading(true)
        try {
            const res = await handleCaseStatus(data)
            if (res?.data?.success) {
                setChangeStatus({ status: false, details: "" })
                toast.success(res?.data?.message)
                setLoading(false)
                if (getCaseById) {
                    getCaseById()
                }
            }
            setLoading(false)
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)

            } else {
                toast.error("Something went wrong")

            }
            setLoading(false)
        }
    }

    const handleSave = () => {
        if (data?.remark?.trim()) {
            handleSumbit()
        }
    }

    const addOneMonthToISO = (date = new Date()) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + 12);
        return d.toISOString().split("T")[0];
    };

    return (
        <Modal
            show={changeStatus?.status}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-2">
                        <h6 className="text-primary text-center fs-3">{isEdit ? "Edit Case Status" : "Change Case Status"}</h6>
                    </div>
                    {changeStatus?.details?.currentStatus && (
                        <div className='text-center'>
                            <p className='badge bg-primary fs-6'>Current Status: {changeStatus?.details?.currentStatus}</p>
                        </div>
                    )}
                    {(changeStatus?.details?.name || changeStatus?.details?.fileNo) && (
                        <div className='d-flex gap-3 h5 justify-content-center'>
                            {changeStatus?.details?.name && <p className='p-0 m-0'>Name: {changeStatus?.details?.name}</p>}
                            {changeStatus?.details?.fileNo && <p className='p-0 m-0'>File No.: {changeStatus?.details?.fileNo}</p>}
                        </div>
                    )}

                    <div className="mb-1">
                        <label htmlFor={"status"} className='col-form-label'>Case Status</label>
                        <select className="form-select color-4" name="status" value={data?.status} onChange={hangleOnchange} aria-label="Default select example">
                            <option>--Select Case Status</option>
                            {statusList?.map(item => <option className='' key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div className={`row w-100 ${isEdit ? 'row-cols-1' : 'row-cols-1 row-cols-lg-2'}`}>
                        {!isEdit && (
                            <div className="mb-1">
                                <label htmlFor={"mailMethod"} className='col-form-label'>Mail Method</label>
                                <select className="form-select color-4" name="mailMethod" value={data?.mailMethod} onChange={hangleOnchange} aria-label="Default select example">
                                    <option>--Mail Method</option>
                                    {caseMailMethod?.map(ele => <option className='' key={ele} value={ele}>{ele}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="mb-1">
                            <label htmlFor={"nextFollowUp"} className='col-form-label'>Next follow-up date</label>
                            <input
                                type={"date"}
                                name={"nextFollowUp"}
                                placeholder={"Next follow-up date"}
                                min={minDate}
                                max={addOneMonthToISO(new Date())}
                                value={data?.nextFollowUp ? formatDateToISO(data?.nextFollowUp) : ''}
                                onChange={hangleOnchange}
                                className="form-control" />
                        </div>
                    </div>
                    {data?.status == "Case file in court" && <div className='row row-cols-1 row-cols-lg-2 w-100'>
                        <div className="mb-1">
                            <label htmlFor={"caseNumber"} className='col-form-label'>Case Number</label>
                            <input
                                type={"text"}
                                name={"caseNumber"}
                                placeholder={"Case Number"}
                                value={data?.otherDetails?.caseNumber || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, caseNumber: e.target.value } })}
                                className="form-control" />
                        </div>
                        <div className="mb-1">
                            <label htmlFor={"courtName"} className='col-form-label'>Court/Forum Name</label>
                            <input
                                type={"text"}
                                name={"courtName"}
                                placeholder={"Court/Forum Name"}
                                value={data?.otherDetails?.courtName || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, courtName: e.target.value } })}
                                className="form-control" />
                        </div>
                        <div className="mb-1">
                            <label htmlFor={"courtAddress"} className='col-form-label'>Court/Forum Address</label>
                            <input
                                type={"text"}
                                name={"courtAddress"}
                                placeholder={"Court/Forum Address"}
                                value={data?.otherDetails?.courtAddress || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, courtAddress: e.target.value } })}
                                className="form-control" />
                        </div>
                        <div className="mb-1">
                            <label htmlFor={"nextHearingDate"} className='col-form-label'>Next Hearing Date</label>
                            <input
                                type={"date"}
                                name={"nextHearingDate"}
                                placeholder={"Next Hearing Date"}
                                value={data?.otherDetails?.nextHearingDate || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, nextHearingDate: e.target.value } })}
                                className="form-control" />
                        </div>
                    </div>}
                    <div className="mb-1 col-12">
                        <label htmlFor={"remark"} className='col-form-label'>Remark</label>
                        <TextEditor value={data?.remark || ""} handleOnChange={(val) => setData({ ...data, remark: val })} />
                    </div>

                    {/* Attachments Section */}
                    <div className="col-12 border-top pt-3 mt-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                <MdAttachFile className="text-primary fs-5" />
                                <span>Attachments ({attachments.length}/5)</span>
                            </label>
                            <span className="badge bg-light text-secondary border">Max 10MB per file (Image/PDF)</span>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,.pdf"
                            multiple
                            hidden
                        />

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
                                        <p className="mb-0 fw-semibold text-dark small">Click to upload receipts or proof</p>
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Supported: PNG, JPG, JPEG, PDF (Max 10MB)</span>
                                    </div>
                                )}
                            </div>
                        )}

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

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={handleSave}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                    </div>
                </div>
                <Button onClick={() => setChangeStatus({ status: false, details: "" })}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}