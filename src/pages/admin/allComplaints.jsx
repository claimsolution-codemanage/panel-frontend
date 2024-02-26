import { allAdminPartner } from "../../apis"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import { caseStatus } from "../../utils/constant"
import { DateRangePicker } from 'react-date-range';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDate } from "../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import { FaCircleArrowDown } from 'react-icons/fa6'
import { LuPcCase } from 'react-icons/lu'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useNavigate } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import Loader from "../../components/Common/loader"
import { useContext } from "react"
import { AppContext } from "../../App"
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationModal from "../../components/Common/confirmationModal"
import loash from 'lodash'
import { AdminViewAllComplaint } from "../../apis"
import { adminRemoveComplaintById } from "../../apis"


export default function AdminAllComplaint() {
  const state = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [viewComplaintModal, setViewComplaintModal] = useState({ status: false, details: {} })
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [complaint, setComplaint] = useState([])
  const [removeComplaint, setRemoveComplaint] = useState({ status: false, details: {} })
  const [noOfComplaint, setNoOfComplaint] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({ show: false, details: {} })


  const getAllComplaint = async () => {
    setLoading(true)
    try {
      const res = await AdminViewAllComplaint(pageItemLimit, pgNo, searchQuery)
      // console.log("AdminAllComplaint res", res);
      // console.log("AdminAllComplaint", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setComplaint([...res?.data?.data])
        setNoOfComplaint(res?.data?.noOfComplaint)
        setLoading(false)
      }
    } catch (error) {
      // console.log("AdminAllComplaint error", error);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  useEffect(() => {
    if(!removeComplaint.status){
      getAllComplaint()
    }
  }, [pageItemLimit, pgNo, changeStatus,removeComplaint])

  useEffect(() => {
    if(searchQuery){     
          let debouncedCall = loash.debounce(function () {
            getAllComplaint()
          }, 1000);
          debouncedCall();
          return () => {
            debouncedCall.cancel();
          };
    }
  }, [searchQuery])


  //   const handleChanges =async(_id,status)=>{
  //     try {
  //         const res = await adminSetPartnerStatus(_id,status)
  //         if (res?.data?.success) {
  //             setChangeStatus({ show: false, details: "" })
  //           toast.success(res?.data?.message)

  //         }
  //       } catch (error) {
  //         console.log("admin all partner error",error);
  //         if (error && error?.response?.data?.message) {
  //           toast.error(error?.response?.data?.message)
  //         } else {
  //           toast.error("Something went wrong")
  //         }
  //         if(error && error?.response?.status==401){
  //           deleteToken()
  //           state?.setMyAppData({ isLogin: false, details:{} })
  //         }
  //         console.log("allAdminPartner error", error);
  //       }
  //     } 



  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };


  return (<>
    {loading ? <Loader /> :
      <div>
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
              <span>All Complaint</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
        </div>

        <div className=" m-5 p-4">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="d-flex flex gap-2">

              <div className="form-control px-2 d-flex gap-2">
                <span className=""><BsSearch className="text-black" /></span>
                <input className="w-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
              </div>

              <div className="">
                <select className="form-select" name="pageItemLimit" value={pageItemLimit} onChange={(e) => setPageItemLimit(e.target.value)} aria-label="Default select example">
                  <option value="">Items</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
            <div className="mt-4 rounded-2 shadow overflow-auto">
              <div className=" table-responsive">
                <table className="table table-responsive table-borderless">
                  <thead>
                    <tr className="bg-primary text-white text-center">
                      <th scope="col" className="text-nowrap"><th scope="col" >S.no</th></th>
                      <th scope="col" className="text-nowrap">Date</th>
                      <th scope="col" className="text-nowrap"><span>Action</span></th>
                      <th scope="col" className="text-nowrap">Name</th>
                      <th scope="col" className="text-nowrap">Email</th>
                      <th scope="col" className="text-nowrap" >Mobile No</th>
                      <th scope="col" className="text-nowrap" >Claim Type</th>
                      <th scope="col" className="text-nowrap" >Complaint Type</th>
                      <th scope="col" className="text-nowrap" >Complaint Breif</th>
                      {/* <th scope="col" className="text-nowrap" >Area Of Operation</th> */}
                      {/* <th scope="col" className="text-nowrap" >Work Association</th> */}
                      {/* <th scope="col" className="text-nowrap" >State</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {complaint.map((item, ind) => <tr key={item._id} className="border-2  border-bottom border-light text-center">
                      <th scope="row" className="text-nowrap">{ind + 1}</th>
                      <td className="text-nowrap">{new Date(item?.createdAt).toLocaleDateString()}</td>
                      {/* <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{item?.isActive ? "Active" : "Unactive"}</span> </td> */}

                      <td className="text-nowrap">
                        <span className="d-flex gap-2"><span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => setViewComplaintModal({ status: true, details: item })}><HiMiniEye /></span>
                          {/* <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ show: true, details: {_id:item._id,currentStatus:item?.isActive} })}><CiEdit /></span> */}
                          <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setRemoveComplaint({ status: true, details: { _id: item?._id, name: item?.name } })}><AiOutlineDelete /></span>
                        </span></td>

                      <td className="text-nowrap">{item?.name}</td>
                      <td className="text-nowrap">{item?.email}</td>
                      <td className="text-nowrap">{item?.mobileNo}</td>
                      <td className="text-nowrap">{item?.claim_type}</td>
                      <td className="text-nowrap">{item?.complaint_type}</td>
                      <td className="">{item?.complaint_brief?.length > 30 ? item?.complaint_brief?.slice(0, 20) + "..." : item?.complaint_brief}</td>

                      {/* <td className="text-nowrap">{item?.profile?.workAssociation}</td> */}
                      {/* <td className="text-nowrap">{item?.profile?.state}</td> */}
                    </tr>)}
                  </tbody>
                </table>

              </div>

              <div className="d-flex flex align-items-center justify-content-center">

                <ReactPaginate
                  breakLabel="..."
                  nextLabel={<BiRightArrow />}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={Math.ceil(noOfComplaint / pageItemLimit) ||1}
                  previousLabel={<BiLeftArrow />}
                  className="d-flex flex gap-2"
                  pageClassName="border border-primary paginate-li"
                  previousClassName="paginate-li bg-color-3"
                  nextClassName="paginate-li bg-color-3"
                  activeClassName="bg-primary text-white"
                  renderOnZeroPageCount={null}
                  forcePage={pgNo > 0 ? pgNo - 1 : 0}
                />
              </div>
            </div>

          </div>
        </div>
        <div>


          <div className={`modal fade ${viewComplaintModal.status && "show"}`} id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" style={{ display: viewComplaintModal.status ? "block" : "none" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">View Complaint</h5>
                  <button onClick={() => setViewComplaintModal({ status: false, details: {} })} type="button" className="close btn" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body text-dark">
                  {/* {console.log(viewComplaintModal?.details)} */}
                  <div className="text-nowrap">Name: {viewComplaintModal?.details?.name}</div>
                  <p className="text-nowrap">Email: {viewComplaintModal?.details?.email}</p>
                  <p className="text-nowrap">Mobile No: {viewComplaintModal?.details?.mobileNo}</p>
                  <p className="text-nowrap">Claim Type: {viewComplaintModal?.details?.claim_type}</p>
                  <p className="text-nowrap">Complaint Type: {viewComplaintModal?.details?.complaint_type}</p>
                  <p className="">Complaint Brief:<br /> {viewComplaintModal?.details?.complaint_brief}</p>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setViewComplaintModal({ status: false, details: {} })} type="button" className="btn btn-primary" data-dismiss="modal">Close</button>

                </div>
              </div>
            </div>
          </div>
        </div>
        {removeComplaint.status && <ConfirmationModal show={removeComplaint.status} hide={()=>setRemoveComplaint({status:false,details:{}})} id={removeComplaint?.details?._id} handleComfirmation={adminRemoveComplaintById} heading="Are you sure" text={`You want to remove ${removeComplaint?.details?.name} complaint`}/>}
      </div>}
  </>)
}