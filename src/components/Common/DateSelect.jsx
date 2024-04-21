import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelect({show,hide,onFilter,dateRange,setDateRange}) {

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
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Date Filter</h6>
                    </div>
                    <div className='d-flex align-items-center justify-content-between gap-2'>
                    <div className="">
                        <div>Start Date</div>
                        <DatePicker className='form-control' selected={dateRange?.startDate} onChange={(date) => setDateRange({...dateRange,startDate:date})}/>
                    </div>
                    <div className="">
                        <div>End Date</div>
                        <DatePicker className='form-control' selected={dateRange?.endDate} onChange={(date) => setDateRange({...dateRange,endDate:date})}/>
                    </div>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>{onFilter();hide()}}>Filter</Button>
                <Button onClick={hide}>Close</Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}
