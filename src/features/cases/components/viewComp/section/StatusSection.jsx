import React, { useContext, useState } from 'react'
import { AppContext } from '../../../../../App'
import { CiEdit } from 'react-icons/ci'
import { getFormateDMYDate } from '../../../../../utils/helperFunction'
import ChangeStatusModal from '../../common/model/changeStatusModal'
import EditCaseStatusModal from '../../common/model/EditCaseStatus'


export default function StatusSection({ isAddCaseProcess, id, role, details, getCaseById, processSteps, addCaseProcess, attachementUpload, editCaseProcess }) {
    const state = useContext(AppContext)
    const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
    const [showEditCaseModal, setShowEditCaseModal] = useState({ status: false, details: {} })
    


    return (
        <>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex justify-content-between">
                        <div className="text-primary text-center fs-4">Case Process</div>
                        {isAddCaseProcess && <div className="d-flex gap-1 btn btn-primary" onClick={() => setChangeStatus({ status: true, details: { ...details } })}>
                            <span><CiEdit /></span>
                            <div>Add Status</div>
                        </div>}
                    </div>
                </div>
                <div className="mt-4 rounded-2 shadow">
                    <div className="table-responsive">
                        <table className="table table-responsive table-borderless">
                            <thead className="">
                                <tr className="bg-primary text-white text-center">
                                    <th scope="col" className="text-nowrap">S.no</th>
                                    {role?.toLowerCase() == "admin" && <th scope="col" className="text-nowrap" >Edit</th>}
                                    <th scope="col" className="text-nowrap">Date</th>
                                    <th scope="col" className="text-nowrap">Status</th>
                                    {role?.toLowerCase() == "admin" && <th scope="col" className="text-nowrap" >Marked By</th>}
                                    <th scope="col" className="text-nowrap" >Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processSteps?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light">
                                    <th scope="row" className=' text-center'>{ind + 1}</th>
                                    {role?.toLowerCase() == "admin" && <td className='text-center'>
                                        <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => setShowEditCaseModal({ status: true, details: { caseId: id, processId: item?._id, caseStatus: item?.status, caseRemark: item?.remark, isCurrentStatus: details?.processSteps.length == ind + 1 } })}><CiEdit /></span>
                                    </td>}
                                    <td className="text-nowrap text-center"> {item?.createdAt && <p className="mb-1">{getFormateDMYDate(item?.createdAt)}</p>}</td>
                                    <td className="text-nowrap text-center">{item?.status && <p className={`mb-1 badge ${(item?.status?.toLowerCase() == "reject" ? "bg-danger" : (item?.status?.toLowerCase() == "pending" ? "bg-warning" : (item?.status?.toLowerCase() == "resolve" ? "bg-success" : "bg-primary")))}`}>{item?.status}</p>}</td>
                                    {role?.toLowerCase() == "admin" && <td className="text-nowrap text-center"> <p className="mb-1 text-capitalize">{item?.consultant ? item?.consultant : "System"} </p></td>}
                                    <td className="text-break col-4 align-middle remark-cell">{item?.remark && <div className='text-editor ql-editor' dangerouslySetInnerHTML={{__html:item?.remark}}></div>}</td>
                                </tr>)}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} getCaseById={getCaseById} handleCaseStatus={addCaseProcess} role="admin" attachementUpload={attachementUpload} />}
            {showEditCaseModal?.status && <EditCaseStatusModal changeStatus={showEditCaseModal} getCaseById={getCaseById} setChangeStatus={setShowEditCaseModal} handleCaseStatus={editCaseProcess} role="admin" />}


        </>
    )
}
