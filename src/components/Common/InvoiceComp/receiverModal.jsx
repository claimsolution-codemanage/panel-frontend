import Modal from 'react-bootstrap/Modal';
import { allStateOptions } from '../../../utils/constant';
import { useState } from 'react';
import { toast } from 'react-toastify';
import FormInputField from '../form/FormInput';
import FormSelectField from '../form/FormSelectField';
import FormNumberInputField from '../form/FormNumberInputField';
import { useSearchParams } from 'react-router-dom';

export default function ReceiverModal({ show, onHide, formik, onSave,fileDetailApi }) {
    const [search,setSearch] = useState(false)
    const [searchParams,setSearchParams] =useSearchParams()

const handleSearch = async()=>{
  if(formik.values?.fileNo){
    try {
      setSearch(true)
       const res = await fileDetailApi(formik.values?.fileNo)
       const data = res?.data?.data?.[0]
       if(data){
        const {email="",name="",mobileNo="",address="",pinCode="",city="",state="",clientObjId="",_id=""} = data
        formik.setFieldValue("email",email)
        formik.setFieldValue("name",name)
        formik.setFieldValue("mobileNo",mobileNo)
        formik.setFieldValue("address",address)
        formik.setFieldValue("pinCode",pinCode)
        formik.setFieldValue("city",city)
        formik.setFieldValue("state",state)
         if (clientObjId && _id) {
           setSearchParams({ clientId:clientObjId,caseId: _id })
         }
        toast.success("Success")
       }
      setSearch(false)
    } catch (error) {
      console.log("error", error);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Failed to download")
      }
      setSearch(false)      
    }
  }
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
              <div className='row row-cols-12 row-cols-2 p-2'>
                <FormInputField name="name" type="text" label="Name*:" formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                <FormInputField name="email" type="text" label="Email:" formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                {/* <FormInputField name="mobileNo" type="text" label="Mobile No:" formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} /> */}
                <FormNumberInputField name="mobileNo" type="text" label="Mobile No:" digit={10} formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                <FormInputField name="gstNo" type="text" label="Gst No:" formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                <FormInputField name="panNo" type="text" label="PAN No:" formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                <FormInputField name="address" type="text" label="Address*:" formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                <FormSelectField name="state" label="State" options={allStateOptions} formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                <FormNumberInputField name="pinCode" type="text" label="PinCode*:" digit={6} formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                  <div className='d-flex w-100 align-items-center gap-2'>
                    <FormNumberInputField name="fileNo" type="text" label="File No:" digit={20} formik={formik} handleOnChange={(e, name) => formik?.handleChange(e)} />
                    <button type='button' className='btn btn-sm btn-primary' disabled={search || !formik.values?.fileNo?.trim()}  onClick={handleSearch}>Search</button>
                  </div>
              </div>
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
