import { allAdminPartner } from "../../../apis"
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
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import SetStatusOfProfile from "../../../components/Common/setStatusModal"
import { adminSetClientStatus, allAdminClient,adminAllClientDownload,adminChangeBranch } from "../../../apis"
import Loader from "../../../components/Common/loader"
import loash from 'lodash'
import { adminDeleteClientById } from "../../../apis"
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationModal from "../../../components/Common/confirmationModal"
import DateSelect from "../../../components/Common/DateSelect"
import { SiMicrosoftexcel } from "react-icons/si";
import { CiFilter } from "react-icons/ci";
import { CiAlignBottom } from 'react-icons/ci'
import ChangeBranch from "../../../components/changeBranch"
import { VscGitPullRequestGoToChanges } from "react-icons/vsc"


export default function AllAdminClient() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const [pageItemLimit, setPageItemLimit] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit :10)
  const [searchQuery, setSearchQuery] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery :"")
  const [isSearch, setIsSearch] = useState(false)
  const [noOfClient, setNoOfClient] = useState(0)
  const [pgNo, setPgNo] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo :1)
  const [changeStatus, setChangeStatus] = useState({ show: false, details: {} })
  const [deleteClient, setDeleteClient] = useState({ status: false, id: "", text: "" })
  const [downloading, setDownloading] = useState(false)
const [dateRange, setDateRange] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.dateRange ? 
  location?.state?.filter?.dateRange : {
  startDate: new Date("2024/01/01"),
  endDate: new Date(),
});
const [showCalender, setShowCalender] = useState(false)
const [changeBranch,setChangeBranch] = useState({loading:false,branchId:null,status:false,_id:null})


  const getAllClients = async () => {
    setLoading(true)
    try {
      const type = true;
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      const res = await allAdminClient(pageItemLimit, pgNo, searchQuery, type,startDate,endDate)
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
    if (!deleteClient?.status && !changeBranch?.status) {
      getAllClients()
    }
  }, [pageItemLimit, pgNo, changeStatus, deleteClient,changeBranch?.status])

  useEffect(() => {
    if (isSearch) {
      let debouncedCall = loash.debounce(function () {
        getAllClients()
        setIsSearch(false)
        setPageItemLimit(5)
        setPgNo(1)
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
      const res = await adminSetClientStatus(_id, status)
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

  const handleDownload = async () => {
    try {
      const type = true
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      setDownloading(true)
      const res = await adminAllClientDownload(searchQuery, type,startDate,endDate)
      // console.log("res", res);
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

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange([{ startDate: new Date("2024/01/01"), endDate: new Date() }])
  }


  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };

  const filter = {
    pageItemLimit,
    pgNo,
    searchQuery,
    dateRange
  }



  return (<>
    {loading ? <Loader /> :
      <div>
        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllClients} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
              <span>All Client List</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
        </div>

        <div className="m-0 m-md-5 p-md-4">
          <div className="">
            <div className=" border-end">
              <div className="bg-color-1 border-0 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                <div className='d-flex align-items-center justify-content-around'>
                  <div className="text-center ">
                    <h3 className='fw-bold h2'>{noOfClient ? noOfClient : 0}</h3>
                    <p className='card-title fs-5 text-primary text-capitalize'>Client</p>
                  </div>
                  <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                </div></div>
            </div>
          </div>
        </div>


        <div className="m-0 m-md-5 p-md-4">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="d-flex flex gap-2">

              <div className="form-control px-2 d-flex gap-2">
                <span className=""><BsSearch className="text-black" /></span>
                <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
              </div>
              <div className="btn btn-primary fs-5" onClick={() => setShowCalender(!showCalender)}><CiFilter /></div>
              <div className="btn btn-primary fs-5" onClick={() => handleReset()}>Reset</div>
              <button className={`btn btn-primary fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-sm"></span> : <SiMicrosoftexcel />}</button>

              <div className="">
                <select className="form-select" name="pageItemLimit" value={pageItemLimit} onChange={(e) => { setPageItemLimit(e.target.value); setPgNo(1) }} aria-label="Default select example">
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
                      {/* <th scope="col" className="text-nowrap">Status</th> */}
                      <th scope="col" className="text-nowrap" ><span>Action</span></th>
                      <th scope="col" className="text-nowrap">Branch ID</th>
                      <th scope="col" className="text-nowrap">Associate With Us</th>
                      <th scope="col" className="text-nowrap">Cient Name</th>
                      <th scope="col" className="text-nowrap" >Client Code</th>
                      <th scope="col" className="text-nowrap" >Mobile No</th>
                      <th scope="col" className="text-nowrap" >Email Id</th>
                      <th scope="col" className="text-nowrap" >City</th>
                      <th scope="col" className="text-nowrap" >State</th>
                      {/* <th scope="col" className="text-nowrap" >DOB</th> */}
                      {/* <th scope="col" className="text-nowrap" >Area Of Operation</th> */}
                      {/* <th scope="col" className="text-nowrap" >Work Association</th> */}
                      {/* <th scope="col" className="text-nowrap" >Gender</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                      <th scope="row" className="text-nowrap">{ind + 1}</th>
                      {/* <td className="text-nowrap"> <span className={`badge ${item?.isActive ? "bg-primary" : "bg-danger"}`}>{item?.isActive ? "Active" : "Unactive"}</span> </td> */}
                      {/* <td className="text-nowrap"><span className="d-flex align-items-center gap-2"><span style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/client details/${item._id}`)}><HiMiniEye /></span><span style={{ cursor: "pointer" }} onClick={() => setChangeStatus({ show: true, details: {_id:item._id,currentStatus:item?.isActive} })}><CiEdit /></span></span></td> */}
                      <td className="text-nowrap">
                        <span className="d-flex gap-2"><span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/admin/client details/${item._id}`,{state:{filter,back:location?.pathname,path:location?.pathname}})}><HiMiniEye /></span>
                          <Link to={`/admin/edit-client/${item?._id}`} state={{filter,back:location?.pathname,path:location?.pathname}} style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-white d-flex align-items-center justify-content-center" ><CiEdit /></Link>
                          <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeBranch({ ...changeBranch,status:true,_id:item?._id,branchId:item?.branchId})}><VscGitPullRequestGoToChanges /></span>
                          <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ show: true, details: { _id: item._id, currentStatus: item?.isActive, name: item?.profile?.consultantName, recovery: false } })}><AiOutlineDelete /></span>
                        </span></td>
                      <td className="text-nowrap">{item?.branchId}</td>
                      <td className="text-nowrap">{item?.profile?.associateWithUs && getFormateDMYDate(item?.profile?.associateWithUs)}</td>
                      <td className="text-nowrap">{item?.profile?.consultantName}</td>
                      <td className="text-nowrap">{item?.profile?.consultantCode}</td>
                      <td className="text-nowrap">{item?.profile?.primaryMobileNo}</td>
                      <td className="text-nowrap">{item?.profile?.primaryEmail}</td>
                      <td className="text-nowrap">{item?.profile?.city}</td>
                      <td className="text-nowrap">{item?.profile?.state}</td>
                      {/* <td>{new Date(item?.profile?.dob).toLocaleDateString()}</td> */}
                      {/* <td>{item?.profile?.areaOfOperation}</td> */}
                      {/* <td>{item?.profile?.workAssociation}</td> */}
                      {/* <td className="text-nowrap">{item?.profile?.gender}</td> */}
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
                  pageCount={Math.ceil(noOfClient / pageItemLimit) || 1}
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
          {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={() => setChangeStatus({ show: false, details: {} })} type="Client" handleChanges={handleChanges} />}
          {deleteClient?.status && <ConfirmationModal show={deleteClient?.status} id={deleteClient?.id} hide={() => setDeleteClient({ status: false, id: "" })} heading="Are you sure?" text={deleteClient?.text ? deleteClient?.text : "Your want to delete this client"} handleComfirmation={adminDeleteClientById} />}
          {changeBranch?.status && <ChangeBranch branch={changeBranch}  onBranchChange={setChangeBranch} type="client" handleBranch={adminChangeBranch}/>}

        </div>

      </div>}
  </>)
}