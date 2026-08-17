import React, { useContext, useEffect, useState } from 'react'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { AppContext } from "../../../../../App"
import { formatWhatsAppDate } from '../../../../../utils/helperFunction'
import AddCaseCommit from '../../common/model/addCaseCommit'
import { MdOutlineEdit } from 'react-icons/md'
import { RiChatPrivateLine } from 'react-icons/ri'
import {
    FaFileImage, FaFileAudio, FaFileVideo, FaFilePdf,
    FaFileWord, FaFileExcel, FaFile, FaDownload,
    FaChevronDown, FaChevronUp
} from 'react-icons/fa'
import Loader from '../../../../../components/Common/loader'
import "../../../../../styles/caseComment.css"
import { toast } from 'react-toastify'

const canEditMessage = (createdAt) => {
    if (!createdAt) return false;

    const now = new Date();
    const messageDate = new Date(createdAt);

    // Check same date
    const isSameDate =
        now.getFullYear() === messageDate.getFullYear() &&
        now.getMonth() === messageDate.getMonth() &&
        now.getDate() === messageDate.getDate();

    // Check last 6 hours
    const diffInMs = now - messageDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return isSameDate && diffInHours <= 6;
};

// Get file icon based on file type
const getFileIcon = (fileType) => {
    switch (fileType) {
        case 'image':
            return <FaFileImage className="text-primary" size={18} />;
        case 'audio':
            return <FaFileAudio className="text-success" size={18} />;
        case 'video':
            return <FaFileVideo className="text-danger" size={18} />;
        case 'pdf':
            return <FaFilePdf className="text-danger" size={18} />;
        case 'word':
            return <FaFileWord className="text-primary" size={18} />;
        case 'excel':
            return <FaFileExcel className="text-success" size={18} />;
        default:
            return <FaFile className="text-secondary" size={18} />;
    }
};

// Format file size
const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Attachment Component
const AttachmentList = ({ attachments, isMe }) => {
    const handleOpenFile = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    if (!attachments || attachments.length === 0) return null;

    return (
        <div className={`attachments-container ${isMe ? 'me' : 'other'}`}>
            {attachments.map((attachment, index) => (
                <div
                    key={index}
                    className="attachment-item"
                    onClick={() => handleOpenFile(attachment.url)}
                >
                    <div className="attachment-icon">
                        {getFileIcon(attachment.fileType)}
                    </div>
                    <div className="attachment-info">
                        <div className="attachment-name" title={attachment.fileName}>
                            {attachment.fileName}
                        </div>
                        {attachment.fileSize && (
                            <div className="attachment-size">
                                {formatFileSize(attachment.fileSize)}
                            </div>
                        )}
                    </div>
                    <div className="attachment-action">
                        <FaDownload size={14} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function CommentSection({ role, id, getCaseCommentsApi, getCaseEmployeeListApi, addCaseCommit, privateCommit, canTagComment, attachementUpload }) {
    const state = useContext(AppContext)
    const [caseComment, setCaseComment] = useState([])
    const [loading, setLoading] = useState(false)
    const [caseCommitModal, setCaseCommitModal] = useState({ status: false, details: null })
    const [isOpen, setIsOpen] = useState(false)
    const [caseEmployeeList, setCaseEmployeeList] = useState([])
    const [loadingEmployeeList, setLoadingEmployeeList] = useState(true)

    const commentBy = (comment) => {
        if (role?.toLowerCase() == "employee") {
            return state?.myAppData?.details?._id == comment?.employeeId
        } else {
            return state?.myAppData?.details?._id == comment?.adminId
        }
    }

    const getCaseComment = async () => {
        setLoading(true)
        try {
            const res = await getCaseCommentsApi(id)
            if (res?.data?.success && res?.data?.data) {
                setCaseComment(res?.data?.data)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Failed to load comments")
            }
            console.log("case comments error", error);
        } finally {
            setLoading(false)
        }
    }

    const getCaseEmployeeList = async () => {
        setLoadingEmployeeList(true)
        try {
            const res = await getCaseEmployeeListApi(id)
            console.log("case employee list", res?.data);
            if (res?.data?.success && res?.data?.data) {
                setCaseEmployeeList(res?.data?.data)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Failed to load case employee list")
            }
            console.log("case employee list error", error);
        } finally {
            setLoadingEmployeeList(false)
        }
    }

    const handleCommentAdded = () => {
        setIsOpen(true)
        getCaseComment()
    }

    useEffect(() => {
        if (id && isOpen && !caseComment?.length) {
            getCaseComment()
        }
    }, [id, isOpen])

    useEffect(() => {
        if (id && isOpen && canTagComment) {
            getCaseEmployeeList()
        }
    }, [id, isOpen])


    return (
        <>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-bottom border-primary pb-2 mb-4">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="d-flex align-items-center justify-content-between gap-2"
                        style={{ cursor: "pointer", userSelect: "none" }}
                    >
                        <h5 className="text-primary m-0">Case Comments</h5>
                        <div className="text-primary d-flex align-items-center">
                            {isOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                        </div>
                    </div>

                </div>

                {loading ? (
                    <Loader />
                ) : (
                    isOpen && <div>
                        <div className='d-flex justify-content-end mb-2'>
                            <div
                                onClick={() => setCaseCommitModal({ status: true, details: null })}
                                className="d-flex justify-content-center align-items-center bg-primary text-white"
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                }}
                            >
                                <IoMdAdd />
                            </div>
                        </div>
                        {Boolean(caseComment?.length) ? (
                            <div className="chat-bg">
                                <div className="chat-wrapper">
                                    {caseComment?.map(commit => {
                                        const isMe = commentBy(commit);

                                        return (
                                            <div
                                                key={commit?._id}
                                                className={`chat-message ${isMe ? "me" : "other"}`}
                                            >
                                                <div className={`chat-bubble ${isMe ? "me" : "other"}`}>
                                                    <div className="chat-author">
                                                        {isMe ? "You" : commit?.name}
                                                    </div>

                                                    {canTagComment && commit?.tagEmployees?.length > 0 && (
                                                        <div className="tag-container">
                                                            {commit?.tagEmployees?.map((ele) => {
                                                                return (
                                                                    <span
                                                                        key={ele?._id}
                                                                        className="tag-badge"
                                                                        title={`${ele?.fullName} (${ele?.type})`}
                                                                    >
                                                                        @{ele?.fullName}
                                                                    </span>
                                                                )
                                                            })}
                                                        </div>
                                                    )}

                                                    {commit?.message && (
                                                        <div
                                                            className="ql-editor"
                                                            dangerouslySetInnerHTML={{ __html: commit?.message }}
                                                        />
                                                    )}

                                                    {/* Display Attachments */}
                                                    {commit?.attachments && commit?.attachments.length > 0 && (
                                                        <AttachmentList
                                                            attachments={commit?.attachments}
                                                            isMe={isMe}
                                                        />
                                                    )}

                                                    <div className="chat-meta-row">
                                                        <span className="chat-time">
                                                            {formatWhatsAppDate(commit?.createdAt)}
                                                        </span>

                                                        {isMe && canEditMessage(commit?.createdAt) && (
                                                            <span
                                                                className="chat-edit"
                                                                title="Edit message"
                                                                onClick={() => setCaseCommitModal({ status: true, details: commit })}
                                                            >
                                                                <MdOutlineEdit className='fs-6' />
                                                            </span>
                                                        )}
                                                        {commit?.isPrivate && <RiChatPrivateLine className='fs-5 text-success' title='private' />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-secondary py-3">
                                No comments yet
                            </div>
                        )
                        }
                    </div>
                )
                }
            </div>


            {caseCommitModal?.status &&
                <AddCaseCommit
                    privateCommit={privateCommit}
                    canTagComment={canTagComment}
                    show={caseCommitModal?.status}
                    attachementUpload={attachementUpload}
                    details={caseCommitModal?.details}
                    caseEmployeeList={caseEmployeeList}
                    id={id}
                    close={() => { setCaseCommitModal({ status: false, details: null }) }}
                    refetchDetails={handleCommentAdded}
                    handleCaseCommit={addCaseCommit}
                />
            }
        </>
    )
}