import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { HiMiniEye } from 'react-icons/hi2'
import { BsSearch } from 'react-icons/bs'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getFormateDMYDate } from "../../../utils/helperFunction"
import { useLocation, useNavigate } from "react-router-dom"
import SetStatusOfProfile from "../../../components/Common/Modal/setStatusModal";
import Loader from "../../../components/Common/loader"
import loash from 'lodash'
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationModal from "../../../components/Common/Modal/confirmationModal";
import { FaTrashRestoreAlt } from 'react-icons/fa'
import PaginateField from "../PaginateField";

export default function AllClientTrash({ allClientApi, clientStatusApi, deleteClientApi, removeClientPermission, viewClientpath }) {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [pageItemLimit, setPageItemLimit] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pageItemLimit ? location?.state?.filter?.pageItemLimit : 10)
    const [searchQuery, setSearchQuery] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.searchQuery ? location?.state?.filter?.searchQuery : "")
    const [isSearch, setIsSearch] = useState(false)
    const [noOfClient, setNoOfClient] = useState(0)
    const [pgNo, setPgNo] = useState(location?.pathname == location?.state?.path && location?.state?.filter?.pgNo ? location?.state?.filter?.pgNo : 1)
    const [changeStatus, setChangeStatus] = useState({ show: false, details: {} })
    const [deleteClient, setDeleteClient] = useState({ status: false, id: "", text: "" })


    const getAllClients = async () => {
        setLoading(true)
        try {
            const type = false;
            const res = await allClientApi(pageItemLimit, pgNo, searchQuery, "", "", type)
            if (res?.data?.success && res?.data?.data) {
                setData([...res?.data?.data])
                setNoOfClient(res?.data?.noOfClient)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        if (!deleteClient?.status) {
            getAllClients()
        }
    }, [pageItemLimit, pgNo, changeStatus, deleteClient])

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
            const res = await clientStatusApi(_id, status)
            if (res?.data?.success) {
                setChangeStatus({ show: false, details: "" })
                toast.success(res?.data?.message)

            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    const handlePageClick = (event) => {
        setPgNo(event.selected + 1)
    };

    const filter = {
        pageItemLimit,
        pgNo,
        searchQuery,
    }


    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        <div className="d-flex flex align-items-center gap-1">
                            <span>All trash Client</span>
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
                                            <th scope="col" className="text-nowrap" ><span>Action</span></th>
                                            <th scope="col" className="text-nowrap">Branch ID</th>
                                            <th scope="col" className="text-nowrap">Associate With Us</th>
                                            <th scope="col" className="text-nowrap">Cient Name</th>
                                            <th scope="col" className="text-nowrap" >Client Code</th>
                                            <th scope="col" className="text-nowrap" >Mobile No</th>
                                            <th scope="col" className="text-nowrap" >Email Id</th>
                                            <th scope="col" className="text-nowrap" >City</th>
                                            <th scope="col" className="text-nowrap" >State</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                                            <th scope="row" className="text-nowrap">{ind + 1}</th>
                                            <td className="text-nowrap">
                                                <span className="d-flex gap-2"><span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-primary text-white d-flex align-items-center justify-content-center" onClick={() => navigate(`${viewClientpath}/${item._id}`, { state: { filter, back: location?.pathname, path: location?.pathname } })}><HiMiniEye /></span>
                                                    <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-success text-white d-flex align-items-center justify-content-center" onClick={() => setChangeStatus({ show: true, details: { _id: item._id, currentStatus: item?.isActive, name: item?.profile?.consultantName, recovery: false } })}><FaTrashRestoreAlt /></span>
                                                    {removeClientPermission && <span style={{ cursor: "pointer", height: 30, width: 30, borderRadius: 30 }} className="bg-danger text-white d-flex align-items-center justify-content-center" onClick={() => setDeleteClient({ status: true, id: item?._id, text: `Your want to permanent delete ${item?.profile?.consultantName} client` })}><AiOutlineDelete /></span>}
                                                </span></td>
                                            <td className="text-nowrap">{item?.branchId}</td>
                                            <td className="text-nowrap">{item?.profile?.associateWithUs && getFormateDMYDate(item?.profile?.associateWithUs)}</td>
                                            <td className="text-nowrap">{item?.profile?.consultantName}</td>
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
                    {changeStatus?.show && <SetStatusOfProfile changeStatus={changeStatus} hide={() => setChangeStatus({ show: false, details: {} })} type="Client" handleChanges={handleChanges} />}
                    {deleteClient?.status && <ConfirmationModal show={deleteClient?.status} id={deleteClient?.id} hide={() => setDeleteClient({ status: false, id: "" })} heading="Are you sure?" text={deleteClient?.text ? deleteClient?.text : "Your want to permanent delete this client"} handleComfirmation={deleteClientApi} />}

                </div>

            </div>}
    </>)
}
