import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import {
    BsPlusCircle,
    BsArrowLeft,
    BsTelephone,
    BsWhatsapp,
    BsEnvelope,
    BsCalendar2,
    BsPencil,
    BsTrash,
    BsThreeDots,
    BsClock
} from 'react-icons/bs';
import { getFormateDMYDate } from '../../../../utils/helperFunction';
import { formatLocalDateTime, getCurrentLocalDateTime, localToUTC, utcToLocalDateTime } from '../../../../utils/dateUtils';

const LeadFollowUpModal = ({ show, onHide, lead, onFollowUpAdded, addOrUpdateLeadFollowUpApi, getLeadFollowUpsApi, columns }) => {
    const [view, setView] = useState('history'); // 'history' or 'form'
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [editingFollowUp, setEditingFollowUp] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        dateTime: getCurrentLocalDateTime(),
        mode: 'Call',
        summary: '',
        nextFollowUpDate: ''
    });

    useEffect(() => {
        if (show && lead) {
            fetchFollowUps();
        }
        setView("history")
        setFollowUps([])
    }, [show, lead]);

    const fetchFollowUps = async () => {
        if (!lead._id) {
            setFollowUps([])
            return
        };
        setLoading(true);
        setError(null);
        try {
            const response = await getLeadFollowUpsApi({ leadId: lead._id });
            setFollowUps(response?.data?.data);
        } catch (err) {
            setError('Failed to load follow-ups');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            dateTime: getCurrentLocalDateTime(),
            mode: 'Call',
            summary: '',
            nextFollowUpDate: ''
        });
        setEditingFollowUp(null);
    };

    const handleAddNew = () => {
        resetForm();
        setView('form');
    };

    const handleEdit = (followUp) => {
        setEditingFollowUp(followUp);
        setFormData({
            dateTime: utcToLocalDateTime(followUp.dateTime),
            mode: followUp.mode,
            summary: followUp.summary,
            nextFollowUpDate: followUp.nextFollowUpDate
        });
        setView('form');
    };

    const handleBackToHistory = () => {
        setView('history');
        resetForm();
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.nextFollowUpDate) {
            setError('Next Follow-up Date is required');
            return false;
        }
        if (!formData.summary.trim()) {
            setError('Summary is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSaving(true);
        setError(null);

        try {
            const payload = {
                lead: { data: {}, ...(lead?._id ? { _id: lead._id } : {}) },
                followup: {
                    ...formData,
                    dateTime: localToUTC(formData.dateTime),
                    nextFollowUpDate: formData.nextFollowUpDate,
                    ...(editingFollowUp?._id ? { _id: editingFollowUp._id } : {}),
                }
            };

            columns.forEach((col) => {
                if (col.key === "assignedTo") {
                    payload.lead[col.key] = lead[col.key]?.value || null;
                } else if (col.key === "followUpDate") {
                    payload.lead[col.key] = lead[col.key] || null;
                } else {
                    payload.lead.data[col.key] = lead[col.key] || "";
                }
            });

            const res = await addOrUpdateLeadFollowUpApi(payload)

            // Refresh the list
            await fetchFollowUps();
            onFollowUpAdded?.(res?.data?.data?.lead, lead?.rowIndex);
            setFollowUps(prev => {
                if (editingFollowUp?._id) {
                    return prev.map(f => f._id === editingFollowUp._id ? res?.data?.data?.followup : f);
                } else {
                    return [...prev, res?.data?.data?.followUp];
                }
            })
            handleBackToHistory();
        } catch (err) {
            setError('Failed to save follow-up');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const getModeIcon = (mode) => {
        switch (mode.toLowerCase()) {
            case 'call': return <BsTelephone size={16} />;
            case 'whatsapp': return <BsWhatsapp size={16} />;
            case 'email': return <BsEnvelope size={16} />;
            default: return <BsThreeDots size={16} />;
        }
    };

    const getModeBadgeVariant = (mode) => {
        switch (mode.toLowerCase()) {
            case 'call': return 'primary';
            case 'whatsapp': return 'success';
            case 'email': return 'info';
            default: return 'secondary';
        }
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return 'N/A';
        const date = new Date(dateTimeStr);
        return date.toLocaleString();
    };

    const isNextFollowUpOverdue = (dateStr) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {view === 'history' ? (
                        <>Follow-ups for: {lead?.name || lead?.company || 'Lead'}</>
                    ) : (
                        <>
                            <Button
                                variant="link"
                                onClick={handleBackToHistory}
                                className="p-0 me-2"
                                style={{ textDecoration: 'none' }}
                            >
                                <BsArrowLeft size={20} />
                            </Button>
                            {editingFollowUp ? 'Edit Follow-up' : 'Add New Follow-up'}
                        </>
                    )}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                {view === 'history' ? (
                    // History View
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted mb-0">
                                Total: {followUps.length} follow-up(s)
                            </h6>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleAddNew}
                            >
                                <BsPlusCircle className="me-1" /> New Follow-up
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Loading history...</p>
                            </div>
                        ) : followUps.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">No follow-ups yet</p>
                                <Button variant="outline-primary" onClick={handleAddNew}>
                                    Add your first follow-up
                                </Button>
                            </div>
                        ) : (
                            <div className="followup-list">
                                {followUps.map((followUp, index) => (
                                    <div
                                        key={followUp.id || index}
                                        className="card mb-3"
                                        style={{
                                            borderLeft: `4px solid ${getModeBadgeVariant(followUp.mode) === 'primary' ? '#0d6efd' :
                                                getModeBadgeVariant(followUp.mode) === 'success' ? '#198754' :
                                                    getModeBadgeVariant(followUp.mode) === 'info' ? '#0dcaf0' : '#6c757d'}`
                                        }}
                                    >
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <Badge bg={getModeBadgeVariant(followUp.mode)} className="me-2">
                                                        {getModeIcon(followUp.mode)} {followUp.mode}
                                                    </Badge>
                                                    <small className="text-muted">
                                                        <BsCalendar2 className="me-1" />
                                                        {formatLocalDateTime(followUp.dateTime, 'datetime')}
                                                    </small>

                                                </div>
                                                <div>
                                                    <Button
                                                        // variant="outline-secondary"
                                                        size="sm"
                                                        className="me-1"
                                                        onClick={() => handleEdit(followUp)}
                                                    >
                                                        <BsPencil size={12} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <p className="card-text mt-2">
                                                <strong>Summary:</strong> {followUp.summary}
                                            </p>

                                            <div className="mt-2">
                                                <Badge
                                                    bg={isNextFollowUpOverdue(followUp.nextFollowUpDate) ? 'danger' : 'warning'}
                                                    text="dark"
                                                >
                                                    Next Follow-up: {getFormateDMYDate(followUp.nextFollowUpDate) || 'Not set'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Form View
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Date & Time
                            </Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleFormChange}
                            />
                            <Form.Text className="text-muted">
                                Auto-filled with current time, can be modified
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mode of Communication *</Form.Label>
                            <Form.Select
                                name="mode"
                                value={formData.mode}
                                onChange={handleFormChange}
                            >
                                <option value="Call">📞 Call</option>
                                <option value="WhatsApp">💬 WhatsApp</option>
                                <option value="Email">✉️ Email</option>
                                <option value="Meeting">🤝 Meeting</option>
                                <option value="Other">📝 Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Summary of Discussion *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="summary"
                                value={formData.summary}
                                onChange={handleFormChange}
                                placeholder="Enter detailed summary of the conversation..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Next Follow-up Date <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                name="nextFollowUpDate"
                                value={formData?.nextFollowUpDate?.split("T")[0] || ""}
                                onChange={handleFormChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Form.Text className="text-muted">
                                Mandatory field - When should we follow up next?
                            </Form.Text>
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>

            <Modal.Footer>
                {view === 'history' ? (
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                ) : (
                    <>
                        <Button variant="secondary" onClick={handleBackToHistory}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={saving}
                        >
                            {saving ? <Spinner size="sm" className="me-1" /> : null}
                            {saving ? 'Saving...' : (editingFollowUp ? 'Update' : 'Save')}
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default LeadFollowUpModal;