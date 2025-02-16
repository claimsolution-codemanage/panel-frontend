import { useState, useEffect, useRef, useContext } from "react"
import { toast } from 'react-toastify'
import { getFormateDMYDate, getFormateDate } from "../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import Loader from "../Common/loader"
import { IoShareSocialOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import DateSelect from "../Common/DateSelect"
import { SiMicrosoftexcel } from "react-icons/si";
import { Link } from "react-router-dom"
import loash from 'lodash'
import CreateOrUpdateStatmentModal from "./createOrUpdateStatementModal";
import { BsSearch } from "react-icons/bs";
import { AppContext } from "../../App";

export default function Statement({getStatementApi,type,excelDownloadApi,fileDetailApi}) {
const state = useContext(AppContext)
  const searchRef = useRef()
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [pageItemLimit, setPageItemLimit] = useState(10)
  const [showCalender, setShowCalender] = useState(false)
  const [noOfData, setNoOfData] = useState(0)
  const [searchQuery, setSearchQuery] = useState(location?.pathname==location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery :"")
  const [isSearch, setIsSearch] = useState(false)
  const [showStatement,setShowStatement] = useState({status:false,data:null,create:false})
  const [pgNo, setPgNo] = useState(1)
  const [statementOf,setStatementOf] = useState({})
  const [downloading, setDownloading] = useState(false)
  const [dateRange, setDateRange] = useState(
   {
      startDate: new Date("2024/01/01"),
      endDate: new Date(),
    }
  );





  const handleReset = () => {
    setPageItemLimit(10)
    setDateRange([{ startDate: new Date("2024/01/01"), endDate: new Date() }])
  }

  // console.log("daterange", dateRange)

  const getAllStatement = async () => {
    setLoading(true)
    try {
      const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
      const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
      const res = await getStatementApi(pageItemLimit,pgNo,startDate,endDate,searchQuery)
      if (res?.data?.success && res?.data?.data?.data) {
        setData(res?.data?.data?.data)
        setNoOfData(res?.data?.data?.totalData)
        setStatementOf(res?.data?.data?.statementOf)        
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

  console.log("statementOf",statementOf);
  

  useEffect(() => {
    if (getStatementApi && !showStatement.status) {
      getAllStatement()
    }
  }, [showStatement,pgNo])


  const handlePageClick = (event) => {
    setPgNo(event.selected + 1)
  };

  const handleBack = () => {
    if(location?.state?.filter && location?.state?.back){
        navigate(location?.state?.back,{state:{...location?.state,back:location?.pathname}});
    }else{
        navigate(-1)
    }
  };

  const handleSearchQuery = (value) => {
    setIsSearch(true)
    setSearchQuery(value)
  }

    const handleDownload = async () => {
      try {
        const type = true
        const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
        const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
        setDownloading(true)
        const res = await excelDownloadApi(startDate, endDate)
        console.log("res", res);
        if (res?.status == 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Statement.xlsx'; // Specify the filename here
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

  useEffect(()=>{
    const type = ["admin","finance","operation"]
    if(!((type?.includes(state?.myAppData?.details?.role?.toLowerCase())) || (type?.includes(state?.myAppData?.details?.empType?.toLowerCase())))){
        navigate(-1)
    }
  },[state?.myAppData])


  useEffect(() => {
    if (isSearch) {
      let debouncedCall = loash.debounce(function () {
        getAllStatement()
        setIsSearch(false)
        setPageItemLimit(10)
        setPgNo(1)
      }, 1000);
      debouncedCall();
      return () => {
        debouncedCall.cancel();
      };
    }

  }, [searchQuery, isSearch])

  return (<>
    {loading ? <Loader /> :
      <div>

        <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllStatement} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            {/* <IoArrowBackCircleOutline className="fs-3"  onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }} /> */}
            <div className="d-flex flex align-items-center gap-1">
              <span>Statement</span>
            </div>
          </div>
          {
            (type=="admin" || type=="operation") && <div className="btn btn-primary" onClick={()=>setShowStatement({status:!showStatement?.status,data:null,create:true})}>
            Create
          </div>
          }
   
        </div>
       

        <div className="mx-md-5 m-sm-0 p-3">
          <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
            <div className="row p-0 mb-2">
              <div className="col-12">
                <div className="">
                  <div className="d-flex flex gap-2">
                  <div className="form-control px-2 d-flex gap-2 w-100">
                <span className=""><BsSearch className="text-black" /></span>
                <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)}  placeholder="Search.." style={{ outline: "none", border: 0 }} />
              </div>
                    <div className="btn btn-primary fs-5" onClick={() => setShowCalender(!showCalender)}><CiFilter /></div>
                    <div className="btn btn-primary fs-5" onClick={() => handleReset()}>Reset</div>
                    <select className="form-select w-auto" name="pageItemLimit" value={pageItemLimit} onChange={(e) => { setPageItemLimit(e.target.value); setPgNo(1) }} aria-label="Default select example">
                      <option value="">Items</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={25}>25</option>
                    </select>
                    <button className={`btn btn-primary fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-sm"></span> : <SiMicrosoftexcel />}</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 overflow-auto">
              <table className="table table-responsive rounded-2 shadow table-borderless">
                <thead>
                  <tr className="bg-primary text-white text-center">
                    <th scope="col" className="text-nowrap" >SL No</th>
                    {(type== "admin"||type=="operation" ) && 
                    <th scope="col" className="text-nowrap" >Action</th>}
                    <th scope="col" className="text-nowrap">Partner Name</th>
                    <th scope="col" className="text-nowrap">Employee Name</th>
                    <th scope="col" className="text-nowrap">Case Login Date</th>
                    <th scope="col" className="text-nowrap"  >Policyholder Name</th>
                    <th scope="col" className="text-nowrap"  >File No</th>
                    <th scope="col" className="text-nowrap"  >Policy No</th>
                    <th scope="col" className="text-nowrap"  >Insurance Company Name</th>
                    <th scope="col" className="text-nowrap"  >Claim Amount</th>
                    <th scope="col" className="text-nowrap" >Total Claim Approved amount</th>
                    <th scope="col" className="text-nowrap"  >Consultancy Fees</th>
                    <th scope="col" className="text-nowrap"  >TDS</th>
                    <th scope="col" className="text-nowrap"  >Mode Of Login</th>
                    <th scope="col" className="text-nowrap"  >Net Amount Payable</th>
                    {/* <th scope="col" className="text-nowrap"  >UTR Details</th> */}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                    <th scope="row">{ind + 1}</th> 
                    {(type== "admin"||type=="operation" ) &&  <th><span  style={{ height: 30, width: 30, borderRadius: 30 }} onClick={()=>setShowStatement({...showStatement,status:!showStatement?.status,data:item})} className="cursor-pointer bg-primary text-white d-flex align-items-center justify-content-center"><CiEdit className="fs-5 text-white" /></span>
                    </th> }    
                   <td className="text-nowrap">{item?.partnerDetails?.profile?.consultantName || "-"}</td>
                   <td className="text-nowrap">{item?.empDetails?.fullName || "-"}</td>
                   <td className="text-nowrap">{item?.caseLogin && getFormateDMYDate(item?.caseLogin)}</td>
                    <td className="text-nowrap">{item?.policyHolder}</td>
                    <td className="text-nowrap">{item?.fileNo}</td>
                    <td className="text-nowrap">{item?.policyNo}</td>
                    <td className="text-nowrap">{item?.insuranceCompanyName}</td>
                    <td className="text-nowrap">{item?.claimAmount}</td>
                    <td className="text-nowrap">{item?.approvedAmt}</td>
                    <td className="text-nowrap">{item?.constultancyFee}</td>
                    <td className="text-nowrap">{item?.TDS}</td>
                    <td className="text-nowrap">{item?.modeOfLogin}</td>
                    <td className="text-nowrap">{item?.payableAmt}</td>
                    {/* <td className="text-nowrap">{item?.utrDetails}</td> */}


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
                pageCount={Math.ceil(noOfData / pageItemLimit) || 1}
                previousLabel={<BiLeftArrow />}
                className="d-flex flex gap-2"
                breakClassName={""}
                marginPagesDisplayed={1}
                pageClassName="border border-primary paginate-li"
                previousClassName="paginate-li bg-color-3"
                nextClassName="paginate-li bg-color-3"
                activeClassName="bg-primary text-white"
                forcePage={pgNo > 0 ? pgNo - 1 : 0}
                renderOnZeroPageCount={null}
              />
            </div>

          </div>
        </div>
          <CreateOrUpdateStatmentModal show={showStatement?.status} data={showStatement?.data} hide={()=>setShowStatement({...showStatement,status:!showStatement?.status})}  type={type} all={showStatement?.create} fileDetailApi={fileDetailApi}/>
      </div>}
  </>)
}