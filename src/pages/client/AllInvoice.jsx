import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDate } from "../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import { useNavigate } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import { clientViewAllInvoice,clientPayInvoiceById} from "../../apis"
import Loader from "../../components/Common/loader";
import { AppContext } from "../../App"
import { useContext } from "react"
import loash from 'lodash'
import { CiAlignBottom } from 'react-icons/ci'
import { redirect } from "react-router-dom";



export default function ClientAllInvoice() {
  const state = useContext(AppContext)
  const [data, setData] = useState([])
  const [tranactionLoading,setTransactionLoading] = useState({status:false,id:null})
  const empType = state?.myAppData?.details?.empType
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState({status:false,data:[],_id:[]})
  const [statusType, setStatusType] = useState("")
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [showCalender, setShowCalender] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [noOfInvoice, setNoOfInvoice] = useState(0)
  const [totalInvoiceAmt, setTotalInvoiceAmt] = useState(0)
  const [pgNo, setPgNo] = useState(1)
  const [changeStatus, setChangeStatus] = useState({ status: false, details: "" })
  const [isActiveInvoice,setIsActiveInvoice] = useState({status:false,details:{}})
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date("2023/01/01"),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleReset = () => {
    setSearchQuery("")
    setPageItemLimit(5)
    setDateRange([{ startDate: new Date("2023/01/01"), endDate: new Date(), key: 'selection' }])
    setStatusType("")
  }


  const getViewAllInvoice = async () => {
    setLoading(true)
    try {
      const startDate = dateRange[0].startDate ? getFormateDate(dateRange[0].startDate) : ""
      const endDate = dateRange[0].endDate ? getFormateDate(dateRange[0].endDate) : ""
      // console.log("start", startDate, "end", endDate);
      const res = await clientViewAllInvoice(pageItemLimit, pgNo, searchQuery, startDate, endDate)
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

const generateTransaction =async(invoiceId,caseId)=>{
  setTransactionLoading({status:true,id:invoiceId})
  try {
    const res = await clientPayInvoiceById(invoiceId,caseId)
    if (res?.data?.success && res?.data?.tranactionId) {
      setTransactionLoading({status:false,id:null})
      // navigate(`${import.meta.env.VITE_API_BASE}/payment?transactionId=${res?.data?.tranactionId}`)
      window.location.href = `${import.meta.env.VITE_API_BASE}/api/payment/paymentCheckoutPage?transactionId=${res?.data?.tranactionId}`;
    }
  } catch (error) {
    if (error && error?.response?.data?.message) {
      toast.error(error?.response?.data?.message)
    } else {
      toast.error("Something went wrong")
    }
    setTransactionLoading({status:false,id:null})
  }
}


  useEffect(() => {
    getViewAllInvoice()
  }, [pageItemLimit, pgNo, dateRange,])

  useEffect(()=>{
    if(!isActiveInvoice.status){
      getViewAllInvoice()
    }
  },[isActiveInvoice])

  useEffect(() => {
    if(searchQuery){
      let debouncedCall = loash.debounce(function () {
        getViewAllInvoice()
      }, 1000);
      debouncedCall();
      return () => {
        debouncedCall.cancel();
      };
    }
  }, [searchQuery])


  const handlePageClick = (event) => {
    // console.log("event", event);
    setPgNo(event.selected + 1)
  };

  return (<>
    {loading ? <Loader /> :
      <div>
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/employee/dashboard")} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
              <span>All Invoice</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
        </div>

        <div className="mx-5 p-3">
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

        <div className="mx-5 p-3">
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
                    <div className="btn btn-primary" onClick={() => setShowCalender(!showCalender)}>Filter</div>
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
            <div className="position-relative">
              <div className="d-flex align-items-center position-absolute  mt-2 justify-content-center m-0">
                {showCalender && <DateRange
                  onChange={item => {
                    setDateRange([item.selection]);
                    setShowCalender(false);
                  }}
                  editableDateInputs={true}
                  months={1}
                  ranges={dateRange}
                  moveRangeOnFirstSelection={false}
                  direction="horizontal"
                />}
              </div>
            </div>

            <div className="mt-4 overflow-auto">
              <table className="table table-responsive rounded-2 shadow table-borderless">
                <thead>
                  <tr className="bg-primary text-white text-center">
                    <th scope="col" className="text-nowrap" ><th scope="col" >S.no</th></th>
                    <th scope="col" className="text-nowrap">Action</th>
                    <th scope="col" className="text-nowrap">Type</th>
                    <th scope="col" className="text-nowrap" >Date</th>
                    <th scope="col" className="text-nowrap" >Invoice</th>
                    <th scope="col" className="text-nowrap"  >Name</th>
                    <th scope="col" className="text-nowrap"  >Email</th>
                    <th scope="col" className="text-nowrap" >Mobile No</th>
                    <th scope="col" className="text-nowrap" >State</th>
                    <th scope="col" className="text-nowrap"  >Invoice Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, ind) => <tr key={item._id} className="border-2 text-nowrap border-bottom border-light text-center">
                    <th scope="row">{ind + 1}</th>
                    <td><span className="d-flex gap-2">
                    <span style={{ cursor: "pointer",height:30,width:30,borderRadius:30 }} className="bg-warning text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`/client/view-invoice/${item._id}`)}><HiMiniEye /></span>
                    </span></td>
                    <td className="text-nowrap"> 
                    {tranactionLoading?.id ?
                    <span className={`spinner-border spinner-border-sm cursor-pointer text-primary`} role="status" aria-hidden={true}></span>
                    : <span onClick={()=>tranactionLoading?.status ? ()=>{} :  generateTransaction(item?._id,item?.caseId)} className={`badge bg-primary cursor-pointer ${item?.isPaid ? "bg-primary":"bg-success"}`}>{item?.isPaid ? "Paid":"To pay"}</span>
                  }
                    
                    </td>
                    <td className="text-nowrap">{new Date(item?.createdAt).toLocaleDateString()}</td>
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
                pageRangeDisplayed={5}
                pageCount={Math.ceil(noOfInvoice / pageItemLimit) ||1}
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

      </div>
    }
  </>)
}