import { allAdminPartner, adminViewSaleEmpPartner, adminSaleEmpPartnerDownload,adminRemoveSaleEmpPartner } from "../../../apis"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate, getFormateDate } from "../../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline, IoNewspaperOutline } from 'react-icons/io5'
import { useNavigate, useParams } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import SetStatusOfProfile from "../../../components/Common/Modal/setStatusModal"
import { adminSetPartnerStatus } from "../../../apis"
import Loader from "../../../components/Common/loader"
import { useContext } from "react"
import { AppContext } from "../../../App"
import { deleteToken } from "../../../utils/helperFunction"
import ConfirmationModal from "../../../components/Common/Modal/confirmationModal"
import { adminDeletePartnerById } from "../../../apis"
import { TbReportAnalytics } from "react-icons/tb";
import loash from 'lodash'
import { Link } from "react-router-dom"
import DateSelect from "../../../components/Common/Modal/DateSelect"
import { SiMicrosoftexcel } from "react-icons/si";
import { CiFilter } from "react-icons/ci";
import { CiAlignBottom } from 'react-icons/ci'
import {MdDelete} from 'react-icons/md'

export default function AdminSaleEmpPartnerReport() {
  const param = useParams()
  const state = useContext(AppContext)
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [noOfPartner, setNoOfPartner] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({ show: false, details: {} })
  const [deletePartner, setDeletePartner] = useState({ status: false, id: "", text: "" })
  const [downloading, setDownloading] = useState(false)
  const [dateRange, setDateRange] = useState({ startDate: new Date("2024/01/01"), endDate: new Date() });
  const [showCalender, setShowCalender] = useState(false)
  const [removePartner, setRemovePartner] = useState([])
  const [removing,setRemoving] = useState(false)



  const getAllPartner = async () => {
    setLoading(true)
    try {
      const type = true
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      const res = await adminViewSaleEmpPartner(param?._id, pageItemLimit, pgNo, searchQuery, type, startDate, endDate)
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data])
        setNoOfPartner(res?.data?.noOfPartner)
        setLoading(false)
      }
    } catch (error) {
      // console.log("admin all partner error",error);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      if (error && error?.response?.status == 401) {
        deleteToken()
        state?.setMyAppData({ isLogin: false, details: {} })
      }
    }
  }

  useEffect(() => {
    if (!deletePartner?.status) {
      getAllPartner()
    }
  }, [pageItemLimit, pgNo, changeStatus, deletePartner])

  useEffect(() => {
    if (isSearch) {
      let debouncedCall = loash.debounce(function () {
        getAllPartner()
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



  const handleChanges = async (_id, status) => {
    try {
      const res = await adminSetPartnerStatus(_id, status)
      if (res?.data?.success) {
        setChangeStatus({ show: false, details: "" })
        toast.success(res?.data?.message)

      }
    } catch (error) {
      // console.log("admin all partner error",error);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      if (error && error?.response?.status == 401) {
        deleteToken()
        state?.setMyAppData({ isLogin: false, details: {} })
      }
      // console.log("allAdminPartner error", error);
    }
  }

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange([{ startDate: new Date("2024/01/01"), endDate: new Date() }])
  }


  const handleDownload = async () => {
    try {
      const type = true
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      setDownloading(true)
      const res = await adminSaleEmpPartnerDownload(param?._id, searchQuery, type, startDate, endDate)
      // console.log("res", res);
      if (res?.status == 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Sales-Partner-Report.xlsx'; // Specify the filename here
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



  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };

  const handleRemoveOnchange = (e, id) => {
    const { value, checked } = e.target
    if (!checked) {
      const newShareList = removePartner.filter(caseShare => caseShare != id)
      setRemovePartner(newShareList)
    } else {
      const newCaseList = [...removePartner]
      newCaseList.push(id)
      // console.log("newList", newCaseList);
      setRemovePartner(newCaseList)
    }
  }


  const handleRemovePartners = async()=>{
    setRemoving(true)
    try {

      const res = await adminRemoveSaleEmpPartner(param?._id,removePartner)
      if (res?.data?.success) {
        toast.success(res?.data?.message)
        setRemoving(false)
        getAllPartner()
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
        setRemoving(false)
      } else {
        toast.error("Something went wrong")
        setRemoving(false)
      }
      if (error && error?.response?.status == 401) {
        deleteToken()
        state?.setMyAppData({ isLogin: false, details: {} })
      }
    }
  }

  const filter = {
    pageItemLimit,
    pgNo,
    searchQuery,
    dateRange
  }

  return (<>
    {loading ? <Loader /> :
      <div>
        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllPartner} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
            { <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />} 
              <span>All Partner</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
        </div>
        <div className="mx-5 p-3">
          <div className="">
            <div className=" border-end">
              <div className="bg-color-1 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                <div className='d-flex align-items-center justify-content-around'>
                  <div className="text-center ">
                    <h3 className='fw-bold h2'>{noOfPartner ? noOfPartner : 0}</h3>
                    <p className='card-title fs-5 text-primary text-capitalize'>Partner</p>
                  </div>
                  <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                </div></div>
            </div>
          </div>
        </div>

        <div className=" mx-5 mb-5 p-4">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="d-flex flex gap-2">

              <div className="form-control px-2 d-flex gap-2">
                <span className=""><BsSearch className="text-black" /></span>
                <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
              </div>
              <div className="btn btn-primary fs-5" onClick={() => setShowCalender(!showCalender)}><CiFilter /></div>
              <div className="btn btn-primary fs-5" onClick={() => handleReset()}>Reset</div>
              <button className={`btn btn-primary fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-sm"></span> : <SiMicrosoftexcel />}</button>
              {removePartner?.length>0 && <button className={`btn btn-primary fs-5 ${removing && "disabled"}`} disabled={removing} onClick={() => !removing && handleRemovePartners()}>{removing ? <span className="spinner-border-sm"></span> : <MdDelete />}</button> }

              <div className="">
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
            <div className="mt-4 rounded-2 shadow overflow-auto">
              <div className=" table-responsive">
                <table className="table table-responsive table-borderless">
                  <thead>
                    <tr className="bg-primary text-white text-center">
                    {/* <th scope="col" className="text-nowrap" ></th> */}
                      <th scope="col" className="text-nowrap"><th scope="col" >SL No</th></th>
                      {/* <th scope="col" className="text-nowrap">Status</th> */}
                      <th scope="col" className="text-nowrap"><span>Action</span></th>
                      <th scope="col" className="text-nowrap">Branch ID</th>
                      <th scope="col" className="text-nowrap">Team Added by</th>
                      <th scope="col" className="text-nowrap">Partner Name</th>
                      <th scope="col" className="text-nowrap" >Mobile No</th>
                      <th scope="col" className="text-nowrap" >Email Id</th>
                      <th scope="col" className="text-nowrap" >consultant Code</th>
                      <th scope="col" className="text-nowrap">Associate With Us</th>
                      <th scope="col" className="text-nowrap" >Work Association</th>
                      <th scope="col" className="text-nowrap" >Area Of Operation</th>
                      {/* <th scope="col" className="text-nowrap" >DOB</th>
                      <th scope="col" className="text-nowrap" >State</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                   <td className="text-nowrap"> {item?.salesId?._id!=param?._id && <input class={`form-check-input ${item?.salesId?._id==param?._id && "disabled"}`} name="removePartner" type="checkbox" disabled={item?.salesId?._id==param?._id}  checked={removePartner.includes(item?._id)} onChange={(e) => item?.salesId!=param?._id && handleRemoveOnchange(e, item?._id)} id="flexCheckDefault" />} </td>
                      <th scope="row" className="text-nowrap">{ind + 1}</th>
                      {/* <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{item?.isActive ? "Active" : "Unactive"}</span> </td> */}
                      {/* <td className="text-nowrap"><span className="d-flex align-items-center gap-2"><span style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/partner details/${item._id}`)}><HiMiniEye /></span><span style={{ cursor: "pointer" }} onClick={() => setChangeStatus({ show: true, details: {_id:item._id,currentStatus:item?.isActive} })}><CiEdit /></span></span></td> */}
                      <td className="text-nowrap">
                        <span className="d-flex gap-2">
                          <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/admin/view-partner-report/${item._id}`)}><TbReportAnalytics className="fs-5" /></span>
                          <Link to={`/admin/edit-partner/${item?._id}`} style={{ height: 30, width: 30, borderRadius: 30 }} className="cursor-pointer bg-info text-white d-flex align-items-center justify-content-center"><CiEdit className="fs-5 text-dark" /></Link>
                           <Link to={`/admin/statment/partner/${item?._id}`} state={{filter,back:location?.pathname,path:location?.pathname}}  style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-primary text-white d-flex align-items-center justify-content-center"><IoNewspaperOutline /></Link>
                          <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/admin/partner details/${item._id}`)}><HiMiniEye /></span>
                          {/* {item?.salesId?._id!=param?._id && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ show: true, details: { _id: item._id, currentStatus: item?.isActive, name: item?.profile?.consultantName, recovery: false } })}><AiOutlineDelete /></span>} */}

                          {/* <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setDeletePartner({status:true,id:item?._id,text:`Your want to delete ${item?.profile?.consultantName} partner`})}><AiOutlineDelete /></span> */}

                        </span></td>
                      <td className="text-nowrap">{item?.branchId}</td>
                      <td className="text-nowrap text-capitalize">{(item?.salesId?.type && item?.salesId?.fullName) ? `${item?.salesId?.fullName} | ${item?.salesId?.type} | ${item?.salesId?.designation}` : "-"}</td>
                      <td className="text-nowrap">{item?.profile?.consultantName}</td>
                      <td className="text-nowrap">{item?.profile?.primaryMobileNo}</td>
                      <td className="text-nowrap">{item?.profile?.primaryEmail}</td>
                      <td className="text-nowrap">{item?.profile?.consultantCode}</td>
                        <td className="text-nowrap">{item?.profile?.xassociateWithUs && getFormateDMYDate(item?.profile?.associateWithUs)}</td>
                      <td className="text-nowrap">{item?.profile?.workAssociation}</td>
                      <td className="text-nowrap">{item?.profile?.areaOfOperation}</td>
                      {/* <td className="text-nowrap">{item?.profile?.state}</td>
                      <td className="text-nowrap">{new Date(item?.profile?.dob).toLocaleDateString()}</td> */}
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
                  pageCount={Math.ceil(noOfPartner / pageItemLimit) || 1}
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
          {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={() => setChangeStatus({ show: false, details: {} })} type="Partner" handleChanges={handleChanges} />}
          {deletePartner?.status && <ConfirmationModal show={deletePartner?.status} id={deletePartner?.id} hide={() => setDeletePartner({ status: false, id: "" })} heading="Are you sure?" text={deletePartner?.text ? deletePartner?.text : "Your want to delete this partner"} handleComfirmation={adminDeletePartnerById} />}
        </div>

      </div>}
  </>)
}