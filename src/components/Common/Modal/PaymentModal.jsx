import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import * as Yup from "yup";
import {checkNumber} from '../../../utils/helperFunction'
import { formatDateToISO } from '../../../utils/helperFunction';
import PaymentDetails from '../SubPart/PaymentDetails';

export default function PaymentModal({ show, close,formik,saving}) {


    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <form onSubmit={formik.handleSubmit} className='p-3'>
                    <div className='border-3 border-primary border-bottom mb-5'>
                        <h6 className="text-primary text-center fs-3">Payment Details</h6>
                    </div>
                    <PaymentDetails formik={formik}/>
                    {/* <div className="">
                    <div className="mb-3 ">
                            <label htmlFor="paymentMode" className={`form-label ${formik?.touched?.paymentMode && formik?.touched?.paymentMode && formik?.errors?.paymentMode && "text-danger"}`}>Payment Mode</label>
                            <select
                                name="paymentMode"
                                className="form-select"
                                value={formik?.values?.paymentMode}
                                onChange={(e) => { formik.resetForm(); formik.handleChange(e) }}
                            >
                                <option value="">Select Payment Mode</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Web">Web</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Net Banking">Net Banking</option>
                            </select>
                            {formik?.touched?.paymentMode && formik?.errors?.paymentMode ? (
                                <span className="text-danger">{formik?.errors?.paymentMode}</span>
                            ) : null}
                        </div>
                        <div className="mb-3 ">
                            <label htmlFor="dateOfPayment" className={`form-label ${formik?.touched?.dateOfPayment && formik?.touched?.dateOfPayment && formik?.errors?.dateOfPayment && "text-danger"}`}>Date of Payment</label>
                            <input type="date" className={`form-control ${formik?.touched?.dateOfPayment && formik?.touched?.dateOfPayment && formik?.errors?.dateOfPayment && "border-danger"}`} id="dateOfPayment" name="dateOfPayment" value={formik?.values?.dateOfPayment ? formatDateToISO(formik?.values?.dateOfPayment) :"" } onChange={formik.handleChange} />
                            {formik?.touched?.dateOfPayment && formik?.errors?.dateOfPayment ? (
                                <span className="text-danger">{formik?.errors?.dateOfPayment}</span>
                            ) : null}
                        </div>
                    
                        {formik?.values?.paymentMode=="UPI" &&
                        <div className="mb-3 ">
                            <label htmlFor="utrNumber" className={`form-label ${formik?.touched?.utrNumber && formik?.touched?.utrNumber && formik?.errors?.utrNumber && "text-danger"}`}>UTR Number</label>
                            <input type="text" className={`form-control ${formik?.touched?.utrNumber && formik?.touched?.utrNumber && formik?.errors?.utrNumber && "border-danger"}`} id="utrNumber" name="utrNumber" value={formik?.values?.utrNumber} onChange={formik.handleChange} />
                            {formik?.touched?.utrNumber && formik?.errors?.utrNumber ? (
                                <span className="text-danger">{formik?.errors?.utrNumber}</span>
                            ) : null}
                        </div>}
                        {formik?.values?.paymentMode=="Cheque" &&
                        <div>
                            <div className="mb-3 ">
                                <label htmlFor="bankName" className={`form-label ${formik?.touched?.bankName && formik?.touched?.bankName && formik?.errors?.bankName && "text-danger"}`}>Bank Name</label>
                                <input type="text" className={`form-control ${formik?.touched?.bankName && formik?.touched?.bankName && formik?.errors?.bankName && "border-danger"}`} id="bankName" name="bankName" value={formik?.values?.bankName} onChange={formik.handleChange} />
                                {formik?.touched?.bankName && formik?.errors?.bankName ? (
                                    <span className="text-danger">{formik?.errors?.bankName}</span>
                                ) : null}
                        </div>
                        <div className="mb-3 ">
                                <label htmlFor="chequeNumber" className={`form-label ${formik?.touched?.chequeNumber && formik?.touched?.chequeNumber && formik?.errors?.chequeNumber && "text-danger"}`}>Cheque Number</label>
                                <input type="text" className={`form-control ${formik?.touched?.chequeNumber && formik?.touched?.chequeNumber && formik?.errors?.chequeNumber && "border-danger"}`} id="chequeNumber" name="chequeNumber" value={formik?.values?.chequeNumber} onChange={formik.handleChange} />
                                {formik?.touched?.chequeNumber && formik?.errors?.chequeNumber ? (
                                    <span className="text-danger">{formik?.errors?.chequeNumber}</span>
                                ) : null}
                        </div>
                        <div className="mb-3 ">
                                <label htmlFor="chequeDate" className={`form-label ${formik?.touched?.chequeDate && formik?.touched?.chequeDate && formik?.errors?.chequeDate && "text-danger"}`}>Cheque Date</label>
                                <input type="date" className={`form-control ${formik?.touched?.chequeDate && formik?.touched?.chequeDate && formik?.errors?.chequeDate && "border-danger"}`} id="chequeDate" name="chequeDate" value={formik?.values?.chequeDate ? formatDateToISO(formik?.values?.chequeDate):""} onChange={formik.handleChange} />
                                {formik?.touched?.chequeDate && formik?.errors?.chequeDate ? (
                                    <span className="text-danger">{formik?.errors?.chequeDate}</span>
                                ) : null}
                        </div>
                        </div>}
                        {formik?.values?.paymentMode=="Net Banking" &&
                        <div>
                            <div className="mb-3 ">
                                <label htmlFor="bankName" className={`form-label ${formik?.touched?.bankName && formik?.touched?.bankName && formik?.errors?.bankName && "text-danger"}`}>Bank Name</label>
                                <input type="text" className={`form-control ${formik?.touched?.bankName && formik?.touched?.bankName && formik?.errors?.bankName && "border-danger"}`} id="bankName" name="bankName" value={formik?.values?.bankName} onChange={formik.handleChange} />
                                {formik?.touched?.bankName && formik?.errors?.bankName ? (
                                    <span className="text-danger">{formik?.errors?.bankName}</span>
                                ) : null}
                        </div>
                        <div className="mb-3 ">
                                <label htmlFor="utrNumber" className={`form-label ${formik?.touched?.utrNumber && formik?.touched?.utrNumber && formik?.errors?.utrNumber && "text-danger"}`}>UTR Number</label>
                                <input type="text" className={`form-control ${formik?.touched?.utrNumber && formik?.touched?.utrNumber && formik?.errors?.utrNumber && "border-danger"}`} id="utrNumber" name="utrNumber" value={formik?.values?.utrNumber} onChange={formik.handleChange} />
                                {formik?.touched?.utrNumber && formik?.errors?.utrNumber ? (
                                    <span className="text-danger">{formik?.errors?.utrNumber}</span>
                                ) : null}
                        </div>
                        <div className="mb-3 ">
                                <label htmlFor="transactionDate" className={`form-label ${formik?.touched?.transactionDate && formik?.touched?.transactionDate && formik?.errors?.transactionDate && "text-danger"}`}>Transaction Date</label>
                                <input type="date" className={`form-control ${formik?.touched?.transactionDate && formik?.touched?.transactionDate && formik?.errors?.transactionDate && "border-danger"}`} id="transactionDate" name="transactionDate" value={formik?.values?.transactionDate ? formatDateToISO(formik?.values?.transactionDate):""} onChange={formik.handleChange} />
                                {formik?.touched?.transactionDate && formik?.errors?.transactionDate ? (
                                    <span className="text-danger">{formik?.errors?.transactionDate}</span>
                                ) : null}
                        </div>
                        </div>}
                        <div className="mb-3 ">
                                <label htmlFor="amount" className={`form-label ${formik?.touched?.amount && formik?.touched?.amount && formik?.errors?.amount && "text-danger"}`}>Amount</label>
                                <input type="text" className={`form-control ${formik?.touched?.amount && formik?.touched?.amount && formik?.errors?.amount && "border-danger"}`} id="amount" name="amount" value={formik?.values?.amount} onChange={(e)=>checkNumber(e) && formik.handleChange(e)} />
                                {formik?.touched?.amount && formik?.errors?.amount ? (
                                    <span className="text-danger">{formik?.errors?.amount}</span>
                                ) : null}
                        </div>
                    </div> */}
                </form>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button disabled={saving} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${saving && "disabled"}`} onClick={formik.handleSubmit}>
                        {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save</span>}
                    </Button>
                </div>
                <Button onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}