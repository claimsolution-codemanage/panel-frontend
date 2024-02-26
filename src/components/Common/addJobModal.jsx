import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';





export default function AddJobModal({ show,handleJob,close}) {
    const [data,setData] = useState({title:"",experience:"",qualification:"",about:"",requirements:""})
    const [loading,setLoading] = useState(false)

      const handleSaveJob =async()=>{
        // console.log("calling handleSaveJob");
            try {
              setLoading(true)
              const res = await handleJob(data)
              // console.log("handleCaseCommit", res?.data?.data);
              if (res?.data?.success) {
                  setLoading(false)
                  toast.success(res?.data?.message)
                  close()
              }
            } catch (error) {
              if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
              } else {
                toast.error("Something went wrong")
              }
              setLoading(false)
              // console.log("handleCaseCommit", error);
            }
        }
      

      const handleOnchange =(e)=>{
        const {name,value} = e.target
        setData({...data,[name]:value})
      }



    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Add Job</h6>
                    </div>
                    <div className="d-flex flex-column gap-3">
                    <input type="text" name="title" className="form-control" value={data.title} onChange={handleOnchange} placeholder='Title' />
                    <input type="text" name="experience" className="form-control" value={data.experience} onChange={handleOnchange} placeholder='Experience' />
                    <textarea className="form-control" name="qualification" value={data.qualification} onChange={handleOnchange} placeholder="Qualification" rows={3} cols={5} ></textarea>
                    <textarea className="form-control" name="about" value={data.about} onChange={handleOnchange} placeholder="About" rows={3} cols={5} ></textarea>
                    <textarea className="form-control" name="requirements" value={data.requirements} onChange={handleOnchange} placeholder="Requirements" rows={3} cols={5} ></textarea>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={handleSaveJob}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add</span>}
                    </Button>
                </div>
                {/* <Button className='' onClick={handleShare}><IoIosShareAlt /> Share</Button> */}
                <Button onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}