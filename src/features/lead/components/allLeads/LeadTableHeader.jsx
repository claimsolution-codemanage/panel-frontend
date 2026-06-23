import { Badge, Button, Dropdown, Spinner } from "react-bootstrap";
import { IoAddOutline, IoCloudDoneOutline, IoCloudOfflineOutline, IoEllipsisVertical, IoFilterOutline, IoGridOutline, IoResizeOutline, IoSaveOutline, IoTextOutline } from "react-icons/io5";
import { FaFileCsv, FaFileExcel } from "react-icons/fa6";
import { useState } from "react";

export default function LeadTableHeader({ grid, loading, isDirty, saving, addRow, saveAll, toggleTextWrap, textWrap, toggleAutoHeight, autoHeight, hasAddColumnAccess, filters, handleExport, setShowAddColumnModal, handleResetFilter }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const filterCount = Object.keys(filters || {}).filter(key => {
        const value = filters[key];
        return value !== undefined && value !== null && value !== '' && value !== false;
    }).length;

    return (
        <div>
            <div className="lead-header-modern">
                {/* Left Section - Record Info & Save Status */}
                <div className="d-flex justify-content-between w-100">
                    <div>
                        <div className="record-info">
                            <Badge bg="primary" className="record-badge">
                                <span className="record-number">{grid?.length || 0}</span>
                                <span className="record-label">Records</span>
                            </Badge>
                            {loading && (
                                <div className="loading-indicator">
                                    <Spinner animation="border" size="sm" variant="primary" />
                                    <span className="loading-text ms-2">Loading...</span>
                                </div>
                            )}
                        </div>

                        <div className={`save-status mt-1 ${isDirty ? 'dirty' : ''}`}>
                            {saving ? (
                                <>
                                    <Spinner animation="border" size="sm" variant="warning" />
                                    <span>Saving...</span>
                                </>
                            ) : isDirty ? (
                                <>
                                    <IoCloudOfflineOutline size={16} className=" unsaved" />
                                    <span className="status-text unsaved">Unsaved changes</span>
                                    <span className="unsaved-dot" />
                                </>
                            ) : (
                                <>
                                    <IoCloudDoneOutline size={16} className=" saved" />
                                    <span className="status-text saved">All changes saved</span>
                                </>
                            )}
                        </div>

                    </div>
                    <div className="">
                        <div className="lead-header-actions">
                            {/* Quick Action Buttons */}
                            <div className="d-flex align-items-center gap-2">
                                {/* Add Row - Always visible */}
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={addRow}
                                    className="action-btn add-row-btn"
                                >
                                    <IoAddOutline size={18} />
                                    <span>Add Row</span>
                                </Button>

                                {/* Save Button - Always visible with status */}
                                <Button
                                    variant={isDirty ? 'warning' : 'secondary'}
                                    size="sm"
                                    onClick={saveAll}
                                    disabled={!isDirty || saving}
                                    className={`action-btn save-btn ${isDirty ? 'active' : ''}`}
                                >
                                    {saving ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <IoSaveOutline size={18} />
                                            <span>Save</span>
                                            {isDirty && <span className="unsaved-dot ms-1" />}
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* 3-Dot Menu */}
                            <Dropdown
                                show={showDropdown}
                                onToggle={(isOpen) => setShowDropdown(isOpen)}
                                align="end"
                            >
                                <Dropdown.Toggle
                                    variant="outline-secondary"
                                    size="sm"
                                    className="three-dot-menu"
                                    id="lead-actions-dropdown"
                                >
                                    <IoEllipsisVertical size={20} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="lead-dropdown-menu">
                                    {/* View Options Group */}
                                    <Dropdown.Header>View Options</Dropdown.Header>

                                    <Dropdown.Item
                                        onClick={toggleTextWrap}
                                        active={textWrap}
                                        className="dropdown-item-custom"
                                    >
                                        <IoTextOutline size={18} />
                                        <span>{textWrap ? 'Text Wrap: On' : 'Text Wrap: Off'}</span>
                                        {textWrap && <Badge bg="primary" pill className="ms-auto">Active</Badge>}
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        onClick={toggleAutoHeight}
                                        active={autoHeight}
                                        className="dropdown-item-custom"
                                    >
                                        <IoResizeOutline size={18} />
                                        <span>{autoHeight ? 'Auto Height: On' : 'Auto Height: Off'}</span>
                                        {autoHeight && <Badge bg="primary" pill className="ms-auto">Active</Badge>}
                                    </Dropdown.Item>

                                    <Dropdown.Divider />

                                    {/* Export Options */}
                                    <Dropdown.Header>Export</Dropdown.Header>

                                    <Dropdown.Item
                                        onClick={() => handleExport("excel")}
                                        className="dropdown-item-custom"
                                    >
                                        <FaFileExcel size={18} className="text-success" />
                                        <span>Export Excel</span>
                                        <Badge bg="success" pill className="ms-auto">.xlsx</Badge>
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        onClick={() => handleExport("csv")}
                                        className="dropdown-item-custom"
                                    >
                                        <FaFileCsv size={18} className="text-info" />
                                        <span>Export CSV</span>
                                        <Badge bg="info" pill className="ms-auto">.csv</Badge>
                                    </Dropdown.Item>

                                    <Dropdown.Divider />

                                    {/* Filter & Column Management */}
                                    <Dropdown.Header>Management</Dropdown.Header>

                                    {filterCount > 0 && (
                                        <Dropdown.Item
                                            onClick={handleResetFilter}
                                            className="dropdown-item-custom"
                                        >
                                            <IoFilterOutline size={18} className="text-warning" />
                                            <span>Reset Filters</span>
                                            <Badge bg="warning" pill className="ms-auto">{filterCount}</Badge>
                                        </Dropdown.Item>
                                    )}

                                    {hasAddColumnAccess && (
                                        <Dropdown.Item
                                            onClick={() => setShowAddColumnModal(true)}
                                            className="dropdown-item-custom"
                                        >
                                            <IoAddOutline size={18} className="text-primary" />
                                            <span>Add Column</span>
                                            <Badge bg="primary" pill className="ms-auto">New</Badge>
                                        </Dropdown.Item>
                                    )}

                                    {/* Additional Info */}
                                    <Dropdown.Divider />
                                    <Dropdown.ItemText className="text-muted small dropdown-footer">
                                        <IoGridOutline size={14} className="me-1" />
                                        {grid?.length || 0} records loaded
                                    </Dropdown.ItemText>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Right Section - Actions */}

            </div>
            <style>
                {
                    `/* LeadHeader.css - Modern Lead Header Styles */

.lead-header-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  gap: 16px;
  flex-wrap: wrap;
  min-height: 64px;
}

/* Left Section */
.lead-header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 200px;
}

.record-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #eff6ff !important;
  color: #1e40af !important;
  border: 1px solid #bfdbfe;
  font-weight: 500;
  border-radius: 20px;
  font-size: 0.85rem;
}

.record-number {
  font-weight: 700;
  font-size: 1rem;
}

.record-label {
  font-weight: 400;
  opacity: 0.8;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.85rem;
}

.loading-text {
  color: #475569;
}

/* Save Status */
.save-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.save-status .status-text.saved {
  color: #22c55e;
}

.save-status .status-text.unsaved {
  color: #eab308;
  font-weight: 500;
}

.save-status.dirty {
  background: #fefce8;
  border: 1px solid #fde68a;
  animation: pulse-status 2s ease-in-out infinite;
}

.save-status .unsaved-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #eab308;
  border-radius: 50%;
  animation: blink-dot 1.5s ease-in-out infinite;
}

@keyframes blink-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

@keyframes pulse-status {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Right Section - Actions */
.lead-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}


.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 0.85rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.action-btn.add-row-btn {
  background: #f8fafc;
  border-color: #cbd5e0;
  color: #1e293b;
}

.action-btn.add-row-btn:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  transform: translateY(-1px);
}

.action-btn.save-btn {
  background: #f1f5f9;
  border-color: #cbd5e0;
  color: #64748b;
}

.action-btn.save-btn.active {
  background: #fefce8;
  border-color: #f59e0b;
  color: #92400e;
}

.action-btn.save-btn.active:hover {
  background: #fef3c7;
  border-color: #d97706;
}

.action-btn.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn .unsaved-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #eab308;
  border-radius: 50%;
  animation: blink-dot 1.5s ease-in-out infinite;
}

/* Three Dot Menu */
.three-dot-menu {
  border-radius: 8px !important;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: #e2e8f0 !important;
  background: #f8fafc !important;
  transition: all 0.2s ease;
}

.three-dot-menu:hover {
  background: #f1f5f9 !important;
  border-color: #94a3b8 !important;
  transform: scale(1.05);
}

.three-dot-menu::after {
  display: none !important;
}

.three-dot-menu .dropdown-toggle {
  border: none !important;
}

/* Dropdown Menu */
.lead-dropdown-menu {
  min-width: 240px;
  padding: 8px 0;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  margin-top: 8px;
}

.lead-dropdown-menu .dropdown-header {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
  padding: 8px 16px;
  font-weight: 600;
}

.lead-dropdown-menu .dropdown-divider {
  margin: 4px 12px;
  border-color: #f1f5f9;
}

.dropdown-item-custom {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  padding: 8px 16px !important;
  font-size: 0.85rem !important;
  color: #1e293b !important;
  transition: all 0.2s ease !important;
}

.dropdown-item-custom:hover {
  background: #f1f5f9 !important;
  transform: translateX(4px);
}

.dropdown-item-custom:active {
  background: #e2e8f0 !important;
}

.dropdown-item-custom svg {
  flex-shrink: 0;
}

.dropdown-item-custom .badge {
  font-size: 0.65rem;
  padding: 2px 8px;
}

.dropdown-footer {
  padding: 8px 16px !important;
  font-size: 0.75rem !important;
  color: #94a3b8 !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .lead-header-modern {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
  }

  .lead-header-left {
    flex-wrap: wrap;
    gap: 12px;
  }

  .record-info {
    flex-wrap: wrap;
  }

  .save-status {
    font-size: 0.75rem;
    padding: 2px 10px;
  }

  .lead-header-actions {
    justify-content: space-between;
    width: 100%;
  }

  .action-btn span {
    display: none;
  }

  .action-btn {
    padding: 6px 12px;
  }

  .action-btn.save-btn span {
    display: inline;
  }

  .three-dot-menu {
    width: 36px;
    height: 36px;
  }

  .lead-dropdown-menu {
    min-width: 200px;
  }

  .dropdown-item-custom {
    font-size: 0.8rem !important;
    padding: 6px 12px !important;
  }
}

@media (max-width: 480px) {
  .record-badge {
    padding: 4px 10px;
    font-size: 0.75rem;
  }

  .record-number {
    font-size: 0.85rem;
  }

  .save-status .status-text {
    display: none;
  }

 
  .action-buttons {
    gap: 4px;
  }

  .action-btn {
    padding: 4px 10px;
    font-size: 0.75rem;
  }

  .action-btn span {
    display: none;
  }
}

/* Tooltip styles (optional) */
[data-tooltip] {
  position: relative;
}

[data-tooltip]:hover::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  background: #1e293b;
  color: white;
  font-size: 0.7rem;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 100;
}
                `}
            </style>
        </div>
    )
}
