import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';




export default function AddEmpRefModal({ empRef,onChangeEmpRef,handleApi,}) {
    const [empDetail,setEmpDetails] = useState({loading:false,empEmail:null})

    const close =()=>{
        onChangeEmpRef({partnerId:null,status:false})
    }

      const handleEmpToPartner =async()=>{
            try {
              setEmpDetails({...empDetail,loading:true,})
              const res = await handleApi({empEmail:empDetail?.empEmail?.trim(),partnerId:empRef?.partnerId})
              if (res?.data?.success) {
                  toast.success(res?.data?.message)
                  close()
              }
            } catch (error) {
                console.log(error);
              if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
              } else {
                toast.error("Something went wrong")
              }
              setEmpDetails({...empDetail,loading:false,})
            }
      }




    return (
        <Modal
            show={empRef?.status}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Add Emp Reference</h6>
                    </div>
                    <div className="mb-3 col-12">
                        <input type='text' className="form-control" name="empDetail" value={empDetail?.empEmail || ""} onChange={(e)=>setEmpDetails({...empDetail,empEmail:e.target.value})} placeholder="Enter employee email" />
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button disabled={empDetail.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${empDetail.loading && "disabled"}`} onClick={handleEmpToPartner}>
                        {empDetail.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save</span>}
                    </Button>
                </div>
                <Button className={`${empDetail.loading && "disabled"}}`} onClick={()=>!empDetail.loading &&  close()}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}