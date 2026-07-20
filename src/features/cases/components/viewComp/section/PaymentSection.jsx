import React, { useState, useMemo } from 'react';
import { getFormateDMYDate } from '../../../../../utils/helperFunction';
import { CiEdit } from 'react-icons/ci';
import { HiMiniEye } from 'react-icons/hi2';
import { MdPayments, MdAddCircleOutline, MdOutlineReceiptLong, MdOutlineCalendarToday, MdOutlineAccountBalance, MdOutlineQrCodeScanner, MdAttachFile } from 'react-icons/md';
import { FaMoneyBillWave, FaUniversity, FaFileInvoice, FaGlobe } from 'react-icons/fa';
import PaymentModal from '../../../../../components/Common/Modal/PaymentModal';
import PaymentDetailModal from '../../../../../components/Common/Modal/PaymentDetailModal';
import { useFormik } from 'formik';
import { paymentInitialValues, paymentValidationSchema } from '../../../../../utils/validation';
import { toast } from 'react-toastify';

export default function PaymentSection({ id, accessPayment, casePayment, getCaseById, paymentDetailsApi, attachementUpload }) {
    const [paymentModal, setpaymentModal] = useState({ save: false, show: false });
    const [detailModal, setDetailModal] = useState({ show: false, details: null });

    const totalPaidAmount = useMemo(() => {
        return (casePayment || []).reduce((acc, curr) => acc + (Number(curr?.amount) || 0), 0);
    }, [casePayment]);

    const latestPaymentDate = useMemo(() => {
        if (!casePayment || casePayment.length === 0) return null;
        const dates = casePayment
            .map(p => p.dateOfPayment)
            .filter(Boolean)
            .sort((a, b) => new Date(b) - new Date(a));
        return dates[0] ? getFormateDMYDate(dates[0]) : null;
    }, [casePayment]);

    const handleSubmit = async (values) => {
        setpaymentModal(prev => ({ ...prev, save: true }));
        try {
            const res = await paymentDetailsApi({ ...values, caseId: id });
            if (res?.data?.success) {
                toast.success(res?.data?.message || "Payment saved successfully.");
                getCaseById && getCaseById();
                setpaymentModal({ show: false, save: false });
            } else {
                toast.error(res?.data?.message || "Failed to save payment.");
                setpaymentModal(prev => ({ ...prev, save: false }));
            }
        } catch (error) {
            console.error("Payment submission error:", error);
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error("Something went wrong");
            }
            setpaymentModal(prev => ({ ...prev, save: false }));
        }
    };

    const paymentFormik = useFormik({
        initialValues: { ...paymentInitialValues, attachments: [] },
        validationSchema: paymentValidationSchema,
        onSubmit: handleSubmit
    });

    const handleUpdatePayment = (ele) => {
        let payload = {
            ...ele,
            attachments: ele?.attachments || []
        };
        paymentFormik.setValues(payload);
        setpaymentModal({ save: false, show: true });
    };

    const handleViewDetails = (item) => {
        setDetailModal({ show: true, details: item });
    };

    // Helper for rendering payment mode badges with distinct icons & pastel styling
    const renderModeBadge = (mode) => {
        switch (mode) {
            case "Cash":
                return (
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold">
                        <FaMoneyBillWave size={12} /> Cash
                    </span>
                );
            case "UPI":
                return (
                    <span className="badge bg-purple-subtle text-purple border border-purple-subtle rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', borderColor: '#e9d5ff' }}>
                        <MdOutlineQrCodeScanner size={14} /> UPI
                    </span>
                );
            case "Cheque":
                return (
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold">
                        <FaFileInvoice size={12} /> Cheque
                    </span>
                );
            case "Net Banking":
                return (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold">
                        <FaUniversity size={12} /> Net Banking
                    </span>
                );
            case "Web":
                return (
                    <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold">
                        <FaGlobe size={12} /> Web
                    </span>
                );
            default:
                return (
                    <span className="badge bg-secondary-subtle text-secondary border rounded-pill px-3 py-1.5 fw-semibold">
                        {mode || "Other"}
                    </span>
                );
        }
    };

    return (
        <div className="my-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                {/* Hero Header Banner */}
                <div
                    className="p-4 p-md-3 text-white position-relative"
                    style={{
                        // background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                    }}
                >
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 position-relative z-2">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="bg-primary text-white rounded-4 p-3 d-flex align-items-center justify-content-center shadow"
                                style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                            >
                                <MdPayments className="fs-2" />
                            </div>
                            <div>
                                <h4 className="mb-0 text-black fw-bold tracking-wide">Payment Details</h4>
                                <p className="text-black mb-0 small">Financial transaction records & verification documents</p>
                            </div>
                        </div>

                        {/* Financial Summary Stat Cards */}
                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-10 rounded-4 px-4 py-2 text-white shadow-sm">
                                <span className="text-black d-block uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>TOTAL PAID</span>
                                <span className="fs-5 fw-bold text-success-light" style={{ color: '#4ade80' }}>
                                    ₹{totalPaidAmount.toLocaleString('en-IN')}
                                </span>
                            </div>


                            {accessPayment && (
                                <button
                                    onClick={() => {
                                        paymentFormik.resetForm();
                                        setpaymentModal({ save: false, show: true });
                                    }}
                                    className="btn btn-primary btn-lg d-flex align-items-center gap-2 rounded-pill px-4 py-2.5 shadow-sm hover-lift border-0"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', fontWeight: 600 }}
                                >
                                    <MdAddCircleOutline className="fs-5" />
                                    <span>Add Payment</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr className="bg-light text-muted uppercase small tracking-wider border-bottom" style={{ fontSize: '0.75rem' }}>
                                    <th scope="col" className="ps-4 py-3 text-center" style={{ width: '50px' }}>#</th>
                                    <th scope="col" className="py-3">Payment Mode</th>
                                    <th scope="col" className="py-3">Amount</th>
                                    <th scope="col" className="py-3">Date of Payment</th>
                                    <th scope="col" className="py-3">Bank Details</th>
                                    <th scope="col" className="py-3">Reference / UTR / Cheque</th>
                                    <th scope="col" className="py-3 text-center">Attachments</th>
                                    <th scope="col" className="pe-4 py-3 text-end" style={{ width: '130px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!casePayment || casePayment.length === 0) ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5">
                                            <div className="py-4">
                                                <div className="bg-light text-secondary rounded-circle d-inline-flex p-4 mb-3 shadow-sm">
                                                    <MdOutlineReceiptLong className="display-4 text-muted" />
                                                </div>
                                                <h6 className="fw-bold text-dark mb-1">No Payment Records Available</h6>
                                                <p className="text-muted small mb-3">No payment details have been recorded for this case yet.</p>
                                                {accessPayment && (
                                                    <button
                                                        onClick={() => {
                                                            paymentFormik.resetForm();
                                                            setpaymentModal({ save: false, show: true });
                                                        }}
                                                        className="btn btn-outline-primary rounded-pill px-4 btn-sm"
                                                    >
                                                        + Add First Payment
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    casePayment.map((item, ind) => {
                                        const attachmentCount = item?.attachments?.length || 0;
                                        return (
                                            <tr key={item._id || ind} className="border-bottom transition-all">
                                                <th scope="row" className="ps-4 text-center text-muted fw-semibold">{ind + 1}</th>

                                                <td>{renderModeBadge(item?.paymentMode)}</td>

                                                <td>
                                                    <span className="fw-bold text-dark fs-6">
                                                        {item?.amount ? `₹${Number(item?.amount).toLocaleString('en-IN')}` : "-"}
                                                    </span>
                                                </td>

                                                <td className="text-nowrap text-secondary font-monospace small">
                                                    {item?.dateOfPayment ? (
                                                        <span className="d-inline-flex align-items-center gap-1.5 text-dark">
                                                            <MdOutlineCalendarToday className="text-primary" />
                                                            {getFormateDMYDate(item?.dateOfPayment)}
                                                        </span>
                                                    ) : "-"}
                                                </td>

                                                <td>
                                                    {item?.bankName ? (
                                                        <span className="d-inline-flex align-items-center gap-1.5 text-dark fw-medium">
                                                            <MdOutlineAccountBalance className="text-secondary" />
                                                            {item?.bankName}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>

                                                <td>
                                                    {item?.utrNumber || item?.chequeNumber ? (
                                                        <div>
                                                            <span className="bg-light border px-2 py-1 rounded font-monospace small fw-semibold text-dark">
                                                                {item?.utrNumber || item?.chequeNumber}
                                                            </span>
                                                            {item?.chequeDate && (
                                                                <span className="d-block text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                                                                    Cheque Date: {getFormateDMYDate(item?.chequeDate)}
                                                                </span>
                                                            )}
                                                            {item?.transactionDate && (
                                                                <span className="d-block text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                                                                    Txn Date: {getFormateDMYDate(item?.transactionDate)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>

                                                <td className="text-center">
                                                    {attachmentCount > 0 ? (
                                                        <button
                                                            onClick={() => handleViewDetails(item)}
                                                            className="btn btn-sm btn-light border text-primary rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1.5 fw-semibold shadow-xs"
                                                            title="Click to view attachments"
                                                        >
                                                            <MdAttachFile className="fs-6" />
                                                            <span>{attachmentCount} file{attachmentCount > 1 ? 's' : ''}</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted small">None</span>
                                                    )}
                                                </td>

                                                <td className="pe-4 text-end">
                                                    <div className="d-flex align-items-center justify-content-end gap-1.5">
                                                        {/* Eye Action Button */}
                                                        <button
                                                            onClick={() => handleViewDetails(item)}
                                                            className="btn btn-sm btn-light text-primary rounded-circle d-flex align-items-center justify-content-center border shadow-xs"
                                                            style={{ width: 36, height: 36, transition: 'all 0.2s' }}
                                                            title="View Payment Details & Attachments"
                                                        >
                                                            <HiMiniEye className="fs-5" />
                                                        </button>

                                                        {/* Edit Action Button */}
                                                        {accessPayment && (
                                                            <button
                                                                onClick={() => handleUpdatePayment(item)}
                                                                className="btn btn-sm btn-light text-dark rounded-circle d-flex align-items-center justify-content-center border shadow-xs"
                                                                style={{ width: 36, height: 36, transition: 'all 0.2s' }}
                                                                title="Edit Payment Record"
                                                            >
                                                                <CiEdit className="fs-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payment Form Modal (Add / Edit) */}
            {paymentModal?.show && (
                <PaymentModal
                    show={paymentModal?.show}
                    saving={paymentModal?.save}
                    formik={paymentFormik}
                    attachementUpload={attachementUpload}
                    close={() => setpaymentModal({ save: false, show: false })}
                />
            )}

            {/* View Payment Details & Attachments Modal */}
            {detailModal?.show && (
                <PaymentDetailModal
                    show={detailModal?.show}
                    details={detailModal?.details}
                    close={() => setDetailModal({ show: false, details: null })}
                />
            )}
        </div>
    );
}
