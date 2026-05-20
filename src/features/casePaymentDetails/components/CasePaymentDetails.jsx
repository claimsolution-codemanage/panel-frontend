
import React, { useState, useEffect, useCallback } from 'react';
import "../../../styles/casePaymentDetails/casePaymentDetail.css"
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import Loader from '../../../components/Common/loader';
import { Edit, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function CasePaymentDetails({ fileDetailApi, addPaymentApi, getDetailApi, updatePaymentScheduleApi, updatePaymentDetailApi, addSchedulePaymentApi, viewUrl }) {
    const { _id } = useParams()
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
    const [savingPayment, setSavingPayment] = useState(false);
    const [updatePaymentData, setUpdatePaymentData] = useState({ paymentMode: "" });
    // ==================== UNIFIED STATE MANAGEMENT ====================
    const [formData, setFormData] = useState({
        // File & Search
        fileNumber: '',
        searchFileNo: '',

        // Client Information
        clientName: '',
        mobile: '',
        email: '',

        // Claim Information
        insuranceCompany: '',
        policyNumber: '',
        totalClaimAmount: '',
        caseStage: '',

        // Payment Information
        totalProcessingFee: '',
        gstOption: true,
        gstPercent: 18,
        totalAmountWithGst: 0,
        totalEmi: 0,
        emiAmount: 0,
        advancePaid: '',
        balanceAmount: 0,
        nextDueDate: '',
        paymentMode: 'UPI',
        reminderType: 'Email',
        paymentStatus: 'Pending',

        // Payment Based on Date Toggle
        paymentBasedOnDate: false,

        // EMI/Payment List
        paymentScheduleList: [],

        // Advocate Mode
        advocateMode: false
    });
    const [disableEditMode, setDisableEditMode] = useState(false)

    // Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newPayment, setNewPayment] = useState({ date: '', amount: '' });
    // const disableEditMode = Boolean(_id) && formData?.paymentStatus == 'Completed'


    const getCasePaymentById = async () => {
        try {
            setLoading(true)
            const res = await getDetailApi(_id)
            if (res?.data?.data) {
                setFormData({
                    ...res?.data?.data,
                    paymentScheduleList: (res?.data?.data?.paymentScheduleList || [])?.map((item) => {
                        return {
                            ...item,
                            dueDate: item?.dueDate?.split("T")[0],
                        }
                    }),
                });
                setDisableEditMode(res?.data?.data?.paymentStatus == 'Completed')
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message ?? "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (_id) {
            getCasePaymentById()
        }
    }, [_id])
    // Handle Search
    const handleSearch = async () => {
        try {
            if (formData.searchFileNo?.trim()) {
                setSearching(true)
                const res = await fileDetailApi(formData.searchFileNo)
                const fileData = res?.data?.data?.[0]
                if (fileData) {
                    const { claimAmount, _id, clientObjId, clientDetails, currentStatus: caseStage, insuranceCompanyName, policyNo } = fileData
                    if (!clientObjId || !_id) {
                        toast.error(!clientObjId ? "Client Not Found!" : "Case Not Found");
                        return;
                    }
                    setFormData(prev => ({
                        ...prev,
                        clientName: clientDetails?.fullName,
                        clientObjId,
                        caseId: _id,
                        mobile: clientDetails?.mobileNo,
                        email: clientDetails?.email,
                        clientDisabled: true,
                        insuranceCompany: insuranceCompanyName,
                        policyNumber: policyNo,
                        totalClaimAmount: claimAmount,
                        caseStage: caseStage,
                    }));

                } else {
                    toast.error("File Number not found!");
                }
            } else {
                toast.error("Please enter File Number!");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message ?? "Something went wrong")
        } finally {
            setSearching(false)
        }
    };

    const handleSaving = async () => {
        setSaving(true)
        try {
            if (_id) {
                const payload = {
                    nextDueDate: formData?.nextDueDate || "",
                    paymentMode: formData?.paymentMode || "",
                    reminderType: formData?.reminderType || "",
                    paymentStatus: formData?.paymentStatus || "",
                    paymentBasedOnDate: formData?.paymentBasedOnDate || false,
                    advocateMode: formData?.advocateMode || false,
                    remarks: formData?.remarks || "",
                }
                const result = await updatePaymentDetailApi(_id, payload)
                toast.success(result?.data?.message || "Details updated successfully")
                getCasePaymentById()

            } else {
                if (!formData?.clientObjId || !formData?.caseId) {
                    toast.error("Please search file no!")
                    return
                }
                if (formData?.totalEmi && !formData?.nextDueDate) {
                    toast.error("Please select Next Due Date!");
                    return;
                }
                if (!formData?.totalProcessingFee || !formData?.paymentMode || !formData?.paymentStatus) {
                    toast.error("Please fill all required fields!");
                    return;
                }

                if (!formData?.paymentBasedOnDate && formData?.balanceAmount > 0 && formData?.paymentScheduleList?.length === 0) {
                    toast.error("Please select total emi");
                    return;
                }
                const result = await addPaymentApi(formData)
                toast.success(result?.data?.message ?? "Payment added successfully")
                if (result?.data?.data?._id && viewUrl) {
                    navigate(`${viewUrl}${result?.data?.data?._id}`)
                } else {
                    navigate(-1)
                }

            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message ?? "Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    // Update form field
    const updateFormField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Auto-calculate GST and Totals
    useEffect(() => {
        const processingFee = parseFloat(formData.totalProcessingFee) || 0;
        let gstAmount = 0;
        let totalWithGst = 0;

        if (formData.gstOption) {
            gstAmount = (processingFee * (formData.gstPercent || 0)) / 100;
            totalWithGst = processingFee + gstAmount;
        } else {
            gstAmount = 0;
            totalWithGst = processingFee;
        }

        const paid = parseFloat(formData.advancePaid) || 0;
        const balance = totalWithGst - paid;

        setFormData(prev => ({
            ...prev,
            totalAmountWithGst: totalWithGst,
            balanceAmount: balance > 0 ? balance : 0
        }));
    }, [formData.totalProcessingFee, formData.gstPercent, formData.gstOption, formData.advancePaid]);

    // Generate EMI Schedule based on Total EMI and Payment Based on Date toggle
    useEffect(() => {
        if (!formData.advocateMode && !_id) {
            generatePaymentSchedule();
        }
    }, [formData.totalEmi, formData.totalAmountWithGst, formData.advancePaid, formData.nextDueDate, formData.paymentBasedOnDate, formData.advocateMode]);

    const generatePaymentSchedule = () => {
        const emiCount = parseInt(formData.totalEmi) || 0;
        const totalAmount = formData.totalAmountWithGst;
        const advancePaid = parseFloat(formData.advancePaid) || 0;
        const remainingAmount = totalAmount - advancePaid;

        if (emiCount > 0 && remainingAmount > 0 && !formData.paymentBasedOnDate) {
            const emiAmountValue = remainingAmount / emiCount;
            setFormData(prev => ({ ...prev, emiAmount: emiAmountValue }));

            // Generate future payment dates
            const schedule = [];
            let startDate = formData.nextDueDate ? new Date(formData.nextDueDate) : new Date();

            for (let i = 0; i < emiCount; i++) {
                const dueDate = new Date(startDate);
                dueDate.setMonth(startDate.getMonth() + i);
                schedule.push({
                    id: Date.now() + i,
                    type: 'emi',
                    installmentNo: i + 1,
                    amount: emiAmountValue,
                    dueDate: dueDate.toISOString().split('T')[0],
                    status: 'Pending',
                    paid: false
                });
            }
            setFormData(prev => ({ ...prev, paymentScheduleList: schedule }));
        } else if (emiCount === 0 || remainingAmount <= 0) {
            setFormData(prev => ({ ...prev, emiAmount: 0, paymentScheduleList: [] }));
        } else if (formData.paymentBasedOnDate) {
            // Keep existing payment list when based on date mode is on
            setFormData(prev => ({ ...prev, emiAmount: 0 }));
        }
    };

    // Add Payment (for Payment Based on Date mode)
    const addPayment = async () => {
        try {
            if (newPayment.date && newPayment.amount && parseFloat(newPayment.amount) > 0) {
                // const remainingAmount = formData.totalAmountWithGst - getTotalPaid();
                // if (parseFloat(newPayment.amount) > remainingAmount) {
                //     alert(`Payment amount cannot exceed remaining balance of ${formatCurrency(remainingAmount)}`);
                //     return;
                // }

                if (_id) {
                    const result = await addSchedulePaymentApi(_id, { ...newPayment, dueDate: newPayment.date })
                    toast.success(result?.data?.message ?? "Payment added successfully")
                    getCasePaymentById()
                    setNewPayment({ date: '', amount: '' });
                    setShowPaymentModal(false);
                    return
                }

                setFormData(prev => ({
                    ...prev,
                    paymentScheduleList: [
                        ...prev.paymentScheduleList,
                        {
                            id: Date.now(),
                            type: 'custom',
                            date: newPayment.date,
                            dueDate: newPayment.date,
                            amount: parseFloat(newPayment.amount),
                            paymentMode: '',
                            status: 'Pending',
                            paid: false
                        }
                    ]
                }));
                setNewPayment({ date: '', amount: '' });
                setShowPaymentModal(false);
            } else {
                alert('Please enter both date and amount');
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message ?? "Something went wrong")
        }
    };

    // Delete Payment (only if not paid)
    const deletePayment = (idx) => {
        setFormData(prev => ({
            ...prev,
            paymentScheduleList: prev.paymentScheduleList.filter((payment, index) => index !== idx)
        }));
    };

    // Calculate Total Paid
    const getTotalPaid = () => {
        let total = parseFloat(formData.advancePaid) || 0;
        total += formData.paymentScheduleList.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
        return total;
    };

    const totalPaid = getTotalPaid();
    const totalPayable = formData.totalAmountWithGst;
    const balancePending = totalPayable - totalPaid;

    // Update Payment Status based on payments
    useEffect(() => {
        if (totalPaid >= totalPayable && totalPayable > 0) {
            setFormData(prev => ({ ...prev, paymentStatus: 'Completed' }));
        } else if (totalPaid > 0 && totalPaid < totalPayable) {
            setFormData(prev => ({ ...prev, paymentStatus: 'Partial Paid' }));
        } else {
            setFormData(prev => ({ ...prev, paymentStatus: 'Pending' }));
        }
    }, [totalPaid, totalPayable]);

    // Format Currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount || 0);
    };

    const handlePaymentUpdate = async () => {
        setSavingPayment(true)
        try {
            const payload = {
                casePaymentDetailId: _id,
                scheduleId: updatePaymentData._id,
                paymentDate: updatePaymentData.date,
                paymentMode: updatePaymentData.paymentMode,
                remarks: updatePaymentData.remark
            }
            console.log("payload", payload, updatePaymentData)
            const res = await updatePaymentScheduleApi(payload)
            if (res.status == 200) {
                toast.success(res?.data?.message || "Updated")
                setShowUpdatePaymentModal(false)
                getCasePaymentById()
            } else {
                toast.error(res?.data?.message || "Something went wrong")
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong")
        } finally {
            setSavingPayment(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(parseISO(dateString), 'dd MMM yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <>
            {loading ? <Loader /> :
                <div>
                    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                        <div className="d-flex flex align-items-center gap-3">
                            <IoArrowBackCircleOutline className="fs-3" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                            <div className="d-flex flex align-items-center gap-1">
                                <span>Case Payment Details</span>
                            </div>
                        </div>
                    </div>
                    <div className="crm-container">
                        <div className="crm-wrapper">
                            {/* Main Form Card */}
                            <div className="crm-card">

                                <div className="crm-card-body">
                                    {/* File Number Search */}
                                    {!formData?._id && <div className="search-section">
                                        <div className="search-wrapper">
                                            <div className="search-input-group">
                                                <input
                                                    type="text"
                                                    className="crm-input search-input"
                                                    placeholder="Enter File Number (e.g., CSI-2026-001)"
                                                    value={formData.searchFileNo}
                                                    onChange={(e) => updateFormField('searchFileNo', e.target.value)}
                                                />
                                                <button disabled={searching} className="crm-btn crm-btn-primary" onClick={handleSearch}>
                                                    {searching ? <span className="spinner"></span> : "Search"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>}

                                    {/* Client & Claim Information Grid */}
                                    <div className="">
                                        <h5 className="my-3">Client Information</h5>
                                        <div className="row row-cols-1 row-cols-md-4 g-3">
                                            <div className="form-group">
                                                <label className="form-label">Client Name</label>
                                                <input type="text" className="crm-input" value={formData.clientName} disabled={true} placeholder="Enter client name" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Mobile Number</label>
                                                <input type="tel" className="crm-input" value={formData.mobile} disabled={true} placeholder="+91 XXXXX XXXXX" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Email ID</label>
                                                <input type="email" className="crm-input" value={formData.email} disabled={true} placeholder="client@example.com" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="">
                                        <h5 className="my-3">Claim Information</h5>
                                        <div className="row row-cols-1 row-cols-md-4 g-3">
                                            <div className="form-group">
                                                <label className="form-label">Insurance Company</label>
                                                <input type="text" className="crm-input" value={formData.insuranceCompany} disabled={true} placeholder="Insurance company name" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Policy Number</label>
                                                <input type="text" className="crm-input" value={formData.policyNumber} disabled={true} placeholder="Policy number" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Total Claim Amount (₹)</label>
                                                <input type="number" className="crm-input" value={formData.totalClaimAmount} disabled={true} placeholder="0" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Case Stage</label>
                                                <input type="text" className="crm-input" value={formData.caseStage} disabled={true} placeholder="Policy number" />

                                            </div>
                                        </div>
                                    </div>

                                    {/* Fee Details Section */}
                                    <div className="section-divider">
                                        <div className="section-title">
                                            <span className="section-icon">💰</span>
                                            <h3>Fee Details</h3>
                                        </div>
                                    </div>

                                    <div className="form-grid">
                                        <div className="grid-3">
                                            <div className="form-group">
                                                <label className="form-label">Processing Fee* (₹)</label>
                                                <input type="number" className="crm-input" disabled={Boolean(_id)} placeholder="Enter processing fee" value={formData.totalProcessingFee} onChange={(e) => updateFormField('totalProcessingFee', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">GST</label>
                                                <div className="toggle-switch">
                                                    <label className="toggle-label">
                                                        <input type="checkbox" disabled={Boolean(_id)} checked={formData.gstOption} onChange={(e) => updateFormField('gstOption', e.target.checked)} />
                                                        <span className="toggle-slider"></span>
                                                        <span className="toggle-text">{formData.gstOption ? 'Including GST' : 'Excluding GST'}</span>
                                                    </label>
                                                </div>
                                            </div>
                                            {formData.gstOption && (
                                                <div className="form-group">
                                                    <label className="form-label">GST Rate* (%)</label>
                                                    <select className="crm-select" disabled={Boolean(_id)} value={formData.gstPercent} onChange={(e) => updateFormField('gstPercent', parseInt(e.target.value))}>
                                                        <option value={0}>0%</option>
                                                        <option value={5}>5%</option>
                                                        <option value={12}>12%</option>
                                                        <option value={18}>18%</option>
                                                        <option value={28}>28%</option>
                                                    </select>
                                                </div>
                                            )}
                                            <div className="form-group">
                                                <label className="form-label">Total Amount (₹)</label>
                                                <input type="text" disabled={Boolean(_id)} className="crm-input crm-input-readonly" value={formatCurrency(formData.totalAmountWithGst)} readOnly />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Configuration */}
                                    <div className="section-divider">
                                        <div className="section-title">
                                            <span className="section-icon">💳</span>
                                            <h3>Payment Configuration</h3>
                                        </div>
                                    </div>

                                    <div className="form-grid">
                                        <div className="grid-3">
                                            <div className="form-group">
                                                <label className="form-label">Total EMI*</label>
                                                <select className="crm-select" disabled={Boolean(_id) || formData?.paymentBasedOnDate} value={formData.totalEmi} onChange={(e) => updateFormField('totalEmi', e.target.value)}>
                                                    <option value={0}>0 EMI (One-Time)</option>
                                                    <option value={1}>1 EMI</option>
                                                    <option value={2}>2 EMI</option>
                                                    <option value={3}>3 EMI</option>
                                                    <option value={4}>4 EMI</option>
                                                    <option value={6}>6 EMI</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">EMI Amount (₹)</label>
                                                <input type="text" disabled={Boolean(_id)} className="crm-input crm-input-readonly" value={formatCurrency(formData.emiAmount)} readOnly />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Advance Paid (₹)*</label>
                                                <input type="number" disabled={Boolean(_id)} className="crm-input" placeholder="0" value={formData.advancePaid} onChange={(e) => updateFormField('advancePaid', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Balance Amount (₹)</label>
                                                <input type="text" disabled={Boolean(_id)} className="crm-input crm-input-readonly" value={formatCurrency(formData.balanceAmount)} readOnly />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Next Due Date</label>
                                                <input type="date" disabled={disableEditMode} className="crm-input" value={formData?.nextDueDate?.split('T')?.[0]} onChange={(e) => updateFormField('nextDueDate', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Payment Mode*</label>
                                                <select className="crm-select" disabled={disableEditMode} value={formData.paymentMode} onChange={(e) => updateFormField('paymentMode', e.target.value)}>
                                                    <option>UPI</option>
                                                    <option>Cash</option>
                                                    <option>Bank Transfer</option>
                                                    <option>Cheque</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Reminder Type*</label>
                                                <select className="crm-select" disabled={disableEditMode} value={formData.reminderType} onChange={(e) => updateFormField('reminderType', e.target.value)}>
                                                    <option value={""}>Select Reminder</option>
                                                    <option>WhatsApp</option>
                                                    <option>Email</option>
                                                    <option>Phone Call</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Payment Status*</label>
                                                <select className="crm-select" disabled={disableEditMode} value={formData.paymentStatus} onChange={(e) => updateFormField('paymentStatus', e.target.value)}>
                                                    <option value={""}>Select Status</option>
                                                    <option>Pending</option>
                                                    <option>Partial Paid</option>
                                                    <option>Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Based on Date Toggle */}
                                    <div className="toggle-card">
                                        <div className="toggle-card-content">
                                            <div className="toggle-info">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                <div>
                                                    <span className="toggle-title">Payment Based on Date</span>
                                                    <span className="toggle-subtitle">Enable to create custom payments with specific dates</span>
                                                </div>
                                            </div>
                                            <label className="toggle-switch-lg">
                                                <input type="checkbox" disabled={disableEditMode} checked={formData.paymentBasedOnDate} onChange={(e) => {
                                                    updateFormField('paymentBasedOnDate', e.target.checked);
                                                    if (!e.target.checked) {
                                                        !_id && updateFormField('paymentScheduleList', []);
                                                    } else {
                                                        updateFormField('totalEmi', 0);
                                                    }
                                                }} />
                                                <span className="toggle-slider-lg"></span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Payment List Section */}
                                    {(formData.paymentScheduleList.length > 0 || formData.paymentBasedOnDate) && (
                                        <div className="payment-list-section">
                                            <div className="payment-list-header">
                                                <div className="section-title">
                                                    <span className="section-icon">📋</span>
                                                    <h3>Payment Schedule</h3>
                                                </div>
                                                {formData.paymentBasedOnDate && !disableEditMode && (
                                                    <button className="crm-btn crm-btn-success" onClick={() => setShowPaymentModal(true)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                        Add Payment
                                                    </button>
                                                )}
                                            </div>
                                            <div className="payment-table-wrapper">
                                                <table className="payment-table">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Due Date</th>
                                                            <th>Payment Date</th>
                                                            <th>Amount (₹)</th>
                                                            <th>Payment Mode</th>
                                                            <th>Remarks</th>
                                                            <th>Status</th>
                                                            {(formData.paymentBasedOnDate || _id) && <th>Action</th>}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.paymentScheduleList.map((payment, idx) => (
                                                            <tr key={payment._id}>
                                                                <td>{idx + 1}</td>
                                                                <td>{formatDate(payment?.dueDate || payment.date)}</td>
                                                                <td>{formatDate(payment?.paidDate)}</td>
                                                                <td className="amount-cell">{formatCurrency(payment?.amount)}</td>
                                                                <td>{payment?.paymentMode ? payment?.paymentMode : '----'}</td>
                                                                <td title={payment?.remarks || '----'}>{(payment?.remarks || '----').slice(0, 10)}</td>
                                                                <td>{payment?.status ? payment?.status : '----'}</td>

                                                                {(formData?.paymentBasedOnDate || _id) && <td>
                                                                    {formData.paymentBasedOnDate && !_id && payment.status !== 'Paid' && (
                                                                        <button className="action-btn delete-btn" onClick={() => deletePayment(idx)}>
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                                        </button>
                                                                    )}
                                                                    {_id && payment.status !== 'Paid' && (
                                                                        <button className="action-btn edit-btn" onClick={() => {
                                                                            if (payment?._id) {
                                                                                setUpdatePaymentData({ ...payment })
                                                                                setShowUpdatePaymentModal(true)
                                                                            }
                                                                        }}>
                                                                            <Edit2 />
                                                                        </button>
                                                                    )}
                                                                </td>}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Advocate Mode Toggle */}
                                    <div className="toggle-card advocate-card">
                                        <div className="toggle-card-content">
                                            <div className="toggle-info">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" /><path d="M12 6v4" /><path d="M12 16h.01" /></svg>
                                                <div>
                                                    <span className="toggle-title">Advocate Account Payment Mode</span>
                                                    <span className="toggle-subtitle">Enable for advocate payment tracking only (no invoice data)</span>
                                                </div>
                                            </div>
                                            <label className="toggle-switch-lg">
                                                <input type="checkbox" disabled={disableEditMode} checked={formData.advocateMode} onChange={(e) => updateFormField('advocateMode', e.target.checked)} />
                                                <span className="toggle-slider-lg"></span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Payment Summary Cards */}
                                    <div className="summary-cards">
                                        <div className="summary-card summary-total">
                                            <div className="summary-icon">📊</div>
                                            <div className="summary-info">
                                                <span className="summary-label">Total Payable</span>
                                                <span className="summary-value">{formatCurrency(totalPayable)}</span>
                                            </div>
                                        </div>
                                        <div className="summary-card summary-paid">
                                            <div className="summary-icon">✅</div>
                                            <div className="summary-info">
                                                <span className="summary-label">Total Paid</span>
                                                <span className="summary-value">{formatCurrency(totalPaid)}</span>
                                            </div>
                                        </div>
                                        <div className="summary-card summary-balance">
                                            <div className="summary-icon">⚖️</div>
                                            <div className="summary-info">
                                                <span className="summary-label">Balance Pending</span>
                                                <span className="summary-value">{formatCurrency(balancePending)}</span>
                                            </div>
                                        </div>
                                        <div className={`summary-card summary-status status-${formData.paymentStatus?.toLowerCase().replace(' ', '-')}`}>
                                            <div className="summary-icon">🏷️</div>
                                            <div className="summary-info">
                                                <span className="summary-label">Payment Status</span>
                                                <span className="summary-value">{formData.paymentStatus}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remarks Section */}
                                    <div className="form-group">
                                        <label className="form-label">Internal Remarks</label>
                                        <textarea disabled={disableEditMode} value={formData?.remarks || ""} onChange={(e) => updateFormField("remarks", e.target.value)} className="crm-textarea" rows="3" placeholder="Enter internal notes, client communication details, payment remarks, follow-up status etc."></textarea>
                                    </div>

                                    {/* Action Buttons */}
                                    {!disableEditMode && <div className="action-buttons">
                                        <button disabled={saving} onClick={handleSaving} className="crm-btn crm-btn-primary crm-btn-lg">
                                            {saving ? <span className="spinner"></span> : "Save"}
                                        </button>
                                    </div>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Modal */}
                        {showPaymentModal && (
                            <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h3>Add Payment</h3>
                                        <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="form-label">Payment Date</label>
                                            <input type="date" className="crm-input" value={newPayment.date} onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Amount (₹)</label>
                                            <input type="number" className="crm-input" placeholder="Enter amount" value={newPayment.amount} onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="crm-btn crm-btn-outline" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                                        <button className="crm-btn crm-btn-primary" onClick={addPayment}>Add Payment</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* update payment modal */}
                        {showUpdatePaymentModal && (
                            <div className="modal-overlay" onClick={() => setShowUpdatePaymentModal(false)}>
                                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h3>Update Payment</h3>
                                        <button className="modal-close" onClick={() => setShowUpdatePaymentModal(false)}>×</button>
                                    </div>
                                    <div className="modal-body">
                                        <div>
                                            <p><strong>Payment Amount : </strong> {formatCurrency(updatePaymentData?.amount || 0)}</p>
                                            <p><strong>Payment Date : </strong> {new Date(updatePaymentData?.dueDate).toLocaleDateString()}</p>

                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Payment Mode</label>
                                            <select className="crm-select" value={updatePaymentData.paymentMode} onChange={(e) => setUpdatePaymentData(prev => ({ ...prev, paymentMode: e.target.value }))}>
                                                <option value="">Select Payment Mode</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                                <option value="UPI">UPI</option>
                                            </select>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label className="form-label mb-0">Date</label>
                                            <input type="date" className="crm-input" placeholder="Enter date" value={updatePaymentData?.date} onChange={(e) => setUpdatePaymentData(prev => ({ ...prev, date: e.target.value }))} />
                                        </div>
                                        <div className="form-group mt-2">
                                            <label className="form-label mb-0">Remark</label>
                                            <textarea className="crm-input" placeholder="Enter remark" value={updatePaymentData?.remark} onChange={(e) => setUpdatePaymentData(prev => ({ ...prev, remark: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="crm-btn crm-btn-outline" onClick={() => setShowUpdatePaymentModal(false)}>Cancel</button>
                                        <button className="crm-btn crm-btn-primary" onClick={handlePaymentUpdate} disabled={savingPayment}>
                                            {savingPayment ? <span className="spinner"></span> : "Update Payment"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>}
        </>
    );
};

