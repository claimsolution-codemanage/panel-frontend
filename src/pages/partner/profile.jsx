import { useEffect, useState } from "react"
import { allState } from "../../utils/constant"
import { getPartnerProfile } from "../../apis"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
// import { API_BASE_IMG } from "../../apis"
import { API_BASE_IMG } from "../../apis/upload"
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader"


export default function Profile() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const res = await getPartnerProfile()
                // console.log("partner", res?.data?.data?.profile);
                if (res?.data?.success && res?.data?.data?.profile) {

                    setData([res?.data?.data?.profile])
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

                // console.log("profile error", error);
            }
        } fetch()
    }, [])
    // console.log(data);



    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate("/partner/dashboard")} style={{ cursor: 'pointer' }} /> */}
                        <div className="d-flex flex align-items-center gap-1">
                            <span>View Profile</span>
                            {/* <span><LuPcCase/></span> */}
                        </div>
                    </div>

                    {/* <div className="d-flex align-items-center gap-2">
            <div className="d-flex gap-1 badge bg-primary mb-1" onClick={()=>navigate("/partner/edit profile")} style={{cursor:"pointer"}}>
                <span><CiEdit/></span>
                <span>Edit</span>
            </div>
            </div> */}

                </div>
                <div className="m-2 m-md-5">
                    <div className="container-fluid color-4 p-0">
                        <div>
                            <div className="">
                                <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                                    <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                        <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }}>
                                            <img src={data[0]?.profilePhoto ? `${API_BASE_IMG}/${data[0]?.profilePhoto}` : "/Images/home/profile.jpg"} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} />
                                        </div>
                                        {/* <h5 className="mb-1 text-capitalize text-white">{data[0]?.consultantName}</h5> */}
                                    </div>
                                    <div className="col-12 col-md-10">
                                        <h5 className="h3 ">About</h5>
                                        <p className="text-primary border-3 border-primary border-bottom">{data[0]?.about}</p>
                                    </div>
                                </div>
                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                    <div className="border-3 border-primary border-bottom py-2">
                                        <div className="d-flex gap-5 justify-content-between">
                                            <h6 className="text-primary text-center fs-3">Profile Details</h6>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="d-flex gap-1 btn btn-primary mb-1" onClick={() => navigate("/partner/edit profile")} style={{ cursor: "pointer" }}>
                                                    <span><CiEdit /></span>
                                                    <span>Edit/ Fill</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row row-cols-1 row-cols-3 mt-5">
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            <h6 className="fw-bold">Name</h6>
                                            <p className="h6 text-capitalize">{data[0]?.consultantName}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            <h6 className="fw-bold">Consultant Code</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.consultantCode}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Associate with us</label> */}
                                            <h6 className="fw-bold">Associate with us</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.associateWithUs ? new Date(data[0]?.associateWithUs).toLocaleDateString() : "/Na"}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            <h6 className="fw-bold">Primary Email Id</h6>
                                            <p className=" h6 ">{data[0]?.primaryEmail}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Alternet Email Id</label> */}
                                            <h6 className="fw-bold">Alternative Email Id</h6>
                                            <p className=" h6 ">{data[0]?.alternateEmail}</p>
                                        </div>
                                     
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Primery Mobile No</label> */}
                                            <h6 className="fw-bold">Primary Mobile No</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.primaryMobileNo}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Primery Mobile No</label> */}
                                            <h6 className="fw-bold">Alternative Mobile No</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.alternateMobileNo}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Whatsup No</label> */}
                                            <h6 className="fw-bold">Whatsapp No</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.whatsupNo}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">DOB</label> */}
                                            <h6 className="fw-bold">DOB</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.dob && new Date(data[0]?.dob).toLocaleDateString()}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">PAN No</label> */}
                                            <h6 className="fw-bold">PAN No</h6>
                                            <p className=" h6 ">{data[0]?.panNo}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Aadhaar No</label> */}
                                            <h6 className="fw-bold">Aadhaar No</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.aadhaarNo}</p>
                                        </div>
                            
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Gender</label> */}
                                            <h6 className="fw-bold">Gender</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.gender}</p>
                                        </div>

                                        {/* <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                           
                                            <h6 className="fw-bold">Designation</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.designation}</p>
                                        </div> */}
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Your are of Operation</label> */}
                                            <h6 className="fw-bold">Area of Operation</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.areaOfOperation}</p>
                                        </div>
                                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Work Association</h6>
                           <p className=" h6 text-capitalize">{data[0]?.workAssociation}</p>
                        </div>
                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">District</label> */}
                                            <h6 className="fw-bold">District</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.district}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">Your City</label> */}
                                            <h6 className="fw-bold">City</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.city}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="state" className="form-label">State</label> */}
                                            <h6 className="fw-bold">State</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.state}</p>
                                        </div>
                                
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
                                            {/* <label for="mobileNo." className="form-label">About you</label> */}
                                            <h6 className="fw-bold">Pin Code</h6>
                                            <p className=" h6 text-capitalize">{data[0]?.pinCode}</p>
                                        </div>
                                    </div>
                                
                                    {/* <div className="row">
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">

                                            <h6 className="fw-bold">Business Name </h6>
                                            <p className=" h5 text-capitalize">{data[0]?.businessName}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">

                                            <h6 className="fw-bold">Company Name</h6>
                                            <p className=" h5 text-capitalize">{data[0]?.companyName}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4">
   
                                            <h6 className="fw-bold">Nature of Business</h6>
                                            <p className=" h5 text-capitalize">{data[0]?.natureOfBusiness}</p>
                                        </div>
                                    </div> */}
                             
                                    {/* <div className="row">
                                        <div className="col-12">
                                           
                                            <h6 className="fw-bold">Your self</h6>
                                            <p className=" h5">{data[0]?.about}</p>
                                        </div>
                                    </div> */}
                                    {/* <div className="d-flex  justify-content-center">
                        <div className="btn btn-primary w-50">Save</div>
                        </div> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>}
    </>)
}