import Loader from '../../components/Common/ViewDocs'
import ViewDocs from '../../components/Common/ViewDocs'
import { partnerTls } from '../../apis'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PartnerViewTLS(){
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const [details,setDetails] = useState({status:true,details:{}})
    useEffect(()=>{
        async function fetch(){
            try {
                const res = await partnerTls()
                if(res?.data?.success){
                    setLoading(false)
                    setDetails({status:true,details:{docURL:res?.data?.data,docType:"pdf"}})
                    // console.log("res",res?.data?.data);
                }
        } catch (error) {
                    if(error && error?.response?.data?.message){
                        toast.error(error?.response?.data?.message)
                    }else{
                        toast.error("Something went wrong")
                    }
                // console.log("signup error",error);
            // setLoading(false)
            }
        }fetch()
    },[])

    useEffect(()=>{
    if(!details.status){
        navigate("/partner/dashboard")
    }
    },[details.status])
    return(<>
    {loading ? <Loader/> : 
       <ViewDocs hide={()=>setDetails({status:false,details:{}})} details={details} type="View TLS"/>}
    </>)
}