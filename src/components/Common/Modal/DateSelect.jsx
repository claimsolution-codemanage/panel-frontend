import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";

export default function DateSelect({ show, hide, onFilter, dateRange:selectedDateRange, setDateRange:setSelectedDateRange }) {
    const [dateRange, setDateRange] = useState([{
        startDate: selectedDateRange?.startDate ?? new Date(),
        endDate: selectedDateRange?.endDate ?? new Date(),
        key: "selection",
    },]);
    const currentYear = new Date().getFullYear();
    const minDate = new Date(2020, 0, 1); // Jan = 0
    const maxDate = new Date(currentYear, 11, 31); // Dec = 11, last day 31

    return (
        <div>
            <Modal
                show={show}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='color-4'>
                    <div className='p-3'>
                        <div className="border-3 border-primary border-bottom mb-2">
                            <h6 className="text-primary text-center fs-3">Date Filter</h6>
                        </div>
                        {/* <div className='d-flex align-items-center justify-content-between gap-2'>
                            <div className="">
                                <div>Start Date</div>
                                <DatePicker className='form-control' selected={dateRange?.startDate} dateFormat={"dd-MM-YYYY"} onChange={(date) => setDateRange({ ...dateRange, startDate: date })} />
                            </div>
                            <div className="">
                                <div>End Date</div>
                                <DatePicker className='form-control' selected={dateRange?.endDate} dateFormat={"dd-MM-YYYY"} onChange={(date) => setDateRange({ ...dateRange, endDate: date })} />
                            </div>
                        </div> */}

                        <div className="date-range-wrapper">
                            <DateRange
                                editableDateInputs
                                onChange={(item) => {
                                    setDateRange([item.selection]);
                                    setSelectedDateRange(item?.selection)
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
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { onFilter(); hide() }}>Apply</Button>
                    <Button onClick={hide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
