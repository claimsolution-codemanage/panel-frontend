import { useEffect, useState } from "react"
import { allState } from "../../utils/constant"
import { getClientProfile } from "../../apis"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { API_BASE_IMG, adminGetPartnerById } from "../../apis"
import { useParams } from "react-router-dom"
import { FaCircleArrowDown } from 'react-icons/fa6'
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import Loader from "../../components/Common/loader"

export default function ClientProfile() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const res = await getClientProfile()
                // console.log("partner", res?.data?.data);
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
        } fetch()
    }, [])
    // console.log(data);



    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate("/client/dashboard")} style={{ cursor: 'pointer' }} /> */}
                        <div className="d-flex flex align-items-center gap-1">
                            <span>View Profile</span>
                            {/* <span><LuPcCase /></span> */}
                        </div>
                    </div>

                    {/* <div className="d-flex align-items-center gap-2">
                        <div className="d-flex gap-1 badge bg-primary mb-1" onClick={() => navigate(`/client/edit profile/_id=${data[0]?._id}`)} style={{ cursor: "pointer" }}>
                            <span><CiEdit /></span>
                            <span>Edit</span>
                        </div>
                    </div> */}

                </div>
                <div className="m-2 m-md-5">
                    <div className="container-fluid color-4 p-0">
                        <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                            <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }}>
                                    <img src={data[0]?.profile?.profilePhoto ? `${import.meta.env.VITE_API_BASE_IMG}${data[0]?.profile?.profilePhoto}` : "/Images/home/profile.jpg"} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} />
                                </div>
                                {/* <h5 className="mb-1 text-capitalize text-white">{data[0]?.profile?.consultantName}</h5> */}
                            </div>
                            <div className="col-12 col-md-10">
                                <h5 className="h3 ">About</h5>
                                <p className="text-primary border-3 border-primary border-bottom">{data[0]?.profile?.about}</p>
                            </div>
                        </div>
                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                            {/* <div className="border-3 border-primary border-bottom py-2">
                                <h6 className="text-primary text-center fs-3">Profile Details</h6>
                            </div> */}
                            <div className="border-3 border-primary border-bottom py-2">
                                        <div className="d-flex gap-5 justify-content-between">
                                            <h6 className="text-primary text-center fs-3">Profile Details</h6>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="d-flex gap-1 btn btn-primary mb-1" onClick={() => navigate(`/client/edit profile/_id=${data[0]?._id}`)} style={{ cursor: "pointer" }}>
                                                    <span><CiEdit /></span>
                                                    <span>Edit/ Fill</span>
                                                </div>
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
                                    <h6 className="fw-bold">Consultant Code</h6>
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
                                {/* <div className="">
                                <div className="mb-1 d-flex align-items-center gap-3">
                                    <h6 className="fw-bold">Alternate Email</h6>
                                    <p className="h6 text-break">{data[0]?.profile?.alternateEmail}</p>
                                </div>
                                </div> */}
                                <div className="">
                                <div className="mb-1 d-flex align-items-center gap-3">
                                    <h6 className="fw-bold">Mobile No</h6>
                                    <p className=" h6 text-break">{data[0]?.profile?.primaryMobileNo}</p>
                                </div>
                                </div>
                                {/* <div className="">
                                <div className="mb-1 d-flex align-items-center gap-3">
                                    <h6 className="fw-bold">Alternate Mobile No.</h6>
                                    <p className=" h6 text-capitalize text-break">{data[0]?.profile?.alternateMobileNo}</p>
                                </div>
                                </div> */}
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
                                {/* <div className=""> 
                                  <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                    <h6 className="fw-bold">Pan No.</h6>
                                    <p className=" h6 text-capitalize text-break">{data[0]?.profile?.panNo}</p>
                                </div></div>
                                <div className="">
                                <div className="mb-1 d-flex align-items-center gap-3 overflow-auto ">
                                    <h6 className="fw-bold">Aadhaar No.</h6>
                                    <p className=" h6 text-capitalize text-break">{data[0]?.profile?.aadhaarNo}</p>
                                </div>
                                </div> */}
                                {/* <div className="">
                                <div className="mb-1 d-flex align-items-center gap-3 overflow-auto ">
                                    <h6 className="fw-bold">Gender</h6>
                                    <p className=" h6 text-capitalize text-break">{data[0]?.profile?.gender}</p>
                                </div>
                                </div> */}
                                <div className="">
                                <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                    <h6 className="fw-bold">Address</h6>
                                    <p className=" h6 text-capitalize text-break">{data[0]?.profile?.address}</p>
                                </div>
                                </div>
                                {/* <div className="">
                                <div className="mb-2 d-flex align-items-center gap-3 overflow-auto ">
                                    <h6 className="fw-bold">District</h6>
                                    <p className=" h6 text-capitalize text-break">{data[0]?.profile?.district}</p>
                                </div>
                                </div> */}
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







                             
                              


                                
                                
                             


                             
                               
                                





                              
                              
                               


                                
                            

                            </div>
                        </div>

                    </div>
                </div>
            </div>}
    </>)
}