import { CiEdit } from 'react-icons/ci'
import { useNavigate } from "react-router-dom"
import {BiLeftArrow} from 'react-icons/bi'
import {BiRightArrow} from 'react-icons/bi'
import SetStatusOfProfile from '../../../components/Common/Modal/setStatusModal'
import {superAdminDeleteAdminById,superAdminGetAllAdmins,superAdminSetAdminIsActive } from "../../../apis"
import Loader from "../../../components/Common/loader"
import { useState,useEffect } from 'react'
import { AiOutlineDelete } from "react-icons/ai";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RiDeleteBin2Line } from "react-icons/ri";
import {BsSearch} from 'react-icons/bs'
import ReactPaginate from 'react-paginate'
import {toast} from 'react-toastify'
import loash from 'lodash'
import { useContext } from 'react'
import { AppContext } from '../../../App'
import { getFormateDMYDate } from '../../../utils/helperFunction'

export default function MyAdmins() {
    const [data, setData] = useState([])
    const state = useContext(AppContext)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [pageItemLimit, setPageItemLimit] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")
    const [noOfAdmin, setNoOfAdmin] = useState(0)
    const [pgNo, setPgNo] = useState(1)
    const [isSearch,setIsSearch] = useState(false)
    const [changeStatus, setChangeStatus] = useState({show: false, details: "" })
    const [parmanentDeleteAdmin,setParmanentDeleteAdmin] = useState({show: false, details: "" })


 const getAllAdmins =async()=>{
    setLoading(true)
    try {
      const res = await superAdminGetAllAdmins(pageItemLimit, pgNo, searchQuery)
      // console.log("adminGetAllEmployee", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data])
        setNoOfAdmin(res?.data?.noofAdmin)
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
      getAllAdmins()
    }, [pageItemLimit, pgNo,changeStatus])

    useEffect(()=>{
      if(isSearch){
        let debouncedCall = loash.debounce(function () {
          getAllAdmins()
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
          const res = await superAdminSetAdminIsActive(_id,status)
          if (res?.data?.success) {
            setChangeStatus({ show: false, details: {} })
            toast.success(res?.data?.message)
            getAllAdmins()
  
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
  
    const deleteAdminPermanent =async(_id)=>{
        try {
            const res = await superAdminDeleteAdminById(_id)
            if (res?.data?.success) {
            setParmanentDeleteAdmin({ show: false, details: {} })
              toast.success(res?.data?.message)
              getAllAdmins()
    
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
              <span>All Admin List</span>
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
                <th scope="col" className="text-nowrap"><th scope="col" >SL No</th></th>
                <th scope="col" className="text-nowrap">Date</th>
                <th scope="col" className="text-nowrap">Full Name</th>
                <th scope="col" className="text-nowrap" >Email</th>
                <th scope="col" className="text-nowrap" >Mobile No</th>
                <th scope="col" className="text-nowrap">Status</th>
                <th scope="col" className="text-nowrap" ><span>Action</span></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                <th scope="row" className="text-nowrap">{ind + 1}</th>
    
                <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
                <td className="text-nowrap">{item?.fullName}</td>
                <td className="text-nowrap">{item?.email}</td>
                <td className="text-nowrap">{item?.mobileNo}</td>  
                <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{item?.isActive ? "Active" : "Unactive"}</span> </td>
                <td className="text-nowrap"><span className="d-flex justify-content-center align-items-center gap-2">
                  {/* <span style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/partner details/${item._id}`)}><HiMiniEye /></span> */}
                  <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ show: true, details: {_id:item._id,currentStatus:item?.isActive,name:item?.fullName} })}><CiEdit /></span>
                  <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setParmanentDeleteAdmin({ show: true, details: {_id:item._id,currentStatus:item?.isActive,name:item?.fullName} })}><AiOutlineDelete /></span>
                  
                  </span>
                  
                  </td>
                  
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
            pageCount={Math.ceil(noOfAdmin / pageItemLimit)}
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
      {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={()=>setChangeStatus({ show: false, details: {} })} isActive={true} type="Admin" handleChanges={handleChanges} />}
      {/* {parmanentDeleteAdmin?.show && <SetStatusOfProfile changeStatus={parmanentDeleteAdmin} hide={()=>setParmanentDeleteAdmin({ show: false, details: {} })} isActive={false} type="Admin" handleChanges={deleteAdminPermanent} />} */}
      <Modal
      show={parmanentDeleteAdmin?.show}
      size="md"
      className='text-center'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className='p-3'>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <div className="d-flex align-items-center justify-content-center text-white bg-danger" style={{ height: 50, width: 50, borderRadius: 50 }}><RiDeleteBin2Line className='fs-3' /></div>
            <p className='text-danger fs-2 mt-4'>Are You Sure ?</p>
            <p className='text-primary fs-5'>
           You want to parmanent delete {parmanentDeleteAdmin?.details?.name} Admin.   
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="bg-danger" onClick={() => deleteAdminPermanent(parmanentDeleteAdmin?.details?._id)}>Delete</Button>
        <Button onClick={()=>setParmanentDeleteAdmin({ show: false, details: {} })}>Close</Button>
      </Modal.Footer>
    </Modal>
        </div>
  
      </div>}
    </>)
}
