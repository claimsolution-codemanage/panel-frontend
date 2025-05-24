import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import GROFormModal from '../CaseStatus/GroModal'
import { formatDateToISO, getCheckStorage, getFormateDMYDate } from '../../../utils/helperFunction'
import { FaFileWord } from 'react-icons/fa6'
import DocumentPreview from '../../DocumentPreview'
import { Link } from 'react-router-dom'

export default function GroSection({ id,role,empType, status, isCaseFormAccess, getCaseById, groDetails, createOrUpdateApi, attachementUpload }) {
    const [showGroStatus, setShowGroStatus] = useState(false)
    return (
        <>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex justify-content-between">
                        <div className="text-primary text-center fs-4">GRO Details</div>
                        {isCaseFormAccess && (status?.toLowerCase() == "gro" || groDetails) && <div className="d-flex gap-1 btn btn-primary" onClick={() => setShowGroStatus(true)}>
                            <span><CiEdit /></span>
                            <div>GRO</div>
                        </div>}
                    </div>
                </div>

                {groDetails && <div>
                    <div className="row">
                        <div className="col-md-4">
                            <div>
                                <label htmlFor="specialCase" className="ms-2">Special Case {groDetails?.specialCase ? "✅" : "❎"}</label>
                            </div>
                        </div>
                        {(role?.toLowerCase()=="admin" || (role?.toLowerCase()=="employee" && empType?.toLowerCase()==="operation")) && <>
                            <div className="col-md-4">
                            <label className="form-label">Partner Fee (%):</label>
                            <span> {groDetails?.partnerFee}</span>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Consultant Fee (%):</label>
                            <span> {groDetails?.consultantFee}</span>
                        </div>
                        </>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">GRO Filing Date:</label>
                        <span> {groDetails?.groFilingDate && getFormateDMYDate(groDetails?.groFilingDate)}</span>
                    </div>
                    {/* GRO Filing Date */}


                    {/* Status Updates */}
                    {groDetails?.groStatusUpdates?.length!=0 &&  <div className="card-body overflow-auto">
                        <div className="mt-4 rounded-2 shadow">
                            <span className='d-flex align-items-center justify-content-center my-2 text-primary  fs-5 fw-bold'>Status</span>
                            <div className="table-responsive">
                                <table className="table table-responsive table-borderless">
                                    <thead className="">
                                        <tr className="bg-primary text-white text-center">
                                            <th scope="col" className="text-nowrap">S.no</th>
                                            <th scope="col" className="text-nowrap" >Status</th>
                                            <th scope="col" className="text-nowrap">Remarks</th>
                                            <th scope="col" className="text-nowrap">Date</th>
                                            <th scope="col" className="text-nowrap" >Attachment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groDetails?.groStatusUpdates?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                            <th scope="row">{ind + 1}</th>
                                            <td className="text-nowrap "><p className="mb-1">{item?.status}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.remarks}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.date && getFormateDMYDate(item?.date)}</p></td>
                                            <td className="text-nowrap">
                                                <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3" style={{ maxWidth: '250px' }}>
                                                    <div className="w-100 p-2">
                                                        <div className="dropdown float-end cursor-pointer">
                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                            <ul className="dropdown-menu">
                                                                <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.attachment) || "#!"}`} target="_blank">View</Link></div></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        {getCheckStorage(item?.attachment) && <DocumentPreview height='150px' url={getCheckStorage(item?.attachment)} />}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>}
                   

                    {/* Query Handling */}
                    {groDetails?.queryHandling?.length!=0 &&  <div className="card-body overflow-auto">
                        <div className="mt-4 rounded-2 shadow">
                            <div className="table-responsive">
                                <span className='d-flex align-items-center justify-content-center my-2 text-primary  fs-5 fw-bold'>Query</span>
                                <table className="table table-responsive table-borderless">
                                    <thead className="">
                                        <tr className="bg-primary text-white text-center">
                                            <th scope="col" className="text-nowrap">S.no</th>
                                            <th scope="col" className="text-nowrap">Date</th>
                                            <th scope="col" className="text-nowrap">Remarks</th>
                                            <th scope="col" className="text-nowrap" >Attachment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groDetails?.queryHandling?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                            <th scope="row">{ind + 1}</th>
                                            <td className="text-nowrap "><p className="mb-1">{item?.date && getFormateDMYDate(item?.date)}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.remarks}</p></td>
                                            <td className="text-nowrap ">
                                                <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3" style={{ maxWidth: '250px' }}>
                                                    <div className="w-100 p-2">
                                                        <div className="dropdown float-end cursor-pointer">
                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                            <ul className="dropdown-menu">
                                                                <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.attachment) || "#!"}`} target="_blank">View</Link></div></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        {getCheckStorage(item?.attachment) && <DocumentPreview height='150px' url={getCheckStorage(item?.attachment)} />}
                                                    </div>
                                                </div>
                                            </td>

                                        </tr>)}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>}
                   

                    {/* Query reply Handling */}
                    {groDetails?.queryReply?.length!=0 && <div className="card-body overflow-auto">
                        <div className="rounded-2 shadow">
                            <div className="table-responsive">
                                <span className='d-flex align-items-center justify-content-center my-2 text-primary  fs-5 fw-bold'>Query Reply</span>
                                <table className="table table-responsive table-borderless">
                                    <thead className="">
                                        <tr className="bg-primary text-white text-center card-header">
                                            <th scope="col" className="text-nowrap">S.no</th>
                                            <th scope="col" className="text-nowrap">Date</th>
                                            <th scope="col" className="text-nowrap">Remarks</th>
                                            <th scope="col" className="text-nowrap">Deliver</th>
                                            <th scope="col" className="text-nowrap" >Attachment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groDetails?.queryReply?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                            <th scope="row">{ind + 1}</th>
                                            <td className="text-nowrap "><p className="mb-1">{item?.date && getFormateDMYDate(item?.date)}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.remarks}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.byMail ? "Mail" : "Courier"}</p></td>
                                            <td className="text-nowrap ">
                                                <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3" style={{ maxWidth: '250px' }}>
                                                    <div className="w-100 p-2">
                                                        <div className="dropdown float-end cursor-pointer">
                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                            <ul className="dropdown-menu">
                                                                <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.attachment) || "#!"}`} target="_blank">View</Link></div></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        {getCheckStorage(item?.attachment) && <DocumentPreview height='150px' url={getCheckStorage(item?.attachment)} />}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>}
                    

                    {/* Approval Section */}
                    {groDetails?.approved &&   <div className="card-body overflow-auto">
                        <div className="rounded-2 shadow">
                            <div className="table-responsive">
                                <span className='d-flex align-items-center justify-content-center my-2 text-primary fs-5 fw-bold'>Approval</span>
                                <table className="table table-responsive table-borderless">
                                    <thead className="">
                                        <tr className="bg-primary text-white text-center card-header">
                                            <th scope="col" className="text-nowrap">S.no</th>
                                            <th scope="col" className="text-nowrap">Date</th>
                                            <th scope="col" className="text-nowrap">Amount</th>
                                            <th scope="col" className="text-nowrap" >Attachment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-2 border-bottom border-light text-center">
                                            <th scope="row">{groDetails?.approvedAmount && 1}</th>
                                            <td className="text-nowrap "><p className="mb-1">{groDetails?.approvalDate && getFormateDMYDate(groDetails?.approvalDate)}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{groDetails?.approvedAmount}</p></td>
                                            <td className="text-nowrap ">
                                                {groDetails?.approvalLetter && <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3" style={{ maxWidth: '250px' }}>
                                                    <div className="w-100 p-2">
                                                        <div className="dropdown float-end cursor-pointer">
                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                            <ul className="dropdown-menu">
                                                                <li><div className="dropdown-item"><Link to={`${getCheckStorage(groDetails?.approvalLetter) || "#!"}`} target="_blank">View</Link></div></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        {getCheckStorage(groDetails?.approvalLetter) && <DocumentPreview height='150px' url={getCheckStorage(groDetails?.approvalLetter)} />}
                                                    </div>
                                                </div>}

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>}
                  

                </div>}

            </div>
            {showGroStatus && <GROFormModal caseId={id} show={showGroStatus} close={() => setShowGroStatus(false)} getCaseById={getCaseById} groDetails={groDetails} createOrUpdateApi={createOrUpdateApi} attachementUpload={attachementUpload} />}
        </>
    )
}
