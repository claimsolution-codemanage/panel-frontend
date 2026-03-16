import React, { act, useEffect, useState } from 'react'
import { Modal, Button, Form } from "react-bootstrap";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import debounce from 'debounce';
import AsyncSelect from 'react-select/async';

export default function LeadColumnFilter({ showModal, filters, setShowModal, activeColumn, setSortConfig, sortConfig, setFilters, getSaleEmp, handleApply }) {
    const [dateRange, setDateRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    },]);
    const currentYear = new Date().getFullYear();
    const minDate = new Date(2020, 0, 1); // Jan = 0
    const maxDate = new Date(currentYear, 11, 31); // Dec = 11, last day 31

    const fetchEmpList = async (inputValue, cb) => {
        try {
            const { data } = await getSaleEmp(50, 0, inputValue)
            const list = data?.data?.map(emp => {
                return {
                    label: `${emp?.fullName || ""} | ${emp?.type || ""}`,
                    value: emp?._id
                }
            })
            cb(list)
        } catch (error) {
            cb([])
        }

    }

    const fetchOptions = debounce(fetchEmpList, 3000)


    const renderModernFilterUI = (col) => {
        const currentFilter = filters[col.key] || {};

        switch (col.type) {
            case "date":
                return (
                    <div className="date-range-wrapper">
                        <DateRange
                            editableDateInputs
                            onChange={(item) => {
                                setDateRange([item.selection]);
                                setFilters((prev) => ({
                                    ...prev,
                                    [col.key]: {
                                        type: "date",
                                        from: item.selection.startDate,
                                        to: item.selection.endDate,
                                    },
                                }));
                            }}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            months={1}
                            direction="vertical"
                            showDateDisplay={false}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </div>
                );

            case "select":
                return (
                    <div>
                        <Form.Select
                            multiple
                            value={currentFilter.value || []}
                            onChange={(e) => {
                                const options = e.target.options;
                                const selectedValues = [];
                                for (let i = 0; i < options.length; i++) {
                                    if (options[i].selected) {
                                        selectedValues.push(options[i].value);
                                    }
                                }
                                setFilters((prev) => ({
                                    ...prev,
                                    [col.key]: {
                                        type: "select",
                                        value: selectedValues,
                                    },
                                }));
                            }}
                            className="multi-select-filter"
                            style={{
                                minHeight: '120px',
                                width: '100%',
                                padding: '8px'
                            }}
                        >
                            {col.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted d-block mt-2">
                            Hold Ctrl/Cmd to select multiple options
                        </Form.Text>

                        {/* Show selected options count */}
                        {currentFilter.value && currentFilter.value.length > 0 && (
                            <div className="mt-2 p-2 bg-light rounded" style={{ fontSize: '13px' }}>
                                <strong>Selected:</strong> {currentFilter.value.length} option(s)
                            </div>
                        )}
                    </div>
                );

            case "emp-select":
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            isMulti // Enable multi-select
                            className="text-capitalize"
                            value={currentFilter?.value || []}
                            onChange={(val) => setFilters((prev) => ({
                                ...prev,
                                [col.key]: {
                                    type: "emp-select",
                                    value: val
                                },
                            }))}
                            loadOptions={fetchOptions}
                            getOptionLabel={(option) => option?.label}
                            getOptionValue={(option) => option?.value}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                control: (base) => ({
                                    ...base,
                                    minHeight: '38px',
                                    borderColor: '#e2e8f0',
                                    '&:hover': {
                                        borderColor: '#3b82f6'
                                    }
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#e2e8f0',
                                    borderRadius: '4px'
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: '#1e293b',
                                    fontSize: '13px'
                                }),
                                multiValueRemove: (base) => ({
                                    ...base,
                                    color: '#64748b',
                                    '&:hover': {
                                        backgroundColor: '#ef4444',
                                        color: 'white'
                                    }
                                })
                            }}
                        />
                        <Form.Text className="text-muted d-block mt-2">
                            Select multiple employees
                        </Form.Text>
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Contains..."
                        value={currentFilter.value || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                [col.key]: {
                                    type: "text",
                                    value: e.target.value,
                                },
                            }))
                        }
                    />
                );
        }
    };


    return (
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
            size="md"

        >
            <div
                onKeyDownCapture={(e) => e.stopPropagation()}
                onKeyUpCapture={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}

            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title style={{ fontSize: 16 }}>
                        {activeColumn?.label}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <hr className='m-0 p-0' />

                    {/* 🔥 SORT SECTION */}
                    <div className="mb-4">
                        <div className="fw-semibold my-2" style={{ fontSize: 14 }}>
                            Order by
                        </div>

                        {/* ASC */}
                        <div
                            className={`py-2 px-3 rounded d-flex justify-content-between align-items-center ${sortConfig?.key === activeColumn?.key &&
                                sortConfig?.direction === "asc"
                                ? "bg-primary bg-opacity-10 text-primary fw-semibold"
                                : "hover-bg"
                                }`}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setSortConfig({
                                    key: activeColumn.key,
                                    direction: "asc",
                                })
                            }
                        >
                            <span>
                                Sort {activeColumn?.type !== "date" ? "A → Z" : "Asc"}
                            </span>

                            {sortConfig?.key === activeColumn?.key &&
                                sortConfig?.direction === "asc" && (
                                    <i className="bi bi-check-lg"></i>
                                )}
                        </div>

                        {/* DESC */}
                        <div
                            className={`py-2 px-3 rounded d-flex justify-content-between align-items-center ${sortConfig?.key === activeColumn?.key &&
                                sortConfig?.direction === "desc"
                                ? "bg-primary bg-opacity-10 text-primary fw-semibold"
                                : "hover-bg"
                                }`}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setSortConfig({
                                    key: activeColumn.key,
                                    direction: "desc",
                                })
                            }
                        >
                            <span>
                                Sort {activeColumn?.type !== "date" ? "Z → A" : "Desc"}
                            </span>

                            {sortConfig?.key === activeColumn?.key &&
                                sortConfig?.direction === "desc" && (
                                    <i className="bi bi-check-lg"></i>
                                )}
                        </div>
                    </div>


                    <hr className='m-0 p-0' />
                    {/* 🔥 FILTER SECTION */}
                    <div>
                        <div className="fw-semibold my-2" style={{ fontSize: 14 }}>
                            Filter by condition
                        </div>

                        {activeColumn && renderModernFilterUI(activeColumn)}
                    </div>

                </Modal.Body>

                <Modal.Footer className="border-0">
                    {(sortConfig?.[activeColumn?.key] || filters?.[activeColumn?.key]) && (<Button
                        variant="light"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Remove filter
                            setFilters((prev) => {
                                const copy = { ...prev };
                                delete copy[activeColumn.key];
                                return copy;
                            });

                            setSortConfig(null)
                            // Reset date range UI if column is date
                            if (activeColumn?.type === "date") {
                                setDateRange([
                                    {
                                        startDate: new Date(),
                                        endDate: new Date(),
                                        key: "selection",
                                    },
                                ]);
                            }
                        }}
                    >
                        Clear
                    </Button>)}

                    <Button
                        variant="primary"
                        onClick={(e) => { e.stopPropagation(); setShowModal(false); handleApply() }}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </div>
            <style jsx>{`
  .multi-select-filter {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
  }
  
  .multi-select-filter option {
    padding: 10px 12px;
    margin: 2px 0;
    border-radius: 4px;
  }
  
  .multi-select-filter option:checked {
    background: linear-gradient(0deg, #3b82f6 0%, #3b82f6 100%);
    color: white;
  }
  
  .multi-select-filter option:hover {
    background-color: #f1f5f9;
  }
  
  .multi-select-filter:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
  }
  
  .multi-select-filter option:checked:hover {
    background: linear-gradient(0deg, #2563eb 0%, #2563eb 100%);
  }
  
  /* Custom scrollbar for multi-select */
  .multi-select-filter::-webkit-scrollbar {
    width: 8px;
  }
  
  .multi-select-filter::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .multi-select-filter::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  .multi-select-filter::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`}</style>
        </Modal>
    )
}
