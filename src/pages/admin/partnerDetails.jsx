import { useEffect, useState } from "react"
import { allState } from "../../utils/constant"
import { adminGetCaseById } from "../../apis"
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import { adminGetPartnerById } from "../../apis"
import { useParams } from "react-router-dom"
import {FaCircleArrowDown} from 'react-icons/fa6'
import {LuPcCase} from 'react-icons/lu'
import {CiEdit} from 'react-icons/ci'
import {IoArrowBackCircleOutline} from 'react-icons/io5'
import Loader from "../../components/Common/loader"
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import AddAdminTagModal from "../../components/Common/AddAdminTagModal"
import {FaTags} from 'react-icons/fa'
import { adminSetPartnerTag } from "../../apis"
import { API_BASE_IMG} from "../../apis/upload"

export default function AdminPartnerDetails() {
    const [data,setData] =useState([])
    const [loading,setLoading] = useState(false)
    const [changeStatus,setChangeStatus] = useState({status:false,details:{}})
    const [adminTag, setAdminTag] = useState({status:false,details:{}})
    const navigate = useNavigate()
    const param = useParams()

    // console.log("param",param);

    useEffect(()=>{
        if(param?._id ||!adminTag?.status){
            async function fetch(){
             setLoading(true)
             try {
                 const res = await adminGetPartnerById(param?._id)
                //  console.log("partner",res?.data?.data);
                 if(res?.data?.success && res?.data?.data){
     
                     setData([res?.data?.data])
                     setLoading(false)
                     
                 }
         } catch (error) {
                     if(error && error?.response?.data?.message){
                         toast.error(error?.response?.data?.message)
                         setLoading(false)
                     }else{
                         toast.error("Something went wrong")
                         setLoading(false)
                     }
     
                //  console.log("case error",error);
             }
            }fetch() 
        }
    },[param,changeStatus,adminTag])
    // console.log(data);



    return (<>
        {loading ? <Loader/>  : 
      <div>
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
            <div className="d-flex flex align-items-center gap-3">
                <IoArrowBackCircleOutline className="fs-3" onClick={()=>navigate(-1)} style={{cursor:"pointer"}}/>
                <div className="d-flex flex align-items-center gap-1">
                <span>View Partner Details</span>
                {/* <span><LuPcCase/></span> */}
                </div>
            </div>

            <div className="">
                   <p className="badge bg-primary mb-1">{data[0]?.isActive ? "Active" : "Unactive"}</p>
            </div>

            </div>
        <div className=" m-5">
        <div className="container-fluid color-4 p-0">
            <div className="">
                
                <div>
                    <div className="">
                        <div className="">
                        <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                                <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                            <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150,borderRadius:150,cursor:"pointer"}}>
                           <img src={data[0]?.profile?.profilePhoto ? `${import.meta.env.VITE_API_BASE_IMG}${data[0]?.profile?.profilePhoto}` :"/Images/home/sign-in.png"} alt="profileImg"  style={{ height: 150, width: 150,borderRadius:150,cursor:"pointer"}} />  
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
                            <div className="d-flex justify-content-between">
                            <h6 className="text-primary text-center fs-3">Profile Details</h6>
                                <div onClick={()=>setAdminTag({status:true,details:{_id:data[0]?._id,profileTag:data[0]?.profileTag}})} className="d-flex gap-3 btn btn-primary align-items-center"><FaTags/> Add/Edit Tag</div>
                            </div>
                            </div>
                            <div className="row mt-5">
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
                            </div>

                        <div className="row">
                        <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Primary Email</h6>
                           <p className="h6 ">{data[0]?.profile?.primaryEmail}</p>
                        </div>
                        <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                        
                            <h6 className="fw-bold">Alternative Email</h6>
                           <p className=" h6 ">{ data[0]?.profile?.alternateEmail}</p>
                        </div>
                        <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Primary Mobile No</h6>
                           <p className=" h6 ">{data[0]?.profile?.primaryMobileNo}</p>
                        </div>
                        </div>
                        <div className="row">
                        <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Alternative Mobile No</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.alternateMobileNo}</p>
                        </div>
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Whatsapp No</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.whatsupNo}</p>
                        </div>
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">DOB</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.dob && new Date(data[0]?.profile?.dob).toLocaleDateString()}</p>
                        </div>
                        </div>
                        <div className="row">
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                    
                            <h6 className="fw-bold">PAN No</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.panNo}</p>
                        </div>
                        <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Aadhaar No</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.aadhaarNo}</p>
                        </div>
                        <div className="mb-1 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Gender</h6>
                           <p className=" h6 ">{data[0]?.profile?.gender}</p>
                        </div>
                        </div>
                        {/* <div className="row">
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                           <h6 className="fw-bold">Business Name</h6>
                          <p className=" h6 text-capitalize">{data[0]?.profile?.businessName}</p>
                       </div>

                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                           
                            <h6 className="fw-bold">Company Name</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.companyName}</p>
                        </div>
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                    
                            <h6 className="fw-bold">Nature Of Business</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.natureOfBusiness}</p>
                        </div>
                       
                        </div> */}
                        <div className="row">
                        {/* <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                           <h6 className="fw-bold">Designation</h6>
                          <p className=" h6 text-capitalize">{data[0]?.profile?.designation}</p>
                       </div> */}
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Area Of Operation</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.areaOfOperation}</p>
                        </div>
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Work Association</h6>
                           <p className=" h6 text-capitalize">{data[0]?.profile?.workAssociation}</p>
                        </div>
                        </div>

                        <div className="row">
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
                        </div>

                        <div className="row">
                        <div className="mb-2 d-flex align-items-center gap-3 col-12 col-md-4">
                           <h6 className="fw-bold">Pincode</h6>
                          <p className=" h6 text-capitalize">{data[0]?.profile?.pinCode}</p>
                       </div>
                       <div className="mb-2 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                           <h6 className="fw-bold">Profile Tag</h6>
                          <p className=" h6 text-capitalize">{data[0]?.profileTag}</p>
                       </div>
                        </div>
                        </div>


                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                        <div className="border-3 border-primary border-bottom py-2">
                            <h6 className="text-primary text-center fs-3">Banking Details</h6>
                            </div>
                            <div className="row mt-5">
                            <div className="mb-2 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Bank Name</h6>
                           <p className=" h6 text-capitalize">{data[0]?.bankingDetails?.bankName}</p>
                        </div>
                        <div className="mb-2 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                          
                            <h6 className="fw-bold">Bank Account No</h6>
                           <p className=" h6 text-capitalize">{data[0]?.bankingDetails?.bankAccountNo}</p>
                        </div>
                        <div className="mb-2 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Bank Branch Name</h6>
                           <p className=" h6 text-capitalize">{data[0]?.bankingDetails?.bankBranchName}</p>
                        </div>
                            </div>

                        <div className="row">
                        <div className="mb-1 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Gst No.</h6>
                           <p className="h6 ">{data[0]?.bankingDetails?.gstNo}</p>
                        </div>
                        <div className="mb-1 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">Pan No.</h6>
                           <p className=" h6 ">{ data[0]?.bankingDetails?.panNo}</p>
                        </div>
                        <div className="mb-1 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">IFSC Code</h6>
                           <p className=" h6 ">{ data[0]?.bankingDetails?.ifscCode}</p>
                        </div>
                        <div className="mb-1 d-flex text-break align-items-center gap-3 col-12 col-md-4">
                            <h6 className="fw-bold">UPI ID/NO.</h6>
                           <p className=" h6 ">{ data[0]?.bankingDetails?.upiId}</p>
                        </div>
                        </div>
                        <div className="mb-3 d-flex flex-column">
                            <label htmlFor="chequeImg" className="form-label text-primary">Cancelled Cheque:</label>
                            {<img style={{height:250}} className="border rounded-2"  src={data[0]?.bankingDetails?.cancelledChequeImg ?  `${API_BASE_IMG}/${data[0]?.bankingDetails?.cancelledChequeImg}` : "/Images/icons/book.svg"} alt="cancelCheque"/>}
                        </div>
                    
                        <div className="mb-3 d-flex flex-column">
                            <label htmlFor="gstImg" className="form-label text-primary">GST Copy</label>
                            {<img style={{height:250}} className="border rounded-2" src={data[0]?.bankingDetails?.gstCopyImg ?  `${API_BASE_IMG}/${data[0]?.bankingDetails?.gstCopyImg}` : "/Images/icons/book.svg"} alt="gstcopyImg"/>}
                        </div>
                        </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </div>
      </div>}
      {adminTag?.status && <AddAdminTagModal adminTag={adminTag} setAdminTag={setAdminTag} handleAdminTag={adminSetPartnerTag}  path={-1} role="admin"/>}
      {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} path={-1} role="admin"/>}
</>)
}