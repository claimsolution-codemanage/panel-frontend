import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import { getCheckStorage, getFormateDMYDate } from '../../../../../utils/helperFunction'
import DocumentPreview from '../../../../../components/DocumentPreview'
import { Link } from 'react-router-dom'
import OmbudsmanFormModal from '../../../../../components/Common/CaseStatus/OmbudsmanModal'

export default function OmbudsmanSection({ id, role, empType, status, isCaseFormAccess, getCaseById, details, createOrUpdateApi, attachementUpload }) {
    const [showGroStatus, setShowGroStatus] = useState(false)
    const combined = [...(details?.queryHandling?.map(ele => { return { ...ele, type: "query" } }) || []), ...(details?.queryReply?.map(ele => { return { ...ele, type: "reply" } }) || [])];
    const sortedList = combined.sort((a, b) => new Date(a?.date) - new Date(b?.date));

    return (
        <>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex justify-content-between">
                        <div className="text-primary text-center fs-4">Ombudsman Details</div>
                        {isCaseFormAccess && (status?.toLowerCase()?.includes("ombudsman") || details) && <div className="d-flex gap-1 btn btn-primary" onClick={() => setShowGroStatus(true)}>
                            <span><CiEdit /></span>
                            <div>Ombudsman</div>
                        </div>}
                    </div>
                </div>

                {details && <div>
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label">Method:</label>
                            <span> {details?.method}</span>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Complaint Number:</label>
                            <span> {details?.complaintNumber}</span>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Ombudsman Filing Date:</label>
                            <span> {details?.filingDate && getFormateDMYDate(details?.filingDate)}</span>
                        </div>
                        {(role?.toLowerCase() == "admin" || (role?.toLowerCase() == "employee" && empType?.toLowerCase() === "operation")) && <>
                            <div className="col-md-4">
                                <label className="form-label">Partner Fee (%):</label>
                                <span> {details?.partnerFee}</span>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Consultant Fee (%):</label>
                                <span> {details?.consultantFee}</span>
                            </div>
                        </>}


                    </div>

                    {/* GRO Filing Date */}


                    {/* Status Updates */}
                    {details?.statusUpdates?.length != 0 && <div className="card-body overflow-auto">
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
                                        {details?.statusUpdates?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
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
                    {sortedList?.length != 0 && <div className="card-body overflow-auto">
                        <div className="mt-4 rounded-2 shadow">
                            <div className="table-responsive">
                                <span className='d-flex align-items-center justify-content-center my-2 text-primary  fs-5 fw-bold'>Query & Reply</span>
                                <table className="table table-responsive table-borderless">
                                    <thead className="">
                                        <tr className="bg-primary text-white text-center">
                                            <th scope="col" className="text-nowrap">S.no</th>
                                            <th scope="col" className="text-nowrap">Type</th>
                                            <th scope="col" className="text-nowrap">Date</th>
                                            <th scope="col" className="text-nowrap">Remarks</th>
                                            <th scope="col" className="text-nowrap">Deliver</th>
                                            <th scope="col" className="text-nowrap" >Attachment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedList?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                            <th scope="row">{ind + 1}</th>
                                            <td className="text-nowrap "><p className="mb-1 text-capitalize">{item?.type}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.date && getFormateDMYDate(item?.date)}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.remarks}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.type == "reply" ? "-" : (item?.byMail ? "Mail" : "Courier")}</p></td>
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


                    {/* hearing schedule */}
                    {details?.hearingSchedule?.length != 0 && <div className="card-body overflow-auto">
                        <div className="mt-4 rounded-2 shadow">
                            <div className="table-responsive">
                                <span className='d-flex align-items-center justify-content-center my-2 text-primary  fs-5 fw-bold'>Hearing schedule</span>
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
                                        {details?.hearingSchedule?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
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


                    {/* award part */}
                    {details?.awardPart?.length != 0 && <div className="card-body overflow-auto">
                        <div className="mt-4 rounded-2 shadow">
                            <div className="table-responsive">
                                <span className='d-flex align-items-center justify-content-center my-2 text-primary  fs-5 fw-bold'>Award Part</span>
                                <table className="table table-responsive table-borderless">
                                    <thead className="">
                                        <tr className="bg-primary text-white text-center">
                                            <th scope="col" className="text-nowrap">S.no</th>
                                            <th scope="col" className="text-nowrap">Date</th>
                                            <th scope="col" className="text-nowrap">Remarks</th>
                                            <th scope="col" className="text-nowrap">Type</th>
                                            <th scope="col" className="text-nowrap" >Attachment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details?.awardPart?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                            <th scope="row">{ind + 1}</th>
                                            <td className="text-nowrap "><p className="mb-1">{item?.date && getFormateDMYDate(item?.date)}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.remarks}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{item?.type}</p></td>
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
                    {details?.approved && <div className="card-body overflow-auto">
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
                                            <th scope="row">{details?.approvedAmount && 1}</th>
                                            <td className="text-nowrap "><p className="mb-1">{details?.approvalDate && getFormateDMYDate(details?.approvalDate)}</p></td>
                                            <td className="text-nowrap "><p className="mb-1">{details?.approvedAmount}</p></td>
                                            <td className="text-nowrap ">
                                                {details?.approvalLetter && <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3" style={{ maxWidth: '250px' }}>
                                                    <div className="w-100 p-2">
                                                        <div className="dropdown float-end cursor-pointer">
                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                            <ul className="dropdown-menu">
                                                                <li><div className="dropdown-item"><Link to={`${getCheckStorage(details?.approvalLetter) || "#!"}`} target="_blank">View</Link></div></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        {getCheckStorage(details?.approvalLetter) && <DocumentPreview height='150px' url={getCheckStorage(details?.approvalLetter)} />}
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
            {showGroStatus && <OmbudsmanFormModal caseId={id} show={showGroStatus} close={() => setShowGroStatus(false)} getCaseById={getCaseById} details={details} createOrUpdateApi={createOrUpdateApi} attachementUpload={attachementUpload} />}
        </>
    )
}
