import { RxDashboard } from 'react-icons/rx'
import { BsFillPersonLinesFill, BsPostcard } from 'react-icons/bs'
import { RiAdminFill, RiBankLine, RiTeamLine, RiTimerFlashLine } from 'react-icons/ri'
import { SiMicrosoftteams, SiReaddotcv } from 'react-icons/si'
import { MdNotificationsActive, MdOutlineCancelPresentation, MdOutlineLeaderboard, MdOutlineLibraryAdd, MdOutlinePostAdd } from 'react-icons/md'
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
import { GoIssueClosed } from "react-icons/go";


export default function PrivateNavbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = useContext(AppContext)
    const [myRole, setRole] = useState("")
    const [showLogout, setLogout] = useState(false)
    const [showTrashOption,setShowTrashOption] = useState(false)
    // console.log("state", state?.myAppData?.details?.role == "Admin");

    useEffect(() => {
        setRole(state?.myAppData?.details?.role?.toLowerCase())
    }, [state])

    const handleLogout = () => {
        deleteToken()
        state?.setMyAppData({ isLogin: false, details: "" })
    }

    const empType  = state?.myAppData?.details?.empType?.toLowerCase()
    const userDetails = state?.myAppData?.details
    console.log("state",userDetails);



    const renderNavItems = ()=>{
        let list = []
        if (myRole === "partner") {
            list = [
                { name: "Dashboard", path: "/partner/dashboard", icon: <RxDashboard />, active: location.pathname.includes("dashboard"), disable: false },
                { name: "Profile", path: "/partner/profile", icon: <BsFillPersonLinesFill />, active: location.pathname.includes("profile"), disable: false },
                { name: "Banking Details", path: "/partner/banking details", icon: <RiBankLine />, active: location.pathname.includes("banking"), disable: false },
                { name: "All Case", path: "/partner/all case", icon: <SiReaddotcv />, active: location.pathname.includes("all%20case") || location.pathname.includes("view%20case") || location.pathname.includes("edit%20case"), disable: false },
                { name: "Add Case", path: "/partner/add new case", icon: <MdOutlineLibraryAdd />, active: location.pathname == "/partner/add%20new%20case", disable: false },
                { name: "Commission", path: `/partner/statement/${userDetails?._id}`, icon: <IoNewspaperOutline />, active: location?.pathname?.includes("/partner/statement/"), disable: false },
                { name: "Service Agreement", path: "/partner/view service agreement", icon: <LuPcCase />, active: location.pathname == "/partner/view%20service%20agreement", disable: false },
            ]
        }else if(myRole==="admin"){
            list = [
                { name: "Dashboard", path: "/admin/dashboard", icon: <RxDashboard />, active: location.pathname.includes("dashboard"), disable: false },
                { name: "All Case", path: "/admin/all case", icon: <SiReaddotcv />, active: location.pathname.includes("case") && !location.pathname.includes("reject-cases") && !location.pathname.includes("trash"), disable: false },
                { name: "All Complaint", path: "/admin/all complaint", icon: <CgNotes />, active: location.pathname.includes("complaint"), disable: false },
                { name: "All Leads", path: "/admin/all-leads", icon: <MdOutlineLeaderboard />, active: location.pathname.includes("all-leads"), disable: false },
                { name: "All Partner", path: "/admin/all partner", icon: <FaUserFriends />, active: location.pathname.includes("partner") && !location.pathname.includes("statement") && !location.pathname.includes("trash"), disable: false },
                { name: "All Client", path: "/admin/all client", icon: <FaUserTag />, active: location.pathname.includes("client") && !location.pathname.includes("trash"), disable: false },
                { name: "All Invoice", path: "/admin/all-invoices", icon: <FaFileInvoice />, active: location.pathname.includes("invoice") && !location.pathname.includes("add-invoice"), disable: false },
                { name: "Add Invoice", path: "/admin/add-invoice", icon: <MdOutlineLibraryAdd />, active: location.pathname.includes("/admin/add-invoice"), disable: false },
                { name: "Notification", path: "/admin/notification", icon: <MdNotificationsActive />, active: location.pathname.includes("/admin/notification"), disable: false },
                { name: "Statement", path: "/admin/statement", icon: <IoNewspaperOutline />, active: location.pathname.includes("/admin/statement"), disable: false },
                { name: "All Employee", path: "/admin/all employee", icon: <FaUsers />, active:(location.pathname=="/admin/all%20employee" || location.pathname.includes("/admin/employee/profile")), disable : false},
                { name:"Add Employee" ,path:"/admin/add new employee" ,icon:<FaUserPlus/>,active : location.pathname == "/admin/add%20new%20employee" ,disable:false},
                ...(state?.myAppData?.details?.superAdmin ? [{name:"My Admins" ,path:"/admin/my-admins" ,icon:<RiAdminFill/>,active : location.pathname == "/admin/my-admins" ,disable:false}] : []),
                { name: "My Jobs", path: "/admin/all job", icon: <MdOutlinePostAdd />, active: location.pathname == "/admin/all%20job", disable: false },
                { name: "Reject Case", path: "/admin/reject-cases", icon: <MdOutlineCancelPresentation />, active: location.pathname.includes("/admin/reject-cases"), disable: false },
                { name: "Closed Case", path: "/admin/closed-cases", icon: <GoIssueClosed />, active: location.pathname.includes("/admin/closed-cases"), disable: false },
                { name: "Weekly Follow-Up", path: "/admin/case-weekly-followUp", icon: <RiTimerFlashLine  />, active: location.pathname.includes("/admin/case-weekly-followUp"), disable: false },
                { name: "Setting", path: "/admin/account setting", icon: <IoSettingsOutline />, active: location.pathname == "/admin/account%20setting", disable: false },
                { name: "Trash", path: "#", icon: <FaRegTrashCan />, active: showTrashOption, disable: false,list:[
                    { name: "Partner", path: "/admin/all trash partner", icon: <FaTrashAlt />, active: location.pathname == "/admin/all%20trash%20partner", disable: false },
                    { name: "Client", path: "/admin/all trash client", icon: <FaTrashAlt />, active: location.pathname == "/admin/all%20trash%20client", disable: false },
                    { name: "Employee", path: "/admin/all-trash-employee", icon: <FaTrashAlt />, active: location.pathname == "/admin/all-trash-employee", disable: false },
                    { name: "Case", path: "/admin/all trash case", icon: <FaTrashAlt />, active: location.pathname == "/admin/all%20trash%20case", disable: false },
                    { name: "Document", path: "/admin/all-trash-doc", icon: <FaTrashAlt />, active: location.pathname == "/admin/all-trash-doc", disable: false },
                    { name: "Invoice", path: "/admin/all-trash-invoice", icon: <FaTrashAlt />, active: location.pathname == "/admin/all-trash-invoice", disable: false }
                ] } 
            ]
        }else if(myRole==="client"){
            list = [
                { name: "Dashboard", path: "/client/dashboard", icon: <RxDashboard />, active: location.pathname == "/client/dashboard", disable: false },
                { name: "Profile", path: "/client/profile", icon: <BsFillPersonLinesFill />, active: location.pathname.includes("profile"), disable: false },
                { name: "Add Case", path: "/client/add new case", icon: <MdOutlineLibraryAdd />, active: location.pathname == "/client/add%20new%20case", disable: false },
                { name: "All Case", path: "/client/all case", icon: <SiReaddotcv />, active: location.pathname == "/client/all%20case" || location.pathname.includes("view%20case") || location.pathname.includes("edit%20case"), disable: false },
                { name: "My Invoice", path: "/client/all-invoices", icon: <FaFileInvoice />, active: location.pathname.includes("invoice"), disable: false },
                { name: "Service Agreement", path: "/client/view service agreement", icon: <LuPcCase />, active: location.pathname == "/client/view service agreement", disable: false }
            ]
        }else if(myRole==="employee"){
            list = [
                { name: "Dashboard", path: "/employee/dashboard", icon: <RxDashboard />, active: location.pathname.includes("dashboard"), disable: false },
                { name: "Profile", path: "/employee/profile", icon: <BsFillPersonLinesFill />, active: location.pathname.includes("profile"), disable: false },
                ...(["operation","finance","branch","sales"]?.includes(empType) ? [{ name: "All Client", path: "/employee/all client", icon: <FaUserTag />, active: location.pathname.includes("all%20client") || location.pathname.includes("client%20details"), disable: false }]:[]),
                ...(["finance","operation","branch","sathi team","sales"]?.includes(empType) ? [{ name: "All Partner", path: "/employee/all partner", icon: <FaUserFriends />, active: location.pathname.includes("all%20partner") || location.pathname.includes("partner%20details"), disable: false }]:[]),
                ...(["branch","sathi team","sales"]?.includes(empType) ? [{ name: "Add Partner", path: "/employee/add-partner", icon: <FaUserPlus />, active: location.pathname.includes("add-partner"), disable: false }]:[]),
                { name: "All Case", path: "/employee/all case", icon: <SiReaddotcv />, active: location.pathname.includes("all%20case") || location.pathname.includes("view%20case") || location.pathname.includes("edit%20case"), disable: false },
                { name: "All Leads", path: "/employee/all-leads", icon: <MdOutlineLeaderboard />, active: location.pathname.includes("all-leads"), disable: false },
                ...(["branch","sales"]?.includes(empType) ? [{ name: "Add Case", path: "/employee/add-case", icon: <MdOutlineLibraryAdd />, active: location.pathname.includes("add-case"), disable: false }]:[]),
                ...(["branch","sales"]?.includes(empType) ? [{ name: "Add Sathi Team", path: "/employee/add-sathi-team", icon: <RiTeamLine />, active: location.pathname.includes("/employee/add-sathi-team"), disable: false }]:[]),
                ...(["branch","sales","finance","operation"]?.includes(empType) ? [{ name: "Branch Team", path: "/employee/branch-team", icon: <SiMicrosoftteams />, active: location.pathname.includes("branch-team") || location?.pathname?.includes("view-sathi"), disable: false }]:[]),
                { name: "Reject Cases", path: "/employee/reject-cases", icon: <MdOutlineCancelPresentation />, active: location.pathname.includes("reject-cases"), disable: false },
                ...(["operation"]?.includes(empType) ? [{ name: "Closed Cases", path: "/employee/closed-cases", icon: <GoIssueClosed />, active: location.pathname.includes("closed-cases"), disable: false },] :[]),
                ...(["sathi team"]?.includes(empType) ? [{ name: "Commission", path: `/employee/statement/sathi-team/${userDetails?._id}`, icon: <IoNewspaperOutline />, active: location.pathname.includes("/statement/sathi-team/"), disable: false }]:[]),

                ...(["finance","operation"]?.includes(empType) ? [{ name: "Statement", path: "/employee/statement", icon: <IoNewspaperOutline />, active: location.pathname.includes("/employee/statement"), disable: false }]:[]),
                ...(["operation"]?.includes(empType) ? [{ name: "Weekly Follow-Up", path: "/employee/case-weekly-followUp", icon: <RiTimerFlashLine  />, active: location.pathname.includes("/employee/case-weekly-followUp"), disable: false }]:[]),
                 ...(["finance","operation"]?.includes(empType) ? [{ name: "All Invoices", path: "/employee/all-invoices", icon: <FaFileInvoice />, active: location.pathname.includes("/employee/all-invoices") || location.pathname.includes("/employee/view-invoice"), disable: false }]:[]),
                 ...(["finance"]?.includes(empType) ? [{ name: "Add Invoice", path: "/employee/add-invoice", icon: <MdOutlineLibraryAdd />, active: location.pathname.includes("/employee/add-invoice"), disable: false }]:[]),
                 ...(["operation"]?.includes(empType) ? [{ name: "Notification", path: "/employee/notification", icon: <MdNotificationsActive />, active: location.pathname.includes("/employee/notification"), disable: false }]:[]),
                { name: "Setting", path: "/employee/reset password", icon: <IoSettingsOutline />, active: location.pathname == "/employee/reset%20password", disable: false },
                  ...(["operation"]?.includes(empType) && userDetails?.designation?.toLowerCase()=="manager" ? [
                { name: "Trash", path: "#", icon: <FaRegTrashCan />, active: showTrashOption, disable: false,list:[
                    { name: "Partner", path: "/employee/all-trash-partner", icon: <FaTrashAlt />, active: location.pathname == "/employee/all-trash-partner", disable: false },
                    { name: "Client", path: "/employee/all-trash-client", icon: <FaTrashAlt />, active: location.pathname == "/employee/all-trash-client", disable: false },
                    { name: "Case", path: "/employee/all-trash-case", icon: <FaTrashAlt />, active: location.pathname == "/employee/all-trash-case", disable: false },
                    { name: "Invoice", path: "/employee/all-trash-invoice", icon: <FaTrashAlt />, active: location.pathname == "/employee/all-trash-invoice", disable: false },
                    { name: "Document", path: "/employee/all-trash-doc", icon: <FaTrashAlt />, active: location.pathname == "/employee/all-trash-doc", disable: false },
                    { name:"Employee" ,path:"/employee/all-trash-employee" ,icon:<FaTrashAlt/>,active : location.pathname == "/employee/all-trash-employee" ,disable:false}
                ] }]:[]),

            ]
        }
        return list
    }


    return (<>
        <div className="h-100 d-flex flex-column  bg-primary gap-2 py-4 color-4">
               <div className='d-flex align-items-center mx-2 py-2  justify-content-center bg-white active_item'>
                      <div className="nav__logo">
                        <img src="/Images/icons/company-logo.png" height={70} alt="Company logo" loading="lazy" />
                      </div>
                    </div>
            {/* {myRole == "partner" && <>
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
            </>} */}

            {/* {myRole == "client" && <>
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
            </>} */}

            {/* {myRole == "Admin" && <>
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
            </>} */}

            {/* {myRole == "Employee" && <>
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
            </>}
            {(["operation","branch","sales"]?.includes(empType?.toLowerCase())) && <Link to="/employee/all client" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("client") && "active_item"}`}  >
            <FaUserTag />
            <div className=''>All Client</div>
            </Link>}

            {(empType?.toLowerCase() =="finance" || empType?.toLowerCase() =="operation" || empType?.toLowerCase() =="sales" || 
            empType?.toLowerCase() =="Sathi Team".toLowerCase() || empType?.toLowerCase() =="branch") && <>
            <Link to="/employee/all partner" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("partner") && !location.pathname.includes("statement") && !location.pathname.includes("add-partner") && "active_item"}`}  >
            <FaUserFriends />
            <div className=''>All Partner</div>
            </Link>
            </>}


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


            <Link to="/employee/all case" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("case") && !location.pathname.includes("reject-case") && !location.pathname.includes("add-case") && "active_item"}`}  >
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
            <Link to="/employee/reject-cases" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname.includes("/employee/reject-cases") && "active_item"}`}  >
                    <MdOutlineCancelPresentation />
                    <div className=''>Reject Case</div>
                </Link>
                <Link to="/employee/reset password" className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${location.pathname == "/employee/reset%20password" && "active_item"}`}  >
                    <IoSettingsOutline />
                    <div className=''>Setting</div>
                </Link>
            </>} */}

            {renderNavItems()?.map((item, index) => {
                if(item?.list && item?.list?.length > 0) {
                    return (
                        <div key={index} className={`cursor-pointer`}>
                            <div onClick={() => setShowTrashOption(!showTrashOption)} className='d-flex align-items-center mx-2 px-2 py-2 gap-3 cursor-pointer text-white'>
                                {item.icon}
                                <div className='d-flex align-items-center gap-5'>
                                    <div className=''>{item.name}</div>
                                    {showTrashOption ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                </div>
                            </div>
                            <div className={`px-3 ${!showTrashOption && "d-none"}`}>
                                {item?.list?.map((subItem, subIndex) => (
                                    <Link key={subIndex} to={subItem.path} className={`d-flex align-items-center mx-2 px-2 py-2 gap-3 text-white   ${subItem.active && "active_item"}`} >
                                        {subItem.icon}
                                        <div className=''>{subItem.name}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )
                }else {
                    return (
                        <NavItems 
                            key={index}
                            active={item.active}
                            path={item.path}
                            name={item.name}
                            disable={item.disable}
                            icon={item.icon}
                        />
                    )
                }
            })}


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