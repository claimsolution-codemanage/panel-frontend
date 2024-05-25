import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate, getFormateDate } from "../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import Loader from "../../components/Common/loader";
import { AppContext } from "../../App"
import { useContext } from "react"
import loash from 'lodash'
import DateSelect from "../../components/Common/DateSelect"
import { CiFilter } from "react-icons/ci";
import ConfirmationModal from "../Common/confirmationModal";
import { CiEdit } from 'react-icons/ci'
import { AiOutlineDelete } from "react-icons/ai";
import SetStatusOfProfile from "../Common/setStatusModal";
import {FaTrashRestoreAlt} from 'react-icons/fa'
import { getCheckStorage } from "../../utils/helperFunction";

export default function CaseDocTrash({getAllDoc,isActive,deleteDoc,isTrash,isDelete,role}) {
  const state = useContext(AppContext)
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isReset, setReset] = useState(true)
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [showCalender, setShowCalender] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [noOfDoc, setNoOfDoc] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
  const [deleteCaseDoc, setDeleteDoc] = useState({ status: false, details: {} })
  const [dateRange, setDateRange] = useState(
    {
      startDate: new Date("2024/01/01"),
      endDate: new Date(),
    }
  );

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange({ startDate: new Date("2024/01/01"), endDate: new Date() })
    setReset(true)
  }

  const handleCheckOut = (encData, clientCode) => {
    if (encData && clientCode) {
      setCheckOutDetails({ status: true, encData: encData, clientCode: clientCode })
      setTimeout(() => {
        const myForm = document.getElementById("paymentForm")
        myForm.submit();
        // setTransactionLoading({ status: false, id: null })
      }, 2000);
    }
  }



  const getViewUnactiveDoc = async () => {
    setLoading(true)
    try {
      const startDate = dateRange?.startDate ? getFormateDate(dateRange?.startDate) : ""
      const endDate = dateRange?.endDate ? getFormateDate(dateRange?.endDate) : ""
      // console.log("start", startDate, "end", endDate);
      const res = await getAllDoc(pageItemLimit, pgNo, searchQuery, startDate, endDate)
      // console.log("allAdminCase", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data])
        setNoOfDoc(res?.data?.totalDoc)
        setLoading(false)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }


  useEffect(() => {
    if(isReset){
        getViewUnactiveDoc()
        setReset(false)
    }
  }, [pageItemLimit, pgNo,isReset])

  useEffect(() => {
    if (!deleteCaseDoc.status && !changeStatus?.show) {
      getViewUnactiveDoc()
    }
  }, [deleteCaseDoc,changeStatus])

  useEffect(() => {
    if (searchQuery) {
      let debouncedCall = loash.debounce(function () {
        getViewUnactiveDoc()
        setPageItemLimit(5)
        setPgNo(1)
      }, 1000);
      debouncedCall();
      return () => {
        debouncedCall.cancel();
      };
    }
  }, [searchQuery])


  const handlePageClick = (event) => {
    setPgNo(event.selected + 1)
  };

  const handleChanges = async (_id, status) => {
    try {
      const res = await isActive(_id, status)
      if (res?.data?.success) {
        setChangeStatus({ show: false, details: {} })
        toast.success(res?.data?.message)

      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }}

  return (<>
    {loading ? <Loader /> :
      <div>
        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getViewUnactiveDoc} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/employee/dashboard")} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
              <span>All Doc</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
        </div>


    

        <div className="m-md-5 p-3">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="row p-0 mb-2">
              <div className="col-12 col-md-3">
                <div className="form-control col-4 col-md-4 px-2 d-flex gap-2">
                  <span className=""><BsSearch className="text-black" /></span>
                  <input className="w-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
                </div>
              </div>
              <div className="col-12 col-md-9">
                <div className="row">
                  <div className="col-12 col-md-7 d-flex gap-3">
                    <div className="btn btn-primary" onClick={() => setShowCalender(!showCalender)}><CiFilter /></div>
                    <div className="btn btn-primary" onClick={() => handleReset()}>Reset</div>
                  </div>
                  <div className="col-12 col-md-3">
                  </div>
                  <div className="col-12 col-md-2">
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
              </div>
            </div>

            <div className="mt-4 overflow-auto">
              <table className="table table-responsive rounded-2 shadow table-borderless">
                <thead>
                  <tr className="bg-primary text-white text-center">
                    <th scope="col" className="text-nowrap" >SL No</th>
                    <th scope="col" className="text-nowrap">Action</th>
                    <th scope="col" className="text-nowrap" >Date</th>
                    <th scope="col" className="text-nowrap">Type</th>
                    <th scope="col" className="text-nowrap">Name</th>
                    <th scope="col" className="text-nowrap"  >Doc name</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, ind) => <tr key={ind} className="border-2 text-nowrap border-bottom border-light text-center">
                    <th scope="row">{ind + 1}</th>
                    <td><span className="d-flex gap-2">
                      <Link to={getCheckStorage(item?.url)} target="_black" style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-white d-flex align-items-center justify-content-center"><HiMiniEye /></Link>
                    {isTrash && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className={`${isTrash ? "bg-success" :"bg-danger"}  text-white d-flex align-items-center justify-content-center`} onClick={() =>setChangeStatus({ show: true, details: { _id: item._id, currentStatus: item?.isActive, name: item?.name, recovery:true } })}>{isTrash ? <FaTrashRestoreAlt/> : <AiOutlineDelete />} </span>}
                    {isDelete && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className={`bg-danger  text-white d-flex align-items-center justify-content-center`} onClick={() =>setDeleteDoc({ status: true, details: { _id: item._id,name:item?.name} })}><AiOutlineDelete /> </span>}

                    </span>
                    </td>
                    <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
                    <td className="text-nowrap">
                    <span  className={`badge bg-primary`}>{item?.type}</span>
                    </td>
                    <td className="text-nowrap">{item?.caseId?.name}</td>
                    <td className="text-nowrap">{item?.name}</td>
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
                pageCount={Math.ceil(noOfDoc / pageItemLimit) || 1}
                previousLabel={<BiLeftArrow />}
                className="d-flex flex gap-2"
                pageClassName="border border-primary paginate-li"
                previousClassName="paginate-li bg-color-3"
                nextClassName="paginate-li bg-color-3"
                activeClassName="bg-primary text-white"
                renderOnZeroPageCount={null}
                forcePage={pgNo - 1}
              />
            </div>

          </div>
        </div>
        {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={() => setChangeStatus({ show: false, details: {} })} type="Doc" handleChanges={handleChanges} />}
        {deleteCaseDoc.status && <ConfirmationModal show={deleteCaseDoc.status} hide={()=>setDeleteDoc({status:false,details:{}})} id={deleteCaseDoc.details?._id} handleComfirmation={deleteDoc} heading={"Are you sure"} text={`You want to permanent delete ${deleteCaseDoc.details?.name}`}/>}
      </div >
    }
  </>)
}