import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFormateDMYDate } from '../../../../../utils/helperFunction'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AddReferenceModal from '../../../../../components/Common/Modal/addReferenceModal';
import {
    FaUser, FaEnvelope, FaPhone, FaCalendarAlt,
    FaBuilding, FaFileAlt, FaDollarSign, FaMapMarkerAlt,
    FaCity, FaFlag, FaCode, FaLink, FaTrash, FaPlus,
    FaEdit, FaEye, FaUserTie, FaIdCard, FaShieldAlt,
    FaFileInvoice, FaTags, FaExclamationTriangle, FaTimes,
    FaUserAlt
} from 'react-icons/fa';
import { MdPolicy } from 'react-icons/md';
import { Eye, EyeOff } from 'lucide-react';

export default function CaseDetails({ data, role, isCaseFromAccess, isViewProfile, editUrl, viewClient, isAddRefence, viewEmp, getCaseById, addReference, deleteReference, viewPartner }) {
    const [removeCaseReference, setRemoveCaseReference] = useState({ status: false, type: null, loading: false })
    const [addCaseReference, setAddCaseReference] = useState({ show: false, _id: "" })
    const [showProblemStatement, setShowProblemStatement] = useState(false)

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
        } else {
            toast.warning("Please select reference type to remove")
        }
    }

    const InfoCard = ({ icon, label, value, link, linkText }) => (
        <div className="info-card mb-3">
            <div className="d-flex align-items-start gap-3">
                <div className="info-icon">
                    {icon}
                </div>
                <div className="info-content flex-grow-1">
                    <small className="text-muted d-block mb-1">{label}</small>
                    {link ? (
                        <Link to={link} className="info-link text-decoration-none">
                            {value || linkText || 'View Details'}
                        </Link>
                    ) : (
                        <p className="mb-0 fw-medium text-dark">{value || 'N/A'}</p>
                    )}
                </div>
            </div>
        </div>
    )

    const SectionHeader = ({ title, actions }) => (
        <div className="section-header d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center gap-2">
                <div className="header-indicator"></div>
                <h5 className="section-title mb-0">{title}</h5>
            </div>
            {actions && <div className="section-actions d-flex gap-2">{actions}</div>}
        </div>
    )

    const getTruncatedText = (htmlText) => {
        if (!htmlText) return "";
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        let text = doc.body.textContent || "";
        return text.length > 80 ? text.substring(0, 80) + "..." : text;
    }

    return (
        <div className="case-details-container">
            {/* Case From Section */}
            {(role?.toLowerCase() !== "client" && role?.toLowerCase() !== "partner" && isCaseFromAccess) && (
                <div className="case-from-section mb-4">
                    <div className="case-from-card">
                        <div className="case-from-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="case-from-badge">
                                    <FaUserTie size={24} />
                                </div>
                                <div>
                                    <h4 className="text-primary mb-0 text-capitalize">{data[0]?.caseFrom}</h4>
                                    <small className="text-muted">Case Source Information</small>
                                </div>
                            </div>
                            {isViewProfile && (
                                <Link
                                    to={data[0]?.caseFrom == "partner" ? `${viewPartner}${data[0]?.partnerObjId}` : (data[0]?.caseFrom == "client" ? `${viewClient}${data[0]?.clientObjId}` : `${viewEmp}${data[0]?.empObjId}`)}
                                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                                >
                                    <FaEye size={14} />
                                    View Profile
                                </Link>
                            )}
                        </div>
                        <div className="case-from-body mt-3">
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <InfoCard
                                        icon={<FaUser size={16} />}
                                        label="Case From"
                                        value={data[0]?.caseFrom}
                                    />
                                </div>
                                {data[0]?.caseFrom == "partner" && (
                                    <div className="col-12 col-md-4">
                                        <InfoCard
                                            icon={<FaUserTie size={16} />}
                                            label="Partner Name"
                                            value={data[0]?.partnerDetails?.profile?.consultantName}
                                        />
                                    </div>
                                )}
                                {["partner", "client"]?.includes(data[0]?.caseFrom?.toLowerCase()) && (
                                    <div className="col-12 col-md-4">
                                        <InfoCard
                                            icon={<FaIdCard size={16} />}
                                            label={data[0]?.caseFrom?.toLowerCase() == "client" ? "Customer Code" : "Consultant Code"}
                                            value={data[0]?.caseFrom?.toLowerCase() == "client" ? data[0]?.clientDetails?.profile?.consultantCode : data[0]?.partnerDetails?.profile?.consultantCode}
                                        />
                                    </div>
                                )}
                                {data[0]?.partnerObjId && (
                                    <div className="col-12 col-md-4">
                                        <InfoCard
                                            icon={<FaLink size={16} />}
                                            label="Partner Reference"
                                            link={`${viewPartner}${data[0]?.partnerObjId}`}
                                            linkText="View Partner"
                                        />
                                    </div>
                                )}
                                {data[0]?.empObjId && (
                                    <div className="col-12 col-md-4">
                                        <InfoCard
                                            icon={<FaUser size={16} />}
                                            label="Employee Reference"
                                            link={`${viewEmp}${data[0]?.empObjId}`}
                                            linkText="View Employee"
                                        />
                                    </div>
                                )}
                                {data[0]?.caseFrom != "client" && (
                                    <div className="col-12">
                                        <InfoCard
                                            icon={<FaCode size={16} />}
                                            label="Mapping ID"
                                            value={data[0]?.caseFrom == "partner" ? `partnerId=${data[0]?.partnerObjId} & partnerCaseId=${data[0]?._id}` : `empSaleId=${data[0]?.empObjId} & empSaleCaseId=${data[0]?._id}`}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Case Details Section */}
            <div className="case-details-card mb-5">
                <SectionHeader
                    title="Case Details"
                    actions={
                        <>
                            {editUrl && (
                                <Link
                                    to={`${editUrl}${data[0]?._id}`}
                                    className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                >
                                    <FaEdit size={14} />
                                    Edit / Update
                                </Link>
                            )}
                            {isAddRefence && (
                                <>
                                    {data[0]?.caseFrom == "client" && (data[0]?.partnerObjId || data[0]?.empObjId) && (
                                        <button
                                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                                            onClick={() => setRemoveCaseReference({ ...removeCaseReference, status: true })}
                                        >
                                            <FaTrash size={14} />
                                            Remove Reference
                                        </button>
                                    )}
                                    {data[0]?.caseFrom == "client" && (
                                        <button
                                            className="btn btn-success btn-sm d-flex align-items-center gap-2"
                                            onClick={() => setAddCaseReference({ show: true, _id: data[0]?._id })}
                                        >
                                            <FaPlus size={14} />
                                            Add Reference
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    }
                />

                <div className="case-details-grid">
                    {/* Personal Information */}
                    <div className="details-group">
                        <h6 className="group-title">
                            <FaUser className="me-2" /> Personal Information
                        </h6>
                        <div className="row g-3">
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaUser size={14} />} label="Name" value={data[0]?.name} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaUserAlt size={14} />} label="Father's Name" value={data[0]?.fatherName} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaEnvelope size={14} />} label="Email" value={data[0]?.email} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaPhone size={14} />} label="Mobile No" value={data[0]?.mobileNo} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaCalendarAlt size={14} />} label="Date of Birth" value={data[0]?.DOB && getFormateDMYDate(data[0]?.DOB)} />
                            </div>
                        </div>
                    </div>

                    {/* Case Information */}
                    <div className="details-group mt-4">
                        <h6 className="group-title">
                            <FaFileAlt className="me-2" /> Case Information
                        </h6>
                        <div className="row g-3">
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaCalendarAlt size={14} />} label="Case Date" value={data[0]?.createdAt && getFormateDMYDate(data[0]?.createdAt)} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaFileInvoice size={14} />} label="File No." value={data[0]?.fileNo} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaShieldAlt size={14} />} label="Current Status" value={data[0]?.currentStatus} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaBuilding size={14} />} label="Insurance Company" value={data[0]?.insuranceCompanyName} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<MdPolicy size={14} />} label="Policy No." value={data[0]?.policyNo} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaTags size={14} />} label="Policy Type" value={data[0]?.policyType} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaExclamationTriangle size={14} />} label="Complaint Type" value={data[0]?.complaintType} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaDollarSign size={14} />} label="Claim Amount" value={data[0]?.claimAmount} />
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="details-group mt-4">
                        <h6 className="group-title">
                            <FaMapMarkerAlt className="me-2" /> Address Information
                        </h6>
                        <div className="row g-3">
                            <div className="col-12">
                                <InfoCard icon={<FaMapMarkerAlt size={14} />} label="Address" value={data[0]?.address} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaCity size={14} />} label="City" value={data[0]?.city} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaFlag size={14} />} label="State" value={data[0]?.state} />
                            </div>
                            <div className="col-12 col-md-4">
                                <InfoCard icon={<FaCode size={14} />} label="Pincode" value={data[0]?.pinCode} />
                            </div>
                        </div>
                    </div>

                    {/* Problem Statement */}
                    {data[0]?.problemStatement && (
                        <div className="details-group mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="group-title">
                                    <FaExclamationTriangle className="me-2" /> Problem Statement
                                </h6>
                                <div className='align-items-center'>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => setShowProblemStatement(!showProblemStatement)}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        {showProblemStatement ? (
                                            <><EyeOff size={16} /> Hide</>
                                        ) : (
                                            <><Eye size={16} /> View</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="problem-statement-card p-3 bg-light rounded">
                                {showProblemStatement ? (
                                    <div
                                        className="text-editor problem-content"
                                        dangerouslySetInnerHTML={{ __html: data[0]?.problemStatement }}
                                    ></div>
                                ) : (
                                    <span className="remark-text">{getTruncatedText(data[0]?.problemStatement)}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Reference Modal */}
            {addCaseReference?.show && (
                <AddReferenceModal
                    showAddCaseReference={addCaseReference}
                    getCaseById={getCaseById}
                    hide={() => setAddCaseReference({ show: false, _id: "" })}
                    addReferenceCase={addReference}
                />
            )}

            {/* Remove Reference Confirmation Modal */}
            <Modal
                show={removeCaseReference.status}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="remove-reference-modal"
            >
                <Modal.Body className="p-4">
                    <div className="text-center">
                        <div className="warning-icon mb-3">
                            <FaTimes size={48} className="text-danger" />
                        </div>
                        <h4 className="text-danger mb-3">Are You Sure?</h4>
                        <p className="text-muted mb-4">
                            Want to remove the reference from this case. This action cannot be undone.
                        </p>

                        <div className="mb-4">
                            <label className="form-label fw-medium">Select Reference Type to Remove</label>
                            <select
                                className="form-select"
                                value={removeCaseReference.type}
                                onChange={(e) => setRemoveCaseReference({ ...removeCaseReference, type: e?.target?.value })}
                            >
                                <option value="">-- Select Reference Type --</option>
                                {data[0]?.partnerObjId && <option value="partner">Partner Reference</option>}
                                {data[0]?.empObjId && <option value="sale-emp">Sale Employee Reference</option>}
                            </select>
                        </div>

                        <div className="d-flex gap-3 justify-content-center">
                            <Button
                                variant="danger"
                                onClick={handleRemoveCaseReference}
                                disabled={removeCaseReference.loading || !removeCaseReference.type}
                                className="d-flex align-items-center gap-2 px-4"
                            >
                                {removeCaseReference.loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>
                                        <span>Removing...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTrash size={14} />
                                        <span>Remove Reference</span>
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setRemoveCaseReference({ status: false, type: null, loading: false })}
                                className="px-4"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <style jsx="true">{`
                .case-details-container {
                    width: 100%;
                    overflow-x: hidden;
                }
                
                /* Case From Card */
                .case-from-card {
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                
                .case-from-badge {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                /* Case Details Card */
                .case-details-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }
                
                /* Section Header */
                .section-header {
                    background: #f8f9fa;
                    margin: -24px -24px 24px -24px;
                    padding: 16px 24px;
                    border-radius: 16px 16px 0 0;
                }
                
                .header-indicator {
                    width: 4px;
                    height: 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 2px;
                }
                
                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                }
                
                /* Info Card */
                .info-card {
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }
                
                .info-card:hover {
                    background: #f0f2f5;
                    transform: translateX(4px);
                }
                
                .info-icon {
                    width: 32px;
                    height: 32px;
                    background: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #667eea;
                    flex-shrink: 0;
                }
                
                .info-link {
                    color: #667eea;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                
                .info-link:hover {
                    color: #764ba2;
                    text-decoration: underline !important;
                }
                
                /* Details Group */
                .details-group {
                    border-top: 1px solid #e9ecef;
                    padding-top: 20px;
                }
                
                .details-group:first-of-type {
                    border-top: none;
                    padding-top: 0;
                }
                
                .group-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #667eea;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                }
                
                /* Problem Statement */
                .problem-statement-card {
                    border-left: 3px solid #667eea;
                }
                
                .problem-content {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #555;
                }
                
                /* Remove Reference Modal */
                .remove-reference-modal .modal-content {
                    border-radius: 16px;
                    border: none;
                }
                
                .warning-icon {
                    width: 80px;
                    height: 80px;
                    background: rgba(220, 53, 69, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .case-from-card,
                    .case-details-card {
                        padding: 16px;
                    }
                    
                    .section-header {
                        margin: -16px -16px 16px -16px;
                        padding: 12px 16px;
                    }
                    
                    .section-title {
                        font-size: 16px;
                    }
                    
                    .info-card {
                        padding: 8px;
                    }
                    
                    .info-icon {
                        width: 28px;
                        height: 28px;
                    }
                    
                    .group-title {
                        font-size: 12px;
                    }
                }
                
                /* Animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .case-from-card,
                .case-details-card {
                    animation: fadeInUp 0.4s ease-out;
                }
                
                .info-card {
                    animation: fadeInUp 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}