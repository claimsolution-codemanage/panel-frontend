import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function EditColumnModal({ showModal, setShowModal, column, updateColumnApi, refetchColumn }) {
    const [editingColumn, setEditingColumn] = useState(null);
    const [editColumnData, setEditColumnData] = useState({});
    const [newEditOption, setNewEditOption] = useState('');


    const handleEditColumnChange = (e) => {
        const { name, value } = e.target;

        // Allow only a-z letters and spaces for label
        if (name === 'label') {
            const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
            setEditColumnData(prev => ({
                ...prev,
                label: sanitizedValue
            }));
        }
    };

    const addEditOption = () => {
        if (newEditOption.trim()) {
            setEditColumnData(prev => ({
                ...prev,
                options: [...prev.options, newEditOption.trim()]
            }));
            setNewEditOption('');
        }
    };

    const removeEditOption = (indexToRemove) => {
        setEditColumnData(prev => ({
            ...prev,
            options: prev.options.filter((_, index) => index !== indexToRemove)
        }));
    };

    const saveEditedColumn = async () => {
        if (!editColumnData.label) {
            toast.error('Please enter column name');
            return;
        }

        const payload = {
            _id: column._id,
            label: editColumnData.label,
            type: editColumnData.type,
            ...(editColumnData.type === 'select' && { options: editColumnData.options })
        };

        try {
            await updateColumnApi(payload)
            setShowModal(false);
            setEditingColumn(null);
            refetchColumn()
            toast.success('Column updated successfully');
        } catch (error) {
            toast.error('Failed to update column');
        }

    };

    useEffect(() => {
        setEditColumnData({
            label: column?.label,
            type: column?.type ?? "text",
            options: column?.options ?? []
        })
    }, [column])

    return (
        <div>
            {/* Edit Column Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderBottom: "none",
                    padding: "20px 24px"
                }}>
                    <Modal.Title style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        Update Column: {editColumnData?.label}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "24px" }}>
                    <Form>
                        {/* Column Name Field */}
                        <Form.Group className="mb-4">
                            <Form.Label style={{
                                fontWeight: 600,
                                color: "#1e293b",
                                marginBottom: "8px",
                                fontSize: "14px"
                            }}>
                                Column Name <span style={{ color: "#ef4444" }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="label"
                                value={editColumnData.label}
                                onChange={handleEditColumnChange}
                                placeholder="Enter column display name"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "10px",
                                    border: "2px solid #e2e8f0",
                                    fontSize: "15px",
                                    transition: "all 0.2s ease"
                                }}
                                className="edit-input-focus"
                            />
                            <Form.Text style={{ color: "#64748b", fontSize: "12px", marginTop: "6px" }}>
                                This is the display name shown in the table header
                            </Form.Text>
                        </Form.Group>


                        {/* Options section for select type */}
                        {editColumnData.type === 'select' && (
                            <div style={{
                                background: "#f8fafc",
                                padding: "20px",
                                borderRadius: "12px",
                                marginTop: "10px",
                                border: "2px solid #e2e8f0"
                            }}>
                                <Form.Label style={{
                                    fontWeight: 700,
                                    color: "#1e293b",
                                    marginBottom: "16px",
                                    fontSize: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <span style={{
                                        background: "#3b82f6",
                                        color: "white",
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "6px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px"
                                    }}>▼</span>
                                    Dropdown Options
                                </Form.Label>

                                {/* Add new option */}
                                <div style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginBottom: "20px",
                                    alignItems: "center"
                                }}>
                                    <Form.Control
                                        type="text"
                                        value={newEditOption}
                                        onChange={(e) => setNewEditOption(e.target.value)}
                                        placeholder="Enter new option (e.g., High Priority)"
                                        style={{
                                            flex: 1,
                                            padding: "12px 16px",
                                            borderRadius: "10px",
                                            border: "2px solid #e2e8f0",
                                            fontSize: "14px"
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addEditOption();
                                            }
                                        }}
                                        className="edit-input-focus"
                                    />
                                    <Button
                                        onClick={addEditOption}
                                        disabled={!newEditOption.trim()}
                                        style={{
                                            background: "#10b981",
                                            border: "none",
                                            padding: "12px 24px",
                                            borderRadius: "10px",
                                            // fontSize: "14px",
                                            fontWeight: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = "#059669"}
                                        onMouseLeave={(e) => e.target.style.background = "#10b981"}
                                    >
                                        <span >+</span> Add Option
                                    </Button>
                                </div>

                                {/* Options list with drag handle */}
                                {editColumnData.options.length > 0 ? (
                                    <div style={{
                                        background: "white",
                                        borderRadius: "12px",
                                        border: "2px solid #e2e8f0",
                                        maxHeight: "250px",
                                        overflowY: "auto"
                                    }}>
                                        {editColumnData.options.map((option, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "12px 16px",
                                                    borderBottom: index < editColumnData?.options?.length - 1 ? "2px solid #e2e8f0" : "none",
                                                    background: index % 2 === 0 ? "#ffffff" : "#fafafa",
                                                    transition: "all 0.2s ease"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "#ffffff" : "#fafafa"}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                                                    <span style={{
                                                        fontSize: "14px",
                                                        color: "#1e293b",
                                                        fontWeight: 500
                                                    }}>{option}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e?.preventDefault(); removeEditOption(index) }}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#ef4444",
                                                        cursor: "pointer",
                                                        // fontSize: "18px",
                                                        // padding: "6px 12px",
                                                        borderRadius: "6px",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = "#fee2e2";
                                                        e.target.style.color = "#dc2626";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = "transparent";
                                                        e.target.style.color = "#ef4444";
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        textAlign: "center",
                                        padding: "40px 20px",
                                        background: "white",
                                        borderRadius: "12px",
                                        border: "2px dashed #cbd5e1",
                                        color: "#64748b",
                                        fontSize: "14px"
                                    }}>
                                        <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>📋</span>
                                        No options added yet. Add options above to create dropdown items.
                                    </div>
                                )}

                                {/* Options count */}
                                {editColumnData.options.length > 0 && (
                                    <div style={{
                                        marginTop: "12px",
                                        fontSize: "13px",
                                        color: "#64748b",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0"
                                    }}>
                                        <span>Total options: <strong>{editColumnData.options.length}</strong></span>
                                        <span style={{ color: "#10b981" }}>✓ Ready to use</span>
                                    </div>
                                )}
                            </div>
                        )}


                    </Form>
                </Modal.Body>

                <Modal.Footer style={{
                    borderTop: "2px solid #e2e8f0",
                    padding: "20px 24px",
                    background: "#f8fafc"
                }}>
                    <Button
                        variant="light"
                        onClick={() => {
                            setShowModal(false);
                            setEditingColumn(null);
                            setEditColumnData({
                                key: '',
                                label: '',
                                type: 'text',
                                options: []
                            });
                            setNewEditOption('');
                        }}
                        style={{
                            background: "white",
                            border: "2px solid #e2e8f0",
                            color: "#475569",
                            padding: "10px 24px",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: 600,
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#f1f5f9";
                            e.target.style.borderColor = "#cbd5e1";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "white";
                            e.target.style.borderColor = "#e2e8f0";
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={saveEditedColumn}
                        disabled={!editColumnData.label || (editColumnData.type === 'select' && editColumnData.options.length === 0)}
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            padding: "10px 32px",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: 600,
                            opacity: (!editColumnData.label || (editColumnData.type === 'select' && editColumnData.options.length === 0)) ? 0.5 : 1,
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            if (!e.target.disabled) {
                                e.target.style.transform = "scale(1.02)";
                                e.target.style.boxShadow = "0 10px 20px -5px rgba(102, 126, 234, 0.4)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "none";
                        }}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add these styles */}
            <style>{`
  .edit-input-focus:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
    outline: none;
  }
  
  .edit-column-icon {
    opacity: 0.5;
    transition: all 0.2s ease;
  }
  
  th:hover .edit-column-icon {
    opacity: 1;
    color: #667eea !important;
  }
  
  .modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .modal-header .btn-close {
    background-color: white;
    opacity: 0.8;
    border-radius: 50%;
    padding: 8px;
  }
  
  .modal-header .btn-close:hover {
    opacity: 1;
  }
  
  /* Custom scrollbar for options list */
  div[style*="max-height: 250px"]::-webkit-scrollbar {
    width: 8px;
  }
  
  div[style*="max-height: 250px"]::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  div[style*="max-height: 250px"]::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  div[style*="max-height: 250px"]::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`}</style>
        </div>
    )
}
