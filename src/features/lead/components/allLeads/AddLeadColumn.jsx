import React, { useState } from 'react'
// Add these imports at the top
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid'; // Install: npm install uuid
import { toast } from 'react-toastify';
export default function AddLeadColumn({ show, onClose, addColumnApi, refetchColumnData }) {
  const [newColumn, setNewColumn] = useState({
    key: '',
    label: '',
    type: 'text',
    options: []
  });
  const [newOption, setNewOption] = useState('');
  const [saving, setSaving] = useState(false);

  // Add function to handle new column input change
  const handleNewColumnChange = (e) => {
    const { name, value } = e.target;

    // Allow only a-z letters and spaces (case insensitive)
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');

    setNewColumn(prev => ({
      ...prev,
      [name]: sanitizedValue,
      // Auto-generate key from sanitized label if key is empty
      // ...(name === 'label' && !prev.key ? { 
      //   key: sanitizedValue.toLowerCase().replace(/\s+/g, '_') 
      // } : {})
    }));
  };

  // Add function to add option to select column
  const addOption = () => {
    if (newOption.trim()) {
      setNewColumn(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  // Add function to remove option
  const removeOption = (indexToRemove) => {
    setNewColumn(prev => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add function to save new column
  const saveNewColumn = async () => {
    if (!newColumn.label) {
      toast.error('Please enter column name');
      return;
    }

    // Check if column key already exists
    //   if (columns.some(col => col.key === newColumn.key)) {
    //     toast.error('Column with this key already exists');
    //     return;
    //   }

    // Create new column object
    const columnToAdd = {
      key: newColumn.key,
      label: newColumn.label,
      type: newColumn.type,
      ...(newColumn.type === 'select' && { options: newColumn.options })
    };

    if (typeof addColumnApi !== "function") return

    try {
      setSaving(true)
      await addColumnApi(columnToAdd)
      setNewColumn({
        key: '',
        label: '',
        type: 'text',
        options: []
      });
      setNewOption('');
      refetchColumnData && refetchColumnData()
      onClose(false);


      toast.success('Column added successfully');
    } catch (error) {
      console.log("Failed to add new column", error)
      toast.success(error?.response?.data?.message ?? "Failed to add new column");
    } finally {
      setSaving(false)
    }
  };


  return (
    <div>
      {/* Add Column Modal */}
      <Modal
        show={show}
        onHide={onClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <Modal.Title style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b" }}>
            Add New Column
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: "24px" }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 500, color: "#475569", marginBottom: "8px" }}>
                    Column Label <span style={{ color: "#ef4444" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="label"
                    value={newColumn.label}
                    onChange={handleNewColumnChange}
                    placeholder="e.g., Phone Number"
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px"
                    }}
                  />
                  <Form.Text style={{ color: "#64748b", fontSize: "12px" }}>
                    Display name for the column
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 500, color: "#475569", marginBottom: "8px" }}>
                    Column Type
                  </Form.Label>
                  <Form.Select
                    name="type"
                    value={newColumn.type}
                    onChange={handleNewColumnChange}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px"
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="textTemplate">Text Template</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Select (Dropdown)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: 500, color: "#475569", marginBottom: "8px" }}>
          Column Type
        </Form.Label>
        <Form.Select
          name="type"
          value={newColumn.type}
          onChange={handleNewColumnChange}
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "14px"
          }}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="select">Select (Dropdown)</option>
        </Form.Select>
      </Form.Group> */}

            {/* Options section for select type */}
            {['select', 'textTemplate'].includes(newColumn.type) && (
              <div style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                marginTop: "20px"
              }}>
                <Form.Label style={{ fontWeight: 600, color: "#1e293b", marginBottom: "12px" }}>
                  Dropdown Options
                </Form.Label>

                <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                  <Form.Control
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Enter option (e.g., Active, Inactive)"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px"
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                  />
                  <Button
                    onClick={addOption}
                    style={{
                      background: "#3b82f6",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500
                    }}
                  >
                    Add Option
                  </Button>
                </div>

                {/* Options list */}
                {newColumn.options.length > 0 ? (
                  <div style={{
                    background: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    maxHeight: "200px",
                    overflowY: "auto"
                  }}>
                    {newColumn.options.map((option, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 15px",
                          borderBottom: index < newColumn.options.length - 1 ? "1px solid #e2e8f0" : "none",
                          background: index % 2 === 0 ? "#ffffff" : "#fafafa"
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#1e293b" }}>{option}</span>
                        <button
                          onClick={(e) => { e.preventDefault(); removeOption(index) }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: "4px 8px",
                            borderRadius: "4px"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#fee2e2"}
                          onMouseLeave={(e) => e.target.style.background = "transparent"}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "30px",
                    background: "white",
                    borderRadius: "8px",
                    border: "1px dashed #cbd5e1",
                    color: "#64748b",
                    fontSize: "14px"
                  }}>
                    No options added yet. Add options above.
                  </div>
                )}
              </div>
            )}

            {/* Preview section */}
            {newColumn.label && (
              <div style={{
                marginTop: "24px",
                padding: "16px",
                background: "#f1f5f9",
                borderRadius: "8px",
                borderLeft: "4px solid #3b82f6"
              }}>
                <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
                  Column Preview:
                </div>
                <div style={{
                  display: "flex",
                  gap: "20px",
                  fontSize: "14px"
                }}>
                  <div><strong>Label:</strong> {newColumn.label}</div>
                  {/* <div><strong>Key:</strong> {newColumn.key}</div> */}
                  <div><strong>Type:</strong> {newColumn.type}</div>
                  {newColumn.type === 'select' && newColumn.options.length > 0 && (
                    <div><strong>Options:</strong> {newColumn.options.length}</div>
                  )}
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer style={{ borderTop: "1px solid #e2e8f0", padding: "16px 24px" }}>
          <Button
            variant="secondary"
            disabled={saving}
            onClick={() => {
              onClose();
              setNewColumn({
                key: '',
                label: '',
                type: 'text',
                options: []
              });
              setNewOption('');
            }}
            style={{
              background: "#f1f5f9",
              border: "none",
              color: "#475569",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={saveNewColumn}
            disabled={saving || !newColumn.label || (newColumn.type === 'select' && newColumn.options.length === 0)}
            style={{
              background: "#3b82f6",
              border: "none",
              padding: "10px 30px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              opacity: (!newColumn.label || (newColumn.type === 'select' && newColumn.options.length === 0)) ? 0.5 : 1
            }}
          >
            {saving ? "saving..." : " Add Column"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add this CSS for the modal */}
      <style>{`
  .modal-content {
    border: none;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .modal-header {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  
  .form-control:focus, .form-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
  }
  
  .btn-close {
    filter: brightness(0.6);
  }
  
  .btn-close:hover {
    filter: brightness(0.4);
  }
`}</style>

    </div>
  )
}
