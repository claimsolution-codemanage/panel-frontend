import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import { caseStatus } from "../../../utils/constant"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate, getFormateDate } from "../../../utils/helperFunction"
import { CiEdit } from 'react-icons/ci'
import ChangeStatusModal from "../../Common/Modal/changeStatusModal"
import { useLocation, useNavigate } from "react-router-dom"
import Loader from "../../../components/Common/loader"
import { CiFilter } from "react-icons/ci";
import loash from 'lodash'
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc'
import DateSelect from "../../Common/Modal/DateSelect"
import PaginateField from "../../Common/PaginateField"

export default function CaseWeeklyFollowUpComp({ getCases,role, viewUrl,
  setStatus, editUrl,
  isChangeStatus, isEdit,
  empId, id, isReject, attachementUpload
}) {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [statusType, setStatusType] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.statusType ? location?.state?.filter?.statusType : "")
  const [pageItemLimit, setPageItemLimit] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit : 10)
  const [showCalender, setShowCalender] = useState(false)
  const [searchQuery, setSearchQuery] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery : "")
  const [noOfCase, setNoOfCase] = useState(0)
  const [pgNo, setPgNo] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo : 1)
  const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
  const [isSearch, setIsSearch] = useState(false)
  const [dateRange, setDateRange] = useState(
    location?.pathname == location?.state?.path && location?.state?.filter?.dateRange ? location?.state?.filter?.dateRange : {
      startDate: new Date("2024/01/01"),
      endDate: new Date(),
    }
  );

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(10)
    setDateRange([{ startDate: new Date("2024/01/01"), endDate: new Date() }])
    setStatusType("")
  }

  const getAllCases = async () => {
    setLoading(true)
    try {
      const type = true
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      const res = await getCases({pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate, type, empId, id,isReject:false,isWeeklyFollowUp:true})
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
    if ( !changeStatus.status) {
      getAllCases()
    }
  }, [pageItemLimit, pgNo, statusType, changeStatus])

  useEffect(() => {
    if (isSearch) {
      let debouncedCall = loash.debounce(function () {
        getAllCases()
        setIsSearch(false)
        setPgNo(1)
        setPageItemLimit(5)
      }, 1000);
      debouncedCall();
      return () => {
        debouncedCall.cancel();
      };
    }

  }, [searchQuery, isSearch])


  const handleSearchQuery = (value) => {
    setIsSearch(true)
    setSearchQuery(value)
  }

  const handlePageClick = (event) => {
    setPgNo(event.selected + 1)
  };


  const filter = {
    pageItemLimit,
    pgNo,
    searchQuery,
    dateRange,
    statusType
  }


  return (<>
    {loading ? <Loader /> :
      <div>
        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllCases} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            <div className="d-flex flex align-items-center gap-1">
              <span>Weekly Follow-Up</span>
            </div>
          </div>
        </div>


        <div className="mx-md-5 m-sm-0 p-3">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="row p-0 mb-2">
              <div className="col-12 col-md-3 mb-2 mb-md-0">
                <div className="form-control col-4 col-md-4 px-2 d-flex gap-2">
                  <span className=""><BsSearch className="text-black" /></span>
                  <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
                </div>
              </div>
              <div className="col-12 col-md-9">
                <div className="row">
                  <div className="col-12 col-md-7 d-flex gap-3 mb-2 mb-md-0">
                    <div className="btn btn-primary fs-5" onClick={() => setShowCalender(!showCalender)}><CiFilter /></div>
                    <div className="btn btn-primary fs-5" onClick={() => handleReset()}>Reset</div> </div>
                  <div className="col-12 col-md-3 mb-2 mb-md-0">
                    <select className="form-select" name="caseStaus" value={statusType} onChange={(e) => setStatusType(e.target.value)} aria-label="Default select example">
                      <option value="">--Select Case Status</option>
                      {caseStatus?.map(typeCase => <option key={typeCase} value={typeCase}>{typeCase}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-2 mb-2 mb-md-0">
                    <select className="form-select" name="pageItemLimit" value={pageItemLimit} onChange={(e) => { setPageItemLimit(e.target.value); setPgNo(1) }} aria-label="Default select example">
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
            <div className="mt-4 overflow-auto">
              <table className="table table-responsive rounded-2 shadow table-borderless">
                <thead>
                  <tr className="bg-primary text-white text-center">
                    <th scope="col" className="text-nowrap" >SL No</th>
                    <th scope="col" className="text-nowrap">Action</th>
                    <th scope="col" className="text-nowrap" >Branch ID</th>
                    <th scope="col" className="text-nowrap" >Current Status</th>
                    <th scope="col" className="text-nowrap" >Date</th>
                    <th scope="col" className="text-nowrap" >Case From</th>
                    <th scope="col" className="text-nowrap" >Team Added by</th>
                    <th scope="col" className="text-nowrap" >Partner Name</th>
                    <th scope="col" className="text-nowrap"  >Case Name</th>
                    <th scope="col" className="text-nowrap"  >Mobile No</th>
                    <th scope="col" className="text-nowrap"  >Email Id</th>
                    <th scope="col" className="text-nowrap"  >Claim Amount</th>
                    <th scope="col" className="text-nowrap"  >Policy No</th>
                    <th scope="col" className="text-nowrap" >File No</th>
                    <th scope="col" className="text-nowrap"  >Policy Type</th>
                    <th scope="col" className="text-nowrap"  >complaint Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                    <th scope="row">{ind + 1}</th>
                    <td className="text-nowrap">
                      <span className="d-flex gap-2"><span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`${viewUrl}${item._id}`, { state: { filter, back: location?.pathname, path: location?.pathname } })}><HiMiniEye /></span>
                        {isEdit && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => navigate(`${editUrl}${item._id}`, { state: { filter, back: location?.pathname, path: location?.pathname } })}><CiEdit /></span>}
                        {isChangeStatus && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ status: true, details: item })}><VscGitPullRequestGoToChanges /></span>}
                      </span></td>
                    
                     <td className="text-nowrap">{item?.branchId}</td>
                    <td className=" text-nowrap"><span className={(item?.currentStatus?.toLowerCase() == "reject" ? "badge bg-danger text-white" : (item?.currentStatus?.toLowerCase() == "pending" ? "badge bg-warning" : (item?.currentStatus?.toLowerCase() == "resolve" ? "badge bg-success" : "badge bg-primary")))}>{item?.currentStatus}</span></td>
                    <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
                    <td className="text-nowrap text-capitalize">{item?.caseFrom}</td>
                    <td className="text-nowrap text-capitalize" >{item?.employeeDetails?.fullName ? `${item?.employeeDetails?.fullName} | ${item?.employeeDetails?.type} | ${item?.employeeDetails?.designation}` : "-"}</td>
                    <td className="text-nowrap text-capitalize" >{item?.partnerDetails?.profile?.consultantName || "-"}</td>
                    <td className="text-nowrap">{item?.name}</td>
                    <td className="text-nowrap">{item?.mobileNo}</td>
                    <td className="text-nowrap">{item?.email}</td>
                    <td className="text-nowrap">{item?.claimAmount}</td>
                    <td className="text-nowrap">{item?.policyNo}</td>
                    <td className="text-nowrap">{item?.fileNo}</td>
                    <td className="text-nowrap">{item?.policyType}</td>
                    <td className="text-nowrap">{item?.complaintType}</td>
                  </tr>)}
                </tbody>
              </table>

            </div>

            <div className="d-flex flex align-items-center justify-content-center">
              <PaginateField pgNo={pgNo} pageCount={Math.ceil(noOfCase / pageItemLimit) || 1} handlePageClick={handlePageClick} />
            </div>

          </div>
          {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={setStatus} role="admin" attachementUpload={attachementUpload} />}
        </div>

      </div>}
  </>)
}
