import { useEffect, useState } from "react"
import { allState } from "../../utils/constant"
import { adminGetCaseById } from "../../apis"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { API_BASE_IMG } from "../../apis"
import { useParams } from "react-router-dom"
import { FaCircleArrowDown } from 'react-icons/fa6'
import { LuPcCase } from 'react-icons/lu'
import { CiAlignCenterV, CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { RxCrossCircled } from 'react-icons/rx'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdOutlineAddCard } from 'react-icons/md'
import Button from 'react-bootstrap/Button';
import { employeeGetCaseById,employeeChangeCaseStatus } from "../../apis"
import Loader from "../../components/Common/loader"
import { AppContext } from "../../App"
import { useContext } from "react"
import { IoMdAdd } from 'react-icons/io'
import AddCaseCommit from "../../components/Common/addCaseCommit"
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import { employeeAddCaseComment } from "../../apis"

export default function EmployeeViewCase() {
    const state = useContext(AppContext)
    const empType  = state?.myAppData?.details?.empType
    const [data, setData] = useState([])
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
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
                    <div className="d-flex flex align-items-center gap-1">
                        <span>View Cases</span>
                        {/* <span><LuPcCase /></span> */}
                    </div>
                </div>

            {empType=="assistant" && 
                <div className="d-flex">
                    <div className="d-flex gap-1 btn" onClick={() => setChangeStatus({ status: true, details: { ...data[0] } })}>
                        <span><CiEdit /></span>
                       
                    </div>
                </div>}


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
                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                <h6 className="fw-bold">Consultant Code</h6>
                                                <p className=" h6 text-capitalize">{data[0]?.consultantCode}</p>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                        <div className="border-3 border-primary border-bottom mb-5">
                                            <h6 className="text-primary text-center fs-3">Case Details</h6>
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
                                                <p className=" h6 text-capitalize">{data[0]?.DOB && new Date(data[0]?.DOB).toLocaleDateString()}</p>
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

                                            <div className="d-flex row  gap-0  align-items-center"></div>
                                        </div>}
                                    {/*for complete payment  */}
                                    {data[0]?.acceptPayment && <> {data[0]?.paymentDetails.filter(payment => payment?.completed == true).length > 0 && <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                        <div className="border-3 border-primary border-bottom py-2 mb-5">
                                            <div className="text-primary text-center fs-4">Completed Payment</div>
                                        </div>
                                        <div className="d-flex row  gap-1  align-items-center">
                                            {
                                                data[0]?.paymentDetails.filter(payment => payment?.completed == true).map((duePayment, ind) => <div className="rounded-2 col-12 d-flex flex-column bg-success text-white align-items-center justify-content-center col-md-4 p-sm-1 p-md-3 shadow">
                                                    <div><IoMdCheckmarkCircleOutline className="fs-3" /></div>
                                                    <h3 className="h3">Rs. {duePayment?.caseFees}</h3>
                                                    <p className="text p-0 m-0">Fee Type {duePayment?.typeFees}</p>
                                                    <p className="text p-0 m-0">Mode {duePayment?.mode}</p>
                                                    <p className="text p-0 m-0">On Date {new Date(duePayment?.onDate).toLocaleDateString() }</p>
                                                </div>)
                                            }
                                        </div>
                                    </div>}
                                    </>
                                    }
                                    {/* for due payment */}
                                    {data[0]?.acceptPayment && <>{data[0]?.paymentDetails.filter(payment => payment?.completed == false).length > 0 &&
                                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                            <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                <div className="text-primary text-center fs-4">Due Payment</div>

                                            </div>
                                            {/* {console.log("not complete", data[0]?.paymentDetails.filter(payment => payment?.completed == false))} */}

                                            <div className="d-flex row  gap-1  align-items-center">
                                                {data[0]?.paymentDetails.filter(payment => payment?.completed == false).map((duePayment, ind) => <div className="rounded-2 col-12 d-flex flex-column bg-danger text-white align-items-center justify-content-center col-md-4 p-sm-1 p-md-3 shadow">
                                                    <div><RxCrossCircled className="fs-3" /></div>
                                                    <h3 className="h3">Rs. {duePayment?.caseFees}</h3>
                                                    <p className="text">Fee Type: {duePayment?.typeFees}</p>
                                                </div>)
                                                }
                                            </div>
                                        </div>}
                                    </>}




                                    <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                        <div className="border-3 border-primary border-bottom py-2 mb-5">
                                            <div className="text-primary text-center fs-4">Case Process</div>
                                        </div>
                                        <div className="d-flex flex-column gap-3 align-items-center justify-content-center">

                                            {/* pending */}
                                            {data[0]?.processSteps?.length > 0 &&
                                                data[0]?.processSteps.map(item => <div className="d-flex flex-column align-items-center justify-content-center w-50 bg-color-3 text-white rounded-3 p-4">
                                                    <p className="text-primary text-center mb-1 fs-5 text-capitalize">{item?.status}</p>
                                                    {item?.date && <p className="mb-1">Date: {new Date(item?.date).toLocaleDateString()}</p>}
                                                    {item?.consultant && <p className="mb-1 text-capitalize">Consultant:  {item?.consultant} </p>}
                                                    {item?.remark && <p className="mb-1 text-center">Remark: {item?.remark}</p>}

                                                    {(item?.status != "reject" || item?.status != "resolved") && <FaCircleArrowDown className="fs-3 text-primary" />}
                                                </div>
                                                )}
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
        </div>}
        {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={employeeChangeCaseStatus} role="admin" />}
        {caseCommitModal && <AddCaseCommit show={caseCommitModal} id={param?._id} close={()=>{setCaseCommitModal(false)}} handleCaseCommit={employeeAddCaseComment}/>}
    

    </>)
}