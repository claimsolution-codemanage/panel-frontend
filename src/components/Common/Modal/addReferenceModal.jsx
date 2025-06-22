import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {toast} from 'react-toastify'
import { useFormik } from 'formik';
import * as yup from 'yup'

export default function AddReferenceModal({showAddCaseReference,hide,addReferenceCase,getCaseById}) {
    const [loading,setLoading] = useState(false)


const caseReferenceFormik = useFormik({
    initialValues:{
        referenceId:""
    },
    validationSchema:yup.object().shape({
        referenceId: yup.string().required("Please enter case reference Id"),}),
    onSubmit:async(values)=>{
        try {
            setLoading(true)
            const res = await addReferenceCase(`clientCaseId=${showAddCaseReference?._id}&${values?.referenceId}`)
            if(res?.status==200 && res?.data?.success){
                caseReferenceFormik.resetForm()
                hide()
                toast.success(res?.data?.message)
                setLoading(false)
                if(getCaseById){ getCaseById()}
            }
        } catch (error) {
            if(error && error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error("Failed to add reference")
            }
                // console.log("Failed to add reference error",error);
                setLoading(false)
        }
    }
    
})


  return (
    <div>
    <Modal
      show={showAddCaseReference?.show}
      size="md"
      className='text-center'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
        <form onSubmit={caseReferenceFormik?.handleSubmit}>
      <Modal.Body>
        <h4 className='text-danger py-3 fs-3'>Are You Sure ?</h4>
        <p className='text-primary fs-5'>
            Your want to add Reference in this case. 
        </p>
        <input className='form-control w-75 mx-auto' placeholder='Case reference Id' value={caseReferenceFormik?.values?.referenceId} name='referenceId' onChange={caseReferenceFormik.handleChange}/>
        <p className='text-danger fw-bold'>{caseReferenceFormik?.touched?.referenceId && caseReferenceFormik?.errors?.referenceId}</p>
      </Modal.Body>
      <Modal.Footer>
        {loading ? 
        <Button disabled={loading} className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></Button>
        :<Button type='submit' disabled={loading}>Add</Button>
    } 
        <Button onClick={hide} disabled={loading}>Close</Button>
      </Modal.Footer>
        </form>
    </Modal>

    </div>
  )
}

