import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { getFormateDMYDate } from '../../../utils/helperFunction';
import DocumentPreview from '../../DocumentPreview';
import { MdPayments, MdOutlineAccountBalance, MdOutlineTag, MdOutlineCalendarToday, MdAttachFile } from 'react-icons/md';
import { FiExternalLink, FiMoreVertical } from 'react-icons/fi';
import { FaReceipt } from 'react-icons/fa';

export default function PaymentDetailModal({ show, close, details }) {
    if (!details) return null;

    const attachments = details?.attachments || [];

    const handleOpenUrl = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Modal
            show={show}
            onHide={close}
            size="lg"
            aria-labelledby="payment-detail-modal-title"
            centered
        >
            <Modal.Header closeButton className="border-bottom bg-light">
                <Modal.Title id="payment-detail-modal-title" className="d-flex align-items-center gap-2 text-primary fs-5 fw-bold">
                    <MdPayments className="fs-4" />
                    <span>Payment Details & Attachments</span>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                {/* Top Section: Payment Details Card */}
                <div className="card border-0 bg-light rounded-4 p-3 p-md-4 mb-4 shadow-sm">
                    <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary px-3 py-2 fs-6 rounded-pill">
                                {details?.paymentMode || 'Payment Record'}
                            </span>
                        </div>
                        {details?.amount && (
                            <div className="text-end">
                                <span className="text-muted small d-block">Amount</span>
                                <span className="fs-4 fw-bold text-success">
                                    ₹{Number(details?.amount).toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="row g-3">
                        {details?.dateOfPayment && (
                            <div className="col-12 col-sm-6 col-md-4">
                                <div className="d-flex align-items-center gap-2">
                                    <MdOutlineCalendarToday className="text-primary fs-5" />
                                    <div>
                                        <small className="text-muted d-block">Date of Payment</small>
                                        <span className="fw-semibold text-dark">
                                            {getFormateDMYDate(details?.dateOfPayment)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {details?.bankName && (
                            <div className="col-12 col-sm-6 col-md-4">
                                <div className="d-flex align-items-center gap-2">
                                    <MdOutlineAccountBalance className="text-primary fs-5" />
                                    <div>
                                        <small className="text-muted d-block">Bank Name</small>
                                        <span className="fw-semibold text-dark">{details?.bankName}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {details?.chequeNumber && (
                            <div className="col-12 col-sm-6 col-md-4">
                                <div className="d-flex align-items-center gap-2">
                                    <FaReceipt className="text-primary fs-5" />
                                    <div>
                                        <small className="text-muted d-block">Cheque Number</small>
                                        <span className="fw-semibold text-dark">{details?.chequeNumber}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {details?.chequeDate && (
                            <div className="col-12 col-sm-6 col-md-4">
                                <div className="d-flex align-items-center gap-2">
                                    <MdOutlineCalendarToday className="text-primary fs-5" />
                                    <div>
                                        <small className="text-muted d-block">Cheque Date</small>
                                        <span className="fw-semibold text-dark">
                                            {getFormateDMYDate(details?.chequeDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {details?.utrNumber && (
                            <div className="col-12 col-sm-6 col-md-4">
                                <div className="d-flex align-items-center gap-2">
                                    <MdOutlineTag className="text-primary fs-5" />
                                    <div>
                                        <small className="text-muted d-block">UTR Number</small>
                                        <span className="fw-semibold text-dark">{details?.utrNumber}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {details?.transactionDate && (
                            <div className="col-12 col-sm-6 col-md-4">
                                <div className="d-flex align-items-center gap-2">
                                    <MdOutlineCalendarToday className="text-primary fs-5" />
                                    <div>
                                        <small className="text-muted d-block">Transaction Date</small>
                                        <span className="fw-semibold text-dark">
                                            {getFormateDMYDate(details?.transactionDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Payment Attachments */}
                <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                            <MdAttachFile className="text-primary fs-5" />
                            <span>Payment Attachments ({attachments.length})</span>
                        </h6>
                    </div>

                    {attachments.length === 0 ? (
                        <div className="text-center py-4 bg-light rounded-4 border border-dashed">
                            <MdAttachFile className="fs-1 text-muted mb-2" />
                            <p className="text-muted mb-0 small">No attachment documents uploaded for this payment.</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {attachments.map((url, index) => (
                                <div key={index} className="col-12 col-sm-6 col-md-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                                        {/* Top-Right 3-Dot Menu */}
                                        <div className="position-absolute top-0 end-0 p-2 z-3">
                                            <Dropdown align="end">
                                                <Dropdown.Toggle
                                                    variant="light"
                                                    size="sm"
                                                    className="rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center p-1"
                                                    style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.9)' }}
                                                    id={`dropdown-attachment-${index}`}
                                                >
                                                    <FiMoreVertical className="text-dark fs-6" />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="shadow border-0 rounded-3">
                                                    <Dropdown.Item
                                                        onClick={() => handleOpenUrl(url)}
                                                        className="d-flex align-items-center gap-2 py-2"
                                                    >
                                                        <FiExternalLink className="text-primary" />
                                                        <span>View Attachment</span>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>

                                        {/* Document Preview Thumbnail */}
                                        <div
                                            className="bg-light d-flex align-items-center justify-content-center p-2"
                                            style={{ height: '180px', cursor: 'pointer' }}
                                            onClick={() => handleOpenUrl(url)}
                                            title="Click to view attachment"
                                        >
                                            <DocumentPreview url={url} height="160px" maxWidth="100%" />
                                        </div>

                                        <div className="card-footer bg-white border-top-0 p-2.5 d-flex align-items-center justify-content-between">
                                            <span className="small text-muted text-truncate" style={{ maxWidth: '70%' }}>
                                                Attachment #{index + 1}
                                            </span>
                                            <button
                                                onClick={() => handleOpenUrl(url)}
                                                className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 small d-flex align-items-center gap-1"
                                            >
                                                <span>View</span>
                                                <FiExternalLink size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className="border-top bg-light">
                <Button variant="secondary" onClick={close} className="rounded-pill px-4">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
