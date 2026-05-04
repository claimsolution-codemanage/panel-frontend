import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IoMdAdd, IoMdCloudUpload } from 'react-icons/io';
import { FaFileImage, FaFileAudio, FaFileVideo, FaFilePdf, FaFileWord, FaFileExcel, FaFile, FaTrash, FaLock, FaLockOpen } from 'react-icons/fa';
import { docType } from '../../../utils/constant';
import DocumentPreview from '../../DocumentPreview';
import { getFileTypeFromExtension, formatFileSize } from '../../../utils/helperFunction';
import { AppContext } from '../../../App';
import { Eye } from 'lucide-react';

export default function AddDocsModal({ _id, uploadingDocs, getCaseById, setUploadingDocs, handleCaseDocsUploading, attachementUpload, type }) {
    const appState = useContext(AppContext);
    const docRef = useRef(null);
    const [data, setData] = useState([]);
    const [docInfo, setDocInfo] = useState({ isPrivate: false, docName: "", otherDocName: "" });
    const [loading, setLoading] = useState({ status: false, code: 0, type: "", message: "" });
    const [uploadProgress, setUploadProgress] = useState({});
    const [dragOver, setDragOver] = useState(false);

    const userDetails = appState?.myAppData?.details;
    const hasAccess = userDetails?.role?.toLowerCase() == "admin" || userDetails?.role?.toLowerCase() == "employee";

    // Get file icon
    const getFileIcon = (fileType, size = 24) => {
        switch (fileType) {
            case 'image': return <FaFileImage className="text-primary" size={size} />;
            case 'audio': return <FaFileAudio className="text-success" size={size} />;
            case 'video': return <FaFileVideo className="text-danger" size={size} />;
            case 'pdf': return <FaFilePdf className="text-danger" size={size} />;
            case 'word': return <FaFileWord className="text-primary" size={size} />;
            case 'excel': return <FaFileExcel className="text-success" size={size} />;
            default: return <FaFile className="text-secondary" size={size} />;
        }
    };

    // Function to open file selector
    const openFileSelector = () => {
        if (!loading.status && docRef.current) {
            docRef.current.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!docInfo.docName) {
            toast.error("Please select document type");
            return;
        }

        if (docInfo.docName.toLowerCase() === "other" && !docInfo.otherDocName.trim()) {
            toast.error("Please enter document name");
            return;
        }

        setLoading({ status: true, code: 1, type: "submit", message: "Adding files..." });

        try {
            const payload = data?.map(ele => ({
                ...ele,
                docName: docInfo?.otherDocName ? docInfo?.otherDocName : docInfo?.docName,
                new: true,
                isPrivate: docInfo?.isPrivate
            }));

            const res = await handleCaseDocsUploading(_id, { caseDocs: payload });

            if (res?.data?.success) {
                toast.success(res?.data?.message);
                setData([]);
                getCaseById && getCaseById();
                setDocInfo({ isPrivate: false, docName: "", otherDocName: "" });
                setLoading({ status: false, code: 1, type: "submit", message: res?.data?.message });
                setUploadingDocs(false);

                setTimeout(() => {
                    setLoading({ status: false, code: 0, type: "", message: "" });
                }, 2000);
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
            setLoading({ status: false, code: 2, type: "submit", message: errorMsg });

            setTimeout(() => {
                setLoading({ status: false, code: 0, type: "", message: "" });
            }, 3000);
        }
    };

    const handleAttachment = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await processFiles(files);
        }
        // Reset the input value to allow selecting the same file again
        if (docRef.current) {
            docRef.current.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await processFiles(files);
        }
    };

    const processFiles = async (files) => {
        const fileArray = [...files];
        const maxSize = 150 * 1024 * 1024; // 150MB
        const maxFiles = 20;

        // Check if adding these files would exceed max limit
        if (data.length + fileArray.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files. You already have ${data.length} file(s).`);
            return;
        }

        // Validate file size
        const oversizedFiles = fileArray.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            toast.error(`${oversizedFiles.length} file(s) exceed the 150MB limit`);
            return;
        }

        // Add fileType to each file
        const processedFiles = fileArray.map(file => {
            const fileExtension = file?.name?.split(".").pop().toLowerCase();
            file.fileType = getFileTypeFromExtension(fileExtension);
            file.fileSizeFormatted = formatFileSize(file.size);
            return file;
        });

        // Check if all files have valid fileType
        const isFileSupported = processedFiles.every(file => file.fileType);

        if (isFileSupported) {
            await uploadAttachmentFile(processedFiles);
        } else {
            toast.error("File format not supported. Supported formats: image, audio, pdf, video, Word, Excel.");
        }
    };

    const uploadAttachmentFile = async (files) => {
        setLoading({ status: true, code: 0, type: "uploading", message: "Uploading files..." });

        // Initialize progress for each file
        const initialProgress = {};
        files.forEach((_, index) => {
            initialProgress[index] = 0;
        });
        setUploadProgress(initialProgress);

        try {
            const uploadPromises = files.map(async (file, index) => {
                const formData = new FormData();
                formData.append("file", file);

                // Simulate progress
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => ({
                        ...prev,
                        [index]: Math.min(prev[index] + 10, 90)
                    }));
                }, 200);

                const result = await attachementUpload(file.fileType, formData);

                clearInterval(progressInterval);
                setUploadProgress(prev => ({
                    ...prev,
                    [index]: 100
                }));

                return { result, index, file };
            });

            const results = await Promise.all(uploadPromises);
            const allSuccess = results.every(r => r.result?.data?.success);

            if (allSuccess) {
                const newAttachments = results.map(({ result, file }) => ({
                    docDate: new Date().toLocaleDateString(),
                    docType: file.fileType,
                    docFormat: file.fileType,
                    docURL: result?.data?.url,
                    fileName: file.name,
                    fileSize: file.size,
                    fileSizeFormatted: file.fileSizeFormatted
                }));

                setData(prevData => [...prevData, ...newAttachments]);
                setLoading({ status: false, code: 1, type: "uploading", message: `${newAttachments.length} file(s) uploaded successfully.` });
                toast.success(`${newAttachments.length} file(s) uploaded successfully`);

                setTimeout(() => {
                    setLoading({ status: false, code: 0, type: "", message: "" });
                    setUploadProgress({});
                }, 2000);
            } else {
                throw new Error("Some files failed to upload");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Some files failed to upload");
            setLoading({ status: false, code: 2, type: "uploading", message: "Upload failed. Please try again." });

            setTimeout(() => {
                setLoading({ status: false, code: 0, type: "", message: "" });
            }, 3000);
        }
    };

    const handleRemoveDoc = (doc, ind) => {
        const updatedList = data?.filter((_, index) => index !== ind);
        setData(updatedList);
        toast.info("Document removed");
    };

    const handleOpenFile = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <Modal
            show={uploadingDocs}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={!loading.status}
            onHide={() => !loading.status && setUploadingDocs(false)}
        >
            <Modal.Body className='p-0'>
                <div className='p-4'>
                    {/* Header */}
                    <div className="border-bottom pb-3 mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="text-primary fw-bold mb-0">Add Documents</h5>
                                <p className="text-muted small mt-1 mb-0">
                                    Upload up to 20 files (Max 150MB per file)
                                </p>
                            </div>
                            <div className="text-muted">
                                <FaFile className="me-1" /> {data.length}/20 files
                            </div>
                        </div>
                    </div>

                    {/* Private Switch */}
                    {hasAccess && type !== "docEmp" && (
                        <div className="mb-4">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="privateSwitch"
                                    checked={docInfo?.isPrivate}
                                    onChange={(e) => setDocInfo({ ...docInfo, isPrivate: e?.target?.checked })}
                                />
                                <label className="form-check-label fw-medium" htmlFor="privateSwitch">
                                    {docInfo?.isPrivate ? <FaLock className="me-1" size={12} /> : <FaLockOpen className="me-1" size={12} />}
                                    Private Document
                                </label>
                                <small className="text-muted d-block mt-1">
                                    Only visible to you and administrators
                                </small>
                            </div>
                        </div>
                    )}

                    {/* Document Type Selection */}
                    <div className="mb-4">
                        <label className="form-label fw-medium">Document Type *</label>
                        <select
                            className="form-select"
                            value={docInfo?.docName}
                            onChange={(e) => setDocInfo({ ...docInfo, otherDocName: "", docName: e?.target?.value })}
                        >
                            <option value="">-- Select Document Type --</option>
                            {docType?.map((type, idx) => (
                                <option key={idx} value={type.value}>{type.label}</option>
                            ))}
                        </select>

                        {docInfo?.docName?.toLowerCase() === "other" && (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter document name (max 60 characters)"
                                    value={docInfo?.otherDocName}
                                    onChange={(e) => e?.target?.value?.length < 60 && setDocInfo({ ...docInfo, otherDocName: e?.target?.value })}
                                />
                                <small className="text-muted">
                                    {docInfo?.otherDocName?.length || 0}/60 characters
                                </small>
                            </div>
                        )}
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={docRef}
                        multiple={true}
                        onChange={handleAttachment}
                        name="caseDoc"
                        hidden={true}
                    />

                    {/* Upload Area - Only show when no files are selected */}
                    {data.length === 0 && (
                        <div
                            className={`upload-area border-2 border-dashed rounded-3 p-5 text-center mb-4 ${dragOver ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            onClick={openFileSelector}
                        >
                            <IoMdCloudUpload className="mb-3" size={48} color="#6c757d" />
                            <h6 className="mb-2">Drag & drop files here or click to browse</h6>
                            <small className="text-muted">
                                Supported: Images, PDF, Word, Excel, Audio, Video (Max 150MB each)
                            </small>
                        </div>
                    )}

                    {/* Upload Progress */}
                    {loading.type === "uploading" && loading.status && Object.keys(uploadProgress).length > 0 && (
                        <div className="mb-4 p-3 bg-light rounded border">
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between mb-1">
                                        <small className="fw-medium">Uploading files...</small>
                                        <small className="text-primary fw-medium">
                                            {Object.values(uploadProgress).filter(p => p === 100).length}/{Object.keys(uploadProgress).length}
                                        </small>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: `${Object.values(uploadProgress).reduce((a, b) => a + b, 0) / Object.keys(uploadProgress).length}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents Grid */}
                    {data.length > 0 && (
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <label className="form-label fw-medium mb-0">Selected Documents ({data.length})</label>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={openFileSelector}
                                    disabled={loading.status || data.length >= 20}
                                >
                                    <IoMdAdd className="me-1" /> Add More Files
                                </Button>
                            </div>

                            <div className="row g-3">
                                {data?.map((doc, ind) => (
                                    <div key={ind} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="document-card border rounded-3 overflow-hidden bg-white h-100">
                                            <div className="position-relative">
                                                <div
                                                    className="document-preview d-flex justify-content-center align-items-center p-3 bg-light"
                                                    style={{ height: '150px', cursor: 'pointer' }}
                                                    onClick={() => handleOpenFile(doc?.docURL)}
                                                >
                                                    <DocumentPreview url={doc?.docURL} />
                                                </div>
                                                <button
                                                    className="position-absolute top-0 end-0 btn btn-sm btn-danger m-2"
                                                    onClick={() => handleRemoveDoc(doc, ind)}
                                                    style={{ borderRadius: '50%', padding: '4px 8px' }}
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                            <div className="p-3">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    {getFileIcon(doc?.docType, 16)}
                                                    <div className="flex-grow-1">
                                                        <div className="fw-medium small text-truncate" title={doc?.fileName || docInfo?.otherDocName || docInfo?.docName}>
                                                            {doc?.fileName || docInfo?.otherDocName || docInfo?.docName}
                                                        </div>
                                                        {doc?.fileSizeFormatted && (
                                                            <small className="text-muted">{doc.fileSizeFormatted}</small>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-muted small d-flex justify-content-end">
                                                    <div onClick={() => handleOpenFile(doc?.docURL)} className='d-flex align-items-center gap-1 text-primary' style={{ cursor: 'pointer' }}>
                                                        <span>View</span>
                                                        <Eye size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Message */}
                    {loading?.message && (
                        <div className={`alert alert-${loading.code === 2 ? 'danger' : 'success'} alert-dismissible fade show mb-3`} role="alert">
                            {loading.message}
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className="border-top bg-light p-3">
                <div className="d-flex justify-content-end gap-2 w-100">
                    <Button
                        variant="secondary"
                        onClick={() => !loading.status && setUploadingDocs(false)}
                        disabled={loading.status}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading.status || !data?.length || !docInfo.docName || (docInfo.docName.toLowerCase() === "other" && !docInfo.otherDocName)}
                        variant="primary"
                        onClick={handleSubmit}
                        className="d-flex align-items-center gap-2 px-4"
                    >
                        {loading.status && loading.type === "submit" ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <IoMdCloudUpload />
                                <span>Add {data.length} Document{data.length !== 1 ? 's' : ''}</span>
                            </>
                        )}
                    </Button>
                </div>
            </Modal.Footer>

            <style jsx>{`
                .upload-area {
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .upload-area:hover {
                    border-color: var(--bs-primary) !important;
                    background-color: rgba(var(--bs-primary-rgb), 0.05) !important;
                }
                
                .document-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .document-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                .border-dashed {
                    border-style: dashed !important;
                }
            `}</style>
        </Modal>
    );
}