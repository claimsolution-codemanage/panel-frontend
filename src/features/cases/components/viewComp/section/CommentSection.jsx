import React, { useContext, useState } from 'react'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { AppContext } from "../../../../../App"
import { formatWhatsAppDate } from '../../../../../utils/helperFunction'
import AddCaseCommit from '../../common/model/addCaseCommit'
import { MdOutlineEdit } from 'react-icons/md'
import { RiChatPrivateLine } from 'react-icons/ri'
import {
    FaFileImage, FaFileAudio, FaFileVideo, FaFilePdf,
    FaFileWord, FaFileExcel, FaFile, FaDownload
} from 'react-icons/fa'
import "../../../../../styles/caseComment.css"

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

export default function CommentSection({ caseCommit, role, id, getCaseById, addCaseCommit, privateCommit, attachementUpload }) {
    const state = useContext(AppContext)
    const [caseCommitModal, setCaseCommitModal] = useState({ status: false, details: null })

    const commentBy = (comment) => {
        if (role?.toLowerCase() == "employee") {
            return state?.myAppData?.details?._id == comment?.employeeId
        } else {
            return state?.myAppData?.details?._id == comment?.adminId
        }
    }

    return (
        <>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-bottom border-primary pb-2 mb-4 d-flex justify-content-between align-items-center">
                    <h5 className="text-primary m-0">Case Comments</h5>
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

                {Boolean(caseCommit?.length) &&
                    <div className="chat-bg">
                        <div className="chat-wrapper">
                            {caseCommit?.map(commit => {
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
                    </div>}
            </div>

            {caseCommitModal?.status &&
                <AddCaseCommit
                    privateCommit={privateCommit}
                    show={caseCommitModal?.status}
                    attachementUpload={attachementUpload}
                    details={caseCommitModal?.details}
                    id={id}
                    close={() => { setCaseCommitModal({ status: false, details: null }) }}
                    getCaseById={getCaseById}
                    handleCaseCommit={addCaseCommit}
                />
            }
        </>
    )
}