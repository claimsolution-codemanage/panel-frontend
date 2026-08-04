import React, { useContext, useState } from 'react'
import { AppContext } from '../../../../../App'
import { CiEdit } from 'react-icons/ci'
import { FaPlus, FaCheckCircle, FaClock, FaTimesCircle, FaUserCheck, FaCalendarAlt, FaComment, FaArrowRight, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { getFormateDMYDate } from '../../../../../utils/helperFunction'
import ChangeStatusModal from '../../common/model/changeStatusModal'
import { Modal, Button } from 'react-bootstrap'
import DocumentPreview from '../../../../../components/DocumentPreview'
import { FiExternalLink } from 'react-icons/fi'
import { MdAttachFile } from 'react-icons/md'

export default function StatusSection({ isAddCaseProcess, id, role, details, getCaseById, processSteps, addCaseProcess, attachementUpload, editCaseProcess }) {
    const state = useContext(AppContext)
    const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
    const [viewRemarkModal, setViewRemarkModal] = useState({ viewStatus: false, remark: "", status: "", date: "" })
    const [showProcess, setShowProcess] = useState(false)
    const [expandedCardId, setExpandedCardId] = useState(null)

    const toggleCardExpand = (id) => {
        setExpandedCardId(prev => prev === id ? null : id)
    }

    const handleOpenUrl = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const stripHtmlTags = (html) => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent?.substring(0, 100) || "";
    }

    const getStatusConfig = (status) => {
        const statusMap = {
            'pending': {
                icon: <FaClock />,
                color: '#ffc107',
                bg: '#fff3cd',
                text: 'Pending',
                borderColor: '#ffc107',
                lightBg: '#fff8e1'
            },
            'processing': {
                icon: <FaArrowRight />,
                color: '#0dcaf0',
                bg: '#d1ecf1',
                text: 'In Progress',
                borderColor: '#0dcaf0',
                lightBg: '#e1f5fe'
            },
            'resolve': {
                icon: <FaCheckCircle />,
                color: '#28a745',
                bg: '#d4edda',
                text: 'Resolved',
                borderColor: '#28a745',
                lightBg: '#e8f5e9'
            },
            'reject': {
                icon: <FaTimesCircle />,
                color: '#dc3545',
                bg: '#f8d7da',
                text: 'Rejected',
                borderColor: '#dc3545',
                lightBg: '#fce4ec'
            },
            'closed': {
                icon: <FaCheckCircle />,
                color: '#28a745',
                bg: '#d4edda',
                text: 'Closed',
                borderColor: '#28a745',
                lightBg: '#e8f5e9'
            },
            'accept': {
                icon: <FaCheckCircle />,
                color: '#28a745',
                bg: '#d4edda',
                text: 'Accepted',
                borderColor: '#28a745',
                lightBg: '#e8f5e9'
            },
            'review': {
                icon: <FaEye />,
                color: '#0d6efd',
                bg: '#cfe2ff',
                text: 'Under Review',
                borderColor: '#0d6efd',
                lightBg: '#e8eaf6'
            }
        }
        return statusMap[status?.toLowerCase()] || {
            icon: <FaClock />,
            color: '#6c757d',
            bg: '#e9ecef',
            text: status,
            borderColor: '#6c757d',
            lightBg: '#f5f5f5'
        }
    }

    return (
        <>
            <div className="status-timeline-wrapper mt-4">
                {/* Header */}
                <div className="timeline-header">
                    <div className="header-left">
                        <div className="header-icon-wrapper">
                            <FaCheckCircle className="header-icon" />
                        </div>
                        <div>
                            <h4 className="header-title">Case Progress Timeline</h4>
                            <p className="header-subtitle">Visual journey of your case status updates</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        {isAddCaseProcess && (
                            <button
                                className="btn-add-status"
                                onClick={() => setChangeStatus({ status: true, details: { ...details } })}
                            >
                                <FaPlus className="me-2" />
                                Add Status
                            </button>
                        )}
                        <button
                            className="btn-toggle-view"
                            onClick={() => setShowProcess(!showProcess)}
                        >
                            {showProcess ? <FaChevronUp /> : <FaChevronDown />}
                            <span className="ms-2">{showProcess ? 'Collapse' : 'Expand'} Timeline</span>
                        </button>
                    </div>
                </div>

                {/* Timeline Content */}
                {showProcess && (
                    <div className="timeline-content">
                        {processSteps?.length > 0 ? (
                            <div className="timeline-container">
                                <div className="timeline">
                                    {processSteps?.map((item, index) => {
                                        const statusConfig = getStatusConfig(item?.status)
                                        const isLast = index === processSteps.length - 1
                                        const isExpanded = expandedCardId === item._id
                                        const isFirst = index === 0

                                        return (
                                            <div key={item._id} className={`timeline-item ${isLast ? 'last-item' : ''}`}>
                                                {/* Timeline Line */}
                                                <div className="timeline-line">
                                                    <div
                                                        className={`timeline-dot ${isFirst ? 'first-dot' : ''}`}
                                                        style={{
                                                            background: isFirst ? '#28a745' : statusConfig.color,
                                                            boxShadow: isFirst ? '0 0 0 4px #d4edda' : `0 0 0 4px ${statusConfig.lightBg}`
                                                        }}
                                                    >
                                                        {isFirst && <FaCheckCircle className="dot-icon" />}
                                                    </div>
                                                    {!isLast && (
                                                        <div
                                                            className="timeline-connector"
                                                            style={{
                                                                background: `linear-gradient(to bottom, ${isFirst ? '#28a745' : statusConfig.color}, ${getStatusConfig(processSteps[index + 1]?.status)?.color || '#e9ecef'})`
                                                            }}
                                                        />
                                                    )}
                                                </div>

                                                {/* Timeline Card */}
                                                <div className={`timeline-card ${isFirst ? 'first-card' : ''}`}>
                                                    <div className="card-header">
                                                        <div className="header-left-content">
                                                            <div className="step-number">{index + 1}</div>
                                                            <div
                                                                className="status-badge"
                                                                style={{
                                                                    backgroundColor: statusConfig.lightBg,
                                                                    borderColor: statusConfig.color,
                                                                    color: statusConfig.color
                                                                }}
                                                            >
                                                                <span>{statusConfig.text}</span>
                                                            </div>
                                                            {isFirst && (
                                                                <span className="latest-badge">Latest</span>
                                                            )}
                                                        </div>
                                                        <div className="header-right-content">
                                                            <span className="date-display">
                                                                <FaCalendarAlt className="me-1" />
                                                                {item?.createdAt && getFormateDMYDate(item?.createdAt)}
                                                            </span>
                                                            {role?.toLowerCase() === "admin" && (
                                                                <button
                                                                    className="edit-btn-timeline"
                                                                    onClick={() => setChangeStatus({
                                                                        status: true,
                                                                        details: {
                                                                            caseId: id,
                                                                            processId: item?._id,
                                                                            caseStatus: item?.status,
                                                                            caseRemark: item?.remark,
                                                                            otherDetails: item?.otherDetails,
                                                                            nextFollowUp: item?.nextFollowUp,
                                                                            isCurrentStatus: index === 0,
                                                                            attachments: item?.attachments || [],
                                                                            name: details?.name,
                                                                            fileNo: details?.fileNo,
                                                                            currentStatus: details?.currentStatus
                                                                        }
                                                                    })}
                                                                    title="Edit status"
                                                                >
                                                                    <CiEdit size={16} />
                                                                </button>
                                                            )}
                                                            <button
                                                                className="expand-btn"
                                                                onClick={() => toggleCardExpand(item._id)}
                                                            >
                                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Card Body - Hidden by default, shown when expanded */}
                                                    {isExpanded && (
                                                        <div className="card-body">
                                                            {/* Other Details */}
                                                            {item?.otherDetails && Object.values(item?.otherDetails).length > 0 && (
                                                                <div className="details-grid">
                                                                    {item?.otherDetails?.caseNumber && (
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Case Number</span>
                                                                            <span className="detail-value">{item?.otherDetails?.caseNumber}</span>
                                                                        </div>
                                                                    )}
                                                                    {item?.otherDetails?.courtName && (
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Court/Forum</span>
                                                                            <span className="detail-value">{item?.otherDetails?.courtName}</span>
                                                                        </div>
                                                                    )}
                                                                    {item?.otherDetails?.courtAddress && (
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Address</span>
                                                                            <span className="detail-value">{item?.otherDetails?.courtAddress}</span>
                                                                        </div>
                                                                    )}
                                                                    {item?.otherDetails?.nextHearingDate && (
                                                                        <div className="detail-item highlight">
                                                                            <span className="detail-label">Next Hearing</span>
                                                                            <span className="detail-value">
                                                                                <FaCalendarAlt className="me-1" />
                                                                                {getFormateDMYDate(item?.otherDetails?.nextHearingDate)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Marked By */}
                                                            {role?.toLowerCase() === "admin" && (
                                                                <div className="marked-by">
                                                                    <FaUserCheck className="me-2" />
                                                                    <span>Marked by: </span>
                                                                    <strong className="text-capitalize">
                                                                        {item?.consultant ? item?.consultant : "System"}
                                                                    </strong>
                                                                </div>
                                                            )}

                                                            {/* Remark - Plain Text */}
                                                            {item?.remark && (
                                                                <div className="remark-section">
                                                                    <div className="remark-header">
                                                                        <FaComment className="remark-icon" />
                                                                        <span className="remark-title">Remark</span>
                                                                    </div>
                                                                    <div className="remark-content">
                                                                        {stripHtmlTags(item?.remark)}
                                                                    </div>
                                                                    {item?.remark?.length > 100 && (
                                                                        <button
                                                                            className="view-full-btn"
                                                                            onClick={() => setViewRemarkModal({
                                                                                viewStatus: true,
                                                                                remark: item?.remark,
                                                                                status: item?.status,
                                                                                date: item?.createdAt
                                                                            })}
                                                                        >
                                                                            View Full Remark <FaEye className="ms-1" size={12} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Attachments */}
                                                            {item?.attachments && item.attachments.length > 0 && (
                                                                <div className="mt-3 pt-3 border-top">
                                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                                        <MdAttachFile className="text-primary fs-5" />
                                                                        <span className="fw-bold text-dark small">Attachments ({item.attachments.length})</span>
                                                                    </div>
                                                                    <div className="row g-2">
                                                                        {item.attachments.map((url, idx) => (
                                                                            <div key={idx} className="col-6 col-sm-4 col-md-3">
                                                                                <div className="card h-100 border rounded-3 overflow-hidden bg-white position-relative shadow-sm">
                                                                                    <div
                                                                                        className="bg-light d-flex align-items-center justify-content-center p-1"
                                                                                        style={{ height: '90px', cursor: 'pointer' }}
                                                                                        onClick={() => handleOpenUrl(url)}
                                                                                        title="Click to view attachment"
                                                                                    >
                                                                                        <DocumentPreview url={url} height="80px" maxWidth="100%" />
                                                                                    </div>
                                                                                    <div className="card-footer bg-white p-1.5 d-flex align-items-center justify-content-between border-top">
                                                                                        <span className="small text-muted text-truncate" style={{ fontSize: '0.75rem', maxWidth: '65%' }}>
                                                                                            Attachment #{idx + 1}
                                                                                        </span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleOpenUrl(url)}
                                                                                            className="btn btn-sm btn-outline-primary p-0 d-flex align-items-center justify-content-center rounded-circle"
                                                                                            style={{ width: '20px', height: '20px' }}
                                                                                            title="View"
                                                                                        >
                                                                                            <FiExternalLink size={10} />
                                                                                        </button>
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
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <FaClock size={48} />
                                </div>
                                <h5 className="empty-state-title">No Status Updates Yet</h5>
                                <p className="empty-state-text">Click "Add Status" to start tracking the case progress</p>
                                {isAddCaseProcess && (
                                    <button
                                        className="btn-add-status-empty"
                                        onClick={() => setChangeStatus({ status: true, details: { ...details } })}
                                    >
                                        <FaPlus className="me-2" />
                                        Add First Status
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {changeStatus?.status && (
                <ChangeStatusModal
                    changeStatus={changeStatus}
                    setChangeStatus={setChangeStatus}
                    getCaseById={getCaseById}
                    handleCaseStatus={changeStatus?.details?.processId ? editCaseProcess : addCaseProcess}
                    role="admin"
                    attachementUpload={attachementUpload}
                />
            )}

            {/* View Remark Modal */}
            <Modal
                show={viewRemarkModal.viewStatus}
                onHide={() => setViewRemarkModal({ viewStatus: false, remark: "", status: "", date: "" })}
                size="lg"
                centered
                className="remark-modal-custom"
            >
                <Modal.Header closeButton className="remark-modal-header-custom">
                    <Modal.Title>
                        <div className="modal-title-content">
                            <h5 className="mb-0">Detailed Remark</h5>
                            <small className="text-white fs-6">Complete status update information</small>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="remark-modal-body-custom">
                    <div className="remark-modal-info">
                        {(() => {
                            const config = getStatusConfig(viewRemarkModal.status)
                            return (
                                <div
                                    className="remark-modal-status"
                                    style={{
                                        backgroundColor: config.lightBg,
                                        borderColor: config.color,
                                        color: config.color
                                    }}
                                >
                                    {config.icon}
                                    <span>{config.text}</span>
                                </div>
                            )
                        })()}
                        <div className="remark-modal-date">
                            <FaCalendarAlt className="me-2" />
                            {viewRemarkModal.date && getFormateDMYDate(viewRemarkModal.date)}
                        </div>
                    </div>
                    <div className="remark-modal-content-wrapper">
                        <div className="remark-modal-label">
                            <FaComment className="me-2" />
                            <strong>Remark Details</strong>
                        </div>
                        <div
                            className="remark-modal-content"
                            dangerouslySetInnerHTML={{ __html: viewRemarkModal.remark }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="remark-modal-footer-custom">
                    <Button
                        variant="primary"
                        onClick={() => setViewRemarkModal({ viewStatus: false, remark: "", status: "", date: "" })}
                        className="btn-close-modal"
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx="true">{`
                /* Main Wrapper */
                .status-timeline-wrapper {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                }

                /* Header */
                .timeline-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f0f2f5;
                    margin-bottom: 24px;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .header-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }

                .header-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin: 0;
                }

                .header-subtitle {
                    font-size: 14px;
                    color: #6c757d;
                    margin: 0;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 16px 0;
                    }

                    table td,
                    table th {
                    border: 1px solid #d1d5db;
                    padding: 10px;
                    text-align: left;
                    }

                    table th {
                    background: #f3f4f6;
                    }

                .btn-add-status {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .btn-add-status:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .btn-toggle-view {
                    background: white;
                    color: #495057;
                    border: 1px solid #dee2e6;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .btn-toggle-view:hover {
                    background: #f8f9fa;
                    border-color: #667eea;
                    color: #667eea;
                }

                /* Timeline */
                .timeline-container {
                    padding: 8px 0;
                }

                .timeline {
                    position: relative;
                }

                .timeline-item {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 0;
                    position: relative;
                }

                .timeline-item.last-item {
                    margin-bottom: 0;
                }

                /* Timeline Line */
                .timeline-line {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 4px;
                    flex-shrink: 0;
                    width: 40px;
                }

                .timeline-dot {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 2;
                    flex-shrink: 0;
                }

                .timeline-dot.first-dot {
                    width: 20px;
                    height: 20px;
                    background: #28a745 !important;
                }

                .dot-icon {
                    color: white;
                    font-size: 10px;
                }

                .timeline-connector {
                    width: 2px;
                    flex: 1;
                    min-height: 40px;
                    margin: 4px 0;
                    border-radius: 2px;
                    opacity: 0.4;
                }

                /* Timeline Card */
                .timeline-card {
                    flex: 1;
                    background: white;
                    border-radius: 12px;
                    padding: 18px 20px;
                    margin-bottom: 20px;
                    border: 1px solid #e9ecef;
                    transition: all 0.3s ease;
                }

                .timeline-card.first-card {
                    border-color: #28a745;
                    background: #fafffe;
                }

                .timeline-card:hover {
                    border-color: #667eea;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .header-left-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .step-number {
                    font-size: 11px;
                    font-weight: 600;
                    color: #6c757d;
                    background: #f8f9fa;
                    padding: 2px 8px;
                    border-radius: 10px;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 3px 10px;
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 500;
                    border: 1px solid;
                }



                .latest-badge {
                    font-size: 9px;
                    font-weight: 600;
                    color: white;
                    background: #28a745;
                    padding: 2px 8px;
                    border-radius: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .header-right-content {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-wrap: wrap;
                }

                .date-display {
                    font-size: 12px;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                }

                .edit-btn-timeline {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    border-radius: 4px;
                    color: #6c757d;
                    transition: all 0.2s;
                }

                .edit-btn-timeline:hover {
                    background: #f8f9fa;
                    color: #667eea;
                }

                .expand-btn {
                    background: none;
                    border: none;
                    padding: 4px 6px;
                    cursor: pointer;
                    color: #6c757d;
                    border-radius: 4px;
                    transition: all 0.2s;
                }

                .expand-btn:hover {
                    background: #f8f9fa;
                }

                /* Card Body */
                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #e9ecef;
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                    background: #f8f9fa;
                    padding: 12px 14px;
                    border-radius: 8px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .detail-item.highlight {
                    background: #fff3cd;
                    padding: 6px 10px;
                    border-radius: 6px;
                }

                .detail-label {
                    font-size: 10px;
                    color: #6c757d;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                .detail-value {
                    font-size: 13px;
                    color: #1a1a2e;
                    font-weight: 500;
                }

                .marked-by {
                    font-size: 13px;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    padding: 4px 0;
                }

                .marked-by strong {
                    color: #1a1a2e;
                    margin-left: 4px;
                }

                /* Remark Section */
                .remark-section {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 10px 14px;
                }

                .remark-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 6px;
                }

                .remark-icon {
                    color: #667eea;
                    font-size: 13px;
                }

                .remark-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #1a1a2e;
                }

                .remark-content {
                    font-size: 14px;
                    color: #495057;
                    line-height: 1.6;
                }

                .view-full-btn {
                    background: none;
                    border: none;
                    color: #667eea;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 4px 0;
                    margin-top: 6px;
                    display: inline-flex;
                    align-items: center;
                    transition: all 0.2s;
                }

                .view-full-btn:hover {
                    color: #5a67d8;
                    text-decoration: underline;
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background: #fafbfc;
                    border-radius: 12px;
                    border: 2px dashed #e9ecef;
                }

                .empty-state-icon {
                    width: 80px;
                    height: 80px;
                    background: rgba(102, 126, 234, 0.08);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    color: #667eea;
                }

                .empty-state-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin-bottom: 8px;
                }

                .empty-state-text {
                    color: #6c757d;
                    font-size: 14px;
                    margin-bottom: 20px;
                }

                .btn-add-status-empty {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .btn-add-status-empty:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                /* Remark Modal */
                .remark-modal-custom .modal-content {
                    border-radius: 16px;
                    border: none;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                }

                .remark-modal-header-custom {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px 16px 0 0;
                    padding: 20px 24px;
                }

                .remark-modal-header-custom .btn-close {
                    filter: brightness(0) invert(1);
                }

                .modal-title-content h5 {
                    color: white;
                }

                .modal-title-content small {
                    color: rgba(255,255,255,0.8);
                }

                .remark-modal-body-custom {
                    padding: 24px;
                }

                .remark-modal-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                    padding-bottom: 14px;
                    border-bottom: 1px solid #e9ecef;
                    margin-bottom: 18px;
                }

                .remark-modal-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 14px;
                    border-radius: 16px;
                    font-size: 13px;
                    font-weight: 500;
                    border: 1px solid;
                }

                .remark-modal-date {
                    font-size: 13px;
                    color: #6c757d;
                }

                .remark-modal-content-wrapper {
                    margin-top: 4px;
                }

                .remark-modal-label {
                    font-size: 14px;
                    margin-bottom: 10px;
                    color: #1a1a2e;
                }

                .remark-modal-content {
                    background: #f8f9fa;
                    padding: 16px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    line-height: 1.8;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .remark-modal-footer-custom {
                    border-top: none;
                    padding: 12px 24px 20px;
                }

                .btn-close-modal {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    padding: 8px 28px;
                    border-radius: 8px;
                }

                .btn-close-modal:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .status-timeline-wrapper {
                        padding: 16px;
                    }

                    .timeline-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .header-actions {
                        width: 100%;
                    }

                    .btn-add-status, .btn-toggle-view {
                        flex: 1;
                        justify-content: center;
                        font-size: 13px;
                        padding: 8px 16px;
                    }

                    .timeline-item {
                        gap: 12px;
                    }

                    .timeline-line {
                        width: 30px;
                    }

                    .timeline-card {
                        padding: 14px 16px;
                        margin-bottom: 16px;
                    }

                    .card-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .header-left-content {
                        width: 100%;
                    }

                    .header-right-content {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .details-grid {
                        grid-template-columns: 1fr;
                    }

                    .remark-modal-info {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 480px) {
                    .status-timeline-wrapper {
                        padding: 12px;
                    }

                    .header-icon-wrapper {
                        width: 40px;
                        height: 40px;
                        font-size: 16px;
                    }

                    .header-title {
                        font-size: 17px;
                    }

                    .timeline-dot {
                        width: 14px;
                        height: 14px;
                    }

                    .timeline-dot.first-dot {
                        width: 18px;
                        height: 18px;
                    }

                    .status-badge {
                        font-size: 11px;
                        padding: 2px 8px;
                    }

                    .remark-modal-body-custom {
                        padding: 16px;
                    }
                }

                /* Smooth animations */
                .timeline-item {
                    animation: slideIn 0.4s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .timeline-item:nth-child(1) { animation-delay: 0.05s; }
                .timeline-item:nth-child(2) { animation-delay: 0.1s; }
                .timeline-item:nth-child(3) { animation-delay: 0.15s; }
                .timeline-item:nth-child(4) { animation-delay: 0.2s; }
                .timeline-item:nth-child(5) { animation-delay: 0.25s; }
                .timeline-item:nth-child(6) { animation-delay: 0.3s; }
                .timeline-item:nth-child(7) { animation-delay: 0.35s; }
                .timeline-item:nth-child(8) { animation-delay: 0.4s; }
                .timeline-item:nth-child(9) { animation-delay: 0.45s; }
                .timeline-item:nth-child(10) { animation-delay: 0.5s; }
            `}</style>
        </>
    )
}