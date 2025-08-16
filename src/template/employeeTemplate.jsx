import PrivateNavbar from "../components/Common/privateNavbar"
import { AppContext } from "../App"
import { useContext, useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { getToken,getJwtDecode } from "../utils/helperFunction"
import { useLocation } from 'react-router-dom';
import {RxHamburgerMenu} from 'react-icons/rx'
import {RxCrossCircled} from 'react-icons/rx'
import Loader from "../components/Common/loader"



export default function EmployeeTemplate({children}){
    const state = useContext(AppContext)
    const [view,setView] = useState(false)
    const [loading,setLoading] = useState(false)
    const navigate= useNavigate()
    const location = useLocation()

    useEffect(()=>{
        const token = getToken()
        if(token){
            const details = getJwtDecode(token)
            if(details?.role=="Employee"){
            }else{
                navigate("/employee/signin")
            }
        }else{
            navigate("/employee/signin")
        }
        setView(false)
    },[state,location])
    return(<>
       <div className="container-fluid">
            <div className="contanter row" style={{height:'100vh'}}>
                <div className="d-md-none col-12 p-3 bg-primary d-flex justify-content-between"><span></span> <span className="text-white" onClick={()=>setView(!view)}>{view ? <RxCrossCircled className="fs-3"/>:<RxHamburgerMenu className="fs-3"/>} </span> </div>
                <div className={`${view ? "d-md-block" : "d-none d-md-block"} col-md-2 p-0 bg-primary`} style={{height:'100vh', overflowY:'auto'}}><PrivateNavbar/></div>
                {loading ? <Loader/> : <div className={`${view && "d-none" } col-12 col-md-10 p-0 bg-color-7 color-4`} style={{height:'100vh', overflowY:'auto'}}>{children}</div>
                        }
            </div>
            </div>
    </>)
}