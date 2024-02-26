import { useEffect, useState } from "react"
import { allState } from "../../utils/constant"
import { adminGetCaseById } from "../../apis"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
// import { API_BASE_IMG } from "../../apis"
import { useParams } from "react-router-dom"
import { FaCircleArrowDown } from 'react-icons/fa6'
import { LuPcCase } from 'react-icons/lu'
import { CiAlignCenterV, CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { RxCrossCircled } from 'react-icons/rx'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdOutlineAddCard } from 'react-icons/md'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { adminAddClientPayment, adminUpdateClientCaseFee, adminChangeCaseStatus, adminAddCaseCommit } from "../../apis"
import { formatDateToISO } from "../../utils/helperFunction"
import Loader from "../../components/Common/loader"
import AddCaseModal from "../../components/Common/addCaseCommit"
import AddCaseCommit from "../../components/Common/addCaseCommit"
import { IoMdAdd } from 'react-icons/io'
import { useContext } from "react"
import { AppContext } from "../../App"
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import { FaFilePdf, FaFileImage, FaFileWord } from 'react-icons/fa6'
import ViewDocs from "../../components/Common/ViewDocs"
import { Link } from "react-router-dom"
import { adminAddCaseReference } from "../../apis"
import AddReferenceModal from "../../components/Common/addReferenceModal"
import { API_BASE_IMG } from "../../apis/upload"
import EditCaseStatusModal from "../../components/Common/EditCaseStatus"
import { adminEditCaseProcessById } from "../../apis"
import {getFormateDMYDate} from "../../utils/helperFunction"

export default function AdminViewCase() {
    const [data, setData] = useState([])
    const state = useContext(AppContext)
    const [addCaseReference, setAddCaseReference] = useState({ show: false, _id: "" })
    const [loading, setLoading] = useState(false)
    const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
    const [addClientpayment, setAddClientPayment] = useState({ status: false, loading: false, _id: "", data: { typeFees: "", caseFees: "", } })
    const [clearClientpayment, setClearClientPayment] = useState({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
    const [caseCommitModal, setCaseCommitModal] = useState(false)
    const [viewDocs, setViewDocs] = useState({ status: false, details: {} })
    const [showEditCaseModal,setShowEditCaseModal] = useState({status:false,details:{}})
    const navigate = useNavigate()
    const param = useParams()

    // console.log("param", param);

    const getCaseById = async () => {
        setLoading(true)
        try {
            const res = await adminGetCaseById(param?._id)
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
        if (param?._id ||!showEditCaseModal.status) {
            getCaseById()
        }
    }, [param, changeStatus, caseCommitModal,showEditCaseModal, addCaseReference])

    const handleAddPayment = async () => {
        setAddClientPayment({ ...addClientpayment, loading: true })
        try {
            const res = await adminAddClientPayment(addClientpayment._id, addClientpayment.data)
            // console.log("case", res?.data);
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setAddClientPayment({ ...addClientpayment, status: false, loading: false })
                getCaseById()
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setAddClientPayment({ ...addClientpayment, status: false, loading: false })
            } else {
                toast.error("Something went wrong")
                setAddClientPayment({ ...addClientpayment, status: false, loading: false })
            }

            // console.log("add payment error", error);
        }
    }

    const handleClearClientPayment = async () => {
        // console.log("clear payment handler", clearClientpayment);
        setClearClientPayment({ ...clearClientpayment, loading: true })
        try {
            const res = await adminUpdateClientCaseFee(clearClientpayment.data)
            // console.log("case", res?.data);
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
                getCaseById()
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
            } else {
                toast.error("Something went wrong")
                setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
            }

            // console.log("case error", error);
        }
    }

    // console.log("clearpayment", clearClientpayment, state?.myAppData?.details?._id);
    // console.log(data);
    return (<>
        {loading ? <Loader /> :
            <div>
                {viewDocs?.status ? <ViewDocs hide={() => setViewDocs({ status: false, details: {} })} details={viewDocs} type="View Case Doc" /> :
                    <div>
                        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                            <div className="d-flex flex align-items-center gap-3">
                                <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
                                <div className="d-flex flex align-items-center gap-1">
                                    <span>View Cases</span>
                                    {/* <span><LuPcCase /></span> */}
                                </div>
                            </div>

                            {/* <div className="d-flex">
                                <div className="d-flex gap-1 btn" onClick={() => setChangeStatus({ status: true, details: { ...data[0] } })}>
                                    <span><CiEdit /></span>
                                   
                                </div>
                            </div> */}


                        </div>
                        <div className=" m-md-5">
                            <div className="container-fluid color-4 p-0">
                                <div className="">
                                    <div>
                                        <div className="">
                                            <div className="">
                                                <div className="bg-color-1 my-3 p-2 p-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom mb-5">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                        <h6 className="text-primary text-capitalize text-center fs-3">{data[0]?.caseFrom}</h6>
                                                          <Link to={data[0]?.caseFrom == "partner" ? `/admin/partner%20details/${data[0]?.partnerId}` : `/admin/client%20details/${data[0]?.clientId}`} className="btn btn-primary">View</Link>          
                                                        </div>
                                                        </div>
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
                                                        {data[0]?.caseFrom == "partner" &&
                                                            <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-12">
                                                                <h6 className="fw-bold">Mapping Id</h6>
                                                                <p className=" h6 text-break">partnerId={data[0]?.partnerId}&partnerCaseId={data[0]?._id}</p>
                                                            </div>
                                                        }
                                                        

                                                    </div>
                                                </div>
                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom mb-5">
                                                        <div className="d-flex gap-2 align-items-center justify-content-between">
                                                            <h6 className="text-primary text-center fs-3">Case Details</h6>
                                                            <div className="d-flex gap-2">
                                                                <Link to={`/admin/edit%20case/${data[0]?._id}`} className="btn btn-primary">Edit/Update</Link>
                                                                {data[0]?.caseFrom != "partner" && <button className="btn btn-success text-white" onClick={() => setAddCaseReference({ show: true, _id: data[0]?._id })}>Add Reference</button>}
                                                            </div>
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
                                                            <p className=" h6 text-capitalize">{data[0]?.DOB && getFormateDMYDate(data[0]?.DOB) }</p>
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
                                                                            <p className="text-center text-nowrap fs-5 text-capitalize">{item?.docName}</p>
                                                                            {/* <span onClick={()=>setViewDocs({status:true,details:item})} style={{ cursor: "pointer" }}><FaEye/></span><span style={{ cursor: "pointer" }}><IoCloudDownloadOutline/></span> */}
                                                                        </div>
                                                                    </Link>} </>
                                                            )}
                                                        </div>

                                                        <div className="d-flex row  gap-0  align-items-center"></div>
                                                    </div>}
                                                {/*for complete payment  */}
                                                {/* {data[0]?.acceptPayment && <> {data[0]?.paymentDetails.filter(payment => payment?.completed == true).length > 0 && <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
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
                                                                <p className="text p-0 m-0">On Date {new Date(duePayment?.onDate).toLocaleDateString()}</p>
                                                            </div>)
                                                        }
                                                    </div>
                                                </div>}
                                                </>
                                                } */}
                                                {/* for due payment */}
                                                {/* {data[0]?.acceptPayment && <>{data[0]?.paymentDetails.filter(payment => payment?.completed == false).length > 0 &&
                                                    <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                        <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                            <div className="text-primary text-center fs-4">Due Payment</div>

                                                        </div>
                                                        {console.log("not complete", data[0]?.paymentDetails.filter(payment => payment?.completed == false))}

                                                        <div className="d-flex row  gap-1  align-items-center">
                                                            {data[0]?.paymentDetails.filter(payment => payment?.completed == false).map((duePayment, ind) => <div className="rounded-2 col-12 d-flex flex-column bg-danger text-white align-items-center justify-content-center col-md-4 p-sm-1 p-md-3 shadow">
                                                                <div><RxCrossCircled className="fs-3" /></div>
                                                                <h3 className="h3">Rs. {duePayment?.caseFees}</h3>
                                                                <p className="text">Fee Type {duePayment?.typeFees}</p>
                                                                <button className="btn btn-primary" onClick={() => setClearClientPayment({ status: true, loading: false, payment: duePayment?.caseFees, feeType: duePayment?.typeFees, data: { _id: data[0]?._id, paymentId: duePayment?._id, paymentMode: "" } })}>Pay Now</button>
                                                            </div>)
                                                            }
                                                        </div>
                                                    </div>}
                                                </>} */}




                                                {/* <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="text-primary text-center fs-4">Case Process</div>
                                                    </div>
                                                    <div className="d-flex flex-column gap-3 align-items-center justify-content-center">

                                                    
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

                                                </div> */}

                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="d-flex justify-content-between">
                                                        <div className="text-primary text-center fs-4">Case Process</div>
                                                        <div className="d-flex gap-1 btn btn-primary" onClick={() => setChangeStatus({ status: true, details: { ...data[0] } })}>
                                                            <span><CiEdit /></span>
                                                            <div>Add Status</div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 rounded-2 shadow">
                                                        <div className="table-responsive">
                                                            <table className="table table-responsive table-borderless">
                                                                <thead className="">
                                                                    <tr className="bg-primary text-white text-center">
                                                                        <th scope="col" className="text-nowrap"><th scope="col" >S.no</th></th>
                                                                        <th scope="col" className="text-nowrap" >Edit</th>
                                                                        <th scope="col" className="text-nowrap">Date</th>
                                                                        <th scope="col" className="text-nowrap">Status</th>
                                                                        <th scope="col" className="text-nowrap" >Marked By</th>
                                                                        <th scope="col" className="text-nowrap" >Remark</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data[0]?.processSteps.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                                                        <th scope="row">{ind + 1}</th>
                                                                        <td>
                                                                        <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => setShowEditCaseModal({status:true,details:{caseId:data[0]?._id,processId:item?._id,caseStatus:item?.status,caseRemark:item?.remark,isCurrentStatus:data[0]?.processSteps.length==ind+1}})}><CiEdit /></span>
                                                                        </td>
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
                                                            <div onClick={() => setCaseCommitModal(true)} className="d-flex justify-content-center align-items-center fs-5 bg-primary text-white" style={{ cursor: 'pointer', width: "2.5rem", height: "2.5rem", borderRadius: "2.5rem" }}>
                                                                <span><IoMdAdd /></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column gap-3">
                                                        {data[0]?.caseCommit.map(commit => <div className="w-100">
                                                            {/* {console.log(data[0]?._id == commit?._id, data[0]?._id, commit?._id)} */}
                                                            <div className={`${state?.myAppData?.details?._id == commit?._id && "float-end"} w-25`}>
                                                                <div className={`${state?.myAppData?.details?._id != commit?._id ? "bg-info  w-auto text-dark" : "bg-primary text-white"} p-2 rounded-3`}>
                                                                    {commit?.commit}</div>
                                                                <p className="badge bg-warning text-dark m-0">{state?.myAppData?.details?._id == commit?._id ? "you" : commit?.name} | {new Date(commit?.Date).toLocaleDateString()}</p>
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
                    {/* {console.log("showEditCaseModal",showEditCaseModal)} */}
                {showEditCaseModal?.status && <EditCaseStatusModal changeStatus={showEditCaseModal} setChangeStatus={setShowEditCaseModal} handleCaseStatus={adminEditCaseProcessById} role="admin" />}
                {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={adminChangeCaseStatus} role="admin" />}
                {
                    addClientpayment && <Modal
                        show={addClientpayment?.status}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        className="p-5"
                    >
                        <Modal.Body className='color-4'>
                            <div className="border-3 border-primary border-bottom py-2 mb-2">
                                <div className="text-primary text-center fs-4">Add Payment</div>
                            </div>
                            <div className="my-3">
                                <label htmlFor="typeFees" className="form-label">Fees Type</label>
                                <input type="text" name="typeFees" value={addClientpayment?.data?.typeFees} onChange={(e) => setAddClientPayment({ ...addClientpayment, data: { ...addClientpayment.data, typeFees: e?.target?.value } })} className="form-control" />
                            </div>
                            <div className="my-3">
                                <label htmlFor="caseFees" className="form-label">Case Fees</label>
                                <input type="number" name="caseFees" value={addClientpayment?.data?.caseFees} onChange={(e) => setAddClientPayment({ ...addClientpayment, data: { ...addClientpayment.data, caseFees: e?.target?.value } })} className="form-control" />
                            </div>

                            <div className="d-flex gap-1 flex-reverse">
                                <div className="d-flex  justify-content-center">
                                    <div aria-disabled={addClientpayment.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${addClientpayment.loading
                                        && "disabled"}`} onClick={handleAddPayment}>
                                        {addClientpayment.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add Payment </span>}
                                    </div>
                                </div>
                                <Button onClick={() => setAddClientPayment({ status: false, loading: false, _id: "", data: { typeFees: "", caseFees: "", } })}>Close</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                }

                {/* for clear case payment */}
                <Modal
                    show={clearClientpayment.status}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="p-5"
                >
                    <Modal.Body className='color-4'>
                        <div className="border-3 border-primary border-bottom py-2 mb-2">
                            <div className="text-primary text-center fs-4">Clear Payment</div>
                        </div>
                        <div className="my-2 text-primary text-center">Fee Type: {clearClientpayment?.feeType}</div>
                        <div className="mb-3 col-12">
                            <label for="paymentMode" className="form-label">Payment mode</label>
                            <select className="form-select w-100" name="paymentMode" value={clearClientpayment.data.paymentMode} onChange={(e) => setClearClientPayment({ ...clearClientpayment, data: { ...clearClientpayment.data, paymentMode: e.target.value } })} >
                                <option value="">--select payment mode</option>
                                <option value="Cash">Cash</option>
                                <option value="paytm">paytm</option>
                                <option value="PhonePay">PhonePay</option>
                                <option value="gpay">GPay</option>
                                <option value="Online">Online</option>
                                <option value="Others">Others</option>

                            </select>
                        </div>

                        <div className="d-flex gap-1 flex-reverse">
                            <div className="d-flex  justify-content-center">
                                <div aria-disabled={clearClientpayment.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${clearClientpayment.loading
                                    && "disabled"}`} onClick={handleClearClientPayment}>
                                    {clearClientpayment.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Clear Rs.{clearClientpayment?.payment} </span>}
                                </div>
                            </div>
                            <Button onClick={() => setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })}>Close</Button>

                        </div>

                    </Modal.Body>
                </Modal>
                {/* {console.log("addCaseReference", addCaseReference)} */}
                {caseCommitModal && <AddCaseCommit show={caseCommitModal} id={param?._id} close={() => { setCaseCommitModal(false) }} handleCaseCommit={adminAddCaseCommit} />}
                {addCaseReference?.show && <AddReferenceModal showAddCaseReference={addCaseReference} hide={() => setAddCaseReference({ show: false, _id: "" })} addReferenceCase={adminAddCaseReference} />}
            </div>}
    </>)
}