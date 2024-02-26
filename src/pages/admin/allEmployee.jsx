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
import { adminSetEmployeeStatus,adminGetAllEmployee } from "../../apis"
import Loader from "../../components/Common/loader"
import loash from 'lodash'

export default function AllAdminEmployee() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [noOfEmployee, setNoOfEmployee] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({show: false, details: "" })


  const getAllEmployees =async()=>{
    setLoading(true)
    try {
      const res = await adminGetAllEmployee(pageItemLimit, pgNo, searchQuery)
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
    getAllEmployees()
  }, [pageItemLimit, pgNo,changeStatus])

  useEffect(()=>{
    if(searchQuery){
      let debouncedCall = loash.debounce(function () {
        getAllEmployees()
    }, 1000);
    debouncedCall();
    return () => {
      debouncedCall.cancel();
    };
    }

   },[searchQuery])


  const handleChanges =async(_id,status)=>{
    try {
        const res = await adminSetEmployeeStatus(_id,status)
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
            <span>All Employee List</span>
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
             <th scope="col" className="text-nowrap" ><span>Action</span></th>
             <th scope="col" className="text-nowrap">Status</th>
              <th scope="col" className="text-nowrap">Date</th>
              <th scope="col" className="text-nowrap" >Department</th> 
              <th scope="col" className="text-nowrap" >Designation</th> 
              <th scope="col" className="text-nowrap">Full Name</th>
              <th scope="col" className="text-nowrap" >Email</th>
              <th scope="col" className="text-nowrap" >Mobile No</th>
              {/* <th scope="col" className="text-nowrap" >consultantCode</th>
              <th scope="col" className="text-nowrap" >DOB</th>
              <th scope="col" className="text-nowrap" >Area Of Operation</th>
              <th scope="col" className="text-nowrap" >Work Association</th>*/}
            </tr>
          </thead>
          <tbody>
            {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
              <th scope="row" className="text-nowrap">{ind + 1}</th>
              <td className="text-nowrap"><span className="d-flex justify-content-center align-items-center gap-2">
                {/* <span style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/partner details/${item._id}`)}><HiMiniEye /></span> */}
                <span style={{ cursor: "pointer" }} onClick={() => setChangeStatus({ show: true, details: {_id:item._id,currentStatus:item?.isActive,name:item?.fullName} })}><CiEdit /></span></span></td>
              <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{item?.isActive ? "Active" : "Unactive"}</span> </td>
              <td className="text-nowrap">{new Date(item?.createdAt).toLocaleDateString()}</td>
              <td className="text-nowrap text-capitalize">{item?.type}</td> 
              <td className="text-nowrap text-capitalize">{item?.designation}</td> 

              <td className="text-nowrap">{item?.fullName}</td>
              <td className="text-nowrap">{item?.email}</td>
              <td className="text-nowrap">{item?.mobileNo}</td>
              {/* <td>{item?.profile?.primaryMobileNo}</td>
              <td>{new Date(item?.profile?.dob).toLocaleDateString()}</td>
              <td>{item?.profile?.areaOfOperation}</td>
              <td>{item?.profile?.workAssociation}</td>*/}
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
    {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={()=>setChangeStatus({ show: false, details: "" })} isActive={true} type="Employee" handleChanges={handleChanges} />}

      </div>

    </div>}
  </>)
}