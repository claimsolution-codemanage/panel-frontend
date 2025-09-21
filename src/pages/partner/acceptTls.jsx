import AcceptTlsView from "../../components/Common/acceptTlsView"
import {toast} from 'react-toastify'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { partnerAcceptTlsApi } from "../../apis/auth/partnerAuthApi"
export default function PartnerAcceptTls(){
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    // console.log("calling partner accept tls");

    const handleAcceptTls =async(verifyToken)=>{
        try {
            const res = await partnerAcceptTlsApi(verifyToken)
            // console.log("case", res?.data?.data);
            if (res?.data?.success) {
                setLoading(false)
                toast.success(res?.data?.message)
                navigate("/partner/signin")
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
    <AcceptTlsView as={"Partner"} handleAccept={handleAcceptTls} loading={loading}/>
    </>)
}