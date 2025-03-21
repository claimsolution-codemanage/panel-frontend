import { useEffect, useState } from "react"
import { adminGetCaseById } from "../../apis"
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { IoArrowBackCircleOutline, IoFolder, IoFolderOpenSharp } from 'react-icons/io5'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {  adminUpdateClientCaseFee,} from "../../apis"
import { formatDateToISO } from "../../utils/helperFunction"
import Loader from "../../components/Common/loader"
import AddDocsModal from "../addDocsModal"
import AddCaseCommit from "../../components/Common/addCaseCommit"
import { IoMdAdd } from 'react-icons/io'
import { useContext } from "react"
import { CiEdit } from "react-icons/ci"
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
import { getFormateDMYDate } from "../../utils/helperFunction"
import ConfirmationModal from "../../components/Common/confirmationModal"
import { getCheckStorage } from "../../utils/helperFunction"
import SetStatusOfProfile from "../Common/setStatusModal"
import { LuFileAudio } from "react-icons/lu"
import { CiLock } from "react-icons/ci";
import DocumentPreview from "../DocumentPreview"
import PaymentModal from "../Common/Modal/PaymentModal"
import { useFormik } from "formik"
import * as Yup from "yup";
import GROFormModal from "../Common/CaseStatus/GroModal"
import GroSection from "../Common/ViewCaseSection/GroSection"
import PaymentSection from "../Common/ViewCaseSection/PaymentSection"
import CommentSection from  "../Common/ViewCaseSection/CommentSection"
import StatusSection from "../Common/ViewCaseSection/StatusSection"


export default function ViewCaseComp({ id, getCase, role, attachementUpload, addCaseDoc,
    editUrl, addCaseCommit, viewPartner, viewClient, editCaseProcess, addCaseProcess, addReference,
    deleteReference, deleteDoc, isAddRefence, isAddCaseProcess, isAddCommit,
    isViewProfile, setCaseDocStatus, viewEmp,paymentDetailsApi,accessPayment,isCaseFormAccess,createOrUpdateCaseFormApi
}) {

    const [data, setData] = useState([])
    const [uploadingDocs, setUploadingDocs] = useState(false)
    const state = useContext(AppContext)
    const location = useLocation()
    const [addCaseReference, setAddCaseReference] = useState({ show: false, _id: "" })
    const [loading, setLoading] = useState(false)
    const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
    const [addClientpayment, setAddClientPayment] = useState({ status: false, loading: false, _id: "", data: { typeFees: "", caseFees: "", } })
    const [clearClientpayment, setClearClientPayment] = useState({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
    const [caseCommitModal, setCaseCommitModal] = useState(false)
    const [viewDocs, setViewDocs] = useState({ status: false, details: {} })
    const [showEditCaseModal, setShowEditCaseModal] = useState({ status: false, details: {} })
    const [removeCaseReference, setRemoveCaseReference] = useState({ status: false, type: null, loading: false })
    const [deleteCaseDoc, setDeleteCaseDoc] = useState({ status: false, id: null })
    const [changeisActiveStatus, setChangeIsActiveStatus] = useState({ show: false, details: {} })
    const [paymentModal, setpaymentModal] = useState({save:false,show:false})
    const [folderInfo,setFolderInfo] = useState({})
    const [fileInfo,setFileInfo] = useState({type:null,list:[]})



    const navigate = useNavigate()
    const param = useParams()

    const getCaseById = async () => {
        setLoading(true)
        try {
            const res = await getCase(id)
            if (res?.data?.success && res?.data?.data) {
                setData([res?.data?.data])
                setLoading(false)
                let caseDocs = res?.data?.data?.caseDocs
                if(Array.isArray(caseDocs)){
                    let folder ={}
                    caseDocs?.forEach(ele=>{
                        let type = ele?.name?.toLowerCase() || "other"
                        if(folder[type]){
                            folder[type]=[...folder[type],ele]
                        }else{
                            folder[type]= [ele]
                        }
                    })
                setFolderInfo(folder)
                }
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setLoading(false)
            } else {
                toast.error("Something went wrong")
                setLoading(false)
            }

            console.log("case error", error);
        }
    }


    useEffect(() => {
        if (id && !showEditCaseModal.status && !caseCommitModal && !changeisActiveStatus.show && !addCaseReference.show && !removeCaseReference.status && !deleteCaseDoc?.status && !uploadingDocs) {
            getCaseById()
        }
    }, [id, changeStatus, caseCommitModal, showEditCaseModal, addCaseReference, changeisActiveStatus, removeCaseReference, deleteCaseDoc, uploadingDocs])



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
        }
    }

    const handleRemoveCaseReference = async () => {
        // console.log("handleRemoveCaseReference",data[0]?._id, removeCaseReference?.type);
        
        // return
        if (removeCaseReference?.type) {
            try {
                setRemoveCaseReference({ ...removeCaseReference, loading: true })
                const res = await deleteReference(data[0]?._id, removeCaseReference?.type)
                if (res?.status == 200 && res?.data?.success) {
                    toast.success(res?.data?.message)

                    setRemoveCaseReference({ status: false, type: null, loading: false })
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Failed to remove case reference")
                }
                setRemoveCaseReference({ status: false, type: null, loading: false })
            }
        }
    }

    const commentBy = (comment) => {
        if (role?.toLowerCase() == "employee") {
            return state?.myAppData?.details?._id == comment?.employeeId
        } else {
            return state?.myAppData?.details?._id == comment?.adminId
        }
    }

    const handleChanges = async (_id, status) => {
        try {
            const res = await setCaseDocStatus(_id, status)
            if (res?.data?.success) {
                setChangeIsActiveStatus({ show: false, details: {} })
                toast.success(res?.data?.message)

            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            // console.log("allAdminCase isActive error", error);
        }
    }

    const handleBack = () => {
        if (location?.state?.filter && location?.state?.back) {
            navigate(location?.state?.back, { state: { ...location?.state, back: location?.pathname } });
        } else {
            navigate(-1)
        }
    };

 const handleShareDocument =(type,data)=>{
    const docUrl = getCheckStorage(data?.url)
  if(!docUrl) return
  if(type=="whatsapp"){
    const message = `Document share from ClaimSolution. Check out this document: ${data?.name || "document"}\n${docUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl,"_blank");
  }else if(type=="email"){
    const subject = `Document share from ClaimSolution`;
    const body = `Hi,\n\nCheck out this document: ${data?.name || "document"}\n\nPlease find the document link below:\n${docUrl}\n\nRegards\nClaimSolution`
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(emailUrl,"_blank");
  }
 }


    return (<>
        {loading ? <Loader /> :
            <div>
                {viewDocs?.status ? <ViewDocs hide={() => setViewDocs({ status: false, details: {} })} details={viewDocs} type="View Case Doc" /> :
                    <div>
                        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                            <div className="d-flex flex align-items-center gap-3">
                                <IoArrowBackCircleOutline className="fs-3" onClick={handleBack} style={{ cursor: "pointer" }} />
                                <div className="d-flex flex align-items-center gap-1">
                                    <span>View Case</span>
                                </div>
                            </div>
                        </div>
                        <div className="m-0 m-md-5 p-md-4">
                            <div className="container-fluid color-4 p-0">
                                <div className="">
                                    <div>
                                        <div className="">
                                            <div className="">
                                                {(role?.toLowerCase() !== "client" && role?.toLowerCase() !== "partner") &&
                                                    <div className="bg-color-1 my-3 p-2 p-5 rounded-2 shadow">
                                                        <div className="border-3 border-primary border-bottom mb-5">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h6 className="text-primary text-capitalize text-center fs-3">{data[0]?.caseFrom}</h6>

                                                                {isViewProfile && <Link state={{ filter: location?.state?.filter, back: location?.pathname }} to={data[0]?.caseFrom == "partner" ? `${viewPartner}${data[0]?.partnerId}` : (data[0]?.caseFrom == "client" ? `${viewClient}${data[0]?.clientId}` : `${viewEmp}${data[0]?.empSaleId}`)} className="btn btn-primary">View</Link>}
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
                                                            {data[0]?.consultantCode && <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                                <h6 className="fw-bold">{data[0]?.caseFrom?.toLowerCase() == "client" ? "Customer Code" : "Consultant Code"} </h6>
                                                                <p className=" h6 text-capitalize">{data[0]?.consultantCode}</p>
                                                            </div>}

                                                            {data[0]?.partnerId && <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                                <h6 className="fw-bold">Reference of partner </h6>
                                                                <Link to={`${viewPartner}${data[0]?.partnerId}`} state={{ filter: location?.state?.filter, back: location?.pathname }} className="h6 text-decoration-underline text-capitalize">View</Link>
                                                            </div>}
                                                            {data[0]?.empSaleId && <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                                <h6 className="fw-bold">Reference of employee</h6>
                                                                <Link to={`${viewEmp}${data[0]?.empSaleId}`} state={{ filter: location?.state?.filter, back: location?.pathname }} className="h6 text-decoration-underline text-capitalize">View</Link>
                                                            </div>}

                                                            {data[0]?.caseFrom != "client" &&
                                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-12">
                                                                    <h6 className="fw-bold">Mapping Id</h6>
                                                                    <p className=" h6 text-break">{data[0]?.caseFrom == "partner" ? `partnerId=${data[0]?.partnerId}` : `empSaleId=${data[0]?.empSaleId}`}&{data[0]?.caseFrom == "partner" ? "partnerCaseId" : "empSaleCaseId"}={data[0]?._id}</p>
                                                                </div>
                                                            }


                                                        </div>
                                                    </div>}
                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom mb-5">
                                                        <div className="d-flex gap-2 align-items-center justify-content-between">
                                                            <h6 className="text-primary text-center fs-3">Case Details</h6>
                                                            {editUrl && <div className="d-flex gap-2">
                                                                <Link to={`${editUrl}${data[0]?._id}`} state={{ filter: location?.state?.filter, back: location?.pathname }} className="btn btn-primary">Edit/ Update</Link>

                                                                {isAddRefence && <>

                                                                    {data[0]?.caseFrom == "client" && ((data[0]?.partnerId || data[0]?.partnerReferenceCaseDetails) || (data[0]?.empSaleId || data[0]?.empSaleReferenceCaseDetails)) && <button className="btn btn-warning text-white" onClick={() => setRemoveCaseReference({ ...removeCaseReference, status: true })}>Remove Reference</button>}
                                                                    {data[0]?.caseFrom == "client" && <button className="btn btn-success text-white" onClick={() => setAddCaseReference({ show: true, _id: data[0]?._id })}>Add Reference</button>}
                                                                </>}
                                                            </div>}
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                            <h6 className="fw-bold">Case Date</h6>
                                                            <p className=" h6 text-capitalize">{data[0]?.createdAt && getFormateDMYDate(data[0]?.createdAt)}</p>
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
                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="d-flex gap-3 justify-content-center text-primary text-center fs-4">
                                                             {fileInfo?.type &&  <IoArrowBackCircleOutline className="fs-3" onClick={()=>setFileInfo({type:null,list:[]})} style={{ cursor: "pointer" }} />} 
                                                            <span className="text-capitalize">{fileInfo?.type || "Document List"}</span>
                                                            {(role?.toLowerCase() == "client" || role?.toLowerCase() == "partner") && <div>
                                                                <span onClick={() => setUploadingDocs(true)} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                                                            </div>}
                                                        </div></div>
                                                    <div className="row row-cols-1 row-cols-md-4 align-items-center">

                                                        {fileInfo?.list?.length==0 && Object.keys(folderInfo)?.map(ele=>  <div key={ele} className="p-2">
                                                                <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3 cursor-pointer" onClick={()=>Array.isArray(folderInfo[ele]) && setFileInfo({type:ele,list:folderInfo[ele]})}>
                                                                    <div className="d-flex flex-column justify-content-center align-items-center py-5">
                                                                    <div className="d-flex justify-content-center align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                            <IoFolder className="text-light"/>
                                                                            </div>
                                                                    </div>
                                                                    <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                                        <p className="text-center text-wrap fs-5 text-capitalize">{ele}</p>
                                                                    </div>
                                                                </div>
                                                            </div>)}
                                                        {fileInfo?.list?.map(item =>
                                                            <div key={item?._id} className="p-2">
                                                                <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3">
                                                                    <div className="w-100 p-2">
                                                                        {item?.isPrivate && <CiLock className="fs-3 text-primary fs-bold" />}
                                                                        <div className="dropdown float-end cursor-pointer">
                                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                                            <ul className="dropdown-menu">
                                                                                <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.url) ? getCheckStorage(item?.url) : "#!"}`} target="_blank">View</Link></div></li>
                                                                                <li><div className="dropdown-item" onClick={()=>handleShareDocument("whatsapp",item)}>WhatsApp</div></li>
                                                                                <li><div className="dropdown-item" onClick={()=>handleShareDocument("email",item)}>Email</div></li>
                                                                                {role?.toLowerCase() == "admin" && <li><div onClick={() => setChangeIsActiveStatus({ show: true, details: { _id: item?._id, currentStatus: item?.isActive, name: item?.name } })} className="dropdown-item">Delete</div></li>}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex flex-column justify-content-center align-items-center">

                                                                        {getCheckStorage(item?.url) ?
                                                                            <DocumentPreview url={getCheckStorage(item?.url)} />
                                                                            : <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                                                <FaFileWord />
                                                                            </div>}


                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>


                                                    <div className="d-flex row  gap-0  align-items-center"></div>
                                                </div>
                                                {/* case process */}
                                                <StatusSection isAddCaseProcess={isAddCaseProcess} id={id} processSteps={data[0]?.processSteps} getCaseById={getCaseById} details={data[0]} addCaseProcess={addCaseProcess} attachementUpload={attachementUpload}/>

                                                {/* case gro form*/}
                                                {((data[0]?.caseFrom?.toLowerCase() == "client" && data[0]?.currentStatus?.toLowerCase()=="gro") || data?.[0]?.caseGroDetails) && 
                                                <GroSection id={id} isCaseFormAccess={isCaseFormAccess} getCaseById={getCaseById} status={data?.[0]?.currentStatus} groDetails={data?.[0]?.caseGroDetails} createOrUpdateApi={createOrUpdateCaseFormApi} attachementUpload={attachementUpload}/>                                
                                                }

                                                {/* payment details */}
                                                {data[0]?.caseFrom?.toLowerCase() == "client" && <PaymentSection id={id} accessPayment={accessPayment} getCaseById={getCaseById} paymentDetailsApi={paymentDetailsApi}  casePayment={data[0]?.casePayment}/> }

                                                {/* case comment */}
                                                {isAddCommit && <CommentSection id={id} addCaseCommit={addCaseCommit} role={role} getCaseById={getCaseById} caseCommit={data[0]?.caseCommit}/>} 
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                {/* {console.log("showEditCaseModal",showEditCaseModal)} */}
                {showEditCaseModal?.status && <EditCaseStatusModal changeStatus={showEditCaseModal} setChangeStatus={setShowEditCaseModal} handleCaseStatus={editCaseProcess} role="admin" />}
                {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={addCaseProcess} role="admin" attachementUpload={attachementUpload}/>}

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

                {/* for case unmerge */}
                <Modal
                    show={removeCaseReference.status}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="p-5"
                >
                    <Modal.Body className='color-4'>
                        <h4 className='text-danger text-center py-3 fs-3'>Are You Sure ?</h4>
                        <p className='text-primary text-center fs-5'>
                            Want to remove the Reference in this case.
                        </p>
                        <div className="mb-3 col-12">
                            <select className="form-select w-100" name="Type" value={removeCaseReference.type} onChange={(e) => setRemoveCaseReference({ ...removeCaseReference, type: e?.target?.value })} >
                                <option value="">--select remove reference type</option>
                                {(data[0]?.partnerId || data[0]?.partnerReferenceCaseDetails) && <option value="partner">Partner</option>}
                                {(data[0]?.empSaleId || data[0]?.empSaleReferenceCaseDetails) && <option value="sale-emp">Sale</option>}
                            </select>
                        </div>

                        <div className="d-flex gap-1 flex-reverse">
                            <div className="d-flex  justify-content-center">
                                <div aria-disabled={removeCaseReference.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${removeCaseReference.loading
                                    && "disabled"}`} onClick={handleRemoveCaseReference}>
                                    {removeCaseReference.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Remove</span>}
                                </div>
                            </div>
                            <Button onClick={() => setRemoveCaseReference({ status: false, type: null, loading: false })}>Close</Button>

                        </div>

                    </Modal.Body>
                </Modal>
                {/* {console.log("addCaseReference", addCaseReference)} */}
                {addCaseReference?.show && <AddReferenceModal showAddCaseReference={addCaseReference} hide={() => setAddCaseReference({ show: false, _id: "" })} addReferenceCase={addReference} />}
                {deleteCaseDoc?.status && <ConfirmationModal show={deleteCaseDoc?.status} hide={() => setDeleteCaseDoc({ status: false, id: null })} id={deleteCaseDoc?.id} handleComfirmation={deleteDoc} heading={"Are you sure?"} text={"Want to permanent delete this doc"} />}
                {uploadingDocs && <AddDocsModal _id={data[0]?._id} uploadingDocs={uploadingDocs} setUploadingDocs={setUploadingDocs}
                    handleCaseDocsUploading={addCaseDoc} attachementUpload={attachementUpload} />}
                {changeisActiveStatus?.show && <SetStatusOfProfile changeStatus={changeisActiveStatus} hide={() => setChangeIsActiveStatus({ show: false, details: {} })} type="Doc" handleChanges={handleChanges} />}


            </div>}
    </>)
}