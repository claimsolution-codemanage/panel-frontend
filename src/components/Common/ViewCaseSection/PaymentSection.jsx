import React, { useState } from 'react'
import { getFormateDMYDate } from '../../../utils/helperFunction';
import { CiEdit } from 'react-icons/ci';
import PaymentModal from '../Modal/PaymentModal';
import { useFormik } from 'formik';
import { paymentInitialValues, paymentValidationSchema } from '../../../utils/validation';
import { toast } from 'react-toastify';

export default function PaymentSection({ id, accessPayment, casePayment, getCaseById, paymentDetailsApi }) {
    const [paymentModal, setpaymentModal] = useState({ save: false, show: false })

    const handleSubmit = async (values) => {
        setpaymentModal({ ...paymentModal, save: true })
        try {
            const res = await paymentDetailsApi({ ...values, caseId: id })
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                getCaseById()
            }
            setpaymentModal({ show: false, save: false })
        } catch (error) {
            console.log(error);

            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            setpaymentModal({ ...paymentModal, save: false })
        }
    }

    const paymentFormik = useFormik({
        initialValues: paymentInitialValues,
        validationSchema: paymentValidationSchema,
        onSubmit: handleSubmit
    })

    const handleUpdatePayment = (ele) => {
        let payload = { ...ele }
        paymentFormik.setValues(payload)
        setpaymentModal({ ...paymentModal, show: true })
    }

    return (
        <div>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex justify-content-between">
                        <div className="text-primary text-center fs-4">Payment Details</div>
                        {accessPayment && <div className="d-flex gap-1 btn btn-primary" onClick={() => { setpaymentModal({ save: false, show: true }); paymentFormik.resetForm() }}>
                            <div>Add Payment</div>
                        </div>}
                    </div>
                </div>
                <div className="mt-4 rounded-2 shadow">
                    <div className="table-responsive">
                        <table className="table table-responsive table-borderless">
                            <thead className="">
                                <tr className="bg-primary text-white text-center">
                                    <th scope="col" className="text-nowrap">S.no</th>
                                    {accessPayment && <th scope="col" className="text-nowrap" >Edit</th>}
                                    <th scope="col" className="text-nowrap">Payment mode</th>
                                    <th scope="col" className="text-nowrap">Date of payment</th>
                                    <th scope="col" className="text-nowrap">Bank name</th>
                                    <th scope="col" className="text-nowrap">Cheque number</th>
                                    <th scope="col" className="text-nowrap" >Amount</th>
                                    <th scope="col" className="text-nowrap" >Cheque date</th>
                                    <th scope="col" className="text-nowrap" >UTR number</th>
                                    <th scope="col" className="text-nowrap" >Transaction date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {casePayment?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                    <th scope="row">{ind + 1}</th>
                                    {accessPayment && <td>
                                        <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => handleUpdatePayment(item)}><CiEdit /></span>
                                    </td>}
                                    <td className="text-break col-1"><p className="mb-1 text-center">{item?.paymentMode || "-"}</p></td>
                                    <td className="text-nowrap "> {item?.dateOfPayment ? <p className="mb-1">{getFormateDMYDate(item?.dateOfPayment)}</p> : "-"}</td>
                                    <td className="text-break col-1"><p className="mb-1 text-center">{item?.bankName || "-"}</p></td>
                                    <td className="text-break col-1"><p className="mb-1 text-center">{item?.chequeNumber || "-"}</p></td>
                                    <td className="text-break col-1"><p className="mb-1 text-center">{item?.amount || "-"}</p></td>
                                    <td className="text-nowrap "> {item?.chequeDate ? <p className="mb-1">{getFormateDMYDate(item?.chequeDate)}</p> : "-"}</td>
                                    <td className="text-break col-1"><p className="mb-1 text-center">{item?.utrNumber || "-"}</p></td>
                                    <td className="text-nowrap "> {item?.transactionDate ? <p className="mb-1">{getFormateDMYDate(item?.transactionDate)}</p> : "-"}</td>

                                </tr>)}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            {paymentModal?.show && <PaymentModal show={paymentModal?.show} saving={paymentModal?.save} formik={paymentFormik} close={() => setpaymentModal({ save: false, show: false })} />}
        </div>
    )
}
