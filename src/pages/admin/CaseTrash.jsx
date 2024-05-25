import { allAdminCase } from "../../apis"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import { caseStatus } from "../../utils/constant"
import { DateRangePicker } from 'react-date-range';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate, getFormateDate } from "../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import { FaCircleArrowDown } from 'react-icons/fa6'
import { LuPcCase } from 'react-icons/lu'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import { useNavigate } from "react-router-dom"
import {BiLeftArrow} from 'react-icons/bi'
import {BiRightArrow} from 'react-icons/bi'
import { adminChangeCaseStatus,adminShareCaseToEmployee } from "../../apis"
import Loader from "../../components/Common/loader"
import { IoShareSocialOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { TbZoomReset } from "react-icons/tb";
import ShareCaseModal from "../../components/Common/shareCaseModal"
import loash from 'lodash'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { BsClipboard,BsClipboardCheck } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationModal from "../../components/Common/confirmationModal"
import { adminDeleteCaseById } from "../../apis"
import {VscGitPullRequestGoToChanges} from 'react-icons/vsc'
import { adminSetCaseIsActive } from "../../apis"
import SetStatusOfProfile from "../../components/Common/setStatusModal"
import {FaTrashRestoreAlt} from 'react-icons/fa'
import DateSelect from "../../components/Common/DateSelect"
import { SiMicrosoftexcel } from "react-icons/si";
 
export default function AdminTrashCase() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [statusType, setStatusType] = useState("")
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [showCalender, setShowCalender] = useState(false)
  const [isSearch,setIsSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [noOfCase, setNoOfCase] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
  const [shareCase,setShareCase] = useState([])
  const [caseShareModal,setCaseShareModal] = useState({status:false,value:[]})
  const [isClipBoardCopy,setIsClipBoardCopy] = useState({id:"",copied:false,value:""})
  const [deleteCase,setDeleteCase] = useState({status:false,id:""})
  const [changeisActiveStatus, setChangeIsActiveStatus] = useState({show: false, details: {} })
  const [dateRange, setDateRange] = useState(
    {
      startDate: new Date("2024/01/01"),
      endDate: new Date(),
    });

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange({ startDate: new Date("2024/01/01"), endDate: new Date(),})
    setStatusType("")
  }

const getAllCases =async()=>{
  setLoading(true)
  try {
    const type = false
    const startDate = dateRange?.startDate ? getFormateDate(dateRange?.startDate) : ""
    const endDate = dateRange?.endDate ? getFormateDate(dateRange?.endDate) : ""
    // console.log("start", startDate, "end", endDate);
    const res = await allAdminCase(pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate,type)
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
    if(!deleteCase.status ||!changeisActiveStatus.show ){
      getAllCases()
    }
  }, [pageItemLimit, pgNo,statusType, changeStatus,changeisActiveStatus,deleteCase])

  useEffect(()=>{
    if(isSearch){
      let debouncedCall = loash.debounce(function () {
        getAllCases()
        setIsSearch(false)
        setPageItemLimit(5)
        setPgNo(1)
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

  const handleChanges =async(_id,status)=>{
    try {
        const res = await adminSetCaseIsActive(_id,status)
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



  const handleShareOnchange =(e,id)=>{
    const {value,checked} = e.target
    if(!checked){
      const newShareList = shareCase.filter(caseShare=>caseShare!=id)
      setShareCase(newShareList)
    }else{
      const newCaseList = [...shareCase]
      newCaseList.push(id)
      // console.log("newList",newCaseList);
      setShareCase(newCaseList)
    }
  }
  // console.log("handleShareOnchange",shareCase);

  // console.log("data", data);
  // console.log("chagne status", changeStatus.details.currentStatus);

  // console.log("range",dateRange);
  return (<>
   {loading?<Loader/> :
    <div>
     <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllCases} dateRange={dateRange} setDateRange={setDateRange} />
    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
          {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
          <div className="d-flex flex align-items-center gap-1">
            <span>All trash Cases</span>
            {/* <span><LuPcCase /></span> */}
          </div>
        </div>
</div>
      <div className="m-md-5 m-sm-0 p-3">
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
              {shareCase?.length>0 && <div className="btn btn-primary fs-5" onClick={()=>setCaseShareModal({status:true,value:shareCase})}><IoShareSocialOutline /></div>} 
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" name="caseStaus" value={statusType} onChange={(e) => setStatusType(e.target.value)} aria-label="Default select example">
                <option value="">--select case status</option>
                {caseStatus?.map(typeCase => <option key={typeCase} value={typeCase}>{typeCase}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" name="pageItemLimit" value={pageItemLimit} onChange={(e) =>{setPageItemLimit(e.target.value);setPgNo(1)}} aria-label="Default select example">
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
            <th scope="col" className="text-nowrap" ></th>
              <th scope="col" className="text-nowrap" >SL No</th>
              <th scope="col" className="text-nowrap">Action</th>
                <th scope="col" className="text-nowrap" >Branch ID</th> 
                    <th scope="col" className="text-nowrap" >Current Status</th>
                    <th scope="col" className="text-nowrap" >Date</th>
               <th scope="col" className="text-nowrap" >Case From</th> 
               <th scope="col" className="text-nowrap" >Team Added by</th> 
               <th scope="col" className="text-nowrap" >Partner Name</th> 
               <th scope="col" className="text-nowrap" >Case Name</th> 
                    <th scope="col" className="text-nowrap"  >Mobile No</th>
                    <th scope="col" className="text-nowrap"  >Email Id</th>
                    <th scope="col" className="text-nowrap"  >Claim Amount</th>
                    <th scope="col" className="text-nowrap"  >Policy No</th>
                    <th scope="col" className="text-nowrap" >File No</th>
                    <th scope="col" className="text-nowrap"  >Policy Type</th>
                    <th scope="col" className="text-nowrap"  >complaint Type</th>
                    {/* <th scope="col" className="text-nowrap" >Reference</th> */}
                   {/* {(role?.toLowerCase()!="client" && role?.toLowerCase()!="partner" ) && <th scope="col" className="text-nowrap" >Partner Consultant Code</th> } */}
            </tr>
          </thead>
          <tbody>
            {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
            <td className="text-nowrap"><input class="form-check-input" name="shareCase"  type="checkbox" checked={shareCase.includes(item?._id)} onChange={(e)=>handleShareOnchange(e,item?._id)} id="flexCheckDefault"/></td>
              <th scope="row">{ind + 1}</th>
              <td className="text-nowrap">
                <span className="d-flex gap-2"><span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/admin/view case/${item._id}`)}><HiMiniEye /></span>
                {/* <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-warning text-dark d-flex align-items-center justify-content-center" onClick={() => navigate(`/admin/edit%20case/${item._id}`)}><CiEdit /></span> */}
                {/* <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ status: true, details: item })}><VscGitPullRequestGoToChanges /></span> */}
                <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeIsActiveStatus({ show: true, details: {_id:item._id,currentStatus:item?.isActive,name:item?.name,recovery:false} })}><FaTrashRestoreAlt/></span>
                <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setDeleteCase({status:true,id:item?._id})}><AiOutlineDelete /></span>
                </span></td>
              <td className="text-nowrap">{item?.branchId}</td>
              <td className=" text-nowrap"><span className={(item?.currentStatus == "reject" || item?.currentStatus == "pending") ? " badge bg-danger text-white" : "badge bg-primary"}>{item?.currentStatus}</span></td>
              <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
              <td className="text-nowrap">{item?.caseFrom}</td>
              <td className="text-nowrap text-capitalize" >{item?.empSaleName || "-"}</td>
              <td className="text-nowrap text-capitalize" >{item?.partnerName || "-"}</td>
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
          nextLabel={<BiRightArrow/>}
          onPageChange={handlePageClick}
          pageRangeDisplayed={4}
          breakClassName={""}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(noOfCase / pageItemLimit)||1}
          previousLabel={<BiLeftArrow/>}
          className="d-flex flex gap-2"
          pageClassName="border border-primary paginate-li"
          previousClassName="paginate-li bg-color-3"
          nextClassName="paginate-li bg-color-3"
          activeClassName="bg-primary text-white"
          forcePage={pgNo>0 ? pgNo-1 : 0}
          renderOnZeroPageCount={null}
        />
      </div>

    </div>
    {changeStatus?.status && <ChangeStatusModal changeStatus={changeStatus} setChangeStatus={setChangeStatus} handleCaseStatus={adminChangeCaseStatus} role="admin" />}
    {caseShareModal?.status && <ShareCaseModal handleShareCase={adminShareCaseToEmployee} caseShareModal={caseShareModal} close={()=>{setCaseShareModal({value:[],status:false});setShareCase([])}}/>}
    {deleteCase?.status && <ConfirmationModal show={deleteCase?.status} id={deleteCase?.id} hide={()=>setDeleteCase({status:false,id:""})} heading="Are you sure?" text="Your want to delete this case" handleComfirmation={adminDeleteCaseById}/>} 
    {changeisActiveStatus?.show && <SetStatusOfProfile changeStatus={changeisActiveStatus} hide={()=>setChangeIsActiveStatus({ show: false, details: {} })} type="Case" handleChanges={handleChanges} />}
    
    
      </div>

    </div>}
  </>)
}