import React, { useContext, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { AppContext } from "../../../../../App"
import { formatWhatsAppDate} from '../../../../../utils/helperFunction'
import AddCaseCommit from '../../common/model/addCaseCommit'
import { MdOutlineEdit } from 'react-icons/md'
import { RiChatPrivateLine } from 'react-icons/ri'
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



export default function CommentSection({ caseCommit, role, id, getCaseById, addCaseCommit, privateCommit }) {
    const state = useContext(AppContext)
    const [caseCommitModal, setCaseCommitModal] = useState({status:false,details:null})


    const commentBy = (comment) => {
        if (role?.toLowerCase() == "employee") {
            return state?.myAppData?.details?._id == comment?.employeeId
        } else {
            return state?.myAppData?.details?._id == comment?.adminId
        }
    }

    return (
        <>
            {/* <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <div className="text-primary text-center fs-4">Case Comment</div>
                        <div onClick={() => setCaseCommitModal(true)} className="d-flex justify-content-center align-items-center fs-5 bg-primary text-white" style={{ cursor: 'pointer', width: "2.5rem", height: "2.5rem", borderRadius: "2.5rem" }}>
                            <span><IoMdAdd /></span>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column gap-3">
                    {caseCommit?.map(commit => <div key={commit?._id} className="w-100">\
                        <div className={`${commentBy(commit) && "float-end"} w-auto`}>
                            <div className={`${commentBy(commit) ? "bg-info  w-auto text-dark" : "bg-primary text-white"} p-0 rounded-3`}>
                                   {commit?.message && <div className='text-editor ql-editor text-break' dangerouslySetInnerHTML={{__html:commit?.message}}></div>}
                                        </div>
                            <p className="badge bg-warning text-dark m-0 float-end mt-1">{commentBy(commit) ? "you" : commit?.name} | {commit?.createdAt && getFormateDMYDate(commit?.createdAt)}</p>
                        </div>
                    </div>)}
                </div>
            </div> */}
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-bottom border-primary pb-2 mb-4 d-flex justify-content-between align-items-center">
                    <h5 className="text-primary m-0">Case Comments</h5>
                    <div
                        onClick={() => setCaseCommitModal({status:true,details:null})}
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

                                            <div className="chat-meta-row">

                                                <span className="chat-time">
                                                    {formatWhatsAppDate(commit?.createdAt)}
                                                </span>

                                                {isMe && canEditMessage(commit?.createdAt) && (
                                                    <span
                                                        className="chat-edit"
                                                        title="Edit message"
                                                        onClick={() => setCaseCommitModal({status:true,details:commit})}
                                                    >
                                                        <MdOutlineEdit className='fs-6'/>
                                                    </span>
                                                )}
                                                {commit?.isPrivate && <RiChatPrivateLine className='fs-5 text-success' title='private'/>}
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>}
            </div>


            {caseCommitModal?.status && <AddCaseCommit privateCommit={privateCommit} show={caseCommitModal?.status} details={caseCommitModal?.details} id={id} close={() => { setCaseCommitModal({status:false,details:null}) }} getCaseById={getCaseById} handleCaseCommit={addCaseCommit} />}

        </>
    )
}
