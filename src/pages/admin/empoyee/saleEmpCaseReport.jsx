import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import { caseStatus } from "../../../utils/constant"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate, getFormateDate } from "../../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import ChangeStatusModal from "../../../components/Common/Modal/changeStatusModal"
import { useLocation, useNavigate } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import { adminChangeCaseStatus, adminShareCaseToEmployee, adminViewSaleEmpCaseReport, adminSaleEmpCaseReportDownload } from "../../../apis"
import Loader from "../../../components/Common/loader"
import { IoShareSocialOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import ShareCaseModal from "../../../components/Common/Modal/shareCaseModal"
import loash from 'lodash'
import { AiOutlineDelete } from "react-icons/ai";
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc'
import { adminSetCaseIsActive } from "../../../apis"
import SetStatusOfProfile from "../../../components/Common/Modal/setStatusModal"
import { useParams } from "react-router-dom"
import DateSelect from "../../../components/Common/Modal/DateSelect"
import { SiMicrosoftexcel } from "react-icons/si";
import { adminAttachementUpload } from "../../../apis/upload"

export default function AdminViewSaleEmpCaseReport() {
  const [data, setData] = useState([])
  const param = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [statusType, setStatusType] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.statusType ? location?.state?.filter?.statusType :"")
  const [pageItemLimit, setPageItemLimit] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit :10)
  const [showCalender, setShowCalender] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery :"")
  const [noOfCase, setNoOfCase] = useState(0)
  const [pgNo, setPgNo] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo :1)
  const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
  const [shareCase, setShareCase] = useState([])
  const [caseShareModal, setCaseShareModal] = useState({ status: false, value: [] })
  const [isClipBoardCopy, setIsClipBoardCopy] = useState({ id: "", copied: false, value: "" })
  const [deleteCase, setDeleteCase] = useState({ status: false, id: "" })
  const [changeisActiveStatus, setChangeIsActiveStatus] = useState({ show: false, details: {} })
  const [caseAmt, setCaseAmt] = useState(0)
  const [userReport, setUserReport] = useState({})
  const [downloading, setDownloading] = useState(false)
  const [dateRange, setDateRange] = useState(
    location?.pathname==location?.state?.path && location?.state?.filter?.dateRange ? location?.state?.filter?.dateRange : {
      startDate: new Date("2024/01/01"),
      endDate: new Date(),
    }
  );

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange({ startDate: new Date("2024/01/01"), endDate: new Date() })
    setStatusType("")
  }

  const getAllCases = async () => {
    if (param?._id) {
      setLoading(true)
      try {
        const type = true
        const startDate = dateRange?.startDate ? getFormateDate(dateRange?.startDate) : ""
        const endDate = dateRange?.endDate ? getFormateDate(dateRange?.endDate) : ""
        // console.log("start", startDate, "end", endDate);
        const res = await adminViewSaleEmpCaseReport(param?._id, pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate, type)
        // console.log("allAdminCase", res?.data?.data);
        if (res?.data?.success && res?.data?.data) {
          setData([...res?.data?.data])
          setNoOfCase(res?.data?.noOfCase)
          setCaseAmt(res?.data?.totalAmt?.[0]?.totalAmtSum)
          setUserReport(res?.data?.user)
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
  }

  const handleDownload = async () => {
    try {
      const type = true
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      setDownloading(true)
      const res = await adminSaleEmpCaseReportDownload(param?._id, searchQuery, statusType, startDate, endDate, type)
      // console.log("res", res);
      if (res?.status == 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Sales-Case-Report.xlsx'; // Specify the filename here
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



  useEffect(() => {
    if (!deleteCase.status || !changeisActiveStatus.show) {
      getAllCases()
    }
  }, [pageItemLimit, pgNo, statusType, changeStatus, changeisActiveStatus, deleteCase])

  useEffect(() => {
    if (isSearch) {
      let debouncedCall = loash.debounce(function () {
        getAllCases()
        setIsSearch(false)
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
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };

  const handleChanges = async (_id, status) => {
    try {
      const res = await adminSetCaseIsActive(_id, status)
      if (res?.data?.success) {
        setChangeIsActiveStatus({ show: false, details: {} })
        toast.success(res?.data?.message)

      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      // console.log("allAdminCase isActive error", error);
    }
  }



  const handleShareOnchange = (e, id) => {
    const { value, checked } = e.target
    if (!checked) {
      const newShareList = shareCase.filter(caseShare => caseShare != id)
      setShareCase(newShareList)
    } else {
      const newCaseList = [...shareCase]
      newCaseList.push(id)
      // console.log("newList", newCaseList);
      setShareCase(newCaseList)
    }
  }

  const filter = {
    pageItemLimit,
    pgNo,
    searchQuery,
    dateRange,
    statusType
  }

  const handleBack = () => {
    if(location?.state?.filter && location?.state?.back){
        navigate(location?.state?.back,{state:{...location?.state,back:location?.pathname}});
    }else{
        navigate(-1)
    }
  };

  return (<>
    {loading ? <Loader /> :
      <div>
        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllCases} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            <IoArrowBackCircleOutline className="fs-3" onClick={handleBack} style={{ cursor: "pointer" }} />
            <div className="d-flex flex align-items-center gap-1">
              <span>All Case</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
          <button onClick={() => navigate(`/admin/partner details/${param._id}`,{state:{filter,back:location?.pathname,path:location?.pathname}})} className="btn btn-primary">View</button>
        </div>

        <div className="mx-5 p-3">
          <div className="row row-cols-1 row-cols-md-2 h-auto">
            {/* <div className="border-end">
              <div className="bg-color-1 border-0 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                <div className='d-flex align-items-center justify-content-around'>
                  <div className="text-center ">
                    <h5 className='fw-bold h5'>{userReport?.profile?.consultantName}</h5>
                    <p className='card-title fs-5 text-primary text-capitalize'>{userReport?.profile?.consultantCode}</p>
                  </div>
                 
                </div></div>
            </div> */}

            <div className="border-end">
              <div className="bg-color-1  border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                <div className='d-flex align-items-center justify-content-around'>
                  <div className="text-center ">
                    <h3 className='fw-bold h2'>{noOfCase}</h3>
                    <p className='card-title fs-5 text-primary text-capitalize'>Total Case</p>
                  </div>
                  {/* <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div> */}
                </div></div>
            </div>

            <div className=" border-end">
              <div className="bg-color-1  border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                <div className='d-flex align-items-center justify-content-around'>
                  <div className="text-center ">
                    <h3 className='fw-bold h2'>{caseAmt ? caseAmt : 0}</h3>
                    <p className='card-title fs-5 text-primary text-capitalize'>Total Case Amount</p>
                  </div>
                  {/* <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div> */}
                </div></div>
            </div>
          </div>
        </div>

        <div className="mx-md-5 m-sm-0 p-3">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="row p-0 mb-2">
              <div className="col-12 col-md-3">
                <div className="form-control col-4 col-md-4 px-2 d-flex gap-2">
                  <span className=""><BsSearch className="text-black" /></span>
                  <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
                </div>
              </div>
              <div className="col-12 col-md-9">
                <div className="row">
                  <div className="col-12 col-md-7 d-flex gap-3">
                    <div className="btn btn-primary fs-5" onClick={() => setShowCalender(!showCalender)}><CiFilter /></div>
                    <div className="btn btn-primary fs-5" onClick={() => handleReset()}>Reset</div>
                    <button className={`btn btn-primary fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-sm"></span> : <SiMicrosoftexcel />}</button>

                    {shareCase?.length > 0 && <div className="btn btn-primary fs-5" onClick={() => setCaseShareModal({ status: true, value: shareCase })}><IoShareSocialOutline /></div>}
                  </div>
                  <div className="col-12 col-md-3">
                    <select className="form-select" name="caseStaus" value={statusType} onChange={(e) => setStatusType(e.target.value)} aria-label="Default select example">
                      <option value="">--Select Case Status</option>
                      {caseStatus?.map(typeCase => <option key={typeCase} value={typeCase}>{typeCase}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-2">
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
                    {/* <th scope="col" className="text-nowrap" ><th scope="col" ></th></th> */}
                    <th scope="col" className="text-nowrap" ><th scope="col" >SL No</th></th>
                    <th scope="col" className="text-nowrap">Action</th>
                   {<th scope="col" className="text-nowrap" >Branch ID</th> }
                    <th scope="col" className="text-nowrap" >Current Status</th>
                    {/* <th scope="col" className="text-nowrap" >Reference</th> */}
                    <th scope="col" className="text-nowrap" >Date</th>
                   { <th scope="col" className="text-nowrap" >Case From</th> }
                   { <th scope="col" className="text-nowrap" >Team Added by</th> }
                   { <th scope="col" className="text-nowrap" >Partner Name</th> }
                   {/* {(role?.toLowerCase()!="client" && role?.toLowerCase()!="partner" ) && <th scope="col" className="text-nowrap" >Partner Consultant Code</th> } */}
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
                    {/* <td className="text-nowrap"><input class="form-check-input" name="shareCase" type="checkbox" checked={shareCase.includes(item?._id)} onChange={(e) => handleShareOnchange(e, item?._id)} id="flexCheckDefault" /></td> */}
                    <th scope="row">{ind + 1}</th>
                    <td className="text-nowrap">
                      <span className="d-flex gap-2"><span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/admin/view case/${item._id}`)}><HiMiniEye /></span>
                        <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => navigate(`/admin/edit%20case/${item._id}`)}><CiEdit /></span>
                        <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ status: true, details: item })}><VscGitPullRequestGoToChanges /></span>
                        <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setChangeIsActiveStatus({ show: true, details: { _id: item._id, currentStatus: item?.isActive, name: item?.name, recovery: false } })}><AiOutlineDelete /></span>
                        {/* <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setDeleteCase({status:true,id:item?._id})}><AiOutlineDelete /></span> */}
                      </span></td>
                    {/* <td className="text-nowrap">
                      {item?.caseFrom == "partner" && item?.partnerId && <CopyToClipboard text={isClipBoardCopy?.value}
                        onCopy={() => { setIsClipBoardCopy(()=>{ return { id: item?._id, copied: true, value: `partnerId=${item?.partnerId}&partnerCaseId=${item?._id}` }}); }}>
                        <span>{(isClipBoardCopy?.id == item?._id && isClipBoardCopy?.copied) ? <BsClipboardCheck className="text-primary fs-4" /> : <BsClipboard />} </span>
                        </CopyToClipboard>}
                      </td> */}
                   {<td className="text-nowrap">{item?.branchId}</td>}
                      <td className=" text-nowrap"><span className={(item?.currentStatus?.toLowerCase() == "reject" ? "badge bg-danger text-white" : (item?.currentStatus?.toLowerCase() == "pending" ?  "badge bg-warning" : (item?.currentStatus?.toLowerCase() == "resolve" ? "badge bg-success" :"badge bg-primary") ))}>{item?.currentStatus}</span></td>
                              <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
                   {<td className="text-nowrap text-capitalize">{item?.caseFrom}</td>}
                   {<td className="text-nowrap text-capitalize" >{item?.employeeDetails?.fullName ? `${item?.employeeDetails?.fullName} | ${item?.employeeDetails?.type} | ${item?.employeeDetails?.designation}`  : "-"}</td> }
                   {<td className="text-nowrap text-capitalize" >{item?.partnerDetails?.fullName || "-"}</td> }
                   {/* {(role?.toLowerCase()!="client" && role?.toLowerCase()!="partner" ) && <td className="text-nowrap text-capitalize" >{item?.partnerCode || "-"}</td> } */}
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

              <ReactPaginate
                breakLabel="..."
                nextLabel={<BiRightArrow />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={4}
                breakClassName={""}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(noOfCase / pageItemLimit) || 1}
                previousLabel={<BiLeftArrow />}
                className="d-flex flex gap-2"
                pageClassName="border border-primary paginate-li"
                previousClassName="paginate-li bg-color-3"
                nextClassName="paginate-li bg-color-3"
                activeClassName="bg-primary text-white"
                forcePage={pgNo > 0 ? pgNo - 1 : 0}
                renderOnZeroPageCount={null}
              />
            </div>

          </div>
          {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={adminChangeCaseStatus} role="admin" attachementUpload={adminAttachementUpload}/>}
          {caseShareModal?.status && <ShareCaseModal handleShareCase={adminShareCaseToEmployee} caseShareModal={caseShareModal} close={() => { setCaseShareModal({ value: [], status: false }); setShareCase([]) }} />}
          {/* {deleteCase?.status && <ConfirmationModal show={deleteCase?.status} id={deleteCase?.id} hide={()=>setDeleteCase({status:false,id:""})} heading="Are you sure?" text="Your want to delete this case" handleComfirmation={adminDeleteCaseById}/>}  */}
          {changeisActiveStatus?.show && <SetStatusOfProfile changeStatus={changeisActiveStatus} hide={() => setChangeIsActiveStatus({ show: false, details: {} })} type="Case" handleChanges={handleChanges} />}
        </div>
      </div>}
  </>)
}