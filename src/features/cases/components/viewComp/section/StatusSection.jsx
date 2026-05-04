import React, { useContext, useState } from 'react'
import { AppContext } from '../../../../../App'
import { CiEdit } from 'react-icons/ci'
import { FaEye, FaPlus, FaCheckCircle, FaClock, FaTimesCircle, FaUserCheck, FaCalendarAlt, FaComment, FaArrowRight, FaEyeSlash } from 'react-icons/fa'
import { getFormateDMYDate } from '../../../../../utils/helperFunction'
import ChangeStatusModal from '../../common/model/changeStatusModal'
import EditCaseStatusModal from '../../common/model/EditCaseStatus'
import { Modal, Button, Badge } from 'react-bootstrap'

export default function StatusSection({ isAddCaseProcess, id, role, details, getCaseById, processSteps, addCaseProcess, attachementUpload, editCaseProcess }) {
    const state = useContext(AppContext)
    const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
    const [showEditCaseModal, setShowEditCaseModal] = useState({ status: false, details: {} })
    const [viewRemarkModal, setViewRemarkModal] = useState({ viewStatus: false, remark: "", status: "", date: "" })
    const [showProcess, setShowProcess] = useState(false)

    const getTruncatedText = (htmlText) => {
        if (!htmlText) return "";
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        let text = doc.body.textContent || "";
        return text.length > 80 ? text.substring(0, 80) + "..." : text;
    }

    const getStatusConfig = (status) => {
        const statusMap = {
            'pending': { icon: <FaClock />, color: 'warning', bg: '#fff3cd', text: 'Pending', borderColor: '#ffc107' },
            'processing': { icon: <FaArrowRight />, color: 'info', bg: '#d1ecf1', text: 'In Progress', borderColor: '#0dcaf0' },
            'resolve': { icon: <FaCheckCircle />, color: 'success', bg: '#d4edda', text: 'Resolved', borderColor: '#28a745' },
            'reject': { icon: <FaTimesCircle />, color: 'danger', bg: '#f8d7da', text: 'Rejected', borderColor: '#dc3545' },
            'closed': { icon: <FaCheckCircle />, color: 'success', bg: '#d4edda', text: 'Closed', borderColor: '#28a745' },
            'accept': { icon: <FaCheckCircle />, color: 'success', bg: '#d4edda', text: 'Accepted', borderColor: '#28a745' },
            'review': { icon: <FaEye />, color: 'primary', bg: '#cfe2ff', text: 'Under Review', borderColor: '#0d6efd' }
        }
        return statusMap[status?.toLowerCase()] || { icon: <FaClock />, color: 'secondary', bg: '#e9ecef', text: status, borderColor: '#6c757d' }
    }

    return (
        <>
            <div className="status-section-wrapper mt-4 p-4 rounded-2">
                <div className="status-container">
                    {/* Header with Show/Hide Button */}
                    <div className="status-header">
                        <div className="status-header-content">
                            <div className="status-title-section">
                                <div className="status-icon-wrapper">
                                    <FaCheckCircle size={20} />
                                </div>
                                <div>
                                    <h5 className=" mb-0 text-primary">Case Process Timeline</h5>
                                    <p className="status-subtitle mb-0">Track the progress of your case</p>
                                </div>
                            </div>
                            <div className="status-actions">
                                {isAddCaseProcess && (
                                    <button
                                        className="btn-add-status"
                                        onClick={() => setChangeStatus({ status: true, details: { ...details } })}
                                    >
                                        <FaPlus className="me-2" size={12} />
                                        Add Status
                                    </button>
                                )}
                                <button
                                    className="btn-toggle-status"
                                    onClick={() => setShowProcess(!showProcess)}
                                >
                                    {showProcess ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    <span className="ms-2">{showProcess ? 'Hide' : 'Show'} Process</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Process Content */}
                    {showProcess && (
                        <div className="status-content">
                            {processSteps?.length > 0 ? (
                                <div className="process-container">
                                    {/* Desktop View */}
                                    <div className="process-desktop">
                                        <div className="process-table-wrapper">
                                            <table className="process-table">
                                                <thead>
                                                    <tr>
                                                        <th width="80">S.No</th>
                                                        {role?.toLowerCase() == "admin" && <th width="80">Edit</th>}
                                                        <th width="120">Date</th>
                                                        <th width="150">Status</th>
                                                        {role?.toLowerCase() == "admin" && <th width="150">Marked By</th>}
                                                        <th>Remark</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {processSteps?.map((item, ind) => {
                                                        const statusConfig = getStatusConfig(item?.status)

                                                        return (
                                                            <tr key={item._id}>
                                                                <td className="sno-cell">
                                                                    <span className="sno-badge">{ind + 1}</span>
                                                                </td>
                                                                {role?.toLowerCase() == "admin" && (
                                                                    <td>
                                                                        <button
                                                                            className="edit-btn"
                                                                            onClick={() => setShowEditCaseModal({
                                                                                status: true,
                                                                                details: {
                                                                                    caseId: id,
                                                                                    processId: item?._id,
                                                                                    caseStatus: item?.status,
                                                                                    caseRemark: item?.remark,
                                                                                    isCurrentStatus: details?.processSteps?.length === ind + 1
                                                                                }
                                                                            })}
                                                                            title="Edit status"
                                                                        >
                                                                            <CiEdit size={16} />
                                                                        </button>
                                                                    </td>
                                                                )}
                                                                <td>
                                                                    <div className="date-cell">
                                                                        {/* <FaCalendarAlt size={12} className="me-2 text-muted" /> */}
                                                                        <span>{item?.createdAt && getFormateDMYDate(item?.createdAt)}</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div
                                                                        className="status-badge-inline text-center d-flex justify-content-center align-items-center"
                                                                        style={{
                                                                            backgroundColor: statusConfig.bg,
                                                                            borderColor: statusConfig.borderColor,
                                                                            color: statusConfig.borderColor
                                                                        }}
                                                                    >
                                                                        {/* <span className="status-icon">{statusConfig.icon}</span> */}
                                                                        <span className="status-text text-center">{statusConfig.text}</span>
                                                                    </div>
                                                                </td>
                                                                {role?.toLowerCase() == "admin" && (
                                                                    <td>
                                                                        <div className="author-cell">
                                                                            <FaUserCheck size={12} className="me-2 text-muted" />
                                                                            <span className="text-capitalize">{item?.consultant ? item?.consultant : "System"}</span>
                                                                        </div>
                                                                    </td>
                                                                )}
                                                                <td>
                                                                    {item?.remark && (
                                                                        <div className="remark-cell">
                                                                            <FaComment size={12} className="remark-icon me-2" />
                                                                            <span className="remark-text">{getTruncatedText(item?.remark)}</span>
                                                                            {item?.remark?.length > 80 && (
                                                                                <button
                                                                                    className="view-remark-btn-inline"
                                                                                    onClick={() => setViewRemarkModal({
                                                                                        viewStatus: true,
                                                                                        remark: item?.remark,
                                                                                        status: item?.status,
                                                                                        date: item?.createdAt
                                                                                    })}
                                                                                >
                                                                                    <FaEye size={12} /> View
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="process-mobile">
                                        {processSteps?.map((item, ind) => {
                                            const statusConfig = getStatusConfig(item?.status)

                                            return (
                                                <div key={item._id} className={`process-card`}   >
                                                    <div className="process-card-header">
                                                        <div className="card-header-left">
                                                            <span className="step-number-mobile">{ind + 1}</span>
                                                        </div>
                                                        {role?.toLowerCase() == "admin" && (
                                                            <button
                                                                className="edit-btn-mobile"
                                                                onClick={() => setShowEditCaseModal({
                                                                    status: true,
                                                                    details: {
                                                                        caseId: id,
                                                                        processId: item?._id,
                                                                        caseStatus: item?.status,
                                                                        caseRemark: item?.remark,
                                                                        isCurrentStatus: details?.processSteps?.length === ind + 1
                                                                    }
                                                                })}
                                                            >
                                                                <CiEdit size={16} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="process-card-body">
                                                        <div className="card-row">
                                                            <div className="card-label">
                                                                <FaCalendarAlt size={12} />
                                                                <span>Date</span>
                                                            </div>
                                                            <div className="card-value">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</div>
                                                        </div>

                                                        <div className="card-row">
                                                            <div className="card-label">
                                                                <span className="status-icon-mobile">{statusConfig.icon}</span>
                                                                <span>Status</span>
                                                            </div>
                                                            <div className="card-value">
                                                                <div
                                                                    className="status-badge-mobile"
                                                                    style={{
                                                                        backgroundColor: statusConfig.bg,
                                                                        borderColor: statusConfig.borderColor,
                                                                        color: statusConfig.borderColor
                                                                    }}
                                                                >
                                                                    {statusConfig.text}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {role?.toLowerCase() == "admin" && (
                                                            <div className="card-row">
                                                                <div className="card-label">
                                                                    <FaUserCheck size={12} />
                                                                    <span>Marked By</span>
                                                                </div>
                                                                <div className="card-value text-capitalize">{item?.consultant ? item?.consultant : "System"}</div>
                                                            </div>
                                                        )}

                                                        {item?.remark && (
                                                            <div className="card-row remark-row">
                                                                <div className="card-label">
                                                                    <FaComment size={12} />
                                                                    <span>Remark</span>
                                                                </div>
                                                                <div className="card-value remark-value">
                                                                    <div dangerouslySetInnerHTML={{ __html: getTruncatedText(item?.remark) }} />
                                                                    {item?.remark?.length > 80 && (
                                                                        <button
                                                                            className="view-remark-btn-mobile"
                                                                            onClick={() => setViewRemarkModal({
                                                                                viewStatus: true,
                                                                                remark: item?.remark,
                                                                                status: item?.status,
                                                                                date: item?.createdAt
                                                                            })}
                                                                        >
                                                                            View Full <FaEye size={10} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-state-process">
                                    <div className="empty-icon">
                                        <FaClock size={40} />
                                    </div>
                                    <h6 className="empty-title">No Status Updates Yet</h6>
                                    <p className="empty-text">Click "Add Status" to start tracking the case progress</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {changeStatus?.status && (
                <ChangeStatusModal
                    changeStatus={changeStatus}
                    setChangeStatus={setChangeStatus}
                    getCaseById={getCaseById}
                    handleCaseStatus={addCaseProcess}
                    role="admin"
                    attachementUpload={attachementUpload}
                />
            )}

            {showEditCaseModal?.status && (
                <EditCaseStatusModal
                    changeStatus={showEditCaseModal}
                    getCaseById={getCaseById}
                    setChangeStatus={setShowEditCaseModal}
                    handleCaseStatus={editCaseProcess}
                    role="admin"
                />
            )}

            {/* View Remark Modal */}
            <Modal
                show={viewRemarkModal.viewStatus}
                onHide={() => setViewRemarkModal({ viewStatus: false, remark: "", status: "", date: "" })}
                size="lg"
                centered
                className="remark-modal"
            >
                <Modal.Header closeButton className="remark-modal-header">
                    <Modal.Title>
                        <div>
                            <h5 className="mb-0">Status Details</h5>
                            <small className="text-muted">Complete information about this status update</small>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="remark-modal-body">
                    <div className="remark-info mb-4">
                        <div className="remark-status">
                            {(() => {
                                const config = getStatusConfig(viewRemarkModal.status)
                                return (
                                    <div
                                        className="remark-status-badge"
                                        style={{
                                            backgroundColor: config.bg,
                                            borderColor: config.borderColor,
                                            color: config.borderColor
                                        }}
                                    >
                                        {config.icon} {config.text}
                                    </div>
                                )
                            })()}
                        </div>
                        <div className="remark-date">
                            <FaCalendarAlt className="me-2 text-muted" />
                            <span className="text-muted">{viewRemarkModal.date && getFormateDMYDate(viewRemarkModal.date)}</span>
                        </div>
                    </div>
                    <div className="remark-full-section">
                        <div className="remark-label">
                            <FaComment className="me-2" />
                            <strong>Detailed Remark</strong>
                        </div>
                        <div
                            className="remark-full-content p-3 bg-light rounded"
                            dangerouslySetInnerHTML={{ __html: viewRemarkModal.remark }}
                        ></div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="remark-modal-footer">
                    <Button variant="primary" onClick={() => setViewRemarkModal({ viewStatus: false, remark: "", status: "", date: "" })}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx="true">{`
                .status-section-wrapper {
                    width: 100%;
                    overflow-x: hidden;
                    background: white;
                }
                
                .status-container {
                    // background: white;
                    border-radius: 0;
                }
                
                /* Header Styles - No background color */
                .status-header {
                    // background: white;
                    padding: 0 0 20px 0;
                    border-bottom: 2px solid #e9ecef;
                    margin-bottom: 20px;
                }
                
                .status-header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                .status-title-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .status-icon-wrapper {
                    width: 40px;
                    height: 40px;
                    background: #667eea;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .status-title {
                    color: #333;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .status-subtitle {
                    color: #6c757d;
                    font-size: 13px;
                }
                
                .status-actions {
                    display: flex;
                    gap: 12px;
                }
                
                .btn-add-status {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }
                
                .btn-add-status:hover {
                    background: #5a67d8;
                    transform: translateY(-1px);
                }
                
                .btn-toggle-status {
                    background: white;
                    color: #6c757d;
                    border: 1px solid #dee2e6;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }
                
                .btn-toggle-status:hover {
                    background: #f8f9fa;
                    border-color: #667eea;
                    color: #667eea;
                }
                
                /* Content Styles */
                .status-content {
                    background: transparent;
                    padding: 0;
                }
                
                /* Desktop Table View */
                .process-desktop {
                    display: block;
                }
                
                .process-table-wrapper {
                    overflow-x: auto;
                }
                
                .process-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }
                
                .process-table thead th {
                    background: #f8f9fa;
                    padding: 12px 16px;
                    text-align: left;
                    font-size: 13px;
                    font-weight: 600;
                    color: #495057;
                    border-bottom: 2px solid #e9ecef;
                }
                
                .process-table tbody tr {
                    transition: all 0.2s ease;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .process-table tbody tr:hover {
                    background: #f8f9fa;
                }
                
                .process-table tbody td {
                    padding: 16px;
                    vertical-align: middle;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .current-row {
                    background: rgba(102,126,234,0.05);
                    border-left: 3px solid #667eea;
                }
                
                .sno-cell {
                    font-weight: 600;
                }
                
                .sno-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    font-weight: 600;
                    color: #667eea;
                }
                
                .current-indicator {
                    display: inline-block;
                    margin-left: 8px;
                    font-size: 10px;
                    padding: 2px 6px;
                    background: #667eea;
                    color: white;
                    border-radius: 4px;
                }
                
                .edit-btn {
                    background: none;
                    border: none;
                    padding: 6px;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                
                .edit-btn:hover {
                    background: #e9ecef;
                }
                
                .date-cell, .author-cell {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    color: #495057;
                }
                
                .status-badge-inline {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    border: 1px solid;
                    width: fit-content;
                }
                
                .remark-cell {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                    font-size: 13px;
                    color: #6c757d;
                }
                
                .remark-text {
                    flex: 1;
                    color: #495057;
                }
                
                .view-remark-btn-inline {
                    background: none;
                    border: none;
                    color: #667eea;
                    font-size: 12px;
                    cursor: pointer;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                
                .view-remark-btn-inline:hover {
                    background: #e9ecef;
                }
                
                /* Mobile View */
                .process-mobile {
                    display: none;
                }
                
                .process-card {
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 16px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .current-card {
                    border: 1px solid #667eea;
                    background: rgba(102,126,234,0.02);
                }
                
                .process-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 12px;
                    margin-bottom: 12px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .card-header-left {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .step-number-mobile {
                    font-weight: 600;
                    font-size: 14px;
                    color: #667eea;
                }
                
                .current-badge-mobile {
                    font-size: 10px;
                    padding: 2px 8px;
                    background: #667eea;
                    color: white;
                    border-radius: 4px;
                }
                
                .edit-btn-mobile {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6c757d;
                }
                
                .process-card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .card-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .card-label {
                    width: 80px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #6c757d;
                    font-weight: 500;
                }
                
                .card-value {
                    flex: 1;
                    font-size: 13px;
                    color: #495057;
                }
                
                .remark-row {
                    align-items: flex-start;
                }
                
                .remark-value {
                    line-height: 1.5;
                }
                
                .status-badge-mobile {
                    display: inline-block;
                    padding: 2px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                    border: 1px solid;
                }
                
                .view-remark-btn-mobile {
                    background: none;
                    border: none;
                    color: #667eea;
                    font-size: 11px;
                    cursor: pointer;
                    margin-top: 6px;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }
                
                /* Empty State */
                .empty-state-process {
                    text-align: center;
                    padding: 60px 20px;
                    background: white;
                    border-radius: 12px;
                }
                
                .empty-icon {
                    width: 70px;
                    height: 70px;
                    background: rgba(102,126,234,0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    color: #667eea;
                }
                
                .empty-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }
                
                .empty-text {
                    color: #6c757d;
                    font-size: 13px;
                }
                
                /* Remark Modal */
                .remark-modal .modal-content {
                    border-radius: 16px;
                }
                
                .remark-modal-header {
                    background: white;
                    border-bottom: 1px solid #e9ecef;
                    padding: 20px 24px;
                }
                
                .remark-modal-body {
                    padding: 24px;
                }
                
                .remark-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .remark-status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 500;
                    border: 1px solid;
                }
                
                .remark-full-section {
                    margin-top: 20px;
                }
                
                .remark-label {
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                }
                
                .remark-full-content {
                    min-height: 120px;
                    max-height: 350px;
                    overflow-y: auto;
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .process-desktop {
                        display: none;
                    }
                    
                    .process-mobile {
                        display: block;
                    }
                    
                    .status-header-content {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .status-actions {
                        width: 100%;
                    }
                    
                    .btn-add-status, .btn-toggle-status {
                        flex: 1;
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    )
}