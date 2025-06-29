import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate, getFormateDate } from "../../utils/helperFunction"
import ReactPaginate from 'react-paginate';
import { CiAlignBottom, CiEdit } from 'react-icons/ci'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'
import Loader from "../../components/Common/loader"
import loash from 'lodash'
import { AppContext } from "../../App"
import { useContext } from "react"
import DateSelect from "../Common/Modal/DateSelect";
import { CiFilter } from "react-icons/ci";
import { SiMicrosoftexcel } from "react-icons/si"
import ShareSectionModal from "../Common/Modal/shareSectionModal";
import { IoShareSocialOutline } from "react-icons/io5";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import SetStatusOfProfile from "../Common/Modal/setStatusModal";
import ConfirmationModal from "../Common/Modal/confirmationModal";
import ChangeBranch from "../Common/Modal/changeBranch";
import PaginateField from "../Common/PaginateField";


export default function ViewAllClient(props) {
    const { getList, listDownload, endableEdit, editPath, viewPath, role, enableClientShare, shareClient, getSaleEmp, changeBranchApi,
        deleteClientByIdApi, setClientStatusApi, enableChangeBranch, enableDeleteClient, enableClientStatus, showTooltip } = props
    const stateContext = useContext(AppContext)
    const empType = stateContext?.myAppData?.details?.empType
    const [data, setData] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const [isSearch, setIsSearch] = useState(false)
    const [loading, setLoading] = useState(true)
    const [pageItemLimit, setPageItemLimit] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit : 10)
    const [searchQuery, setSearchQuery] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery : "")
    const [noOfClient, setNoOfClient] = useState(0)
    const [pgNo, setPgNo] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo : 1)
    const [showCalender, setShowCalender] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [shareClientList, setClientList] = useState([])
    const [shareModal, setShareModal] = useState({ status: false, value: [] })
    const [changeStatus, setChangeStatus] = useState({ show: false, details: {} })
    const [deleteClient, setDeleteClient] = useState({ status: false, id: "", text: "" })


    const [changeBranch, setChangeBranch] = useState({ loading: false, branchId: null, status: false, _id: null })

    const [dateRange, setDateRange] = useState(
        location?.pathname == location?.state?.path && location?.state?.filter?.dateRange ? location?.state?.filter?.dateRange : {
            startDate: new Date("2024/01/01"),
            endDate: new Date(),
        });

    const handleReset = () => {
        setSearchQuery("")
        setPageItemLimit(5)
        setDateRange({ startDate: new Date("2024/01/01"), endDate: new Date() })
        setPgNo(1)
    }

    const getAllClient = async () => {
        setLoading(true)
        try {
            const startDate = dateRange?.startDate ? getFormateDate(dateRange?.startDate) : ""
            const endDate = dateRange?.endDate ? getFormateDate(dateRange?.endDate) : ""
            const res = await getList(pageItemLimit, pgNo, searchQuery, startDate, endDate)
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
        getAllClient()
    }, [pageItemLimit, pgNo])


    useEffect(() => {
        if (isSearch) {
            let debouncedCall = loash.debounce(function () {
                getAllClient()
                setPgNo(1)
                setPageItemLimit(5)
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

    const handlePageClick = (event) => {
        setPgNo(event.selected + 1)
    };


    const handleDownload = async () => {
        try {
            const type = true
            const startDate = dateRange.startDate ? getFormateDate(dateRange.startDate) : ""
            const endDate = dateRange.endDate ? getFormateDate(dateRange.endDate) : ""
            setDownloading(true)
            const res = await listDownload(searchQuery, startDate, endDate)
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

    const filter = {
        pageItemLimit,
        pgNo,
        searchQuery,
        dateRange
    }

    const handleShareOnchange = (e, id) => {
        const { value, checked } = e.target
        if (!checked) {
            const newShareList = shareClientList.filter(partnerShare => partnerShare != id)
            setClientList(newShareList)
        } else {
            const newPartnerList = [...shareClientList]
            newPartnerList.push(id)
            setClientList(newPartnerList)
        }
    }

    const handleChanges = async (_id, status) => {
        try {
            const res = await setClientStatusApi(_id, status)
            if (res?.data?.success) {
                setChangeStatus({ show: false, details: "" })
                toast.success(res?.data?.message)
                getAllClient()
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }


    return (<>
        {loading ? <Loader /> :
            <div>
                <DateSelect show={showCalender} hide={() => setShowCalender(false)} onFilter={getAllClient} dateRange={dateRange} setDateRange={setDateRange} />
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        <div className="d-flex flex align-items-center gap-1">
                            <span>All Client</span>
                        </div>
                    </div>
                </div>
                <div className="m-0 m-md-5 p-md-4">
                    <div className="">
                        <div className=" border-end">
                            <div className="bg-color-1 border-0 border-primary border-start card mx-1 my-4 p-2 shadow">
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

                <div className="m-md-5 p-md-4">
                    <div className="bg-color-1 p-3 p-md-5 rounded-2 shadow">
                        <div className="d-block d-md-flex flex gap-2">

                            <div className="form-control px-2 d-flex gap-2">
                                <span className=""><BsSearch className="text-black" /></span>
                                <input className="w-100" value={searchQuery} onChange={(e) => handleSearchQuery(e.target.value)} placeholder="Search.." style={{ outline: "none", border: 0 }} />
                            </div>
                            <div className="btn btn-primary m-2 m-md-0" onClick={() => setShowCalender(!showCalender)}><CiFilter /></div>
                            <div className="btn btn-primary m-2 m-md-0" onClick={() => handleReset()}>Reset</div>
                            {shareClientList?.length > 0 && <div className="btn btn-primary fs-5 m-2 m-md-0" onClick={() => setShareModal({ status: true, value: shareClientList })}><IoShareSocialOutline /></div>}
                            {listDownload && <button className={`btn btn-primary m-2 m-md-0 fs-5 ${downloading && "disabled"}`} disabled={downloading} onClick={() => !downloading && handleDownload()}>{downloading ? <span className="spinner-border-sm"></span> : <SiMicrosoftexcel />}</button>}
                            <div className="">
                                <select className="form-select" name="pageItemLimit" value={pageItemLimit} onChange={(e) => setPageItemLimit(e.target.value)} aria-label="Default select example">
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
                                            {enableClientShare && <th scope="col" className="text-nowrap" ></th>}
                                            <th scope="col" className="text-nowrap">SL No</th>
                                            <th scope="col" className="text-nowrap" ><span>Action</span></th>
                                            <th scope="col" className="text-nowrap">Branch ID</th>
                                            <th scope="col" className="text-nowrap">Associate With Us</th>
                                            <th scope="col" className="text-nowrap">Client Name</th>
                                            <th scope="col" className="text-nowrap" >Client Code</th>
                                            <th scope="col" className="text-nowrap" >Mobile No</th>
                                            <th scope="col" className="text-nowrap" >Email Id</th>
                                            <th scope="col" className="text-nowrap" >City</th>
                                            <th scope="col" className="text-nowrap" >State</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                            {enableClientShare && <td className="text-nowrap"><input className="form-check-input" name="shareClient" type="checkbox" checked={shareClientList.includes(item?._id)} onChange={(e) => handleShareOnchange(e, item?._id)} id="flexCheckDefault" /></td>}
                                            <th scope="row" className="text-nowrap">{ind + 1}</th>
                                            <td className="text-nowrap"><span className="d-flex align-items-center gap-2">
                                                <span style={{ height: 30, width: 30, borderRadius: 30 }} className="cursor-pointer bg-success text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`${viewPath}/${item._id}`, { state: { filter, back: location?.pathname, path: location?.pathname } })}><HiMiniEye /></span>
                                                {endableEdit && <>
                                                    <Link to={`${editPath}/${item?._id}`} state={{ filter, back: location?.pathname, path: location?.pathname }} style={{ height: 30, width: 30, borderRadius: 30 }} className="cursor-pointer bg-info text-white d-flex align-items-center justify-content-center"><CiEdit className="fs-5 text-dark" /></Link>
                                                </>}
                                                {enableChangeBranch && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeBranch({ ...changeBranch, status: true, _id: item?._id, branchId: item?.branchId })}><VscGitPullRequestGoToChanges /></span>}
                                                {enableClientStatus && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ show: true, details: { _id: item._id, currentStatus: item?.isActive, name: item?.profile?.consultantName, recovery: false } })}><AiOutlineDelete /></span>}
                                            </span></td>
                                            <td className="text-nowrap">{item?.branchId}</td>
                                            <td className="text-nowrap">{item?.profile?.associateWithUs && getFormateDMYDate(item?.profile?.associateWithUs)}</td>
                                            <td className="text-nowrap">
                                                <span className="custom-tooltip-wrapper text-capitalize">
                                                    {item?.profile?.consultantName}
                                                    {item?.share?.length && showTooltip ? <span className="custom-tooltip-text">
                                                        {item?.share?.map(sh => <span className="badge text-bg-primary">{`${sh?.emp?.fullName} | ${sh?.emp?.type} | ${sh?.emp?.designation} | ${sh?.emp?.branchId}`}</span>)}
                                                    </span> : ""}

                                                </span>
                                            </td>


                                            <td className="text-nowrap">{item?.profile?.consultantCode}</td>
                                            <td className="text-nowrap">{item?.profile?.primaryMobileNo}</td>
                                            <td className="text-nowrap">{item?.profile?.primaryEmail}</td>
                                            <td className="text-nowrap">{item?.profile?.city}</td>
                                            <td className="text-nowrap">{item?.profile?.state}</td>
                                        </tr>)}
                                    </tbody>
                                </table>

                            </div>

                            <div className="d-flex flex align-items-center justify-content-center">
                                <PaginateField pgNo={pgNo} pageCount={Math.ceil(noOfClient / pageItemLimit) || 1} handlePageClick={handlePageClick} />
                            </div>
                        </div>
                    </div>

                </div>
                {shareModal.status && <ShareSectionModal show={shareModal?.status} shareValue={shareModal?.value} handleShareCase={shareClient} getRefreshData={getAllClient} shareOf="shareClients" close={() => { setShareModal({ value: [], status: false }); setClientList([]) }} getSaleEmp={getSaleEmp} />}
                {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={() => setChangeStatus({ show: false, details: {} })} type="Client" handleChanges={handleChanges} />}
                {deleteClient?.status && <ConfirmationModal show={deleteClient?.status} id={deleteClient?.id} getRefreshData={getAllClient} hide={() => setDeleteClient({ status: false, id: "" })} heading="Are you sure?" text={deleteClient?.text ? deleteClient?.text : "Your want to delete this client"} handleComfirmation={deleteClientByIdApi} />}
                {changeBranch?.status && <ChangeBranch branch={changeBranch} onBranchChange={setChangeBranch} getRefreshData={getAllClient} type="client" handleBranch={changeBranchApi} />}

            </div>}
    </>)
}