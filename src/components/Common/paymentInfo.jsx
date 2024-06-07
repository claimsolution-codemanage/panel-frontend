import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getFormateDMYDate } from '../../utils/helperFunction';

export default function PaymentInfo({ show, hide, details }) {
    // console.log("payment Details",details);
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
                            <h6 className="text-primary text-center fs-3">Payment Details</h6>
                        </div>

                        <div className="d-flex flex-column">
                            <div>Invoice: {details?.invoiceNo}</div>
                            <div>Amount: {details?.totalAmt}</div>
                            {details?.transactionId ? <>
                            <div>Paid Amount: {details?.transactionId?.paidAmount}</div>
                            {/* <div>Bank Name: {details?.transactionId?.bankName}</div> */}
                            <div>Payment Mode: {details?.transactionId?.paymentMode}</div>
                            <div>Date: {details?.transactionId?.transDate}</div>
                            <div>TxnId: {details?.transactionId?.sabPaisaTxnId}</div>
                            </>: <>
                            <div>Date: {details?.paidDate && getFormateDMYDate(details?.paidDate)}</div>
                            <div>Remark: {details?.remark}</div>
                            
                            </>}
                        

                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
