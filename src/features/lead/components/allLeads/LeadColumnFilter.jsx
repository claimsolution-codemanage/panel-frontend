import React, { act, useEffect, useState } from 'react'
import { Modal, Button, Form } from "react-bootstrap";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import debounce from 'debounce';
import AsyncSelect from 'react-select/async';

export default function LeadColumnFilter({ showModal, filters, setShowModal, activeColumn, setSortConfig, sortConfig, setFilters, getSaleEmp,handleApply }) {
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
            // 🔥 DATE RANGE WITH react-date-range
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

            // 🔥 SELECT FILTER
            case "select":
                return (
                    <select
                        className="form-select"
                        value={currentFilter.value || ""}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                [col.key]: {
                                    type: "select",
                                    value: e?.target?.value,
                                },
                            }))
                        }
                        }
                    >
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
                    <div
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            className="text-capitalize"
                            value={currentFilter?.value}
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
                            menuPortalTarget={document.body}   // 🔥 important for z-index issues
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                        />
                    </div>
                );
            // 🔥 TEXT FILTER
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
                        onClick={(e) => {e.stopPropagation();setShowModal(false);handleApply()}}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    )
}
