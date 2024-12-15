import { useEffect, useState } from "react"
import { adminGetCaseById } from "../../apis"
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { adminDeleteCaseDocById, adminUpdateClientCaseFee, adminChangeCaseStatus, adminAddCaseCommit, adminRemoveCaseReference } from "../../apis"
import { formatDateToISO } from "../../utils/helperFunction"
import Loader from "../../components/Common/loader"
import AddCaseModal from "../../components/Common/addCaseCommit"
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

export default function ViewCaseComp({ id, getCase, role, attachementUpload, addCaseDoc,
    editUrl, addCaseCommit, viewPartner, viewClient, editCaseProcess, addCaseProcess, addReference,
    deleteReference, deleteDoc, isAddRefence, isAddCaseProcess, isAddCommit,
    isViewProfile, setCaseDocStatus, viewEmp,paymentDetailsApi,accessPayment
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


    const navigate = useNavigate()
    const param = useParams()

    const getCaseById = async () => {
        setLoading(true)
        try {
            const res = await getCase(id)
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

           // Dynamic validation schema based on form value of paymentMode
           const validationSchema = Yup.object({
            paymentMode: Yup.string()
              .required("Payment mode is required")
              .oneOf(["Cash", "UPI", "Web", "Cheque", "Net Banking"], "Invalid payment mode"),
            
            dateOfPayment: Yup.date()
              .required("Date of payment is required"),
            
            utrNumber: Yup.string()
              .test(
                "is-required-htmlFor-upi",
                "UTR Number is required htmlFor UPI",
                function (value) {
                  const { paymentMode } = this.parent;
                  return paymentMode !== "UPI" || (value && value.trim() !== "");
                }
              ),
            
            bankName: Yup.string()
              .test(
                "is-required-htmlFor-bank-modes",
                "Bank Name is required",
                function (value) {
                  const { paymentMode } = this.parent;
                  return !["Cheque", "Net Banking"].includes(paymentMode) || (value && value.trim() !== "");
                }
              ),
            
            chequeNumber: Yup.string()
              .test(
                "is-required-htmlFor-cheque",
                "Cheque Number is required",
                function (value) {
                  const { paymentMode } = this.parent;
                  return paymentMode !== "Cheque" || (value && value.trim() !== "");
                }
              ),
            
            chequeDate: Yup.date()
              .test(
                "is-required-htmlFor-cheque",
                "Cheque Date is required",
                function (value) {
                  const { paymentMode } = this.parent;
                  return paymentMode !== "Cheque" || !!value;
                }
              ),
            
              amount: Yup.number()
              .test(
                "is-required-htmlFor-cheque",
                "Amount is required",
                function (value) {
                  const { paymentMode } = this.parent;
                  return (value && !isNaN(value));
                }
              )
              .typeError("Amount must be a number"),
            
            transactionDate: Yup.date()
              .test(
                "is-required-htmlFor-net-banking",
                "Transaction Date is required",
                function (value) {
                  const { paymentMode } = this.parent;
                  return paymentMode !== "Net Banking" || !!value;
                }
              ),
          })
    
    
        const initialValues = {
            dateOfPayment: "",
            utrNumber: "",
            bankName: "",
            chequeNumber: "",
            chequeDate: "",
            amount: "",
            transactionDate: "",
            paymentMode:""
        };
    
        const handleSubmit = async (values) => {
          setpaymentModal({...paymentModal,save:true})
          try {
              const res = await paymentDetailsApi({...values,caseId:id})
              if (res?.data?.success) {
                  toast.success(res?.data?.message)
                  getCaseById()
              }
              setpaymentModal({show:false,save:false})
          } catch (error) {
              if (error && error?.response?.data?.message) {
                  toast.error(error?.response?.data?.message)
              } else {
                  toast.error("Something went wrong")
              }
              setpaymentModal({...paymentModal,save:false})
          }
      }
    
        const paymentFormik = useFormik({
            initialValues,
            validationSchema,
            onSubmit: handleSubmit
        })

    const handleUpdatePayment =(ele)=>{
        let payload ={...ele}
        paymentFormik.setValues(payload)
        setpaymentModal({...paymentModal,show:true})
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
        console.log("handleRemoveCaseReference",data[0]?._id, removeCaseReference?.type);
        
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
                                                            <span>Document List</span>
                                                            {(role?.toLowerCase() == "client" || role?.toLowerCase() == "partner") && <div>
                                                                <span onClick={() => setUploadingDocs(true)} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                                                            </div>}
                                                        </div></div>
                                                    <div className="row row-cols-1 row-cols-md-4 align-items-center">
                                                        {data[0]?.caseDocs?.map(item =>
                                                            <div key={item?._id} className="p-2">
                                                                <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3">
                                                                    <div className="w-100 p-2">
                                                                        {item?.isPrivate && <CiLock className="fs-3 text-primary fs-bold" />}
                                                                        <div className="dropdown float-end cursor-pointer">
                                                                            <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                                            <ul className="dropdown-menu">
                                                                                <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.url) ? getCheckStorage(item?.url) : "#!"}`} target="_blank">View</Link></div></li>
                                                                                {role?.toLowerCase() == "admin" && <li><div onClick={() => setChangeIsActiveStatus({ show: true, details: { _id: item?._id, currentStatus: item?.isActive, name: item?.name } })} className="dropdown-item">Delete</div></li>}
                                                                                {/* {role?.toLowerCase()=="admin" &&  <li><div onClick={()=>setDeleteCaseDoc({status:true,id:`caseId=${data[0]?._id}&docId=${item?._id}`})} className="dropdown-item">Delete</div></li>} */}
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
                                                                    <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                                        <p className="text-center text-wrap fs-5 text-capitalize">{item?.name}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>


                                                    <div className="d-flex row  gap-0  align-items-center"></div>
                                                </div>
                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="text-primary text-center fs-4">Case Process</div>
                                                            {isAddCaseProcess && <div className="d-flex gap-1 btn btn-primary" onClick={() => setChangeStatus({ status: true, details: { ...data[0] } })}>
                                                                <span><CiEdit /></span>
                                                                <div>Add Status</div>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 rounded-2 shadow">
                                                        <div className="table-responsive">
                                                            <table className="table table-responsive table-borderless">
                                                                <thead className="">
                                                                    <tr className="bg-primary text-white text-center">
                                                                        <th scope="col" className="text-nowrap">S.no</th>
                                                                        {role?.toLowerCase() == "admin" && <th scope="col" className="text-nowrap" >Edit</th>}
                                                                        <th scope="col" className="text-nowrap">Date</th>
                                                                        <th scope="col" className="text-nowrap">Status</th>
                                                                        {role?.toLowerCase() == "admin" && <th scope="col" className="text-nowrap" >Marked By</th>}
                                                                        <th scope="col" className="text-nowrap" >Remark</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data[0]?.processSteps?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                                                        <th scope="row">{ind + 1}</th>
                                                                        {role?.toLowerCase() == "admin" && <td>
                                                                            <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => setShowEditCaseModal({ status: true, details: { caseId: data[0]?._id, processId: item?._id, caseStatus: item?.status, caseRemark: item?.remark, isCurrentStatus: data[0]?.processSteps.length == ind + 1 } })}><CiEdit /></span>
                                                                        </td>}
                                                                        <td className="text-nowrap "> {item?.createdAt && <p className="mb-1">{getFormateDMYDate(item?.createdAt)}</p>}</td>
                                                                        <td className="text-nowrap ">{item?.status && <p className={`mb-1 badge ${(item?.status?.toLowerCase() == "reject" ? "bg-danger" : (item?.status?.toLowerCase() == "pending" ? "bg-warning" : (item?.status?.toLowerCase() == "resolve" ? "bg-success" : "bg-primary")))}`}>{item?.status}</p>}</td>
                                                                        {role?.toLowerCase() == "admin" && <td className="text-nowrap "> <p className="mb-1 text-capitalize">{item?.consultant ? item?.consultant : "System"} </p></td>}
                                                                        <td className="text-break col-4">{item?.remark && <p className="mb-1 text-center">{item?.remark}</p>}</td>
                                                                        {/* <td className="text-nowrap">{(item?.status!="reject" || item?.status!="resolve")  && <FaCircleArrowDown className="fs-3 text-primary" />}</td> */}
                                                                    </tr>)}
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>
                                                </div>
                                                {data[0]?.caseFrom?.toLowerCase() == "client" &&
                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="text-primary text-center fs-4">Payment Details</div>
                                                            {accessPayment && <div className="d-flex gap-1 btn btn-primary" onClick={() =>{ setpaymentModal({save:false,show:true});paymentFormik.resetForm()}}>
                                                                <div>Add Payment</div>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 rounded-2 shadow">
                                                        <div className="table-responsive">
                                                            <table className="table table-responsive table-borderless">
                                                                <thead className="">
                                                                    <tr className="bg-primary text-white text-center">
                                                                        <th scope="col" className="text-nowrap">S.no</th>
                                                                        {accessPayment && <th scope="col" className="text-nowrap" >Edit</th>}
                                                                        <th scope="col" className="text-nowrap">Payment mode</th>
                                                                        <th scope="col" className="text-nowrap">Date of payment</th>
                                                                        <th scope="col" className="text-nowrap">Bank name</th>
                                                                        <th scope="col" className="text-nowrap">Cheque number</th>
                                                                        <th scope="col" className="text-nowrap" >Amount</th>
                                                                        <th scope="col" className="text-nowrap" >Cheque date</th>
                                                                        <th scope="col" className="text-nowrap" >UTR number</th>
                                                                        <th scope="col" className="text-nowrap" >Transaction date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data[0]?.casePayment?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                                                        <th scope="row">{ind + 1}</th>
                                                                        {accessPayment && <td>
                                                                            <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => handleUpdatePayment(item)}><CiEdit /></span>
                                                                        </td>}
                                                                        <td className="text-break col-1"><p className="mb-1 text-center">{item?.paymentMode || "-"}</p></td>
                                                                        <td className="text-nowrap "> {item?.dateOfPayment ? <p className="mb-1">{getFormateDMYDate(item?.dateOfPayment)}</p> :"-"}</td>
                                                                        <td className="text-break col-1"><p className="mb-1 text-center">{item?.bankName || "-"}</p></td>
                                                                        <td className="text-break col-1"><p className="mb-1 text-center">{item?.chequeNumber || "-"}</p></td>
                                                                        <td className="text-break col-1"><p className="mb-1 text-center">{item?.amount || "-"}</p></td>
                                                                        <td className="text-nowrap "> {item?.chequeDate ? <p className="mb-1">{getFormateDMYDate(item?.chequeDate)}</p>:"-"}</td>
                                                                        <td className="text-break col-1"><p className="mb-1 text-center">{item?.utrNumber || "-"}</p></td>
                                                                        <td className="text-nowrap "> {item?.transactionDate ? <p className="mb-1">{getFormateDMYDate(item?.transactionDate)}</p>: "-"}</td>
                                                                        
                                                                    </tr>)}
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>
                                                </div> }

                                                {isAddCommit && <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="d-flex justify-content-center align-items-center gap-3">
                                                            <div className="text-primary text-center fs-4">Case Comment</div>
                                                            <div onClick={() => setCaseCommitModal(true)} className="d-flex justify-content-center align-items-center fs-5 bg-primary text-white" style={{ cursor: 'pointer', width: "2.5rem", height: "2.5rem", borderRadius: "2.5rem" }}>
                                                                <span><IoMdAdd /></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column gap-3">
                                                        {data[0]?.caseCommit?.map(commit => <div key={commit?._id} className="w-100">
                                                            {/* {console.log(data[0]?._id == commit?._id, data[0]?._id, commit?._id)} */}
                                                            <div className={`${commentBy(commit) && "float-end"} w-25`}>
                                                                <div className={`${commentBy(commit) ? "bg-info  w-auto text-dark" : "bg-primary text-white"} p-2 rounded-3`}>
                                                                    {commit?.message}</div>
                                                                <p className="badge bg-warning text-dark m-0">{commentBy(commit) ? "you" : commit?.name} | {commit?.createdAt && getFormateDMYDate(commit?.createdAt)}</p>
                                                            </div>
                                                        </div>)}


                                                    </div>

                                                </div>}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                {/* {console.log("showEditCaseModal",showEditCaseModal)} */}
                {showEditCaseModal?.status && <EditCaseStatusModal changeStatus={showEditCaseModal} setChangeStatus={setShowEditCaseModal} handleCaseStatus={editCaseProcess} role="admin" />}
                {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={addCaseProcess} role="admin" />}
                {paymentModal?.show && <PaymentModal show={paymentModal?.show} saving={paymentModal?.save} formik={paymentFormik} close={() => setpaymentModal({save:false,show:false})} />}

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
                {caseCommitModal && <AddCaseCommit show={caseCommitModal} id={id} close={() => { setCaseCommitModal(false) }} handleCaseCommit={addCaseCommit} />}
                {addCaseReference?.show && <AddReferenceModal showAddCaseReference={addCaseReference} hide={() => setAddCaseReference({ show: false, _id: "" })} addReferenceCase={addReference} />}
                {deleteCaseDoc?.status && <ConfirmationModal show={deleteCaseDoc?.status} hide={() => setDeleteCaseDoc({ status: false, id: null })} id={deleteCaseDoc?.id} handleComfirmation={deleteDoc} heading={"Are you sure?"} text={"Want to permanent delete this doc"} />}
                {uploadingDocs && <AddDocsModal _id={data[0]?._id} uploadingDocs={uploadingDocs} setUploadingDocs={setUploadingDocs}
                    handleCaseDocsUploading={addCaseDoc} attachementUpload={attachementUpload} />}
                {changeisActiveStatus?.show && <SetStatusOfProfile changeStatus={changeisActiveStatus} hide={() => setChangeIsActiveStatus({ show: false, details: {} })} type="Doc" handleChanges={handleChanges} />}


            </div>}
    </>)
}