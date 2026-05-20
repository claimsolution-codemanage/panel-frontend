import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsPlusCircle, BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { formatAmount, getFormateDate, getFormateDMYDate } from "../../../utils/helperFunction"
import { useLocation, useNavigate } from "react-router-dom"
import Loader from "../../../components/Common/loader";
import loash from 'lodash'
import DateSelect from "../../../components/Common/Modal/DateSelect";
import { CiFilter } from "react-icons/ci";
import PaginateField from "../../../components/Common/PaginateField";

export default function CasePaymentDetailList({ getListApi, viewUrl, addPaymentUrl, role }) {
    const location = useLocation()
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [pageItemLimit, setPageItemLimit] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit : 10)
    const [showCalender, setShowCalender] = useState(false)
    const [searchQuery, setSearchQuery] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery : "")
    const [totalRecords, setTotalRecords] = useState(0)
    const [pgNo, setPgNo] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo : 1)

    const [dateRange, setDateRange] = useState(
        location?.pathname == location?.state?.path && location?.state?.filter?.dateRange ?
            location?.state?.filter?.dateRange : {
                startDate: new Date("2024/01/01"),
                endDate: new Date(),
            }
    );

    const handleReset = () => {
        setSearchQuery("")
        setPageItemLimit(10)
        setDateRange({ startDate: new Date("2024/01/01"), endDate: new Date() })
        setStatusType("")
    }

    const getViewAllInvoice = async () => {
        setLoading(true)
        try {
            const startDate = dateRange?.startDate ? getFormateDate(dateRange?.startDate) : ""
            const endDate = dateRange?.endDate ? getFormateDate(dateRange?.endDate) : ""
            const res = await getListApi({ limit: pageItemLimit, pageNo: pgNo, search: searchQuery, startDate, endDate })
            if (res?.data?.success && res?.data?.data) {
                setData([...res?.data?.data])
                setTotalRecords(res?.data?.pagination?.totalRecords)
                setLoading(false)
            }
        } catch (error) {
            console.log("error", error);

            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    useEffect(() => {
        getViewAllInvoice()
    }, [pageItemLimit, pgNo,])


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
                <div className="d-md-flex flex-column flex-md-row justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-1">
                            <span>All Payment Details</span>
                        </div>
                    </div>
                    {role !== "client" && <div className="d-flex gap-2">
                        <div className="btn btn-primary" onClick={() => navigate(addPaymentUrl)}><BsPlusCircle /> Add Payment</div>
                    </div>}
                </div>

                <div className="m-0 m-md-5">
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
                                        <th scope="col" className="text-nowrap" >Current Case Status</th>
                                        <th scope="col" className="text-nowrap" >Case Added On</th>
                                        <th scope="col" className="text-nowrap"  >Payment Added On</th>
                                        {role === "client" && <th scope="col" className="text-nowrap"  >Case Name</th>}
                                        {role !== "client" && <>
                                            <th scope="col" className="text-nowrap"  >Client Name</th>
                                            <th scope="col" className="text-nowrap"  >Email Address</th>
                                            <th scope="col" className="text-nowrap" >Mobile Number</th>
                                        </>}
                                        <th scope="col" className="text-nowrap" >Claim Amount (₹)</th>
                                        <th scope="col" className="text-nowrap" >Fee Amount (₹)</th>
                                        <th scope="col" className="text-nowrap" >Remaining Amount (₹)</th>
                                        <th scope="col" className="text-nowrap"  >File Reference No.</th>
                                        <th scope="col" className="text-nowrap"  >Policy Number</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, ind) => <tr key={ind} className="border-2 text-nowrap border-bottom border-light text-center">
                                        <th scope="row">{ind + 1}</th>
                                        <td><span className="d-flex gap-2">
                                            <span data-tooltip="View" style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-warning text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`${viewUrl}${item._id}`, { state: { filter, back: location?.pathname, path: location?.pathname } })}><HiMiniEye /></span>
                                        </span>
                                        </td>
                                        <td className="text-nowrap">{item?.currentStatus}</td>
                                        <td className="text-nowrap">{item?.caseAddOn && getFormateDMYDate(item?.caseAddOn)}</td>
                                        <td className="text-nowrap">{item?.createdAt && getFormateDMYDate(item?.createdAt)}</td>
                                        {role === "client" && <td className="text-nowrap">{item?.caseName}</td>}
                                        {role !== "client" && <>
                                            <td className="text-nowrap">{item?.name}</td>
                                            <td className="text-nowrap">{item?.email}</td>
                                            <td className="text-nowrap">{item?.mobileNo}</td>
                                        </>}
                                        <td className="text-nowrap">{formatAmount(item?.claimAmount || 0)}</td>
                                        <td className="text-nowrap">{formatAmount(item?.totalAmountWithGst || 0)}</td>
                                        <td className="text-nowrap">{formatAmount(item?.balanceAmount || 0)}</td>
                                        <td className="text-nowrap">{item?.fileNo}</td>
                                        <td className="text-nowrap">{item?.policyNumber}</td>
                                    </tr>)}
                                </tbody>
                            </table>

                        </div>

                        <div className="d-flex flex align-items-center justify-content-center">
                            <PaginateField pgNo={pgNo} pageCount={Math.ceil(totalRecords / pageItemLimit) || 1} handlePageClick={handlePageClick} />
                        </div>
                    </div>
                </div>
            </div >
        }
    </>)
}