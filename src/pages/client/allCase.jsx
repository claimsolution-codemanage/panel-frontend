import { clientViewAllCase } from "../../apis"
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
import Loader from "../../components/Common/loader"
import loash from 'lodash'

 
export default function ClientViewAllCase() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [statusType, setStatusType] = useState("")
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [showCalender, setShowCalender] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [noOfCase, setNoOfCase] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date("2023/01/01"),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange([{ startDate: new Date("2023/01/01"), endDate: new Date(), key: 'selection' }])
    setStatusType("")
    setShowCalender(false)
  }

const getAllCaseDetails =async()=>{
  setLoading(true)
  try {
    const startDate = dateRange[0].startDate ? getFormateDate(dateRange[0].startDate) : ""
    const endDate = dateRange[0].endDate ? getFormateDate(dateRange[0].endDate) : ""
    // console.log("start", startDate, "end", endDate);
    const res = await clientViewAllCase(pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate)
    // console.log("clientViewAllCase", res?.data?.data);
    if (res?.data?.success && res?.data?.data) {
      setData([...res?.data?.data])
      setNoOfCase(res?.data?.noOfCase)
      setLoading(false)
    }
  } catch (error) {
    if (error && error?.response?.data?.message) {
      toast.error(error?.response?.data?.message)
    } else {
      toast.error("Something went wrong")
    }
    // console.log("allAdminCase error", error);
  }
}



  useEffect(() => {
       getAllCaseDetails()
       console.log("calling effect1")
  }, [pageItemLimit, pgNo, dateRange, statusType, changeStatus])

 useEffect(()=>{
  if(searchQuery){
    let debouncedCall = loash.debounce(function () {
      getAllCaseDetails()
      console.log("calling effect2")
  
  }, 1000);
  debouncedCall();
  return () => {
    debouncedCall.cancel();
  };
  }
 },[searchQuery])


  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };


  // console.log("data", data);
  // console.log("chagne status", changeStatus.details.currentStatus);

  // console.log("range",dateRange);
  return (<>
   {loading?<Loader/> :
    <div>
      <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
          {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/client/dashboard")} style={{ cursor: "pointer" }} /> */}
          <div className="d-flex flex align-items-center gap-1">
            <span>All Cases</span>
            {/* <span><LuPcCase /></span> */}
          </div>
        </div>

    

      </div>



      <div className="m-md-5 p-2 p-md-3">
      <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
      <div className="row p-0 mb-2">
        <div className="col-12 col-md-3">
          <div className="form-control col-4 mb-2 mb-md-0 col-md-4 px-2 d-flex gap-2">
            <span className=""><BsSearch className="text-black" /></span>
            <input className="w-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
          </div>
        </div>
        <div className="col-12 col-md-9">
          <div className="row gap-2 gap-md-0">
            <div className="col-12 col-md-7 d-flex gap-3">
               <div className="btn btn-primary" onClick={() => setShowCalender(!showCalender)}>Filter</div>
              <div className="btn btn-primary" onClick={() => handleReset()}>Reset</div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" name="caseStaus" value={statusType} onChange={(e) => setStatusType(e.target.value)} aria-label="Default select example">
                <option value="">--Select Case Status</option>
                {caseStatus?.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" name="pageItemLimit" value={pageItemLimit} onChange={(e) => {setPageItemLimit(e.target.value);setPgNo(1)}} aria-label="Default select example">
                <option value="">Items</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="position-relative">
        <div className="d-flex align-items-center position-absolute  mt-2 justify-content-center m-0">
        {showCalender && <DateRange
                onChange={item => {
                  setDateRange([item.selection]);
                  setShowCalender(false);
                }}
                editableDateInputs={true}
                months={1}
                ranges={dateRange}
                className=" "
                moveRangeOnFirstSelection={false}
                direction="horizontal"
              // preventSnapRefocus={true}
              // calendarFocus="backwards"
              />}
          </div>
          </div>

            <div className="mt-4 rounded-2 shadow">
      <div className="table-responsive">
        <table className="table table-responsive table-borderless">
          <thead className="">
            <tr className="bg-primary text-white text-center">
              <th scope="col" className="text-nowrap"><th scope="col" >S.no</th></th>
              <th scope="col" className="text-nowrap">Current Status</th>
              <th scope="col" className="text-nowrap"><span>Action</span></th>
              <th scope="col" className="text-nowrap">Date</th>
              <th scope="col" className="text-nowrap">Name</th>
              <th scope="col" className="text-nowrap">File No</th>
              {/* <th scope="col" className="text-nowrap" >Name</th>
              <th scope="col" className="text-nowrap" >Email</th>
              <th scope="col" className="text-nowrap" >Mobile No.</th> */}
              <th scope="col" className="text-nowrap" >Policy No</th>
              <th scope="col" className="text-nowrap" >Policy Type</th>
              <th scope="col" className="text-nowrap" >complaint Type</th>
              <th scope="col" className="text-nowrap" >Claim Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
              <th scope="row">{ind + 1}</th>
              <td className=""><span className={(item?.currentStatus == "reject" || item?.currentStatus == "pending") ? " badge bg-danger text-white" : "badge bg-primary"}>{item?.currentStatus}</span></td>
              <td className="">
                <div className="d-flex">
                </div> <span className="d-flex align-items-center gap-2">
                  <span style={{ cursor: "pointer" }} onClick={() => navigate(`/client/view case/${item._id}`)}><HiMiniEye /></span>
                  {/* <span style={{ cursor: "pointer" }} onClick={() => navigate(`/client/edit case/${item._id}`)}><CiEdit /></span> */}
              </span></td>
              <td className="text-nowrap">{new Date(item?.createdAt).toLocaleDateString()}</td>
              <td className="text-nowrap">{item?.name}</td>
              <td className="text-nowrap">{item?.fileNo}</td>
              {/* <td>{item?.name}</td>
              <td>{item?.email}</td>
              <td>{item?.mobileNo}</td> */}
              <td className="text-nowrap">{item?.policyNo}</td>
              <td className="text-nowrap">{item?.policyType}</td>
              <td className="text-nowrap">{item?.complaintType}</td>
              <td className="text-nowrap">{item?.claimAmount}</td>
            </tr>)}
          </tbody>
        </table>

      </div>

      <div className="d-flex flex align-items-center justify-content-center">

        <ReactPaginate
          breakLabel="..."
          nextLabel={<BiRightArrow className="text-white"/>}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(noOfCase / pageItemLimit) || 1}
          previousLabel={<BiLeftArrow className="text-white"/>}
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
}







 
  </>)
}