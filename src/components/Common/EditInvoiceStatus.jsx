import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { invStatusInitalValues, invStatusValidationSchema } from '../../utils/validation';
import FormSelectField from './form/FormSelectField';
import { invStatusOptions } from '../../utils/constant';
import FormTextarea from './form/FormTextarea';

export default function EditInvoiceStatusModal({ changeInvoiceStatus,fetchDetails, setChangeInvoiceStatus,type="invoice", handleInvoiceStatus}) {
    const [loading, setLoading] = useState(false)

    const handleSumbit = async (values) => {
        setLoading(true)
        try {
            const res = await handleInvoiceStatus(values)
            if (res?.data?.success) {
                setChangeInvoiceStatus({ status: false, details: "" })
                toast.success(res?.data?.message)
                fetchDetails && fetchDetails()
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        }            
        setLoading(false)
    }
        const formik = useFormik({
            initialValues: {...invStatusInitalValues,_id:changeInvoiceStatus?._id},
            validationSchema: invStatusValidationSchema,
            enableReinitialize:true,
            onSubmit: handleSumbit
        })


    return (
        <Modal
            show={changeInvoiceStatus?.status}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Change {type} status</h6>
                    </div>

                 <FormSelectField name="status" label="Status" options={invStatusOptions} formik={formik} handleOnChange={(e, name) => formik.handleChange(e)} />
                 {type=="invoice" && <FormTextarea name="remark" label="Remark" placeholder={`${type} remark`} formik={formik} handleOnChange={(e, name) => formik.handleChange(e)} /> }
 
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={formik.handleSubmit}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                    </div>
                </div>
                <Button disabled={loading} onClick={() => setChangeInvoiceStatus({ status: false, details: {} })}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}