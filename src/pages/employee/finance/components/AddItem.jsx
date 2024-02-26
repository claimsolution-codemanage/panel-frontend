import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function AddItem({ show, onHide,formik,data, handleChange,onSave }) {
 
 
  const handleOnChange = (e) => {
    const { name, value } = e.target
    // console.log(name, value);
    handleChange(name,value)
  }

   const handleAddItem =()=>{
      onSave()
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
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add Item</h5>
        <button type="button" onClick={()=>onHide()} class="close btn" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form className='row row-cols-12 row-cols-2 p-2'>
          <div class="form-group px-2">
            <label for="recipient-name" class="col-form-label">Name*:</label>
            <input type="text" name='name' value={data.name} onChange={(e)=>handleOnChange(e)} className={`form-control ${formik.errors.name && formik.touched.name && "border-danger"}`} id="recipient-name"/>
            <p className='text-danger'>{formik.touched.name && formik.errors.name}</p>
          
          </div>
           <div class="form-group px-2">
            <label for="recipient-name" class="col-form-label">Description:</label>
            <input type="text" name='description' value={data.description} onChange={(e)=>handleOnChange(e)} className={`form-control ${formik.errors.description && formik.touched.description && "border-danger"}`} id="recipient-name"/>
            <p className='text-danger'>{formik.touched.description && formik.errors.description}</p>
          
          </div>
          <div class="form-group px-2">
            <label for="recipient-name" class="col-form-label">Quantity:</label>
            <input type="number" name='quantity' value={data.quantity} onChange={(e)=>handleOnChange(e)} className={`form-control ${formik.errors.quantity && formik.touched.quantity && "border-danger"}`} id="recipient-name"/>
            <p className='text-danger'>{formik.touched.quantity && formik.errors.quantity}</p>
          
          </div>
          <div class="form-group px-2">
            <label for="recipient-name" class="col-form-label">Gst Rate*:</label>
            <input type="number" name='gstRate' value={data.gstRate} onChange={(e)=>handleOnChange(e)} className={`form-control ${formik.errors.gstRate && formik.touched.gstRate && "border-danger"}`} id="recipient-name"/>
            <p className='text-danger'>{formik.touched.gstRate && formik.errors.gstRate}</p>
          
          </div>
          <div class="form-group px-2">
            <label for="recipient-name" class="col-form-label">Amount*:</label>
            <input type="number" name='amt' value={data.amt} onChange={(e)=>handleOnChange(e)} className={`form-control ${formik.errors.amt && formik.touched.amt && "border-danger"}`} id="recipient-name"/>
            <p className='text-danger'>{formik.touched.amt && formik.errors.amt}</p>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button onClick={()=>onHide()} type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        <button onClick={()=>handleAddItem()} type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
</Modal>

    </div>
    </div>
  )
}
