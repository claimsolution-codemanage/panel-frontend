import { useEffect, useState } from "react"
import { allState } from "../../utils/constant"
import { adminGetCaseById } from "../../apis"
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
// import { API_BASE_IMG } from "../../apis"
import { API_BASE_IMG } from "../../apis/upload"
import { useParams } from "react-router-dom"
import { FaCircleArrowDown } from 'react-icons/fa6'
import { LuPcCase } from 'react-icons/lu'
import { CiAlignCenterV, CiEdit } from 'react-icons/ci'
import { FaFilePdf, FaFileImage, FaFileWord } from 'react-icons/fa6'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { RxCrossCircled } from 'react-icons/rx'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdOutlineAddCard } from 'react-icons/md'
import Button from 'react-bootstrap/Button';
import { employeeGetCaseById,employeeChangeCaseStatus } from "../../apis"
import { getFormateDMYDate } from "../../utils/helperFunction"
import Loader from "../../components/Common/loader"
import { AppContext } from "../../App"
import { useContext } from "react"
import { IoMdAdd } from 'react-icons/io'
import AddCaseCommit from "../../components/Common/addCaseCommit"
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import { employeeAddCaseComment } from "../../apis"
import ViewDocs from "../../components/Common/ViewDocs"

export default function EmployeeViewCase() {
    const state = useContext(AppContext)
    const empType  = state?.myAppData?.details?.empType
    const [data, setData] = useState([])
    const [viewDocs, setViewDocs] = useState({ status: false, details: {} })
    const [caseCommitModal,setCaseCommitModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
    const navigate = useNavigate()
    const param = useParams()

    // console.log("param", param);

    const getCaseById = async () => {
        setLoading(true)
        try {
            const res = await employeeGetCaseById(param?._id)
            // console.log("case", res?.data?.data);
            if (res?.data?.success && res?.data?.data) {

                setData([res?.data?.data])
                setLoading(false)

            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setLoading(false)
            } else {
                toast.error("Something went wrong")
                setLoading(false)
            }

            // console.log("case error", error);
        }
    }

    useEffect(() => {
        if (param?._id) {
            getCaseById()
        }
    }, [param, changeStatus,caseCommitModal])

    // console.log(data);
    return (<>
     {loading?<Loader/> :
        <div>
            {viewDocs?.status ? <ViewDocs hide={() => setViewDocs({ status: false, details: {} })} details={viewDocs} type="View Case Doc" /> :
            <>
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
                    <div className="d-flex flex align-items-center gap-1">
                        <span>View Cases</span>
                        {/* <span><LuPcCase /></span> */}
                    </div>
                </div>

            {/* {empType?.toLowerCase()=="operation" && 
                <div className="d-flex">
                    <div className="d-flex gap-1 btn" onClick={() => setChangeStatus({ status: true, details: { ...data[0] } })}>
                        <span><CiEdit /></span>
                       
                    </div>
                </div>} */}


            </div>
            <div className=" m-5">
                <div className="container-fluid color-4 p-0">
                    <div className="">
                        <div>
                            <div className="">
                                <div className="">
                                    <div className="bg-color-1 my-3 p-2 p-md-5 rounded-2 shadow">
                                        <div className="border-3 border-primary border-bottom mb-5">
                                            <h6 className="text-primary text-capitalize text-center fs-3">{data[0]?.caseFrom}</h6></div>
                                        <div className="row">
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Case From</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.caseFrom}</p>
                                            </div>
                                            {data[0]?.caseFrom == "partner" &&
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Partner Name</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.partnerName}</p>
                                                </div>
                                            }
                                            {data[0]?.consultantCode &&  <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Consultant Code</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.consultantCode}</p>
                                            </div>}

                                        </div>
                                    </div>
                                    <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                    <div className="border-3 border-primary border-bottom mb-5">
                                        <div className="d-flex gap-2 align-items-center justify-content-between">
                                            <h6 className="text-primary text-center fs-3">Case Details</h6>
                                            {empType?.toLowerCase()=="operation" &&  <Link to={`/employee/edit-case/${data[0]?._id}`} className="btn btn-primary">Edit/ Update</Link>}
                                        </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Case Date</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.createdAt && new Date(data[0]?.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">File No.</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.fileNo}</p>
                                            </div>
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">Current Status</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.currentStatus}</p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Name</h6>
                                                <p className="h6 text-capitalize">{data[0]?.name}</p>
                                            </div>
                                            <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">Father's Name</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.fatherName}</p>
                                            </div>
                                            <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">Email</h6>
                                                <p className=" h6 ">{data[0]?.email}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Mobile No</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.mobileNo}</p>
                                            </div>
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">DOB</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.DOB && getFormateDMYDate(data[0]?.DOB)}</p>
                                            </div>
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Insurance Company</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.insuranceCompanyName}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">Policy No.</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.policyNo}</p>
                                            </div>
                                            <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Policy Type</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.policyType}</p>
                                            </div>
                                            <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Complaint Type</h6>
                                                <p className=" h6 ">{data[0]?.complaintType}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Claim Amount</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.claimAmount}</p>
                                            </div>

                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">Address</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.address}</p>
                                            </div>
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">City</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.city}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">State</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.state}</p>
                                            </div>
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                <h6 className="fw-bold">Pincode</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.pinCode}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <h6 className="fw-bold">Problem Statement</h6>
                                                <p className=" h6">{data[0]?.problemStatement}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {data[0]?.caseDocs?.length > 0 &&
                                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                            <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                <div className="text-primary text-center fs-4">Document List</div>
                                            </div>

                                            <div className="d-flex flex-wrap  gap-5 px-5  align-items-center">
                                                            {data[0]?.caseDocs.map(item =>
                                                                <>{item?.docType == "image" ?
                                                                    <div onClick={() => setViewDocs({ status: true, details: item })} style={{ cursor: "pointer" }} className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                                                        <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                                                            <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                                                {item?.docType == "image" ? <FaFileImage /> : (item?.docType == "pdf" ? <FaFilePdf /> : <FaFileWord />)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                                            <p className="text-center text-nowrap fs-5 text-capitalize">{item?.docName}</p>
                                                                            {/* <span onClick={()=>setViewDocs({status:true,details:item})} style={{ cursor: "pointer" }}><FaEye/></span><span style={{ cursor: "pointer" }}><IoCloudDownloadOutline/></span> */}
                                                                        </div>
                                                                    </div>
                                                                    : <Link to={`${API_BASE_IMG}/${encodeURIComponent(item?.docURL)}`} target="_blank" style={{ cursor: "pointer" }} className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                                                        <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                                                            <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                                                {item?.docType == "image" ? <FaFileImage /> : (item?.docType == "pdf" ? <FaFilePdf /> : <FaFileWord />)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                                            <p className="fs-5 text-break text-capitalize text-center text-wrap">{item?.docName}</p>
                                                                            {/* <span onClick={()=>setViewDocs({status:true,details:item})} style={{ cursor: "pointer" }}><FaEye/></span><span style={{ cursor: "pointer" }}><IoCloudDownloadOutline/></span> */}
                                                                        </div>
                                                                    </Link>} </>
                                                            )}
                                                        </div>
                                        </div>}
       
                                       <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="text-primary text-center fs-4">Case Process</div>
                                                            {empType?.toLowerCase()=="operation" &&   <div className="d-flex gap-1 btn btn-primary"  onClick={() => setChangeStatus({ status: true, details: { ...data[0] } })}>
                                                                <span><CiEdit /></span>
                                                                <div>Add Status</div>
                                                            </div> }
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 rounded-2 shadow">
                                                        <div className="table-responsive">
                                                            <table className="table table-responsive table-borderless">
                                                                <thead className="">
                                                                    <tr className="bg-primary text-white text-center">
                                                                        <th scope="col" className="text-nowrap"><th scope="col" >S.no</th></th>
                                                                        {/* <th scope="col" className="text-nowrap" >Edit</th> */}
                                                                        <th scope="col" className="text-nowrap">Date</th>
                                                                        <th scope="col" className="text-nowrap">Status</th>
                                                                        <th scope="col" className="text-nowrap" >Marked By</th>
                                                                        <th scope="col" className="text-nowrap" >Remark</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data[0]?.processSteps.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                                                        <th scope="row">{ind + 1}</th>
                                                                        {/* <td>
                                                                            <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => setShowEditCaseModal({ status: true, details: { caseId: data[0]?._id, processId: item?._id, caseStatus: item?.status, caseRemark: item?.remark, isCurrentStatus: data[0]?.processSteps.length == ind + 1 } })}><CiEdit /></span>
                                                                        </td> */}
                                                                        <td className="text-nowrap "> {item?.date && <p className="mb-1">{new Date(item?.date).toLocaleDateString()}</p>}</td>
                                                                        <td className="text-nowrap ">{item?.status && <p className={`mb-1 badge bg-${item?.status == "reject" || item?.status == "query" ? "danger" : (item?.status == "pending" ? "warning" : (item?.status == "resolved" ? "success" : "primary"))}`}>{item?.status}</p>}</td>
                                                                        <td className="text-nowrap "> <p className="mb-1 text-capitalize">{item?.consultant ? item?.consultant : "System"} </p></td>
                                                                        <td className="text-break col-4">{item?.remark && <p className="mb-1 text-center">{item?.remark}</p>}</td>
                                                                        {/* <td className="text-nowrap">{(item?.status!="reject" || item?.status!="resolve")  && <FaCircleArrowDown className="fs-3 text-primary" />}</td> */}
                                                                    </tr>)}
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>
                                                </div>

                                    <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                        <div className="border-3 border-primary border-bottom py-2 mb-5">
                                            <div className="d-flex justify-content-center align-items-center gap-3">
                                            <div className="text-primary text-center fs-4">Case Comment</div>
                                            <div onClick={()=>setCaseCommitModal(true)} className="d-flex justify-content-center align-items-center fs-5 bg-primary text-white" style={{cursor:'pointer',width:"2.5rem",height:"2.5rem",borderRadius:"2.5rem"}}>
                                            <span><IoMdAdd/></span>
                                            </div>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column gap-3">
                                            {data[0]?.caseCommit.map(commit=><div className="w-100">
                                                {/* {console.log(data[0]?._id==commit?._id,data[0]?._id,commit?._id)} */}
                                                <div className={`${state?.myAppData?.details?._id==commit?._id && "float-end"} w-25`}>
                                                <div className={`${state?.myAppData?.details?._id!=commit?._id ? "bg-info  w-auto text-dark" : "bg-primary text-white" } p-2 rounded-3`}>
                                                {commit?.commit}</div>
                                                <p className="badge bg-warning text-dark m-0">{state?.myAppData?.details?._id==commit?._id ? "you" : commit?.name} | {new Date(commit?.Date).toLocaleDateString()}</p>
                                                </div>
                                            </div>)}
                                            
                                           
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>                                            
            </>}
        </div>}
        {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={employeeChangeCaseStatus} role="admin" />}
        {caseCommitModal && <AddCaseCommit show={caseCommitModal} id={param?._id} close={()=>{setCaseCommitModal(false)}} handleCaseCommit={employeeAddCaseComment}/>}
    

    </>)
}