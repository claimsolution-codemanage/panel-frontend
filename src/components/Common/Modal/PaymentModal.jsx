import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PaymentDetails from '../SubPart/PaymentDetails';

export default function PaymentModal({ show, close, formik, saving, attachementUpload }) {
    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Body className='color-4'>
                <form onSubmit={formik.handleSubmit} className='p-3'>
                    <div className='border-3 border-primary border-bottom mb-4'>
                        <h6 className="text-primary text-center fs-3 fw-bold">Payment Details</h6>
                    </div>
                    <PaymentDetails formik={formik} attachementUpload={attachementUpload} />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-end gap-2 w-100">
                    <Button variant="secondary" onClick={close} disabled={saving} className="rounded-pill px-4">
                        Close
                    </Button>
                    <Button
                        disabled={saving}
                        variant="primary"
                        className="d-flex align-items-center justify-content-center gap-2 rounded-pill px-4"
                        onClick={formik.handleSubmit}
                    >
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Save Payment</span>
                        )}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}