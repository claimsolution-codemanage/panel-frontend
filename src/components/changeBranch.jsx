import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';




export default function ChangeBranch({ branch,onBranchChange,type,handleBranch}) {
    const [error,setError] = useState("")

    const close =()=>{
        onBranchChange({loading:false,branchId:null,status:false,_id:null})
    }

      const handleUserBranch =async()=>{
        if(branch?.branchId){
            try {
              onBranchChange({...branch,loading:true,})
              const res = await handleBranch({_id:branch?._id,branchId:branch?.branchId,type:type})
              if (res?.data?.success) {
                  toast.success(res?.data?.message)
                  close()
              }
            } catch (error) {
              if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
              } else {
                toast.error("Something went wrong")
              }
              onBranchChange({...branch,loading:false,})
            }
        }else{
            setError("Please enter branch Id")
        }
      }

    useEffect(()=>{
        if(branch?.branchId){
            setError("")
        }else{setError("Please enter branch Id")}
    },[branch?.branchId])


    return (
        <Modal
            show={branch?.status}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Change Branch</h6>
                    </div>
                    <div className="mb-3 col-12">
                        <input className="form-control" name="remark" value={branch?.branchId} onChange={(e)=>onBranchChange({...branch,branchId:e.target.value})} placeholder="Enter Branch ID" />
                        <p className='text-danger'>{error}</p>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button disabled={branch?.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${branch?.loading && "disabled"}`} onClick={handleUserBranch}>
                        {branch?.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save</span>}
                    </Button>
                </div>
                <Button className={`${branch?.loading && "disabled"}}`} onClick={()=>!branch?.loading &&  close()}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}