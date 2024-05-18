import PrivateNavbar from "../components/Common/privateNavbar"
import { AppContext } from "../App"
import { useContext, useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { getToken,getJwtDecode } from "../utils/helperFunction"
import { useLocation } from 'react-router-dom';
import {RxHamburgerMenu} from 'react-icons/rx'
import {RxCrossCircled} from 'react-icons/rx'
import { employeeAuthenticate } from "../apis"
import { deleteToken } from "../utils/helperFunction"
import {toast} from 'react-toastify'
import Loader from "../components/Common/loader"



export default function EmployeeTemplate({children}){
    const state = useContext(AppContext)
    const [view,setView] = useState(false)
    const [loading,setLoading] = useState(false)
    const navigate= useNavigate()
    const location = useLocation()
    // console.log("my state",state);

    // useEffect(()=>{
    //     async function fetch(){
    //         try {
    //             const res = await employeeAuthenticate()
    //             setLoading(false)
    //         } catch (error) {
    //                 deleteToken()
    //                 state?.setMyAppData({ isLogin: false, details: {} })
    //                 navigate("/employee/signin")
    //             if(error && error?.response?.data?.message){
    //                 toast.error(error?.response?.data?.message)
    //             }else{
    //                 toast.error("Something went wrong")
    //             }
    //         }
    //     }fetch()
    //  },[location])


    useEffect(()=>{
        const token = getToken()
        if(token){
            const details = getJwtDecode(token)
            // console.log(details);
            if(details?.role=="Employee"){
            }else{
                navigate("/employee/signin")
            }
        }else{
            navigate("/employee/signin")
        }
    },[state,location])
    return(<>
       <div className="container-fluid">
            <div className="contanter row" style={{height:'100vh'}}>
                <div className="d-md-none col-12 p-3 bg-color-4 d-flex justify-content-between"><span></span> <span onClick={()=>setView(!view)}>{view ? <RxCrossCircled className="fs-3"/>:<RxHamburgerMenu className="fs-3"/>} </span> </div>
                <div className={`${view ? "d-md-block" : "d-none d-md-block"} col-md-2 p-0 bg-primary`} style={{height:'100vh', overflowY:'auto'}}><PrivateNavbar/></div>
                {loading ? <Loader/> : <div className={`${view && "d-none" } col-12 col-md-10 p-0 bg-color-7 color-4`} style={{height:'100vh', overflowY:'auto'}}>{children}</div>
                        }
            </div>
            </div>
    </>)
}