import { employeeAllPartner } from "../../apis"
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
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import { useNavigate } from "react-router-dom"
import {BiLeftArrow} from 'react-icons/bi'
import {BiRightArrow} from 'react-icons/bi'
import SetStatusOfProfile from "../../components/Common/setStatusModal"
import { adminSetPartnerStatus } from "../../apis"
import Loader from "../../components/Common/loader"
import loash from 'lodash'
import { useContext } from "react"
import { AppContext } from "../../App"
import { Link } from "react-router-dom"

 
export default function EmployeeAllPartner() {
  const state = useContext(AppContext)
  const empType  = state?.myAppData?.details?.empType
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [isSearch,setIsSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [noOfPartner, setNoOfPartner] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({show: false, details: "" })


  const getAllPatner =async()=>{
    setLoading(true)
    try {
      const res = await employeeAllPartner(pageItemLimit, pgNo, searchQuery)
      // console.log("allAdminCase", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data])
        setNoOfPartner(res?.data?.noOfPartner)
        setLoading(false)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      // console.log("allAdminPartner error", error);
    }
  }

  useEffect(() => {
    getAllPatner()
  }, [pageItemLimit, pgNo,changeStatus])

  useEffect(() => {
    if(searchQuery){
      let debouncedCall = loash.debounce(function () {
        getAllPatner()
      }, 1000);
      debouncedCall();
      return () => {
        debouncedCall.cancel();
      };
    }
  }, [searchQuery])

  useEffect(()=>{
    if(isSearch){
      let debouncedCall = loash.debounce(function () {
        getAllPatner()
        setIsSearch(false)
    }, 1000);
    debouncedCall();
    return () => {
      debouncedCall.cancel();
    };
    }

   },[searchQuery,isSearch])


   const handleSearchQuery =(value)=>{
    setIsSearch(true)
    setSearchQuery(value)
  }



  const handleChanges =async(_id,status)=>{
    try {
        const res = await adminSetPartnerStatus(_id,status)
        if (res?.data?.success) {
            setChangeStatus({ show: false, details: "" })
          toast.success(res?.data?.message)

        }
      } catch (error) {
        if (error && error?.response?.data?.message) {
          toast.error(error?.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
        // console.log("allAdminPartner error", error);
      }
    } 



  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };


  // console.log("data", data);

  return (<>
  {loading ? <Loader/> :
    <div>
    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
          {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/employee/dashboard")} style={{ cursor: "pointer" }} /> */}
          <div className="d-flex flex align-items-center gap-1">
            <span>All Partner</span>
            {/* <span><LuPcCase /></span> */}
          </div>
        </div>
      </div>

      <div className=" m-5 p-4">
      <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
      <div className="d-flex flex gap-2">
       
          <div className="form-control px-2 d-flex gap-2">
            <span className=""><BsSearch className="text-black" /></span>
            <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
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
              <th scope="col" className="text-nowrap"><span>Action</span></th>
              <th scope="col" className="text-nowrap">Status</th>
              <th scope="col" className="text-nowrap">Date</th>
              <th scope="col" className="text-nowrap">Full Name</th>
              <th scope="col" className="text-nowrap" >consultantCode</th>
              <th scope="col" className="text-nowrap" >Email</th>
              <th scope="col" className="text-nowrap" >Mobile No.</th>
              <th scope="col" className="text-nowrap" >DOB</th>
              <th scope="col" className="text-nowrap" >Area Of Operation</th>
              <th scope="col" className="text-nowrap" >Work Association</th>
              <th scope="col" className="text-nowrap" >State</th>
            
            </tr>
          </thead>
          <tbody>
            {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
              <th scope="row" className="text-nowrap">{ind + 1}</th>
              <td className="text-nowrap"><span className="d-flex align-items-center gap-2">
                <span style={{ height: 30, width: 30, borderRadius: 30 }} className="cursor-pointer bg-success text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/employee/partner details/${item._id}`)}><HiMiniEye /></span>
              {empType?.toLowerCase()=="operation" && <>
              <Link to={`/employee/edit-partner/${item?._id}`} style={{ height: 30, width: 30, borderRadius: 30 }} className="cursor-pointer bg-info text-white d-flex align-items-center justify-content-center"><CiEdit className="fs-5 text-dark"/></Link>
              </>}
                </span></td>
              <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{item?.isActive ? "Active" : "Unactive"}</span> </td>
              <td className="text-nowrap">{new Date(item?.profile?.associateWithUs).toLocaleDateString()}</td>
              <td className="text-nowrap">{item?.profile?.consultantName}</td>
              <td className="text-nowrap">{item?.profile?.consultantCode}</td>
              <td className="text-nowrap">{item?.profile?.primaryEmail}</td>
              <td className="text-nowrap">{item?.profile?.primaryMobileNo}</td>
              <td className="text-nowrap">{new Date(item?.profile?.dob).toLocaleDateString()}</td>
              <td className="text-nowrap">{item?.profile?.areaOfOperation}</td>
              <td className="text-nowrap">{item?.profile?.workAssociation}</td>
              <td className="text-nowrap">{item?.profile?.state}</td>
            </tr>)}
          </tbody>
        </table>

      </div>

      <div className="d-flex flex align-items-center justify-content-center">

        <ReactPaginate
          breakLabel="..."
          nextLabel={<BiRightArrow/>}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(noOfPartner / pageItemLimit) ||1}
          previousLabel={<BiLeftArrow/>}
          className="d-flex flex gap-2"
          pageClassName="border border-primary paginate-li"
          previousClassName="paginate-li bg-color-3"
          nextClassName="paginate-li bg-color-3"
          activeClassName="bg-primary text-white"
          renderOnZeroPageCount={null}
          forcePage={pgNo>0 ? pgNo-1 : 0}
        />
      </div>
      </div>

    </div>
      </div>

    </div>
}</>)
}