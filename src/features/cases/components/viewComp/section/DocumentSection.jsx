import React, { useEffect, useState, useRef } from 'react'
import DocumentPreview from '../../../../../components/DocumentPreview'
import { getCheckStorage } from '../../../../../utils/helperFunction'
import { FaFileWord, FaEdit, FaSave, FaTimes, FaFolderOpen } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoArrowBackCircleOutline, IoFolder } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import AddDocsModal from '../../../../../components/Common/Modal/addDocsModal'
import ConfirmationModal from '../../../../../components/Common/Modal/confirmationModal'
import SetStatusOfProfile from '../../../../../components/Common/Modal/setStatusModal'
import { toast } from 'react-toastify'
import { CiLock } from 'react-icons/ci'
import { Button } from 'react-bootstrap'
import { Eye, EyeOff } from 'lucide-react'

export default function DocumentSection({ role, data, getCaseById, attachementUpload, addCaseDoc, deleteDoc, setCaseDocStatus, renameDocFolder, isRenameDocFolder }) {
    const [uploadingDocs, setUploadingDocs] = useState(false)
    const [folderInfo, setFolderInfo] = useState({})
    const [fileInfo, setFileInfo] = useState({ type: null, list: [] })
    const [changeisActiveStatus, setChangeIsActiveStatus] = useState({ show: false, details: {} })
    const [deleteCaseDoc, setDeleteCaseDoc] = useState({ status: false, id: null })
    const [showDocList, setShowDocList] = useState(false)
    const [editingFolder, setEditingFolder] = useState(null)
    const [newFolderName, setNewFolderName] = useState('')
    const containerRef = useRef(null)
    const fileContainerRef = useRef(null)

    useEffect(() => {
        let caseDocs = data?.[0]?.caseDocs
        if (Array.isArray(caseDocs)) {
            let folder = {}
            caseDocs?.forEach(ele => {
                let type = ele?.name?.toLowerCase() || "other"
                if (folder[type]) {
                    folder[type] = [...folder[type], ele]
                } else {
                    folder[type] = [ele]
                }
            })
            setFolderInfo(folder)
        }
    }, [data])

    // Scroll to top when opening a folder
    useEffect(() => {
        if (fileInfo?.type && fileContainerRef.current) {
            setTimeout(() => {
                fileContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
            }, 100)
        }
    }, [fileInfo?.type])

    const handleChanges = async (_id, status) => {
        try {
            const res = await setCaseDocStatus(_id, status)
            if (res?.data?.success) {
                setChangeIsActiveStatus({ show: false, details: {} })
                toast.success(res?.data?.message)
                if (getCaseById) {
                    getCaseById()
                }
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    const handleShareDocument = (type, data) => {
        const docUrl = getCheckStorage(data?.url)
        if (!docUrl) return
        if (type == "whatsapp") {
            const message = `Document share from ClaimSolution. Check out this document: ${data?.name || "document"}\n${docUrl}`
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, "_blank")
        } else if (type == "email") {
            const subject = `Document share from ClaimSolution`
            const body = `Hi,\n\nCheck out this document: ${data?.name || "document"}\n\nPlease find the document link below:\n${docUrl}\n\nRegards\nClaimSolution`
            const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            window.open(emailUrl, "_blank")
        }
    }

    const handleFolderClick = (folderName, folderData) => {
        if (Array.isArray(folderData)) {
            setFileInfo({ type: folderName, list: folderData })
        }
    }

    const handleBackClick = () => {
        setFileInfo({ type: null, list: [] })
    }

    const startEditingFolder = (folderName, e) => {
        e.stopPropagation()
        setEditingFolder(folderName)
        setNewFolderName(folderName)
    }

    const cancelEditingFolder = (e) => {
        if (e) e.stopPropagation()
        setEditingFolder(null)
        setNewFolderName('')
    }

    const saveFolderName = async (oldFolderName, e) => {
        e.stopPropagation()

        if (!newFolderName.trim()) {
            toast.error("Folder name cannot be empty")
            return
        }

        if (newFolderName.toLowerCase() === oldFolderName.toLowerCase()) {
            cancelEditingFolder(e)
            return
        }

        if (folderInfo[newFolderName.toLowerCase()]) {
            toast.error("A folder with this name already exists")
            return
        }

        try {
            const documentsToUpdate = folderInfo[oldFolderName]

            await renameDocFolder({ documentIds: documentsToUpdate.map(doc => doc._id), newFolderName })

            const updatedFolderInfo = { ...folderInfo }
            updatedFolderInfo[newFolderName.toLowerCase()] = updatedFolderInfo[oldFolderName]
            delete updatedFolderInfo[oldFolderName]
            setFolderInfo(updatedFolderInfo)

            toast.success(`Folder renamed to "${newFolderName}"`)
            cancelEditingFolder(e)
        } catch (error) {
            console.log("error", error)
            toast.error("Failed to rename folder")
        }
    }

    return (
        <div className="document-section-wrapper">
            <div className="bg-color-1 rounded-2 shadow">
                {/* Header Section */}
                <div className="border-bottom border-primary p-4">
                    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                        <div className="d-flex gap-3 align-items-center">
                            {fileInfo?.type && (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleBackClick}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <IoArrowBackCircleOutline size={20} />
                                    {/* Back */}
                                </Button>
                            )}
                            <div>
                                <h5 className="text-primary mb-0">
                                    {fileInfo?.type ? (
                                        <span className="text-capitalize d-flex align-items-center gap-2 text-break">
                                            <FaFolderOpen className="text-primary" />
                                            {fileInfo.type}
                                        </span>
                                    ) : (
                                        "Document Library"
                                    )}
                                </h5>
                                {!fileInfo?.type && (
                                    <small className="text-muted">
                                        {Object.keys(folderInfo).length} folder(s) • Total documents: {Object.values(folderInfo).reduce((sum, docs) => sum + docs.length, 0)}
                                    </small>
                                )}
                                {fileInfo?.type && (
                                    <small className="text-muted d-block  text-truncate">
                                        {fileInfo.list.length} documents
                                        in this folder
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setUploadingDocs(true)}
                                className="d-flex align-items-center gap-2"
                            >
                                <IoMdAdd size={18} />
                                Add Document
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setShowDocList(!showDocList)}
                                className="d-flex align-items-center gap-2"
                            >
                                {showDocList ? (
                                    <><EyeOff size={16} /> Hide</>
                                ) : (
                                    <><Eye size={16} /> View</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {showDocList && (
                    <div
                        ref={containerRef}
                        className="document-content p-4"
                        style={{ minHeight: '500px', maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}
                    >
                        {/* Folder List View */}
                        {!fileInfo?.type && (
                            <div className="folder-view">
                                {Object.keys(folderInfo).length > 0 ? (
                                    <div className="row g-4">
                                        {Object.keys(folderInfo)?.map(ele => (
                                            <div key={ele} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                <div
                                                    className="folder-card"
                                                    onClick={() => handleFolderClick(ele, folderInfo[ele])}
                                                >
                                                    <div className="folder-card-inner">
                                                        <div className="folder-icon-wrapper">
                                                            <div className="folder-icon">
                                                                <IoFolder size={48} />
                                                            </div>
                                                            {editingFolder === ele ? (
                                                                <div
                                                                    className="folder-edit-form"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        value={newFolderName}
                                                                        onChange={(e) => { e.target.value.length <= 60 && setNewFolderName(e.target.value) }}
                                                                        autoFocus
                                                                        onKeyPress={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                saveFolderName(ele, e)
                                                                            }
                                                                        }}
                                                                    />
                                                                    <div className="d-flex gap-1 mt-2">
                                                                        <button
                                                                            className="btn btn-sm btn-outline-success"
                                                                            onClick={(e) => saveFolderName(ele, e)}
                                                                        >
                                                                            <FaSave size={12} />
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={cancelEditingFolder}
                                                                        >
                                                                            <FaTimes size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {isRenameDocFolder && <button
                                                                        className="folder-edit-btn"
                                                                        onClick={(e) => startEditingFolder(ele, e)}
                                                                        title="Rename folder"
                                                                    >
                                                                        <FaEdit size={14} />
                                                                    </button>}
                                                                    <div className="folder-info">
                                                                        <h6 className="folder-name text-capitalize mb-1 text-break">
                                                                            {ele}
                                                                        </h6>
                                                                        <small className="folder-count text-muted">
                                                                            {folderInfo[ele]?.length} documents
                                                                        </small>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <IoFolder size={64} className="text-muted mb-3" />
                                        <h6 className="text-muted">No documents found</h6>
                                        <p className="text-muted small">Click the "Add Document" button to upload files</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* File List View */}
                        {fileInfo?.type && fileInfo?.list?.length > 0 && (
                            <div
                                ref={fileContainerRef}
                                className="file-view"
                            >
                                <div className="row g-4">
                                    {fileInfo?.list?.map(item => (
                                        <div key={item?._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="document-card">
                                                <div className="document-card-inner">
                                                    <div className="document-header">
                                                        {item?.isPrivate && (
                                                            <CiLock className="private-icon" title="Private Document" />
                                                        )}
                                                        <div className="dropdown">
                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <Link
                                                                        className="dropdown-item"
                                                                        to={`${getCheckStorage(item?.url) ? getCheckStorage(item?.url) : "#!"}`}
                                                                        target="_blank"
                                                                    >
                                                                        View Document
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <div className="dropdown-item" onClick={() => handleShareDocument("whatsapp", item)}>
                                                                        Share on WhatsApp
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="dropdown-item" onClick={() => handleShareDocument("email", item)}>
                                                                        Share via Email
                                                                    </div>
                                                                </li>
                                                                {role?.toLowerCase() == "admin" && (
                                                                    <li>
                                                                        <div
                                                                            className="dropdown-item text-danger"
                                                                            onClick={() => setChangeIsActiveStatus({
                                                                                show: true,
                                                                                details: {
                                                                                    _id: item?._id,
                                                                                    currentStatus: item?.isActive,
                                                                                    name: item?.name
                                                                                }
                                                                            })}
                                                                        >
                                                                            Delete
                                                                        </div>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="document-preview-wrapper">
                                                        {getCheckStorage(item?.url) ? (
                                                            <DocumentPreview url={getCheckStorage(item?.url)} height="180px" />
                                                        ) : (
                                                            <div className="document-placeholder">
                                                                <FaFileWord size={48} className="text-primary" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="document-footer">
                                                        <p className="document-name mb-0 text-truncate" title={item?.name}>
                                                            {item?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {uploadingDocs && (
                <AddDocsModal
                    _id={data[0]?._id}
                    getCaseById={getCaseById}
                    uploadingDocs={uploadingDocs}
                    setUploadingDocs={setUploadingDocs}
                    handleCaseDocsUploading={addCaseDoc}
                    attachementUpload={attachementUpload}
                />
            )}

            {deleteCaseDoc?.status && (
                <ConfirmationModal
                    show={deleteCaseDoc?.status}
                    hide={() => setDeleteCaseDoc({ status: false, id: null })}
                    id={deleteCaseDoc?.id}
                    handleComfirmation={deleteDoc}
                    heading={"Are you sure?"}
                    text={"Want to permanently delete this doc"}
                />
            )}

            {changeisActiveStatus?.show && (
                <SetStatusOfProfile
                    changeStatus={changeisActiveStatus}
                    hide={() => setChangeIsActiveStatus({ show: false, details: {} })}
                    type="Doc"
                    handleChanges={handleChanges}
                />
            )}

            <style jsx="true">{`
                .document-section-wrapper {
                    width: 100%;
                    overflow-x: hidden;
                }
                
                .document-content {
                    overflow-y: auto;
                    overflow-x: hidden;
                    scroll-behavior: smooth;
                }
                
                /* Custom scrollbar */
                .document-content::-webkit-scrollbar {
                    width: 8px;
                }
                
                .document-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .document-content::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                
                .document-content::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                
                /* Folder Card Styles */
                .folder-card {
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .folder-card-inner {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    padding: 2px;
                    transition: all 0.3s ease;
                }
                
                .folder-card:hover .folder-card-inner {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                
                .folder-icon-wrapper {
                    background: white;
                    border-radius: 14px;
                    padding: 24px;
                    text-align: center;
                    position: relative;
                    min-height: 200px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .folder-icon {
                    color: #667eea;
                    margin-bottom: 16px;
                }
                
                .folder-edit-btn {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    opacity: 0;
                }
                
                .folder-card:hover .folder-edit-btn {
                    opacity: 1;
                }
                
                .folder-edit-btn:hover {
                    background: #667eea;
                    color: white;
                }
                
                .folder-info {
                    margin-top: 12px;
                }
                
                .folder-name {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                }
                
                .folder-count {
                    font-size: 12px;
                }
                
                .folder-edit-form {
                    width: 100%;
                    margin-top: 12px;
                }
                
                /* Document Card Styles */
                .document-card {
                    transition: all 0.3s ease;
                }
                
                .document-card-inner {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }
                
                .document-card:hover .document-card-inner {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                }
                
                .document-header {
                    padding: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .private-icon {
                    font-size: 18px;
                    color: #667eea;
                }
                
                .document-preview-wrapper {
                    padding: 20px;
                    background: #f8f9fa;
                    min-height: 220px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .document-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 180px;
                }
                
                .document-footer {
                    padding: 12px;
                    background: white;
                    border-top: 1px solid #f0f0f0;
                }
                
                .document-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: #333;
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .document-content {
                        max-height: 60vh !important;
                        min-height: 400px !important;
                    }
                    
                    .folder-icon-wrapper {
                        min-height: 160px;
                        padding: 16px;
                    }
                    
                    .folder-icon svg {
                        width: 36px;
                        height: 36px;
                    }
                    
                    .document-preview-wrapper {
                        min-height: 160px;
                        padding: 16px;
                    }
                }
                
                @media (max-width: 576px) {
                    .document-content {
                        padding: 16px !important;
                    }
                    
                    .folder-name {
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    )
}