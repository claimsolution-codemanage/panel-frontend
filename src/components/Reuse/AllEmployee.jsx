import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import ChangeStatusModal from "../../components/Common/changeStatusModal"
import { useNavigate } from "react-router-dom"
import {BiLeftArrow} from 'react-icons/bi'
import {BiRightArrow} from 'react-icons/bi'
import SetStatusOfProfile from "../../components/Common/setStatusModal"
import { adminSetEmployeeStatus,adminGetAllEmployee,adminDeleteEmployeeById,adminUpdateEmployeeById } from "../../apis"
import Loader from "../../components/Common/loader"
import loash from 'lodash'
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationModal from "../../components/Common/confirmationModal";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import EditEmployeeModal from "../../components/editEmployeeModal";
import { TbReportAnalytics } from "react-icons/tb";
import { FaUserFriends } from "react-icons/fa";
import {FaTrashRestoreAlt} from 'react-icons/fa'
import { employeeType } from "../../utils/constant";
import { getFormateDMYDate } from "../../utils/helperFunction";
import { FaUserTag } from "react-icons/fa6";
import { SiMicrosoftexcel } from "react-icons/si";
export default function AllEmployee({page,empId,getEmployee,isTrash,isActive,deleteEmployeeId,
  updateEmployee,role,caseUrl,partnerUrl,isedit,viewSathiUrl,isDownload,getDownload}) {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearch,setIsSearch] = useState(false)
  const [noOfEmployee, setNoOfEmployee] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({show: false, details: "" })
  const [employeeUpdateStatus, setEmployeeUpdateStatus] = useState({show: false,id:null, details: {} })
  const [deleteEmployee,setDeleteEmployee] = useState({status:false,id:"",text:""})
  const [empType,setEmpType] = useState('')
  const [downloading, setDownloading] = useState(false)



  const getAllEmployees =async()=>{
    setLoading(true)
    try {
      const res = await getEmployee(pageItemLimit, pgNo, searchQuery,!isTrash,empType,empId||"")
      // console.log("adminGetAllEmployee", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data]) 
        setNoOfEmployee(res?.data?.noOfEmployee)
        setLoading(false)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      // console.log("adminGetAllEmployee error", error);
  }
}



  useEffect(() => {
    if(!deleteEmployee?.status && !employeeUpdateStatus?.show){
      getAllEmployees()
    }
  }, [pageItemLimit, pgNo,changeStatus,deleteEmployee?.status,employeeUpdateStatus?.show,empType])

  useEffect(()=>{
    if(isSearch){
      let debouncedCall = loash.debounce(function () {
        getAllEmployees()
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

  const handleDownload = async () => {
    try {
      const type = true
      setDownloading(true)
      const res = await getDownload(pageItemLimit, pgNo, searchQuery,!isTrash,empType,empId||"")
      console.log("res", res);
      if (res?.status == 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sathi.xlsx'; // Specify the filename here
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




  const handleChanges =async(_id,status)=>{
    try {
        const res = await isActive(_id,status)
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
   {loading?<Loader/> :
    <div>
    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
          {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
          <div className="d-flex flex align-items-center gap-1">
            <span>{page ? page : "All Employee"}</span>
            {/* <span><LuPcCase /></span> */}
          </div>
        </div>
      </div>

      <div className="m-0 m-md-5 p-md-4">
      <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
      <div className="d-flex flex align-items-center gap-2">
       
          <div className="form-control px-2 d-flex gap-2">
            <span className=""><BsSearch className="text-black" /></span>
            <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
          </div>
          {role?.toLowerCase()=="admin" && <div className="">
              <select className="form-select" name="empType" value={empType} onChange={(e) => setEmpType(e.target.value)} aria-label="Default select example">
                <option value="">--Department--</option>
                {employeeType?.map(type=><option key={type} value={type}>{type}</option>)}
              </select>
        </div>}
        {isDownload &&  <button className={`btn btn-primary fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-md"></span> : <SiMicrosoftexcel />}</button>}
        
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
             <th scope="col" className="text-nowrap" ><span>Action</span></th>
             {/* <th scope="col" className="text-nowrap">Status</th> */}
             <th scope="col" className="text-nowrap">Emp ID</th>
             <th scope="col" className="text-nowrap">Branch ID</th>
             {page?.toLowerCase()=="sathi team" && <th scope="col" className="text-nowrap">Type</th>}
              <th scope="col" className="text-nowrap">Date</th>
              <th scope="col" className="text-nowrap" >Department</th> 
              <th scope="col" className="text-nowrap" >Designation</th> 
              <th scope="col" className="text-nowrap">Full Name</th>
              <th scope="col" className="text-nowrap" >Email</th>
              <th scope="col" className="text-nowrap" >Mobile No</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
              <th scope="row" className="text-nowrap">{ind + 1}</th>
              <td className="text-nowrap"><span className="d-flex justify-content-center align-items-center gap-2">
                {!isTrash && <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className={`bg-primary text-white d-flex align-items-center justify-content-center`} onClick={() =>navigate(`${caseUrl}${item._id}`)}><TbReportAnalytics className="fs-5"/></span>}
                {!isTrash && <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className={`${(item?.type?.toLowerCase()=="sales" ||item?.type?.toLowerCase()=="branch" ||item?.type?.toLowerCase()=="sathi team") ? "bg-info" :"bg-secondary" } text-white d-flex align-items-center justify-content-center`} onClick={() => (item?.type?.toLowerCase()=="sales" ||item?.type?.toLowerCase()=="branch" ||item?.type?.toLowerCase()=="sathi team") && navigate(`${partnerUrl}${item._id}`)}><FaUserFriends className="fs-5"/></span>}
                {!isTrash && isedit && <span className="bg-warning text-white" style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} onClick={() => setEmployeeUpdateStatus({ show: true,id:item?._id, details: {fullName:item?.fullName,type:item?.type,designation:item?.designation,mobileNo:item?.mobileNo,branchId:item?.branchId} })}><CiEdit /></span>}
                {!isTrash && viewSathiUrl && (item?.type?.toLowerCase()=="sales" ||item?.type?.toLowerCase()=="branch") && <span className="bg-warning text-white" style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} onClick={()=>navigate(`${viewSathiUrl}${item._id}`)}><FaUserTag /></span>}
                {role?.toLowerCase()=="admin" && <span className={`${!isTrash ? "bg-danger" :"bg-success"}  text-white`} style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} onClick={() => setChangeStatus({ show: true, details: {_id:item._id,currentStatus:item?.isActive,name:item?.fullName} })}>{isTrash ? <FaTrashRestoreAlt/> :<AiOutlineDelete />} </span>}
                {isTrash && role?.toLowerCase()=="admin" && <span className="bg-danger text-white" style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} onClick={() => setDeleteEmployee({status:true,id:item?._id,text:`Your want to parmanent delete ${item?.fullName} employee`})}><AiOutlineDelete /></span>}
                </span></td>
                
              <td className="text-nowrap ">{item?.empId}</td> 
         
              {page?.toLowerCase()=="sathi team" && <td className="text-nowrap"><span className="badge bg-primary">{item?.referEmpId==empId ? "Added" : "Other"}</span> </td> }
              {/* <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{iem?.isActive ? "Active" : "Unactive"}</span> </td> */}
              <td className="text-nowrap">{item?.branchId}</td>
              <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
              <td className="text-nowrap text-capitalize">{item?.type}</td> 
              <td className="text-nowrap text-capitalize">{item?.designation}</td> 
              <td className="text-nowrap">{item?.fullName}</td>
              <td className="text-nowrap">{item?.email}</td>
              <td className="text-nowrap">{item?.mobileNo}</td>
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
          pageCount={Math.ceil(noOfEmployee / pageItemLimit) ||1}
          previousLabel={<BiLeftArrow/>}
          className="d-flex flex gap-2"
          pageClassName="border border-primary paginate-li"
          previousClassName="paginate-li bg-color-3"
          nextClassName="paginate-li bg-color-3"
          activeClassName="bg-primary text-white"
          renderOnZeroPageCount={null}
          forcePage={pgNo>0 ? pgNo-1 : 0 }
        />
      </div>
      </div>

    </div>
    {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={()=>setChangeStatus({ show: false, details: "" })} isActive={false} type="Employee" handleChanges={handleChanges} />}
    {deleteEmployee?.status && <ConfirmationModal show={deleteEmployee?.status} id={deleteEmployee?.id} hide={()=>setDeleteEmployee({status:false,id:""})} heading="Are you sure?" text={deleteEmployee?.text ? deleteEmployee?.text : "Your want to delete this employee"}  handleComfirmation={deleteEmployeeId}/>} 
    {employeeUpdateStatus.show && <EditEmployeeModal show={employeeUpdateStatus?.show} id={employeeUpdateStatus?.id} details={employeeUpdateStatus?.details} hide={()=>setEmployeeUpdateStatus({show:false,id:null,details:{}})} handleComfirmation={updateEmployee}/>}
      </div>

    </div>}
  </>)
}