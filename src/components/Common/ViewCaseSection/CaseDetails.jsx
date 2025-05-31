import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFormateDMYDate } from '../../../utils/helperFunction'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AddReferenceModal from '../Modal/addReferenceModal';

export default function CaseDetails({ data, role, isViewProfile, editUrl, viewClient, isAddRefence, viewEmp, getCaseById, addReference,deleteReference,viewPartner }) {
    const [removeCaseReference, setRemoveCaseReference] = useState({ status: false, type: null, loading: false })
    const [addCaseReference, setAddCaseReference] = useState({ show: false, _id: "" })


    const handleRemoveCaseReference = async () => {
        if (removeCaseReference?.type) {
            try {
                setRemoveCaseReference({ ...removeCaseReference, loading: true })
                const res = await deleteReference(data[0]?._id, removeCaseReference?.type)
                if (res?.status == 200 && res?.data?.success) {
                    toast.success(res?.data?.message)
                    setRemoveCaseReference({ status: false, type: null, loading: false })
                    if (getCaseById) {
                        getCaseById()
                    }
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Failed to remove case reference")
                }
                setRemoveCaseReference({ status: false, type: null, loading: false })
            }
        }
    }

    return (
        <div>
            {(role?.toLowerCase() !== "client" && role?.toLowerCase() !== "partner") &&
                <div className="bg-color-1 my-3 p-2 p-5 rounded-2 shadow">
                    <div className="border-3 border-primary border-bottom mb-5">
                        <div className="d-flex align-items-center justify-content-between">
                            <h6 className="text-primary text-capitalize text-center fs-3">{data[0]?.caseFrom}</h6>
                            {isViewProfile && <Link state={{ filter: location?.state?.filter, back: location?.pathname }} to={data[0]?.caseFrom == "partner" ? `${viewPartner}${data[0]?.partnerId}` : (data[0]?.caseFrom == "client" ? `${viewClient}${data[0]?.clientId}` : `${viewEmp}${data[0]?.empSaleId}`)} className="btn btn-primary">View</Link>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Case From</h6>
                            <p className=" h6 text-capitalize">{data[0]?.caseFrom}</p>
                        </div>
                        {data[0]?.caseFrom == "partner" &&
                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                <h6 className="fw-bold">Partner Name</h6>
                                <p className=" h6 text-capitalize">{data[0]?.partnerName}</p>
                            </div>
                        }
                        {data[0]?.consultantCode && <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">{data[0]?.caseFrom?.toLowerCase() == "client" ? "Customer Code" : "Consultant Code"} </h6>
                            <p className=" h6 text-capitalize">{data[0]?.consultantCode}</p>
                        </div>}

                        {data[0]?.partnerId && <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Reference of partner </h6>
                            <Link to={`${viewPartner}${data[0]?.partnerId}`} state={{ filter: location?.state?.filter, back: location?.pathname }} className="h6 text-decoration-underline text-capitalize">View</Link>
                        </div>}
                        {data[0]?.empSaleId && <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Reference of employee</h6>
                            <Link to={`${viewEmp}${data[0]?.empSaleId}`} state={{ filter: location?.state?.filter, back: location?.pathname }} className="h6 text-decoration-underline text-capitalize">View</Link>
                        </div>}

                        {data[0]?.caseFrom != "client" &&
                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-12">
                                <h6 className="fw-bold">Mapping Id</h6>
                                <p className=" h6 text-break">{data[0]?.caseFrom == "partner" ? `partnerId=${data[0]?.partnerId}` : `empSaleId=${data[0]?.empSaleId}`}&{data[0]?.caseFrom == "partner" ? "partnerCaseId" : "empSaleCaseId"}={data[0]?._id}</p>
                            </div>
                        }


                    </div>
                </div>}
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom mb-5">
                    <div className="d-flex gap-2 align-items-center justify-content-between">
                        <h6 className="text-primary text-center fs-3">Case Details</h6>
                        {editUrl && <div className="d-flex gap-2">
                            <Link to={`${editUrl}${data[0]?._id}`} state={{ filter: location?.state?.filter, back: location?.pathname }} className="btn btn-primary">Edit/ Update</Link>

                            {isAddRefence && <>

                                {data[0]?.caseFrom == "client" && ((data[0]?.partnerId || data[0]?.partnerReferenceCaseDetails) || (data[0]?.empSaleId || data[0]?.empSaleReferenceCaseDetails)) && <button className="btn btn-warning text-white" onClick={() => setRemoveCaseReference({ ...removeCaseReference, status: true })}>Remove Reference</button>}
                                {data[0]?.caseFrom == "client" && <button className="btn btn-success text-white" onClick={() => setAddCaseReference({ show: true, _id: data[0]?._id })}>Add Reference</button>}
                            </>}
                        </div>}
                    </div>

                </div>
                <div className="row">
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">Case Date</h6>
                        <p className=" h6 text-capitalize">{data[0]?.createdAt && getFormateDMYDate(data[0]?.createdAt)}</p>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">File No.</h6>
                        <p className=" h6 text-capitalize">{data[0]?.fileNo}</p>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">Current Status</h6>
                        <p className=" h6 text-capitalize">{data[0]?.currentStatus}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">Name</h6>
                        <p className="h6 text-capitalize">{data[0]?.name}</p>
                    </div>
                    <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">Father's Name</h6>
                        <p className=" h6 text-capitalize">{data[0]?.fatherName}</p>
                    </div>
                    <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">Email</h6>
                        <p className=" h6 ">{data[0]?.email}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">Mobile No</h6>
                        <p className=" h6 text-capitalize">{data[0]?.mobileNo}</p>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">DOB</h6>
                        <p className=" h6 text-capitalize">{data[0]?.DOB && getFormateDMYDate(data[0]?.DOB)}</p>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">Insurance Company</h6>
                        <p className=" h6 text-capitalize">{data[0]?.insuranceCompanyName}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">Policy No.</h6>
                        <p className=" h6 text-capitalize">{data[0]?.policyNo}</p>
                    </div>
                    <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">Policy Type</h6>
                        <p className=" h6 text-capitalize">{data[0]?.policyType}</p>
                    </div>
                    <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">Complaint Type</h6>
                        <p className=" h6 ">{data[0]?.complaintType}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">Claim Amount</h6>
                        <p className=" h6 text-capitalize">{data[0]?.claimAmount}</p>
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">Address</h6>
                        <p className=" h6 text-capitalize">{data[0]?.address}</p>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">City</h6>
                        <p className=" h6 text-capitalize">{data[0]?.city}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                        <h6 className="fw-bold">State</h6>
                        <p className=" h6 text-capitalize">{data[0]?.state}</p>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                        <h6 className="fw-bold">Pincode</h6>
                        <p className=" h6 text-capitalize">{data[0]?.pinCode}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h6 className="fw-bold">Problem Statement</h6>
                        <div className='text-editor' dangerouslySetInnerHTML={{__html:data[0]?.problemStatement}}></div>
                        {/* <p className=" h6">{ data[0]?.problemStatement}</p> */}
                    </div>
                </div>
            </div>
            {addCaseReference?.show && <AddReferenceModal showAddCaseReference={addCaseReference} hide={() => setAddCaseReference({ show: false, _id: "" })} addReferenceCase={addReference} />}

            {/* for case unmerge */}
            <Modal
                show={removeCaseReference.status}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="p-5"
            >
                <Modal.Body className='color-4'>
                    <h4 className='text-danger text-center py-3 fs-3'>Are You Sure ?</h4>
                    <p className='text-primary text-center fs-5'>
                        Want to remove the Reference in this case.
                    </p>
                    <div className="mb-3 col-12">
                        <select className="form-select w-100" name="Type" value={removeCaseReference.type} onChange={(e) => setRemoveCaseReference({ ...removeCaseReference, type: e?.target?.value })} >
                            <option value="">--select remove reference type</option>
                            {(data[0]?.partnerId || data[0]?.partnerReferenceCaseDetails) && <option value="partner">Partner</option>}
                            {(data[0]?.empSaleId || data[0]?.empSaleReferenceCaseDetails) && <option value="sale-emp">Sale</option>}
                        </select>
                    </div>

                    <div className="d-flex gap-1 flex-reverse">
                        <div className="d-flex  justify-content-center">
                            <div aria-disabled={removeCaseReference.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${removeCaseReference.loading
                                && "disabled"}`} onClick={handleRemoveCaseReference}>
                                {removeCaseReference.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Remove</span>}
                            </div>
                        </div>
                        <Button onClick={() => setRemoveCaseReference({ status: false, type: null, loading: false })}>Close</Button>

                    </div>

                </Modal.Body>
            </Modal>
        </div>
    )
}
