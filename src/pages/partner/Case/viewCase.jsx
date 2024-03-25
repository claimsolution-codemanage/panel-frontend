import { useEffect, useRef, useState } from "react"
// import { allState } from "../../utils/constant"
import { partnerGetCaseById } from "../../../apis"
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
// import { API_BASE_IMG } from "../../../apis"
import { useParams } from "react-router-dom"
import { FaCircleArrowDown } from 'react-icons/fa6'
import { LuPcCase } from 'react-icons/lu'
import { CiAlignCenterV, CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import Loader from "../../../components/Common/loader"
import AddDocsModal from "../../../components/addDocsModal"
import { partnerAddCaseFileById } from "../../../apis"
import { partnerAttachementUpload } from "../../../apis/upload"
import { FaFilePdf, FaFileImage,FaFileWord } from 'react-icons/fa6'
// import { FaFileWord } from "react-icons/fa6";
import { FaEye } from 'react-icons/fa'
import { IoCloudDownloadOutline } from 'react-icons/io5'
import ViewDocs from "../../../components/Common/ViewDocs"
import { API_BASE_IMG } from "../../../apis/upload"
import {getFormateDMYDate} from "../../../utils/helperFunction"

// import PDFViewer from 'pdf-viewer-reactjs'


export default function PartnerViewCase() {
    const docRef = useRef(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const param = useParams()
    const [uploadingDocs, setUploadingDocs] = useState(false)
    const [viewDocs, setViewDocs] = useState({ status: false, details: {} })

    // console.log("param", param);

    const getCaseById = async () => {
        setLoading(true)
        try {
            const res = await partnerGetCaseById(param?._id)
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
        if (param?._id && !uploadingDocs) {
            getCaseById()
        }
    }, [param, uploadingDocs])




    // console.log(data);
    return (<>
        {loading ? <Loader /> :
            <div>
                {viewDocs?.status ? <ViewDocs hide={() => setViewDocs({ status: false, details: {} })} details={viewDocs} type="View Case Doc" /> :
                    <div>
                        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                            <div className="d-flex flex   align-items-center gap-3">
                                <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
                                <div className="d-flex flex align-items-center gap-1">
                                    <span>View Case</span>
                                    {/* <span><LuPcCase /></span> */}
                                </div>
                            </div>
                        </div>
                        <div className="m-2 m-md-5">
                            <div className="container-fluid color-4 p-0">
                                <div className="">
                                    <div>
                                        <div className="">
                                            <div className="">
                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom mb-5">
                                                      
                                                        <div className="d-flex gap-2 align-items-center justify-content-between">
                                                        <h6 className="text-primary text-center fs-3">Case Details</h6>
                                                        {/* <Link to={`/partner/edit%20case/${data[0]?._id}`} className="btn btn-primary">Edit/Update</Link> */}
                                                        </div>
                                                    </div>
                                                    {/* <div className="row ">
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

                                                    </div> */}
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
                                                            <h6 className="fw-bold">Description</h6>
                                                            <p className=" h6">{data[0]?.problemStatement}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="d-flex gap-3 justify-content-center text-primary text-center fs-4">
                                                            <span>Document List</span>
                                                            <div>
                                                                <span onClick={() => setUploadingDocs(true)} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                                                            </div>
                                                        </div></div>

                                                    <div className="d-flex flex-wrap  gap-5 px-5  align-items-center">
                                                        {/* {data[0]?.caseDocs.map(item => item?.docType!="image" ? <Link to={`${API_BASE_IMG}/${item?.docURL}`} target="_blank" className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                                        <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                                                <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                                    {item?.docType == "image" ? <FaFileImage /> : <FaFilePdf />}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                                <p className="text-center text-nowrap fs-5 text-capitalize">{item?.docName}</p>
                                                               
                                                            </div>
                                                        </Link>  :  <div onClick={() => setViewDocs({ status: true, details: item })} style={{ cursor: "pointer" }} className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                                            <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                                                <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                                    {item?.docType == "image" ? <FaFileImage /> : <FaFilePdf />}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                                <p className="text-center text-nowrap fs-5 text-capitalize">{item?.docName}</p>
                                                              
                                                            </div>
                                                        </div>
                                                        )} */}

                                                        {data[0]?.caseDocs.map(item =><>{item?.docType == "image" ?
                                                        <div onClick={() => setViewDocs({ status: true, details: item })} style={{ cursor: "pointer" }} className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                                        <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                                            <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                                {item?.docType == "image" ? <FaFileImage /> :(item?.docType == "pdf" ? <FaFilePdf /> : <FaFileWord/>)}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                            <p className="text-center text-nowrap fs-5 text-capitalize">{item?.docName}</p>

                                                        </div>
                                                    </div>
                                                    :
                                                    <Link  to={`${API_BASE_IMG}/${encodeURIComponent(item?.docURL)}`} target="_blank"   style={{ cursor: "pointer" }} className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                                    <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                                        <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                            {item?.docType == "image" ? <FaFileImage /> :(item?.docType == "pdf" ? <FaFilePdf /> : <FaFileWord/>)}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                                        <p className="fs-5 text-break text-capitalize text-center text-wrap">{item?.docName}</p>
                                                    </div>
                                                </Link>
                                                } </> 
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                                    <div className="border-3 border-primary border-bottom py-2 mb-5">
                                                        <div className="text-primary text-center fs-4">Case Process</div>
                                                    </div>
                                                    <div className="mt-4 rounded-2 shadow">
                                                        <div className="table-responsive">
                                                            <table className="table table-responsive table-borderless">
                                                                <thead className="">
                                                                    <tr className="bg-primary text-white text-center">
                                                                        <th scope="col" className="text-nowrap"><th scope="col" >S.no</th></th>
                                                               
                                                                        <th scope="col" className="text-nowrap">Date</th>
                                                                        <th scope="col" className="text-nowrap">Status</th>
                                                                    
                                                                        <th scope="col" className="text-nowrap" >Remark</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data[0]?.processSteps?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                                                        <th scope="row">{ind + 1}</th>
                                                                        <td className="text-nowrap "> {item?.date && <p className="mb-1">{new Date(item?.date).toLocaleDateString()}</p>}</td>
                                                                        <td className="text-nowrap ">{item?.status && <p className={`mb-1 badge bg-${item?.status == "reject" || item?.status == "query" ? "danger" : (item?.status == "pending" ? "warning" : (item?.status == "resolved" ? "success" : "primary"))}`}>{item?.status}</p>}</td>
                                                                        <td className="text-nowrap "> <p className="mb-1 text-capitalize">{item?.consultant ? item?.consultant : "System"} </p></td>
                                                                       
                                                                        {/* <td className="text-nowrap">{(item?.status!="reject" || item?.status!="resolve")  && <FaCircleArrowDown className="fs-3 text-primary" />}</td> */}
                                                                    </tr>)}
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>
                                  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {uploadingDocs && <AddDocsModal _id={data[0]?._id} uploadingDocs={uploadingDocs} setUploadingDocs={setUploadingDocs}
                            handleCaseDocsUploading={partnerAddCaseFileById} attachementUpload={partnerAttachementUpload} />}
                    </div>}
            </div>}
    </>)
}