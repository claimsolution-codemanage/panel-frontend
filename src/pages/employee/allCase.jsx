import { employeeAllCase } from "../../apis"
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
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"
import {BiLeftArrow} from 'react-icons/bi'
import {BiRightArrow} from 'react-icons/bi'
import { employeeChangeCaseStatus } from "../../apis"
import Loader from "../../components/Common/loader"
import { AppContext } from "../../App"
import { useContext} from "react"
import loash from 'lodash'
import { Link } from "react-router-dom"
 
export default function EmployeeAllCase() {
  const state = useContext(AppContext)
  const [data, setData] = useState([])
  const empType  = state?.myAppData?.details?.empType
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
  }


  const getAllCase =async()=>{
    setLoading(true)
    try {
      const startDate = dateRange[0].startDate ? getFormateDate(dateRange[0].startDate) : ""
      const endDate = dateRange[0].endDate ? getFormateDate(dateRange[0].endDate) : ""
      // console.log("start", startDate, "end", endDate);
      const res = await employeeAllCase(pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate)
      // console.log("allAdminCase", res?.data?.data);
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
    getAllCase()
  }, [pageItemLimit, pgNo, dateRange, statusType, changeStatus])

  useEffect(() => {
    if(searchQuery){
      let debouncedCall = loash.debounce(function () {
        getAllCase()
      }, 1000);
      debouncedCall();
      return () => {
        debouncedCall.cancel();
      };
    }
  }, [searchQuery])


  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };


  console.log("empType", empType);
  // console.log("chagne status", changeStatus.details.currentStatus);

  // console.log("range",dateRange);
  return (<>
  {loading ? <Loader/> :
    <div>
    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
          {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/employee/dashboard")} style={{ cursor: "pointer" }} /> */}
          <div className="d-flex flex align-items-center gap-1">
            <span>All Cases</span>
            {/* <span><LuPcCase /></span> */}
          </div>
        </div>
</div>


      <div className="m-5 p-3">
      <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
      <div className="row p-0 mb-2">
        <div className="col-12 col-md-3">
          <div className="form-control col-4 col-md-4 px-2 d-flex gap-2">
            <span className=""><BsSearch className="text-black" /></span>
            <input className="w-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
          </div>
        </div>
        <div className="col-12 col-md-9">
          <div className="row">
            <div className="col-12 col-md-7 d-flex gap-3">
              <div className="btn btn-primary" onClick={() => setShowCalender(!showCalender)}>Filter</div>
              <div className="btn btn-primary" onClick={() => handleReset()}>Reset</div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" name="caseStaus" value={statusType} onChange={(e) => setStatusType(e.target.value)} aria-label="Default select example">
                <option value="">--select Case Status</option>
                {caseStatus?.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2">
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
                moveRangeOnFirstSelection={false}
                direction="horizontal"
              // preventSnapRefocus={true}
              // calendarFocus="backwards"
              />}
          </div>
          </div>

      <div className="mt-4 overflow-auto">
        <table className="table table-responsive rounded-2 shadow table-borderless">
          <thead>
            <tr className="bg-primary text-white text-center">
              <th scope="col" className="text-nowrap" ><th scope="col" >S.no</th></th>
              <th scope="col" className="text-nowrap">Action</th>
              <th scope="col" className="text-nowrap" >Current Status</th>
              {empType?.toLowerCase()=="finance" && <th scope="col" className="text-nowrap">Invoice</th>}
              <th scope="col" className="text-nowrap" >Date</th>
              <th scope="col" className="text-nowrap" >File No</th>
              <th scope="col" className="text-nowrap"  >Name</th>
              <th scope="col" className="text-nowrap"  >Email</th>
              <th scope="col" className="text-nowrap"  >Mobile No.</th>
              <th scope="col" className="text-nowrap"  >Policy No</th>
              <th scope="col" className="text-nowrap"  >Policy Type</th>
              <th scope="col" className="text-nowrap"  >complaint Type</th>
              <th scope="col" className="text-nowrap"  >Claim Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, ind) => <tr key={item._id} className="border-2 text-nowrap border-bottom border-light text-center">
              <th scope="row">{ind + 1}</th>
              <td><span className="d-flex gap-1">
                <span style={{ cursor: "pointer" }} onClick={() => navigate(`/employee/view case/${item._id}`)}><HiMiniEye className="fs-5 text-dark"/></span> 
                {empType?.toLowerCase()=="assistant" && <span style={{ cursor: "pointer" }} onClick={() => setChangeStatus({ status: true, details: item })}><CiEdit className="fs-5 text-info"/></span>}
                 </span></td>
              <td className="text-nowrap"><span className={(item?.currentStatus == "reject" || item?.currentStatus == "pending") ? " badge bg-danger text-white" : "badge bg-primary"}>{item?.currentStatus}</span></td>
              <td className="text-nowrap">
              {empType?.toLowerCase()=="finance"  && <span>
                {item?.caseFrom?.toLowerCase()=="client" ?
                <Link to={`/employee/create-invoice/${item?.clientId}/${item?._id}`}><span className="badge bg-primary" style={{ cursor: "pointer" }}>Create</span></Link>
                : <span className="badge bg-secondary">Create</span>
                 }
                </span> }
              </td>
              <td className="text-nowrap">{new Date(item?.createdAt).toLocaleDateString()}</td>
              <td className="text-nowrap">{item?.fileNo}</td>
              <td className="text-nowrap">{item?.name}</td>
              <td className="text-nowrap">{item?.email}</td>
              <td className="text-nowrap">{item?.mobileNo}</td>
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
          nextLabel={<BiRightArrow/>}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(noOfCase / pageItemLimit)||1}
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
    {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={employeeChangeCaseStatus} role="employee" />}

      </div>

    </div>
}







 
  </>)
}