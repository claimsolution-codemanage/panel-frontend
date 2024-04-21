import { useEffect, useState } from "react"
import { allState } from "../../utils/constant"
import { getPartnerProfile } from "../../apis"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
// import { API_BASE_IMG } from "../../apis"
import { API_BASE_IMG } from "../../apis/upload"
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader"
import ViewPartnerComp from "../../components/Reuse/ViewPartnerComp"


export default function Profile() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const res = await getPartnerProfile()
                // console.log("partner", res?.data?.data?.profile);
                if (res?.data?.success && res?.data?.data?.profile) {

                    setData([res?.data?.data?.profile])
                    setLoading(false)

                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                    setLoading(false)
                } else {
                    toast.error("Something went wrong")
                    setLoading(false)
                }

                // console.log("profile error", error);
            }
        } fetch()
    }, [])
    // console.log(data);



    return (<>
    <ViewPartnerComp id={1} viewPartner={getPartnerProfile} role={"partner"} editUrl={"/partner/edit profile"}/>
    </>)
}