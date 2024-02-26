import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik'
import * as Yup from 'yup';


export default function EditItem({ show, onHide,data,id,onSave }) {
    const invoiceItemsFormik = useFormik({
        initialValues:{
          name:data?.name,
          description:data?.description,
          quantity:data?.quantity,
          gstRate:data?.gstRate,
          rate:data?.rate,
          gstAmt:data?.gstAmt,
          amt:data?.amt,
          totalAmt:data?.totalAmt
    
        },
        validationSchema: Yup.object().shape({
          name: Yup.string().required('Item name is required'),
          description: Yup.string(),
          quantity: Yup.number().required('Quantity is required'),
          gstRate: Yup.number().required('GST rate is required'),
          rate:Yup.number(),
          gstAmt:Yup.number(),
          amt: Yup.number().required('Amount is required'),
          totalAmt:Yup.number(),
        }),
        onSubmit:async(values)=>{
          const rate = values.quantity && values.quantity !== 0
          ? (values.amt / (1 + values.gstRate / 100) * values.quantity).toFixed(2)
          : (values?.amt / (1 + values?.gstRate / 100)).toFixed(2);
    
        const convertItem = {
          ...values,
          rate: rate,
          gstAmt: values.quantity && values.quantity !== 0
            ? (values.amt * values.quantity - rate).toFixed(2)
            : (values.amt - rate).toFixed(2),
          totalAmt: values.quantity && values.quantity !== 0
            ? (values.amt * values.quantity).toFixed(2)
            : (values.amt),
        };
        onSave(convertItem,id)
        invoiceItemsFormik.resetForm()
        }
       })
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
                <input type="text" name='name' value={invoiceItemsFormik.values.name} onChange={(e)=>invoiceItemsFormik.handleChange(e)} className={`form-control ${invoiceItemsFormik.errors.name && invoiceItemsFormik.touched.name && "border-danger"}`} id="recipient-name"/>
                <p className='text-danger'>{invoiceItemsFormik.touched.name && invoiceItemsFormik.errors.name}</p>
              
              </div>
               <div class="form-group px-2">
                <label for="recipient-name" class="col-form-label">Description:</label>
                <input type="text" name='description' value={invoiceItemsFormik.values.description} onChange={(e)=>invoiceItemsFormik.handleChange(e)} className={`form-control ${invoiceItemsFormik.errors.description && invoiceItemsFormik.touched.description && "border-danger"}`} id="recipient-name"/>
                <p className='text-danger'>{invoiceItemsFormik.touched.description && invoiceItemsFormik.errors.description}</p>
              
              </div>
              <div class="form-group px-2">
                <label for="recipient-name" class="col-form-label">Quantity:</label>
                <input type="number" name='quantity' value={invoiceItemsFormik.values.quantity} onChange={(e)=>invoiceItemsFormik.handleChange(e)} className={`form-control ${invoiceItemsFormik.errors.quantity && invoiceItemsFormik.touched.quantity && "border-danger"}`} id="recipient-name"/>
                <p className='text-danger'>{invoiceItemsFormik.touched.quantity && invoiceItemsFormik.errors.quantity}</p>
              
              </div>
              <div class="form-group px-2">
                <label for="recipient-name" class="col-form-label">Gst Rate*:</label>
                <input type="number" name='gstRate' value={invoiceItemsFormik.values.gstRate} onChange={(e)=>invoiceItemsFormik.handleChange(e)} className={`form-control ${invoiceItemsFormik.errors.gstRate && invoiceItemsFormik.touched.gstRate && "border-danger"}`} id="recipient-name"/>
                <p className='text-danger'>{invoiceItemsFormik.touched.gstRate && invoiceItemsFormik.errors.gstRate}</p>
              
              </div>
              <div class="form-group px-2">
                <label for="recipient-name" class="col-form-label">Amount*:</label>
                <input type="number" name='amt' value={invoiceItemsFormik.values.amt} onChange={(e)=>invoiceItemsFormik.handleChange(e)} className={`form-control ${invoiceItemsFormik.errors.amt && invoiceItemsFormik.touched.amt && "border-danger"}`} id="recipient-name"/>
                <p className='text-danger'>{invoiceItemsFormik.touched.amt && invoiceItemsFormik.errors.amt}</p>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button onClick={()=>onHide()} type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            <button onClick={invoiceItemsFormik.handleSubmit} type="button" class="btn btn-primary">Add</button>
          </div>
        </div>
    </Modal>
        </div>
        </div>
  )
}
