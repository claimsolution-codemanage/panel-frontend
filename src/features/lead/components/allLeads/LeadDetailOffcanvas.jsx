import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import {
    IoCloseOutline,
    IoSaveOutline,
    IoPencilOutline,
    IoCheckmarkCircleOutline,
    IoTimeOutline,
    IoCalendarOutline
} from 'react-icons/io5';
import AsyncSelect from 'react-select/async';
import '../../../../styles/lead/LeadDetailOffcanvas.css';

const LeadDetailOffcanvas = ({
    show,
    onHide,
    leadData = {},
    rowIndex = -1,
    columns = [],
    grid = [],
    onUpdateCell,
    fetchOptions = () => { },
    formatDateToISO = (date) => date,
    getFormateDMYDate = (date) => date,
    getStatusClass = () => '',
    getFollowUpClass = () => '',
    toggleTemplateDropdown = () => { },
    closeTemplateDropdown = () => { },
    isTemplateOpen = () => false,
    renderFollowUpCell = () => { },
    isSaving = false,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [activeField, setActiveField] = useState(null);


    // Initialize edited data when lead changes
    useEffect(() => {
        if (leadData && show) {
            setEditedData({ ...leadData });
            setIsEditing(false);
        }
    }, [leadData, show]);

    // Handle field change
    const handleFieldChange = (key, value) => {
        setEditedData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle save all changes
    const handleSaveAll = () => {
        if (rowIndex >= 0) {
            Object.keys(editedData)?.filter(key => key !== "next_follow_up_date").forEach(key => {
                if (editedData[key] !== leadData[key]) {
                    onUpdateCell(rowIndex, key, editedData[key]);
                }
            });
        }
        setIsEditing(false);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditedData({ ...leadData });
        setIsEditing(false);
    };

    // Render input based on column type
    const renderFieldInput = (col, value) => {
        const commonProps = {
            className: "detail-field-input",
            value: value || "",
            onChange: (e) => handleFieldChange(col.key, e.target.value),
            onFocus: () => setActiveField(col.key),
            onBlur: () => setActiveField(null),
        };

        switch (col.type) {
            case "number":
                return <input type="number" {...commonProps} />;

            case "date":
                return (
                    <input
                        type="date"
                        {...commonProps}
                        value={value?.trim() ? formatDateToISO(value) : ""}
                    />
                );

            case "select":
                return (
                    <select {...commonProps}>
                        <option value="">Select</option>
                        {col.options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );

            case "emp-select":
                return (
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        className="detail-async-select"
                        value={value}
                        onChange={(val) => handleFieldChange(col.key, val)}
                        loadOptions={fetchOptions}
                        getOptionLabel={(option) => option?.label}
                        getOptionValue={(option) => option?.value}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (base) => ({
                                ...base,
                                borderColor: '#e2e8f0',
                                borderRadius: '8px',
                                minHeight: '44px',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#94a3b8',
                                },
                            }),
                        }}
                    />
                );

            case "textTemplate":
                return (
                    <div className="template-field-wrapper">
                        <input type="text" {...commonProps} />
                        {/* {col.options && col.options.length > 0 && (
                            <div className="template-dropdown-trigger">
                                <span className="template-icon">⚡</span>
                                <div className="template-dropdown">
                                    {col.options.map((tpl, i) => (
                                        <div
                                            key={i}
                                            className="template-option"
                                            onClick={() => handleFieldChange(col.key, tpl)}
                                        >
                                            {tpl}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}

                        {/* ✅ Template dropdown trigger */}
                        <div style={{ position: "relative" }}>
                            <span
                                style={{
                                    cursor: "pointer",
                                    padding: "4px 6px",
                                    borderRadius: "100%",
                                    background: "#f1f5f9",
                                    border: "1px solid #e2e8f0",
                                    fontSize: "12px"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleTemplateDropdown(rowIndex, col.key)
                                }}
                            >
                                ⚡
                            </span>

                            {/* ✅ Dropdown */}
                            {isTemplateOpen(rowIndex, col.key) && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 20,
                                        right: 20,
                                        // background: "#fff",
                                        backgroundColor: 'white',
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        zIndex: 9999,
                                        minWidth: "200px",
                                        maxHeight: "200px",
                                        overflowY: "auto"
                                    }}
                                >
                                    {col.options?.map((tpl, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                handleFieldChange(col.key, tpl)
                                                closeTemplateDropdown()
                                            }}
                                            style={{
                                                padding: "8px 10px",
                                                cursor: "pointer",
                                                fontSize: "13px"
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background = "#f8fafc")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background = "transparent")
                                            }
                                        >
                                            {tpl}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return <input type="text" {...commonProps} />;
        }
    };

    // Render field value for display
    const renderFieldValue = (col, value) => {
        if (col.key === "status" && value) {
            return <span className={getStatusClass(value)}>{value}</span>;
        }

        if (col.type === "date" && value) {
            return (
                <span className={col.systemField ? "" : getFollowUpClass(value)}>
                    {getFormateDMYDate(value)}
                </span>
            );
        }

        return value?.label ?? value;
    };

    // Check if field is system field (read-only)
    const isSystemField = (col) => col?.systemField === true;

    // Get grouped columns
    const groupedColumns = columns.reduce((acc, col) => {
        const group = col.group || 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(col);
        return acc;
    }, {});

    // Get badge color based on status
    const getStatusBadgeColor = (status) => {
        const statusMap = {
            'New': 'primary',
            'Contacted': 'info',
            'Qualified': 'success',
            'Lost': 'danger',
            'Won': 'success',
            'In Progress': 'warning',
        };
        return statusMap[status] || 'secondary';
    };

    return (
        <Offcanvas
            show={show}
            onHide={onHide}
            placement="end"
            size="lg"
            // style={{ width: '70vw' }}
            className="lead-detail-offcanvas w-75"
            backdrop="static"
        >
            <Offcanvas.Header className="detail-header">
                <div className="detail-header-left">
                    <div className="detail-title-wrapper">
                        <h5 className="detail-title">
                            Lead Details
                            <Badge bg="primary" className="ms-2">
                                #{rowIndex + 1}
                            </Badge>
                        </h5>
                        {leadData?.status && (
                            <Badge
                                bg={getStatusBadgeColor(leadData.status)}
                                className="status-badge"
                            >
                                {leadData.status}
                            </Badge>
                        )}
                    </div>
                    <div className="detail-subtitle">
                        <span className="text-muted">
                            {leadData?.fullName || leadData?.name || 'Unnamed Lead'}
                        </span>
                        {leadData?.email && (
                            <span className="text-muted ms-3">
                                <IoTimeOutline className="me-1" />
                                {leadData.email}
                            </span>
                        )}
                    </div>
                </div>
                <div className="detail-header-actions">
                    {!isEditing ? (
                        <>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="edit-toggle-btn"
                            >
                                <IoPencilOutline className="me-1" />
                                Edit
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={onHide}
                                className="close-btn"
                            >
                                <IoCloseOutline size={20} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveAll}
                                disabled={isSaving}
                                className="save-btn"
                            >
                                {isSaving ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-1" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <IoSaveOutline className="me-1" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body className="detail-body">
                {Object.entries(groupedColumns).map(([groupName, cols]) => (
                    <div key={groupName} className="detail-section">
                        <div className="section-header">
                            <h6 className="section-title">{groupName}</h6>
                            <div className="section-divider" />
                        </div>
                        <Row className="g-3">
                            {cols.map((col) => {
                                const value = isEditing
                                    ? editedData[col.key]
                                    : leadData[col.key];
                                const isSystem = isSystemField(col);

                                return (
                                    <Col md={6} key={col.key} className="detail-field-col">
                                        <div className="detail-field">
                                            <label className="field-label">
                                                {col.label}
                                                {col.required && <span className="required-star">*</span>}
                                                {isSystem && (
                                                    <Badge bg="secondary" className="ms-1 system-badge">
                                                        System
                                                    </Badge>
                                                )}
                                            </label>
                                            <div className="field-value-wrapper">
                                                {isEditing && !isSystem ? (
                                                    col.key === 'next_follow_up_date'
                                                        ? renderFollowUpCell(leadData, col, rowIndex)
                                                        : renderFieldInput(col, value)
                                                ) : (
                                                    <div className={`field-display ${activeField === col.key ? 'active' : ''}`}>
                                                        {
                                                            col.key === 'next_follow_up_date'
                                                                ? renderFollowUpCell(leadData, col, rowIndex)
                                                                : renderFieldValue(col, value) || (
                                                                    <span className="empty-value">—</span>
                                                                )
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                ))}

                {/* Additional Info Section */}
                <div className="detail-section">
                    <div className="section-header">
                        <h6 className="section-title">Additional Information</h6>
                        <div className="section-divider" />
                    </div>
                    <Row className="g-3">
                        <Col md={6}>
                            <div className="detail-field">
                                <label className="field-label">Created At</label>
                                <div className="field-display">
                                    {leadData?.createdAt ? getFormateDMYDate(leadData.createdAt) : '—'}
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="detail-field">
                                <label className="field-label">Last Updated</label>
                                <div className="field-display">
                                    {leadData?.updatedAt ? getFormateDMYDate(leadData.updatedAt) : '—'}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Action Footer */}
                {isEditing && (
                    <div className="detail-footer">
                        <div className="footer-actions">
                            <Button
                                variant="primary"
                                onClick={handleSaveAll}
                                disabled={isSaving}
                                className="footer-save-btn"
                            >
                                {isSaving ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <IoSaveOutline className="me-2" />
                                        Save All Changes
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default LeadDetailOffcanvas;