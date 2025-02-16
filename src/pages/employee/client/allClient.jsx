import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate, getFormateDate } from "../../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import { Link, useLocation, useNavigate } from "react-router-dom"
import {BiLeftArrow} from 'react-icons/bi'
import {BiRightArrow} from 'react-icons/bi'
import { adminSetClientStatus,employeeAllClient,empClientDownload } from "../../../apis"
import Loader from "../../../components/Common/loader"
import loash from 'lodash'
import { AppContext } from "../../../App"
import { useContext } from "react"
import DateSelect from "../../../components/Common/DateSelect"
import { CiFilter } from "react-icons/ci";
import { SiMicrosoftexcel } from "react-icons/si"

 
export default function EmployeeAllClient() {
  const stateContext = useContext(AppContext)
  const empType  = stateContext?.myAppData?.details?.empType
  const [data, setData] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const [isSearch,setIsSearch] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pageItemLimit, setPageItemLimit] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit :10)
  const [searchQuery, setSearchQuery] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery :"")
  const [noOfClient, setNoOfClient] = useState(0)
  const [pgNo, setPgNo] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo :1)
  const [changeStatus, setChangeStatus] = useState({show: false, details: "" })
  const [showCalender, setShowCalender] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [dateRange, setDateRange] = useState(
    location?.pathname==location?.state?.path && location?.state?.filter?.dateRange ? location?.state?.filter?.dateRange : {
      startDate: new Date("2024/01/01"),
      endDate: new Date(),
    });

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange({ startDate: new Date("2024/01/01"), endDate: new Date()})
    setPgNo(1)
  }

  const getAllClient =async()=>{
    setLoading(true)
    try {
      const startDate = dateRange?.startDate ? getFormateDate(dateRange?.startDate) : ""
      const endDate = dateRange?.endDate ? getFormateDate(dateRange?.endDate) : ""
      const res = await employeeAllClient(pageItemLimit, pgNo, searchQuery,startDate,endDate)
      // console.log("allAdminClient", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data])
        setNoOfClient(res?.data?.noOfClient)
        setLoading(false)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      // console.log("allAdminClient error", error);
    }
  }

  useEffect(() => {
   getAllClient()
  }, [pageItemLimit, pgNo,changeStatus])


  useEffect(()=>{
    if(isSearch){
      let debouncedCall = loash.debounce(function () {
        getAllClient()
        setPgNo(1)
        setPageItemLimit(5)
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



  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };


  const handleDownload = async () => {
    try {
      const type = true
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      setDownloading(true)
      const res = await empClientDownload(searchQuery,startDate,endDate)
      if (res?.status == 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Clients.xlsx'; // Specify the filename here
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Download the excel")
        setDownloading(false)
      } else {
        setDownloading(false)

      }
    } catch (error) {
      console.log("error", error);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Failed to download")
      }
      setDownloading(false)
    }
  }

const filter = {
  pageItemLimit,
  pgNo,
  searchQuery,
  dateRange
}

  return (<>
  {loading ? <Loader/> : 
    <div>
        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllClient} dateRange={dateRange} setDateRange={setDateRange} />
    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
          {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/employee/dashboard")} style={{ cursor: "pointer" }} /> */}
          <div className="d-flex flex align-items-center gap-1">
            <span>All Client</span>
            {/* <span><LuPcCase /></span> */}
          </div>
        </div>
      </div>

      <div className="m-md-5 p-md-4">
      <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
      <div className="d-flex flex gap-2">
       
          <div className="form-control px-2 d-flex gap-2">
            <span className=""><BsSearch className="text-black" /></span>
            <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
          </div>
          <div className="btn btn-primary" onClick={() => setShowCalender(!showCalender)}><CiFilter/></div>
          <div className="btn btn-primary" onClick={() => handleReset()}>Reset</div>
          <button className={`btn btn-primary fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-sm"></span> : <SiMicrosoftexcel />}</button>
        
        
            <div className="">
              <select className="form-select" name="pageItemLimit" value={pageItemLimit} onChange={(e) => setPageItemLimit(e.target.value)} aria-label="Default select example">
                <option value="">No. of Items</option>
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
              <th scope="col" className="text-nowrap">SL No</th>
              <th scope="col" className="text-nowrap" ><span>Action</span></th>
              <th scope="col" className="text-nowrap">Branch ID</th>
                      <th scope="col" className="text-nowrap">Associate With Us</th>
                      <th scope="col" className="text-nowrap">Client Name</th>
                      <th scope="col" className="text-nowrap" >Client Code</th>
                      <th scope="col" className="text-nowrap" >Mobile No</th>
                      <th scope="col" className="text-nowrap" >Email Id</th>
                      <th scope="col" className="text-nowrap" >City</th>
                      <th scope="col" className="text-nowrap" >State</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
              <th scope="row" className="text-nowrap">{ind + 1}</th>
              <td className="text-nowrap"><span className="d-flex align-items-center gap-2">
              <span  style={{ height: 30, width: 30, borderRadius: 30 }} className="cursor-pointer bg-success text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/employee/client details/${item._id}`,{state:{filter,back:location?.pathname,path:location?.pathname}})}><HiMiniEye /></span>
              {empType?.toLowerCase()=="operation" && <>
              <Link to={`/employee/edit-client/${item?._id}`} state={{filter,back:location?.pathname,path:location?.pathname}} style={{ height: 30, width: 30, borderRadius: 30 }} className="cursor-pointer bg-info text-white d-flex align-items-center justify-content-center"><CiEdit className="fs-5 text-dark"/></Link>
              </>}
              </span></td>
              <td className="text-nowrap">{item?.branchId}</td>
              <td className="text-nowrap">{item?.profile?.associateWithUs && getFormateDMYDate(item?.profile?.associateWithUs)}</td>
              <td className="text-nowrap">{item?.profile?.consultantName}</td>
              <td className="text-nowrap">{item?.profile?.consultantCode}</td>
              <td className="text-nowrap">{item?.profile?.primaryMobileNo}</td>
              <td className="text-nowrap">{item?.profile?.primaryEmail}</td>
              <td className="text-nowrap">{item?.profile?.city}</td>
              <td className="text-nowrap">{item?.profile?.state}</td>
              {/* <td className="text-nowrap">{item?.profile?.gender}</td> */}
              {/* <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{item?.isActive ? "Active" : "Unactive"}</span> </td> */}
              
            </tr>)}
          </tbody>
        </table>

      </div>

      <div className="d-flex flex align-items-center justify-content-center">

        <ReactPaginate
          breakLabel="..."
          nextLabel={<BiRightArrow/>}
          onPageChange={handlePageClick}
          pageRangeDisplayed={4}
          breakClassName={""}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(noOfClient / pageItemLimit)||1}
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

    </div>}
  </>)
}