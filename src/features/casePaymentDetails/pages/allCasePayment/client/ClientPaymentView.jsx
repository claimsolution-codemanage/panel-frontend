// ClientPaymentView.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { FaRegClock, FaCheckCircle, FaHourglassHalf, FaCalendarAlt, FaMobileAlt, FaEnvelope, FaShieldAlt, FaFileInvoiceDollar, FaCreditCard, FaRupeeSign, FaChartLine, FaGavel, FaUser, FaFileAlt, FaBuilding, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import '../../../../../styles/casePaymentDetails/ClientPaymentView.css';
import { clientCasePaymentDetailApi } from '../../../../../apis/casePayment/clientCasePaymentApi';
import { FaClockRotateLeft } from 'react-icons/fa6';

// Helper Functions
const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹ 0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'dd MMM yyyy');
    } catch {
        return dateString;
    }
};

const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':
        case 'completed':
            return 'status-paid';
        case 'partial paid':
            return 'status-partial';
        case 'pending':
            return 'status-pending';
        case 'upcoming':
            return 'status-upcoming';
        default:
            return 'status-pending';
    }
};

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':
        case 'completed':
            return <FaCheckCircle />;
        case 'partial paid':
            return <FaHourglassHalf />;
        case 'pending':
        case 'upcoming':
            return <FaRegClock />;
        default:
            return <FaRegClock />;
    }
};


const ClientPaymentView = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);
    const upcomingPayment = paymentData?.paymentScheduleList?.filter((item) => item?.status !== 'Paid')?.
        sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))?.[0];

    useEffect(() => {
        loadPaymentDetails();
    }, [_id]);

    const loadPaymentDetails = async () => {
        setLoading(true);
        try {
            const response = await clientCasePaymentDetailApi(_id);
            if (response?.data?.success && response?.data?.data) {
                setPaymentData(response?.data?.data);
            } else {
                toast.error('Failed to load payment details');
            }
        } catch (error) {
            console.error('Error loading payment details:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="client-view-loader">
                <div className="spinner"></div>
                <p>Loading payment details...</p>
            </div>
        );
    }

    if (!paymentData) {
        return (
            <div className="client-view-error">
                <div className="error-container">
                    <h3>Payment Details Not Found</h3>
                    <p>The requested payment information could not be found.</p>
                    <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        );
    }

    // Calculate stats
    const totalPaid = (paymentData.paymentScheduleList
        ?.filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0) + paymentData?.advancePaid;


    return (
        <div>
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    <IoArrowBackCircleOutline className="fs-3" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                    <div className="d-flex flex align-items-center gap-1">
                        <span>Case Payment Details</span>
                    </div>
                </div>
            </div>

            <div className="client-view-container">

                {/* Client Information Section */}
                <div className="info-section">
                    <div className="section-header">
                        <FaUser className="section-icon" />
                        <h2>Client Information</h2>
                    </div>
                    <div className="info-grid">
                        <div className="info-card">
                            <div className="info-content">
                                <label>Client Name</label>
                                <p className='p-0 m-0'>{paymentData.clientName || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-content">
                                <label>File Number</label>
                                <p>{paymentData.fileNo || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-content">
                                <label>Mobile Number</label>
                                <p>{paymentData.mobile || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-content">
                                <label>Email ID</label>
                                <p>{paymentData.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    {/* Claim Information Section */}
                    <div className="section-header mt-4">
                        <FaShieldAlt className="section-icon" />
                        <h2>Claim Information</h2>
                    </div>
                    <div className="info-grid">
                        <div className="info-card">
                            <div className="info-content">
                                <label>Insurance Company</label>
                                <p>{paymentData.insuranceCompany || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-content">
                                <label>Policy Number</label>
                                <p>{paymentData.policyNumber || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-content">
                                <label>Total Claim Amount</label>
                                <p>{formatCurrency(paymentData.totalClaimAmount)}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-content">
                                <label>Case Stage</label>
                                <p>{paymentData.caseStage || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Fee Details Section */}
                    <div className="mt-4">
                        <div className="section-header">
                            <FaMoneyBillWave className="section-icon" />
                            <h2>File Processing Fee Details</h2>
                        </div>
                        <div className="fee-grid">
                            <div className="fee-card">
                                <label>Processing Fee</label>
                                <p>{formatCurrency(paymentData.totalProcessingFee)}</p>
                                {paymentData.gstOption && (
                                    <small>+ {paymentData.gstPercent}% GST</small>
                                )}
                            </div>
                            {paymentData.gstOption && <div className="fee-card">
                                <label>Total Payable</label>
                                <p className="highlight">{formatCurrency(paymentData.totalAmountWithGst)}</p>
                            </div>}
                            <div className="fee-card">
                                <label>Advanced Paid</label>
                                <p>{formatCurrency(paymentData.advancePaid)}</p>
                            </div>
                            <div className="fee-card">
                                <label>Total Paid</label>
                                <p className="success">{formatCurrency(totalPaid)}</p>
                            </div>
                            <div className="fee-card warning">
                                <label>Balance Pending</label>
                                <p>{formatCurrency(paymentData.balanceAmount)}</p>
                            </div>
                            <div className="fee-card">
                                <label>EMI Amount</label>
                                <p>{formatCurrency(paymentData.emiAmount)}</p>
                                {paymentData.totalEmi && <small>{paymentData.totalEmi} installments</small>}
                            </div>
                            {upcomingPayment?.dueDate &&
                                <div className="fee-card">
                                    <label>Next Due Date</label>
                                    <p>{formatDate(upcomingPayment.dueDate)}</p>
                                </div>}
                        </div>
                    </div>

                    {/* Payment Schedule / History Section */}
                    <div className="mt-4">
                        <div className="section-header">
                            <FaClockRotateLeft className="section-icon" />
                            <h2>Payment History</h2>
                        </div>
                        <div className="table-wrapper">
                            <table className="payment-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Payment Mode</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentData.paymentScheduleList?.map((payment, index) => (
                                        <tr key={payment._id || index}>
                                            <td>{index + 1}</td>
                                            <td>{formatDate(payment?.dueDate)}</td>
                                            <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                                            <td>{payment.paymentMode || '-'}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusBadgeClass(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    {payment?.status !== 'Paid' ? (payment?._id === upcomingPayment?._id ? (new Date(payment?.dueDate) < new Date() ? 'Overdue' : 'Upcoming') : (payment?.status || 'Pending')) : 'Paid'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientPaymentView;