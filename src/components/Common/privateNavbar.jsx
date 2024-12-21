import { RxDashboard } from 'react-icons/rx'
import { BsFillPersonLinesFill, BsPostcard } from 'react-icons/bs'
import { RiAdminFill, RiBankLine, RiTeamLine } from 'react-icons/ri'
import { SiMicrosoftteams, SiReaddotcv } from 'react-icons/si'
import { MdNotificationsActive, MdOutlineCancelPresentation, MdOutlineLibraryAdd, MdOutlinePostAdd } from 'react-icons/md'
import { IoLogOutOutline,IoNewspaperOutline,IoSettingsOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App'
import { useContext, useEffect, useState } from 'react'
import { deleteToken } from '../../utils/helperFunction'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {ImSwitch} from 'react-icons/im'
import { useNavigate } from 'react-router-dom'
import { NavItems } from './NavItems'
import { LuPcCase } from 'react-icons/lu'
import {IoIosArrowDown, IoIosArrowForward} from 'react-icons/io'
import {FaFileInvoice, FaFileInvoiceDollar, FaRegTrashCan,FaUserPlus} from 'react-icons/fa6'
import {FaTrashAlt,FaUserFriends,FaUserTag,FaUsers} from 'react-icons/fa'
import {GrCompliance} from 'react-icons/gr'
import { CgNotes, CgProfile } from "react-icons/cg";
import { TbFileInvoice, } from 'react-icons/tb'


export default function PrivateNavbar() {
    const location = useLocation()
    const navigate = useNavigate()

    // console.log("location123", location.pathname);


    const state = useContext(AppContext)
    const [myRole, setRole] = useState("")
    const [showLogout, setLogout] = useState(false)
    const [showTrashOption,setShowTrashOption] = useState(false)
    // console.log("state", state?.myAppData?.details?.role == "Admin");

    useEffect(() => {
        setRole(state?.myAppData?.details?.role)
    }, [state])

    const handleLogout = () => {
        deleteToken()
        state?.setMyAppData({ isLogin: false, details: "" })
    }

    const empType  = state?.myAppData?.details?.empType
    const userDetails = state?.myAppData?.details
    // console.log("state",userDetails);


    return (<>
        <div className="h-100 d-flex flex-column  bg-primary gap-2 py-4 color-4">
               <div className='d-flex align-items-center mx-2 py-2  justify-content-center bg-white active_item'>
                      <div className="nav__logo">
                        <img src="/Images/icons/company-logo.png" height={70} alt="Company logo" loading="lazy" />
                      </div>
                    </div>
            {myRole == "partner" && <>
                <Link to="/partner/dashboard" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("dashboard") && "active_item"}`}  >
                    <RxDashboard />
                    <div className=''>Dashboard</div>
                </Link>
                <Link to="/partner/profile" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("profile") && "active_item"}`} >
                    <BsFillPersonLinesFill />
                    <div className=''>Profile</div>
                </Link>
                <Link to="/partner/banking details" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("banking") && "active_item"}`} >
                    <RiBankLine />
                    <div className=''>Banking Details</div>
                </Link>
                <Link to="/partner/all case" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location.pathname== "/partner/all%20case" ||location.pathname.includes("/partner/view%20case") ||location.pathname.includes("/partner/edit%20case") ) && "active_item"}`} >
                    <SiReaddotcv />
                    <div className=''>All Case</div>
                </Link>
                <Link to="/partner/add new case" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3  text-white  ${location.pathname == "/partner/add%20new%20case" && "active_item"}`} >
                    <MdOutlineLibraryAdd />
                    <div className=''>Add Case</div>
                </Link>
                <Link to={`/partner/statement/${userDetails?._id}`} className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location?.pathname?.includes("/partner/statement/")) && "active_item"}`}  >
             <IoNewspaperOutline />
             <div className=''>Commission</div>
            </Link>
                <Link to="/partner/view service agreement" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3  text-white  ${location.pathname == "/partner/view%20service%20agreement" && "active_item"}`} >
                <LuPcCase />
                    <div className=''>Service Agreement</div>
                </Link>
            </>}

            {myRole == "client" && <>
            <NavItems 
            active={location.pathname == "/client/dashboard"}
            path={"/client/dashboard"}
            name={"Dashboard"}
            disable={false}
            icon={<RxDashboard />}
            />
            <NavItems 
            active={location.pathname.includes("profile")}
            path={"/client/profile"}
            name={"Profile"}
            disable={false}
            icon={<BsFillPersonLinesFill />}
            />
            <NavItems 
            active={location.pathname == "/client/add%20new%20case"}
            path={'/client/add new case'}
            name={"Add Case"}
            disable={false}
            icon={<MdOutlineLibraryAdd />}
            />
          <NavItems 
            active={(location.pathname== "/client/all%20case" ||location.pathname.includes("/client/view%20case") ||location.pathname.includes("/client/edit%20case") )}
            path={'/client/all case'}
            name={"All Case"}
            disable={false}
            icon={<SiReaddotcv />}
            />
            <NavItems 
            active={location.pathname.includes("invoice")}
            path={'/client/all-invoices'}
            name={"My Invoice"}
            disable={false}
            icon={<FaFileInvoice />}
            />
            <NavItems 
            active={(location.pathname== "/client/view%20service%20agreement" )}
            path={'/client/view service agreement'}
            name={"Service Agreement"}
            disable={false}
            icon={<LuPcCase />}
            />
            </>}

            {myRole == "Admin" && <>
                <Link to="/admin/dashboard" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("dashboard") && "active_item"}`}  >
                    <RxDashboard />
                    <div className=''>Dashboard</div>
                </Link>
                <Link to="/admin/all case" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("case") && !location.pathname.includes("/admin/reject-cases") && !location.pathname.includes("trash") && "active_item"}`}  >
                <SiReaddotcv />
                    <div className=''>All Case</div>
                </Link>
                <Link to="/admin/all complaint" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("complaint") && "active_item"}`}  >
                <CgNotes/>
                    <div className=''>All Complaint</div>
                </Link>
                <Link to="/admin/all partner" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("partner") && !location.pathname.includes("statement") && !location.pathname.includes("trash") && "active_item"}`}  >
                    <FaUserFriends />
                    <div className=''>All Partner</div>
                </Link>
                <Link to="/admin/all client" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("client") && !location.pathname.includes("trash") &&  "active_item"}`}  >
                    <FaUserTag />
                    <div className=''>All Client</div>
                </Link>
                <Link to="/admin/all-invoices" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("invoice") && !location.pathname.includes("add-invoice") &&  "active_item"}`}  >
                    <FaFileInvoice />
                    <div className=''>All Invoice</div>
                </Link>
                <Link to="/admin/add-invoice" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("/admin/add-invoice") &&  "active_item"}`}  >
                    <MdOutlineLibraryAdd />
                    <div className=''>Add Invoice</div>
                </Link>
                <Link to="/admin/notification" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("/admin/notification") &&  "active_item"}`}  >
                    <MdNotificationsActive />
                    <div className=''>Notification</div>
                </Link>
                <Link to="/admin/statement" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("/admin/statement") &&  "active_item"}`}  >
                    <IoNewspaperOutline />
                    <div className=''>Statement</div>
                </Link>
                <Link to="/admin/all employee" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location.pathname=="/admin/all%20employee" || location.pathname.includes("/admin/employee/profile")) && "active_item"}`}  >
                    <FaUsers />
                    <div className=''>All Employee</div>
                </Link>
                <Link to="/admin/add new employee" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/add%20new%20employee" && "active_item"}`}  >
                    <FaUserPlus />
                    <div className=''>Add Employee</div>
                </Link>
                {state?.myAppData?.details?.superAdmin && <Link to="/admin/my-admins" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/my-admins" && "active_item"}`}  >
                    <RiAdminFill />
                    <div className=''>My Admins</div>
                </Link>}

                <Link to="/admin/all job" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/all%20job" && "active_item"}`}  >
                    <MdOutlinePostAdd />
                    <div className=''>My Jobs</div>
                </Link>
                <Link to="/admin/reject-cases" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("/admin/reject-cases") && "active_item"}`}  >
                    <MdOutlineCancelPresentation />
                    <div className=''>Reject Case</div>
                </Link>
                <Link to="/admin/account setting" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/account%20setting" && "active_item"}`}  >
                    <IoSettingsOutline />
                    <div className=''>Setting</div>
                </Link>
                <div  className={`cursor-pointer`}  >
                    <div onClick={()=>setShowTrashOption(!showTrashOption)} className='d-flex align-items-center mx-2 px-2 py-2 gap-3 cursor-pointer text-white'>
                    <FaRegTrashCan />
                    <div className='d-flex align-items-center gap-5'>
                        <div className=''>Trash</div>
                        {showTrashOption ? <IoIosArrowDown/> : <IoIosArrowForward/>}
                    </div>
                    </div>
                    <div className={`px-3 ${!showTrashOption && "d-none"}`}>
                    <Link to="/admin/all trash partner" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/all%20trash%20partner" && "active_item"}`}  >
                    <FaTrashAlt />
                    <div className=''>Partner</div>
                    </Link>
                    <Link to="/admin/all trash client" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/all%20trash%20client" && "active_item"}`}  >
                    <FaTrashAlt />
                    <div className=''>Client</div>
                    </Link>
                    <Link to="/admin/all-trash-employee" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/all-trash-employee" && "active_item"}`}  >
                    <FaTrashAlt />
                    <div className=''>Employee</div>
                    </Link>
                    <Link to="/admin/all trash case" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/all%20trash%20case" && "active_item"}`}  >
                    <FaTrashAlt />
                    <div className=''>Case</div>
                    </Link>
                    <Link to="/admin/all-trash-doc" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/all-trash-doc" && "active_item"}`}  >
                    <FaTrashAlt />
                    <div className=''>Document</div>
                    </Link>
                    <Link to="/admin/all-trash-invoice" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/admin/all-trash-invoice" && "active_item"}`}  >
                    <FaTrashAlt />
                    <div className=''>Invoice</div>
                    </Link>
                    </div>
                </div>
            </>}

            {myRole == "Employee" && <>
            <Link to="/employee/dashboard" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("dashboard") && "active_item"}`}  >
            <RxDashboard />
            <div className=''>Dashboard</div>
            </Link>
            <Link to="/employee/profile" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("profile") && "active_item"}`}  >
            <CgProfile />
            <div className=''>Profile</div>
            </Link>
            {(empType?.toLowerCase() =="operation") && <>
                <Link to="/employee/notification" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("/employee/notification") &&  "active_item"}`}  >
                    <MdNotificationsActive />
                    <div className=''>Notification</div>
                </Link>
            <Link to="/employee/all client" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("client") && "active_item"}`}  >
            <FaUserTag />
            <div className=''>All Client</div>
            </Link>
            </>}

            {(empType?.toLowerCase() =="finance" || empType?.toLowerCase() =="operation" || empType?.toLowerCase() =="sales" || 
            empType?.toLowerCase() =="Sathi Team".toLowerCase() || empType?.toLowerCase() =="branch") && <>
            <Link to="/employee/all partner" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("partner") && !location.pathname.includes("statement") && !location.pathname.includes("add-partner") && "active_item"}`}  >
            <FaUserFriends />
            <div className=''>All Partner</div>
            </Link>
            </>}

                {/*for sales emp  */}
            {(empType?.toLowerCase() =="sales" || empType?.toLowerCase() =="branch" || empType?.toLowerCase() =="Sathi Team".toLowerCase())  && <>
                <Link to="/employee/add-partner" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("add-partner") && "active_item"}`}  >
                    <FaUserPlus />
                    <div className=''>Add Partner</div>
                </Link>
                { empType?.toLowerCase() !="Sathi Team".toLowerCase() && <Link to="/employee/add-case" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("add-case") && "active_item"}`}  >
                    <MdOutlineLibraryAdd />
                    <div className=''>Add Case</div>
                </Link>}
               
            </>}


            <Link to="/employee/all case" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("case") && !location.pathname.includes("add-case") && "active_item"}`}  >
                <SiReaddotcv />
                    <div className=''>All Case</div>
            </Link>
            {(empType?.toLowerCase() =="sales" || empType?.toLowerCase() =="branch") && <>
            <Link to="/employee/add-sathi-team" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("/employee/add-sathi-team") && "active_item"}`}  >
             <RiTeamLine />
             <div className=''>Add Sathi Team</div>
         </Link>
            </>  }
            {(empType?.toLowerCase() =="sales" || empType?.toLowerCase() =="branch" || empType?.toLowerCase() =="finance" || empType?.toLowerCase() =="operation") && <>
            <Link to="/employee/branch-team" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location.pathname.includes("branch-team") || location?.pathname?.includes("view-sathi")) && "active_item"}`}  >
             <SiMicrosoftteams />
             <div className=''>Branch Team</div>
            </Link>
            </>}
            {/* for finance employee */}
            {(empType?.toLowerCase() =="operation" || empType?.toLowerCase() =="finance") && <>
                <Link to="/employee/statement" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location.pathname.includes("/employee/statement")) && "active_item"}`}  >
                    <IoNewspaperOutline />
                    <div className=''>Statement</div>
                </Link>
                <Link to="/employee/all-invoices" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location.pathname.includes("/employee/all-invoices") || location.pathname.includes("/employee/view-invoice") ) && "active_item"}`}  >
                    <FaFileInvoice />
                    <div className=''>All Invoices</div>
                </Link>
              
            </>}
            {(empType?.toLowerCase() =="finance") && <>
                <Link to="/employee/add-invoice" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location.pathname.includes("/employee/add-invoice") ) && "active_item"}`}  >
                    <MdOutlineLibraryAdd />
                    <div className=''>Add Invoice</div>
                </Link>
              
            </>}
            {(empType?.toLowerCase() =="sathi team") && <>
            <Link to={`/employee/statement/sathi-team/${userDetails?._id}`} className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${(location?.pathname?.includes("/statement/sathi-team/")) && "active_item"}`}  >
             <IoNewspaperOutline />
             <div className=''>Commission</div>
            </Link>
            </>}
                <Link to="/employee/reset password" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/employee/reset%20password" && "active_item"}`}  >
                    <IoSettingsOutline />
                    <div className=''>Setting</div>
                </Link>
            </>}


            <Link onClick={()=>setLogout(true)} className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/" && "active_item"}`} >
                <IoLogOutOutline />
                <div className=''>Logout</div>
            </Link>
        </div>

        <Modal
            show={showLogout}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Body className='color-4'>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <div className='d-flex align-items-center justify-content-center text-white bg-danger' style={{height:50,width:50,borderRadius:50}}><ImSwitch className='fs-3'/></div>
                    <h2 className='py-3'>Are you sure?</h2>
                </div>
                <div className='d-flex  align-items-center justify-content-center mt-3 gap-3'>
                <Button className='btn btn-success px-4' onClick={() => handleLogout()}>Yes</Button>
                <Button className='btn btn-danger px-4' onClick={() => setLogout(false)}>No</Button>
                </div>
            </Modal.Body>
        </Modal>

    </>)
}