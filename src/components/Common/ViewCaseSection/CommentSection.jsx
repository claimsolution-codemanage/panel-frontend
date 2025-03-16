import React, { useContext, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { AppContext } from "../../../App"
import { getFormateDMYDate } from '../../../utils/helperFunction'
import AddCaseCommit from '../addCaseCommit'


export default function CommentSection({ caseCommit, role,id,getCaseById,addCaseCommit }) {
    const state = useContext(AppContext)
    const [caseCommitModal, setCaseCommitModal] = useState(false)
    

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
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <div className="text-primary text-center fs-4">Case Comment</div>
                        <div onClick={() => setCaseCommitModal(true)} className="d-flex justify-content-center align-items-center fs-5 bg-primary text-white" style={{ cursor: 'pointer', width: "2.5rem", height: "2.5rem", borderRadius: "2.5rem" }}>
                            <span><IoMdAdd /></span>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column gap-3">
                    {caseCommit?.map(commit => <div key={commit?._id} className="w-100">
                        {/* {console.log(data[0]?._id == commit?._id, data[0]?._id, commit?._id)} */}
                        <div className={`${commentBy(commit) && "float-end"} w-25`}>
                            <div className={`${commentBy(commit) ? "bg-info  w-auto text-dark" : "bg-primary text-white"} p-2 rounded-3`}>
                                {commit?.message}</div>
                            <p className="badge bg-warning text-dark m-0">{commentBy(commit) ? "you" : commit?.name} | {commit?.createdAt && getFormateDMYDate(commit?.createdAt)}</p>
                        </div>
                    </div>)}
                </div>
            </div>
        {caseCommitModal && <AddCaseCommit show={caseCommitModal} id={id} close={() => { setCaseCommitModal(false) }} getCaseById={getCaseById} handleCaseCommit={addCaseCommit} />}
            
        </>
    )
}
