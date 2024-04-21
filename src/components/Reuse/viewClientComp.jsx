import { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CiEdit } from 'react-icons/ci'
import Loader from "../../components/Common/loader"
import { getCheckStorage } from "../../utils/helperFunction"
import { Link } from "react-router-dom"
import { IoArrowBackCircleOutline } from 'react-icons/io5'

export default function ViewClientComp({ id, getClient,role,link }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            if (id) {
                try {
                    const res = await getClient(id)
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
                }
            }
        } fetch()
    }, [id])

    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                    {role?.toLowerCase()!=="client" && <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />}
                        <div className="d-flex flex align-items-center gap-1">
                            <span>View Profile</span>
                        </div>
                    </div>
                </div>
                <div className="m-2 m-md-5">
                    <div className="container-fluid color-4 p-0">
                        <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                            <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }}>
                                    <img src={getCheckStorage(data[0]?.profile?.profilePhoto) ? getCheckStorage(data[0]?.profile?.profilePhoto) : "/Images/home/profile.jpg"} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} />
                                </div>
                            </div>
                            <div className="col-12 col-md-10">
                                <h5 className="h3 ">About</h5>
                                <p className="text-primary border-3 border-primary border-bottom">{data[0]?.profile?.about}</p>
                            </div>
                        </div>
                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                            <div className="border-3 border-primary border-bottom py-2">
                                <div className="d-flex gap-5 justify-content-between">
                                    <h6 className="text-primary text-center fs-3">Profile Details</h6>
                                    <div className="d-flex align-items-center gap-2">
                                        {!(role?.toLowerCase()=="client" && data[0]?.isProfileCompleted) &&  <div className="d-flex gap-1 btn btn-primary mb-1" onClick={() => navigate(link)} style={{ cursor: "pointer" }}>
                                            <span><CiEdit /></span>
                                            <span>Edit/ Fill</span>
                                        </div>
                                        }
                                
                                    </div>
                                </div>
                            </div>
                            <div className="row row-cols-12 row-cols-md-3  mt-5">
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3">
                                        <h6 className="fw-bold">Name</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.consultantName}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3">
                                        <h6 className="fw-bold">Father's Name</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.fatherName}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3">
                                        <h6 className="fw-bold">Customer Code</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.consultantCode}</p>
                                    </div>
                                </div>

                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3">
                                        <h6 className="fw-bold">Associate With Us</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.associateWithUs && new Date(data[0]?.profile?.associateWithUs).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="">
                                    <div className="mb-1 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">Email</h6>
                                        <p className="h6 text-break">{data[0]?.profile?.primaryEmail}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-1 d-flex align-items-center gap-3">
                                        <h6 className="fw-bold">Mobile No</h6>
                                        <p className=" h6 text-break">{data[0]?.profile?.primaryMobileNo}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">Whatsapp No</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.whatsupNo}</p>
                                    </div></div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">DOB</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.dob && new Date(data[0]?.profile?.dob).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">Address</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.address}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">City</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.city}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">State</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.state}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">Pincode</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profile?.pinCode}</p>
                                    </div>
                                </div>
                                {/* <div className="">
                                    <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                        <h6 className="fw-bold">Profile Tag</h6>
                                        <p className=" h6 text-capitalize text-break">{data[0]?.profileTag}</p>
                                    </div>
                                </div> */}
                            </div>
                            <div className="border-3 border-primary border-bottom pt-5">
                                <h6 className="d-flex flex-start text-primary text-center fs-3">KYC Details</h6>
                            </div>
                            <div className="mt-2 row row-cols-12 row-cols-md-3">
                                <div className="mb-3 d-flex gap-2 flex-column">
                                    <label htmlFor="kycPhoto" className="form-label text-break fw-bold">Photo</label>
                                    {<Link target="_blank" to={getCheckStorage(data[0]?.profile?.kycPhoto) ? getCheckStorage(data[0]?.profile?.kycPhoto) : "#!"}>
                                    <img style={{ height: '300px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(data[0]?.profile?.kycPhoto) ? getCheckStorage(data[0]?.profile?.kycPhoto) : "/Images/upload.jpeg"} alt="kycPhoto" />
                                    </Link>}
                                </div>
                                <div className="mb-3 d-flex gap-2 flex-column">
                                    <label htmlFor="kycAadhar" className="form-label text-break fw-bold">Aadhaar Card</label>
                                    {<Link target="_blank" to={getCheckStorage(data[0]?.profile?.kycAadhaar) ? getCheckStorage(data[0]?.profile?.kycAadhaar) : "#!"}>
                                    <img style={{ height: '300px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(data[0]?.profile?.kycAadhaar) ? getCheckStorage(data[0]?.profile?.kycAadhar) : "/Images/upload.jpeg"} alt="kycPhoto" />
                                    
                                    </Link>}

                                </div>
                                <div className="mb-3 d-flex gap-2 flex-column">
                                    <label htmlFor="kycPan" className="form-label text-break fw-bold">Pan Card</label>
                                    {<Link target="_blank" to={getCheckStorage(data[0]?.profile?.kycPan) ? getCheckStorage(data[0]?.profile?.kycPan) : "#!"}>
                                    <img style={{ height: '300px' }} className="border rounded-2 w-100 img-fluid" src={getCheckStorage(data[0]?.profile?.kycPan) ? getCheckStorage(data[0]?.profile?.kycPan) : "/Images/upload.jpeg"} alt="kycPhoto" />
                                    </Link>}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>}
    </>)
}