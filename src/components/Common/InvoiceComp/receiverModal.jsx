import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { allState } from '../../../utils/constant';

export default function ReceiverModal({ show, onHide, formik, data, handleChange, onSave }) {
  // console.log("receiver", formik.errors);

  const handleOnChange = (e) => {
    const { name, value } = e.target
    // console.log(name, value);
    handleChange(name, value)
  }

  return (
    <div>
      <div>
        <Modal
          show={show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Receiver Details</h5>
              <button type="button" onClick={() => onHide()} className="close btn" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form className='row row-cols-12 row-cols-2 p-2'>
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">Name*:</label>
                  <input type="text" name='name' value={data.name} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.name && formik.touched.name && "border-danger"}`} id="recipient-name" />
                  <p className='text-danger'>{formik.touched.name && formik.errors.name}</p>
                </div>
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">Email:</label>
                  <input type="email" name='email' value={data.email} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.email && formik.touched.email && "border-danger"}`} id="recipient-name" />
                  <p className='text-danger'>{formik.touched.email && formik.errors.email}</p>

                </div>
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">Mobile No:</label>
                  <input type="text" name='mobileNo' value={data.mobileNo} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.mobileNo && formik.touched.mobileNo && "border-danger"}`} id="recipient-name" />
                  <p className='text-danger'>{formik.touched.mobileNo && formik.errors.mobileNo}</p>

                </div>
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">Gst No:</label>
                  <input type="text" name='gstNo' value={data.gstNo} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.gstNo && formik.touched.gstNo && "border-danger"}`} id="recipient-name" />
                  <p className='text-danger'>{formik.touched.gstNo && formik.errors.gstNo}</p>

                </div>
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">Pan No:</label>
                  <input type="text" name='panNo' value={data.panNo} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.panNo && formik.touched.panNo && "border-danger"}`} id="recipient-name" />
                  <p className='text-danger'>{formik.touched.panNo && formik.errors.panNo}</p>

                </div>
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">Address*:</label>
                  <input type="text" name='address' value={data.address} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.address && formik.touched.address && "border-danger"}`} id="recipient-name" />
                  <p className='text-danger'>{formik.touched.address && formik.errors.address}</p>

                </div>
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">State*:</label>
                  <select name='state' value={data.state} onChange={(e) => handleOnChange(e)} className={`form-select ${formik.errors.state && formik.touched.state && "border-danger"}`} aria-label="Default select example">
                    <option>Select State</option>
                    {allState?.map(state => <option value={state}>{state}</option>)}
                  </select>
                  <p className='text-danger'>{formik.touched.state && formik.errors.state}</p>
                </div>
                {/* <div className="form-group px-2">
                    <label for="recipient-name" className="col-form-label">Country:</label>
                    <input type="text" name='country' value={data.country} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.country && formik.touched.country && "border-danger"}`} id="recipient-name" />
                    <p className='text-danger'>{formik.touched.country && formik.errors.country}</p>
                  </div> */}
                <div className="form-group px-2">
                  <label for="recipient-name" className="col-form-label">PinCode*:</label>
                  <input type="text" name='pinCode' value={data.pinCode} onChange={(e) => handleOnChange(e)} className={`form-control ${formik.errors.pinCode && formik.touched.pinCode && "border-danger"}`} id="recipient-name" />
                  <p className='text-danger'>{formik.touched.pinCode && formik.errors.pinCode}</p>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={() => onHide()} type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
              <button onClick={() => onSave()} type="button" className="btn btn-primary">Save</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
