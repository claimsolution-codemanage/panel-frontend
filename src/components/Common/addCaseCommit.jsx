import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io'
import { adminGetAllEmployee } from '../../apis';
import HashLoader from "react-spinners/HashLoader";
import { IoIosShareAlt } from "react-icons/io";




export default function AddCaseCommit({ show,handleCaseCommit,close,id }) {
    const [data,setData] = useState({_id:id,Comment:""})
    const [commitLoading,setCommitLoading] = useState(false)

      const handleCommit =async()=>{
        // console.log("calling handleCommit");
        if(data?.Comment?.length>=3){
            try {
              setCommitLoading(true)
              const res = await handleCaseCommit(data)
            //   console.log("handleCaseCommit", res?.data?.data);
              if (res?.data?.success) {
                  setCommitLoading(false)
                  toast.success(res?.data?.message)
                  close()
              }
            } catch (error) {
              if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
              } else {
                toast.error("Something went wrong")
              }
              setCommitLoading(false)
            //   console.log("handleCaseCommit", error);
            }
        }else{
            // console.log("Comment else",data);
        }

      }



    return (
        <Modal
            show={show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Case Comment</h6>
                    </div>
                    <div className="mb-3 col-12">
                        <textarea className="form-control" name="remark" value={data.Comment} onChange={(e)=>setData({...data,Comment:e.target.value})} placeholder="Case Comment..." rows={5} cols={5} ></textarea>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button disabled={commitLoading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${commitLoading && "disabled"}`} onClick={handleCommit}>
                        {commitLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span> Commit</span>}
                    </Button>
                </div>
                {/* <Button className='' onClick={handleShare}><IoIosShareAlt /> Share</Button> */}
                <Button onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}