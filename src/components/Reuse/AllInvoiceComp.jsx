import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDate } from "../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import Loader from "../../components/Common/loader";
import { AppContext } from "../../App"
import { useContext } from "react"
import loash from 'lodash'
import { CiAlignBottom } from 'react-icons/ci'
import PaymentInfo from "../../components/Common/paymentInfo";
import DateSelect from "../../components/Common/DateSelect"
import { CiFilter } from "react-icons/ci";
import ConfirmationModal from "../Common/confirmationModal";
import { CiEdit } from 'react-icons/ci'
import { AiOutlineDelete } from "react-icons/ai";
import SetStatusOfProfile from "../Common/setStatusModal";
import {FaTrashRestoreAlt} from 'react-icons/fa'
import { getFormateDMYDate } from "../../utils/helperFunction";
import EditInvoiceStatusModal from "../Common/EditInvoiceStatus";
import { MdCurrencyRupee } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";

export default function AllInvoiceComp({viewAllInvoice,payInvoice,viewInvoiceUrl,role,
  isEdit,isDelete,editInvoiceUrl,unactiveInvoice,isTrash,deleteInvoice,paidAccess,handlePaid,
  downloadAccess,downloadApi
}) {
  const state = useContext(AppContext)
  const location = useLocation()
  const [data, setData] = useState([])
  const [tranactionLoading, setTransactionLoading] = useState({ status: false, id: null })
  const empType = state?.myAppData?.details?.empType
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [downloadLoading, setDownloadLoading] = useState({ status: false, data: [], _id: [] })
  const [statusType, setStatusType] = useState("")
  const [pageItemLimit, setPageItemLimit] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit :10)
  const [showCalender, setShowCalender] = useState(false)
  const [searchQuery, setSearchQuery] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery :"")
  const [noOfInvoice, setNoOfInvoice] = useState(0)
  const [totalInvoiceAmt, setTotalInvoiceAmt] = useState(0)
  const [pgNo, setPgNo] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo :1)
  const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
  const [isActiveInvoice, setIsActiveInvoice] = useState({ status: false, details: {} })
  const [paymentDetails, setPaymentDetails] = useState({ status: false, details: {} })
  const [checkOutDetails, setCheckOutDetails] = useState({ status: false, encData: null, clientCode: null })
  const [changeInvoiceStatus, setChangeInvoiceStatus] = useState({status:false,_id:null})
  const [downloading, setDownloading] = useState(false)

  const [dateRange, setDateRange] = useState(
    location?.pathname==location?.state?.path && location?.state?.filter?.dateRange ?
     location?.state?.filter?.dateRange : {
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



  const getViewAllInvoice = async () => {
    setLoading(true)
    try {
      const startDate = dateRange?.startDate ? getFormateDate(dateRange?.startDate) : ""
      const endDate = dateRange?.endDate ? getFormateDate(dateRange?.endDate) : ""
      // console.log("start", startDate, "end", endDate);
      const res = await viewAllInvoice(pageItemLimit, pgNo, searchQuery, startDate, endDate)
      // console.log("allAdminCase", res?.data?.data);
      if (res?.data?.success && res?.data?.data) {
        setData([...res?.data?.data])
        setNoOfInvoice(res?.data?.noOf)
        setTotalInvoiceAmt(res?.data?.totalAmt[0]?.totalAmtSum)
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

  const generateTransaction = async (invoiceId, caseId) => {
    setTransactionLoading({ status: true, id: invoiceId })
    try {
      const res = await payInvoice(invoiceId, caseId)
      if (res?.data?.success && res?.data?.encData && res?.data?.clientCode) {
        handleCheckOut(res?.data?.encData, res?.data?.clientCode)

      }
    } catch (error) {
      console.log("error",error);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      setTransactionLoading({ status: false, id: null })
    }
  }

  // const handleDownload = async () => {
  //   try {
  //     const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
  //     const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
  //     setDownloading(true)
  //     const res = await downloadApi(searchQuery, startDate, endDate,true)
  //     console.log("res", res?.data);
  //     if (res?.status == 200) {
  //       const url = window.URL.createObjectURL(new Blob([res.data]));
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'invoice.xlsx'; 
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       toast.success("Download the excel")
  //       setDownloading(false)
  //     } else {
  //       setDownloading(false)
  //     }
      
  //   } catch (error) {
  //     console.log("error", error);
  //     if (error && error?.response?.data?.message) {
  //       toast.error(error?.response?.data?.message)
  //     } else {
  //       toast.error("Failed to download")
  //     }
  //     setDownloading(false)
  //   }
  // }

  const handleDownload = async () => {
    try {
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : "";
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : "";
      setDownloading(true);
  
      // Step 1: Fetch File Data
      const res = await downloadApi(searchQuery, startDate, endDate, true);
  
      if (res?.status === 200) {
        // Step 2: Create Blob URL
        const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
  
        // Step 3: Create and Trigger Download
        const a = document.createElement("a");
        a.href = url;
        const contentDisposition = res.headers["content-disposition"];
        const match = contentDisposition?.match(/filename="(.+)"/);
        a.download = match ? match[1] : "invoice.xlsx"; // Use backend filename if available
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
  
        // Notify Success
        toast.success("Download successful!");
      } else {
        toast.error("Failed to download the file.");
      }
    } catch (error) {
      console.error("Download Error:", error);
      const errorMessage = error?.response?.data?.message || "Failed to download the file.";
      toast.error(errorMessage);
    } finally {
      setDownloading(false);
    }
  };
  

  useEffect(() => {
    getViewAllInvoice()
  }, [pageItemLimit, pgNo,])

  useEffect(() => {
    if (!isActiveInvoice.status && !changeStatus?.show && !changeInvoiceStatus?.status) {
      getViewAllInvoice()
    }
  }, [isActiveInvoice,changeStatus,changeInvoiceStatus])

  useEffect(() => {
    if (searchQuery) {
      let debouncedCall = loash.debounce(function () {
        getViewAllInvoice()
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
      const res = await unactiveInvoice(_id, !status)
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

    const filter = {
      pageItemLimit,
      pgNo,
      searchQuery,
      dateRange
    }

  return (<>
    {loading ? <Loader /> :
      <div>
        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getViewAllInvoice} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/employee/dashboard")} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
              <span>All Invoice</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
        </div>

        <div className="m-0 m-md-5 p-md-4">
          <div className="row row-cols-1 row-cols-md-2">
            <div className="border-end">
              <div className="bg-color-1 border-0 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                <div className='d-flex align-items-center justify-content-around'>
                  <div className="text-center ">
                    <h3 className='fw-bold h2'>{noOfInvoice ? noOfInvoice : 0}</h3>
                    <p className='card-title fs-5 text-primary text-capitalize'>Total Invoice</p>
                  </div>
                  <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                </div></div>
            </div>

            <div className=" border-end">
              <div className="bg-color-1 border-0 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                <div className='d-flex align-items-center justify-content-around'>
                  <div className="text-center ">
                    <h3 className='fw-bold h2'>{totalInvoiceAmt ? totalInvoiceAmt : 0}</h3>
                    <p className='card-title fs-5 text-primary text-capitalize'>Total Invoice Amount</p>
                  </div>
                  <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                </div></div>
            </div>
          </div>
        </div>
        {checkOutDetails?.status && <form id="paymentForm" action="https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1" method="post">
          <input type="hidden" name="encData" value={checkOutDetails.encData} id="frm1" />
          <input type="hidden" name="clientCode" value={checkOutDetails.clientCode} id="frm2" />
        </form>}
    

        <div className="m-0 m-md-5 p-md-4">
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
                    {downloadAccess &&  <button className={`btn btn-primary fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-md"></span> : <SiMicrosoftexcel />}</button>}
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
                    <th scope="col" className="text-nowrap">Type</th>
                    <th scope="col" className="text-nowrap" >Date</th>
                     {role?.toLowerCase()!="client" && <th scope="col" className="text-nowrap" >Branch ID</th>}
                    <th scope="col" className="text-nowrap" >Invoice</th>
                    <th scope="col" className="text-nowrap"  >Name</th>
                    <th scope="col" className="text-nowrap"  >Email</th>
                    <th scope="col" className="text-nowrap" >Mobile No</th>
                    <th scope="col" className="text-nowrap" >State</th>
                    <th scope="col" className="text-nowrap"  >Invoice Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, ind) => <tr key={ind} className="border-2 text-nowrap border-bottom border-light text-center">
                    <th scope="row">{ind + 1}</th>
                    <td><span className="d-flex gap-2">
                      <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`${viewInvoiceUrl}${item._id}`,{state:{filter,back:location?.pathname,path:location?.pathname}})}><HiMiniEye /></span>
                    {isEdit &&!isTrash && !item?.isPaid && <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`${editInvoiceUrl}${item._id}`,{state:{filter,back:location?.pathname,path:location?.pathname}})}><CiEdit /></span>}
                    {isDelete && !item?.isPaid && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className={`${isTrash ? "bg-success" :"bg-danger"}  text-white d-flex align-items-center justify-content-center`} onClick={() =>setChangeStatus({ show: true, details: { _id: item._id, currentStatus: item?.isActive, name: item?.invoiceNo, recovery: false } })}>{isTrash ? <FaTrashRestoreAlt/> : <AiOutlineDelete />} </span>}
                    {isTrash && !item?.isPaid && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className={`bg-danger  text-white d-flex align-items-center justify-content-center`} onClick={() =>setIsActiveInvoice({ status: true, details: { _id: item._id,invoiceNo:item?.invoiceNo} })}><AiOutlineDelete /> </span>}
                    {!isTrash && paidAccess && !item?.isPaid && <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeInvoiceStatus({status:true,_id:item._id})}><MdCurrencyRupee /></span>}

                    </span>
                    </td>
                    <td className="text-nowrap">
                      {item?.isOffice ? <span  className={`badge bg-danger`}>Office</span> 
                      :  
                      <>{item?.isPaid ?
                        <span onClick={() => setPaymentDetails({ status: true, details: item })} className={`badge cursor-pointer bg-success`}>Paid</span>
                        : <>
                          {tranactionLoading?.id == item._id ?
                            <span className={`spinner-border spinner-border-sm cursor-pointer text-primary`} role="status" aria-hidden={true}></span>
                            : <span onClick={() => role?.toLowerCase()!=="client" || tranactionLoading?.status ? () => {} : generateTransaction(item?._id, item?.caseId)} className={`badge bg-primary ${role?.toLowerCase()==="client" && "cursor-pointer"}`}>To pay</span>
                          }
                        </>
                      }</>
                    }
                    

                    </td>
                    <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
                    {role?.toLowerCase()!="client" && <td className="text-nowrap">{item?.branchId}</td>}
                    <td className="text-nowrap">{item?.invoiceNo}</td>
                    <td className="text-nowrap">{item?.receiver?.name}</td>
                    <td className="text-nowrap">{item?.receiver?.email}</td>
                    <td className="text-nowrap">{item?.receiver?.mobileNo}</td>
                    <td className="text-nowrap">{item?.receiver?.state}</td>
                    <td className="text-nowrap">{item?.totalAmt}</td>
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
                pageCount={Math.ceil(noOfInvoice / pageItemLimit) || 1}
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
        {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={() => setChangeStatus({ show: false, details: {} })} type="Invoice" handleChanges={handleChanges} />}
        {isActiveInvoice.status && <ConfirmationModal show={isActiveInvoice.status} hide={()=>setIsActiveInvoice({status:false,details:{}})} id={isActiveInvoice.details?._id} handleComfirmation={deleteInvoice} heading={"Are you sure"} text={`You want to permanent delete invoice ${isActiveInvoice.details?.invoiceNo}`}/>}
        {paymentDetails?.status && <PaymentInfo show={paymentDetails.status} hide={() => setPaymentDetails({ status: false, details: {} })} details={paymentDetails?.details} />}
        {changeInvoiceStatus?.status && <EditInvoiceStatusModal changeInvoiceStatus={changeInvoiceStatus} setChangeInvoiceStatus={setChangeInvoiceStatus} handleInvoiceStatus={handlePaid} />}

      </div >
    }
  </>)
}