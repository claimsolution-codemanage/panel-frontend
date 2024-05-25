
import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { CiEdit } from 'react-icons/ci'
import { LuPcCase } from 'react-icons/lu'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useNavigate } from "react-router-dom"
import AddJobModal from "../../components/Common/addJobModal"
import { adminAddJob,viewAllJob,adminRemoveJobById } from "../../apis"
import {MdOutlineDelete} from 'react-icons/md'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Loader from "../../components/Common/loader"
 
export default function AdminAllJobs() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [showJobModal,setShowModal] = useState(false)
  const [showJobRemoveModal,setJobRemoveModal] = useState({status:false,loading:false,id:""})


  const getAllJob =async()=>{
    setLoading(true)
    try {
      const res = await viewAllJob()
    //   console.log("viewAllJob", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data])
        setLoading(false)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    //   console.log("viewAllJob error", error);
    }
  }

  useEffect(() => {
        getAllJob()
  }, [showJobModal])

//   console.log("data",data);

  const handleDeleteJob =async()=>{
    // console.log("showmodal",showJobRemoveModal);
    setJobRemoveModal({...showJobRemoveModal,loading:true})
    try {
      const res = await adminRemoveJobById(showJobRemoveModal?.id)
      if (res?.data?.success) {
        setJobRemoveModal({status:false,loading:false,id:""})
        getAllJob()
        toast.success(res?.data?.message)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      setJobRemoveModal({status:false,loading:false,id:""})
    //   console.log("viewAllJob error", error);
    }

  }

  return (<>
        {loading ? <Loader /> :
            <div className="">
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
                    <div className="d-flex flex align-items-center gap-1">
                        <span>My Jobs</span>
                        {/* <span><LuPcCase /></span> */}
                    </div>
                </div>

                <div className="d-flex">
                    <div className="d-flex gap-1 btn" onClick={() =>setShowModal(true)}>
                        <span><CiEdit /></span>
                 
                    </div>
                </div>


            </div>
                <div className="row m-sm-0 m-md-5 py-4">
                    <div className="col-12 p-0">
                        <div className="color-4 mx-auto">
                            <div className="align-items-center bg-color-1 p-5 rounded-2 row shadow m-0">
                                <div className="border-3 border-primary border-bottom  mb-4">
                                    <h6 className="text-primary text-center h3">All Job</h6>
                                </div>
                                <div className="row">
                                    {data?.map(job=><div className="col-12 col-md-4 h-auto">
                                    <div className=" bg-color-7 rounded-2 shadow p-3 mb-4 h-100">
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                    <h6 className="fs-4 my-3 text-capitalize text-center text-decoration-underline text-primary">{job?.title}</h6>
                                        <span onClick={()=>setJobRemoveModal({status:true,loading:false,id:job?._id})} className="d-flex justify-content-center align-items-center bg-danger text-white " style={{width:'2rem',cursor:'pointer', height:'2rem', borderRadius:'2rem'}}><MdOutlineDelete/></span>
                                        </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">experience</h6>
                                        <p className="fw-lighter">{job?.experience}</p>
                                    </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">qualification</h6>
                                        <p className="fw-lighter">{job?.qualification}</p>
                                    </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">about</h6>
                                        <p className="fw-lighter">{job?.about}</p>
                                    </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">requirements</h6>
                                        <p className="fw-lighter">{job?.requirements}</p>
                                    </div>
                                    </div>
                                    </div>)} 
                                </div>                       
                            </div>
                        </div>
                    </div>
                </div>

                {showJobModal && <AddJobModal show={showJobModal} handleJob={adminAddJob} close={()=>setShowModal(false)}/>}

                <Modal
            show={showJobRemoveModal.status}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Remove Job</h6>
                    </div>

                    <div className="fs-4 text-center">Are you sure?</div>
                  
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button disabled={showJobRemoveModal.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${showJobRemoveModal.loading && "disabled"}`} onClick={handleDeleteJob}>
                        {showJobRemoveModal.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Yes</span>}
                    </Button>
                </div>
                {/* <Button className='' onClick={handleShare}><IoIosShareAlt /> Share</Button> */}
                <Button onClick={()=>setJobRemoveModal({status:false,loading:false,id:""})}>No</Button>
            </Modal.Footer>
        </Modal>
            </div>}
  </>)
}