import { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { adminGetPartnerById, employeeGetPartnerById } from "../../apis"
import { API_BASE_IMG } from "../../apis/upload"
import { useParams } from "react-router-dom"
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader"
import { Link } from "react-router-dom"
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import { useContext } from "react"
import { AppContext } from "../../App"

export default function EmployeePartnerDetails() {
    const state = useContext(AppContext)
    const empType  = state?.myAppData?.details?.empType
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
    const navigate = useNavigate()
    const param = useParams()

    // console.log("param",param);

    useEffect(() => {
        if (param?._id) {
            async function fetch() {
                setLoading(true)
                try {
                    const res = await employeeGetPartnerById(param?._id)
                    //  console.log("partner",res?.data?.data);
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

                    //  console.log("case error",error);
                }
            } fetch()
        }
    }, [param, changeStatus])
    // console.log(data);



    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
                        <div className="d-flex flex align-items-center gap-1">
                            <span>View Partner Details</span>
                            {/* <span><LuPcCase/></span> */}
                        </div>
                    </div>

                    {empType?.toLowerCase()=="operation" &&
                    <div className="">
                        <Link className="btn bg-primary text-white" to={`/employee/edit-partner/${data[0]?._id}`}>Edit</Link>
                    </div>}

                </div>
                <div className=" m-5">
                    <div className="container-fluid color-4 p-0">
                        <div className="">

                            <div>
                                <div className="">
                                    <div className="">
                                        <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                                            <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                                <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }}>
                                                    <img src={data[0]?.profile?.profilePhoto ? `${API_BASE_IMG}/${data[0]?.profile?.profilePhoto}` : "/Images/home/sign-in.png"} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} />
                                                </div>
                                                {/* <h5 className="mb-1 text-capitalize text-white">{data[0]?.profile?.consultantName}</h5> */}
                                            </div>
                                            <div className="col-12 col-md-10">
                                                <h5 className="h3 ">About</h5>
                                                <p className="text-primary border-3 border-primary border-bottom">{data[0]?.profile?.about}</p>
                                            </div>
                                        </div>
                                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                            <div className="border-3 border-primary border-bottom py-2">
                                                <h6 className="text-primary text-center fs-3">Profile Details</h6>
                                            </div>
                                            <div className="row row-cols-1 row-cols-3 mt-5">
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Name</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.consultantName}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                    <h6 className="fw-bold">Consultant Code</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.consultantCode}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Associate With Us</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.associateWithUs && new Date(data[0]?.profile?.associateWithUs).toLocaleDateString()}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Primary Email</h6>
                                                    <p className="h6 ">{data[0]?.profile?.primaryEmail}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">

                                                    <h6 className="fw-bold">Alternate Email</h6>
                                                    <p className=" h6 ">{data[0]?.profile?.alternateEmail}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Primary Mobile No.</h6>
                                                    <p className=" h6 ">{data[0]?.profile?.primaryMobileNo}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Alternate Mobile No.</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.alternateMobileNo}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Whatsapp No.</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.whatsupNo}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">DOB</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.dob && new Date(data[0]?.profile?.dob).toLocaleDateString()}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                    <h6 className="fw-bold">PAN No.</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.panNo}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Aadhaar No.</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.aadhaarNo}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Gender</h6>
                                                    <p className=" h6 ">{data[0]?.profile?.gender}</p>
                                                </div>

                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Area Of Operation</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.areaOfOperation}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Work Association</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.workAssociation}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">District</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.district}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">City</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.city}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">State</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.state}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Pincode</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.profile?.pinCode}</p>
                                                </div>
                                            </div>

                                        </div>


                                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                            <div className="border-3 border-primary border-bottom py-2">
                                                <h6 className="text-primary text-center fs-3">Banking Details</h6>
                                            </div>
                                            <div className="row mt-5">
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Bank Name</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.bankingDetails?.bankName}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">

                                                    <h6 className="fw-bold">Bank Account No</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.bankingDetails?.bankAccountNo}</p>
                                                </div>
                                                <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Bank Branch Name</h6>
                                                    <p className=" h6 text-capitalize">{data[0]?.bankingDetails?.bankBranchName}</p>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Gst No.</h6>
                                                    <p className="h6 ">{data[0]?.bankingDetails?.gstNo}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">Pan No.</h6>
                                                    <p className=" h6 ">{data[0]?.bankingDetails?.panNo}</p>
                                                </div>
                                                <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                                                    <h6 className="fw-bold">UPI ID/ Number</h6>
                                                    <p className=" h6 ">{data[0]?.bankingDetails?.upiId}</p>
                                                </div>
                                            </div>

                                            <div className="mb-3 d-flex flex-column">
                                                <label for="chequeImg" className="form-label">Cancelled Cheque:</label>
                                                {data[0]?.bankingDetails?.cancelledChequeImg ? <Link to={`${API_BASE_IMG}/${data[0]?.bankingDetails?.cancelledChequeImg}`} target="_blank" className="w-100">
                                                    <img style={{ height: 250 }} className="border rounded-2 w-100" src={`${API_BASE_IMG}/${data[0]?.bankingDetails?.cancelledChequeImg}`} alt="gstcopyImg" />
                                                </Link>
                                                    : <img style={{ height: 250 }} className="border rounded-2" src={"/Images/home/cancel-cheque.jpg"} alt="chequeImg" />
                                                }
                                            </div>

                                            <div className="mb-3 d-flex flex-column">
                                                <label for="gstImg" className="form-label">GST Copy</label>
                                                {data[0]?.bankingDetails?.gstCopyImg ? <Link to={`${API_BASE_IMG}/${data[0]?.bankingDetails?.gstCopyImg}`} target="_blank" className="w-100">
                                                    <img style={{ height: 250 }} className="border rounded-2 w-100" src={`${API_BASE_IMG}/${data[0]?.bankingDetails?.gstCopyImg}`} alt="gstcopyImg" />
                                                </Link>
                                                    : <img style={{ height: 250 }} className="border rounded-2" src={"/Images/home/gst-copy.jpg"} alt="gstcopyImg" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} path={-1} role="admin" />}
    </>)
}