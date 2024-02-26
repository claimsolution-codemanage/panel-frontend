import AcceptTlsView from "../../components/Common/acceptTlsView"
import { clientAcceptTls } from "../../apis"
import {toast} from 'react-toastify'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function ClientAcceptTls(){
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handleAcceptTls =async(verifyToken)=>{
        try {
            const res = await clientAcceptTls(verifyToken)
            // console.log("case", res?.data?.data);
            if (res?.data?.success) {
                setLoading(false)
                toast.success(res?.data?.message)
                navigate("/client/signin")
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setLoading(false)
            } else {
                toast.error("Something went wrong")
                setLoading(false)
            }

            // console.log("case error", error);
        }
    }
    return(<>
    <AcceptTlsView as={"Client"} handleAccept={handleAcceptTls} loading={loading}/>
    </>)
}