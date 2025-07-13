import Modal from 'react-bootstrap/Modal';
import FormInputField from '../../form/FormInput';

export default function EditInvoiceNoModal({ show, onHide, formik }) {
    const isDisabled = formik?.values?.loading

  return (
    <div>
      <div>
        <Modal
          show={show}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Update Invoice No</h5>
              <button type="button" onClick={() => onHide()} className="close btn" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form className='row row-cols-12 p-2'>
                <FormInputField name="invoiceNo" type="text" label="Invoice No* :" formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={() => onHide()} type="button" disabled={isDisabled} className="btn btn-primary" data-dismiss="modal">Close</button>
              <button onClick={formik.handleSubmit} type="button" disabled={isDisabled} className="btn btn-primary">
                {isDisabled ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
