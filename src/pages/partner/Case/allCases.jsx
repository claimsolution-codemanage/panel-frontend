import { allCasePartner } from "../../../apis"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import { caseStatus } from "../../../utils/constant"
import { DateRangePicker } from 'react-date-range';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getFormateDate } from "../../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import { useNavigate } from "react-router-dom"
import Loader from "../../../components/Common/loader"
import loash from 'lodash'


export default function AllPartnerCase() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [statusType, setStatusType] = useState("")
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [showCalender, setShowCalender] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [noOfCase, setNoOfCase] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date("2023/01/01"),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange([{ startDate: new Date("2023/01/01"), endDate: new Date(), key: 'selection' }])
    setStatusType("")
    setShowCalender(false)
  }


  const getCases = async () => {
    setLoading(true)
    try {
      const startDate = dateRange[0].startDate ? getFormateDate(dateRange[0].startDate) : ""
      const endDate = dateRange[0].endDate ? getFormateDate(dateRange[0].endDate) : ""
      // console.log("start", startDate, "end", endDate);
      const res = await allCasePartner(pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate)
      // console.log("allCasePartner", res?.data?.data);
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
      // console.log("allCasePartner error", error);
    }
  }


  useEffect(() => {
    getCases()
  }, [pageItemLimit, pgNo, dateRange, statusType])

  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event?.selected + 1)

  };


  useEffect(() => {
    if(searchQuery){
      let debouncedCall = loash.debounce(function () {
        getCases()
      }, 1000);
      debouncedCall();
      return () => {
        debouncedCall.cancel();
      };
    }
  }, [searchQuery])


  // console.log("data", data);

  // console.log("range", dateRange);
  return (<>
    {loading ? <Loader /> :
      <div>
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow" >
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate('/partner/dashboard')} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
              <span>All Case</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>

          {/* <div className="d-flex gap-1 badge bg-primary mb-1" onClick={()=>navigate("/partner/edit banking details")} style={{cursor:"pointer"}}>
                <span><CiEdit/></span>
                <span>Edit</span>
            </div> */}

        </div>
        <div className="m-md-5 p-2 p-md-3">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="row p-0 mb-2">
              <div className="col-12 col-md-3 pb-2 pb-md-0">
                <div className="form-control col-4 col-md-4 px-2 d-flex gap-2">
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
              <div className="position-relative">
                <div className="d-flex align-items-center position-absolute  mt-2 justify-content-center m-0">
                  {showCalender && <DateRange
                    onChange={item => {
                      setDateRange([item.selection]);

                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={dateRange}
                    editableDateInputs={true}
                    className=""
                    direction="horizontal"
                  />}
                </div>
              </div>
              <div className="mt-4 overflow-auto table-responsive">
                <table className="table table-responsive rounded-2 shadow table-borderless">
                  <thead>
                    <tr className="bg-primary text-white text-center">
                      <th scope="col" className="text-nowrap"><th scope="col" >S.no</th></th>
                      <th scope="col" className="text-nowrap" ><span>Action</span></th>
                      <th scope="col" className="text-nowrap">Date</th>
                      <th scope="col" className="text-nowrap">Current Status</th>
                      <th scope="col" className="text-nowrap">File No</th>
                      <th scope="col" className="text-nowrap" >Name</th>
                      <th scope="col" className="text-nowrap" >Mobile No.</th>
                      <th scope="col" className="text-nowrap" >Policy No</th>
                      <th scope="col" className="text-nowrap" >Policy Type</th>
                      <th scope="col" className="text-nowrap" >complaint Type</th>
                      <th scope="col" className="text-nowrap" >Claim Amount</th>
                      <th scope="col" className="text-nowrap" >Email</th>
                    </tr>
                  </thead>
                  <tbody>

                    {data.map((item, ind) => <tr key={item._id}>
                      <th className="text-nowrap" scope="row">{ind + 1}</th>
                      <td className="text-nowrap">
                        <div className="d-flex gap-2">
                          <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/partner/view case/${item._id}`)}><HiMiniEye /></span>
                          {/* <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/partner/edit case/${item._id}`)}><CiEdit /></span> */}
                          </div></td>
                      <td className="text-nowrap">{new Date(item?.createdAt).toLocaleDateString()}</td>
                      <td className="text-nowrap"><span className={(item?.currentStatus == "reject" || item?.currentStatus == "pending") ? "badge bg-danger text-white" : "badge bg-primary"}>{item?.currentStatus}</span></td>
                      <td className="text-nowrap">{item?.fileNo}</td>
                      <td className="text-nowrap">{item?.name}</td>
                      <td className="text-nowrap">{item?.mobileNo}</td>
                      <td className="text-nowrap">{item?.policyNo}</td>
                      <td className="text-nowrap">{item?.policyType}</td>
                      <td className="text-nowrap">{item?.complaintType}</td>
                      <td className="text-nowrap">{item?.claimAmount}</td>
                      <td className="text-nowrap">{item?.email}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex flex align-items-center justify-content-center">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<BiRightArrow />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(noOfCase / pageItemLimit) || 1}
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
      </div>}
  </>)
}