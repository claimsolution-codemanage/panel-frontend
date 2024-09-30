import { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import Loader from "../loader"
import { Link } from "react-router-dom"
import { getFormateDMYDate } from "../../../utils/helperFunction"
import { MdMarkChatRead, MdNotificationsActive } from "react-icons/md"
import { LuBadgeCheck } from "react-icons/lu"

export default function ViewAllNotification({getNotificationApi,viewUrl,updateNotificationApi}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [saving,setSaving] = useState(false)
    const [markNotification,setMarkNotification] = useState([])

    const getAllNotification = async () => {
        setLoading(true)
        try {
            const res = await getNotificationApi()
            if (res?.data?.success && res?.data?.data) {
                setData(res?.data?.data)
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
        }
    }

    const handleMarkNotification =async()=>{
        setSaving(true)
        try {
            const res = await updateNotificationApi({markNotification})
            if (res?.status==200) {
                getAllNotification()
                setSaving(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setSaving(false)
            } else {
                toast.error("Something went wrong")
                setSaving(false)
            }
        }
    }

    useEffect(() => {
        getAllNotification()
    }, [])

    const handleCheck = (e,_id)=>{
        const check = e?.target?.checked
        if(check){
            setMarkNotification([...markNotification,_id])
        }else{
            let updateList = markNotification.filter(ele=>ele!=_id)
            setMarkNotification(updateList)
        }   
    }

    return (<>
        {loading ? <Loader /> :
            <div>
                <div>
                        <div className="d-flex justify-content-between bg-color-1 text-black text-primary fs-5 px-4 py-3 shadow">
                            <div className="d-flex flex align-items-center gap-3">
                                <div className="d-flex flex align-items-center gap-1">
                                    <span>Notification</span>
                                </div>
                            </div>
                            <button onClick={handleMarkNotification} className="btn btn-primary" disabled={markNotification?.length==0 || saving}>
                               {saving ? "Saving..." : "Mark as read"}  
                            </button>
                        </div>
                        <div className="mx-3 m-md-5 p-md-4">
                            <div className="container-fluid p-0">
                                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                         
                                    {data?.map(item=> <div className="p-1">
                                    <div className="border border-primary card p-3 h-100">
                                        <div>
                                            <div className="d-flex justify-content-between">
                                        <div className="bg-primary d-flex align-items-center justify-content-center rounded-circle" style={{width:35,height:35}}>
                                        <MdNotificationsActive className="text-white fs-4"/>
                                        </div>
                                            <div className=" d-flex align-items-center justify-content-center " >
                                                <input type="checkbox" name="notification" checked={markNotification?.includes(item?._id)} onChange={(e)=>handleCheck(e,item?._id)} id="notification" style={{width:15,height:15}}/>
                                                {/* <LuBadgeCheck className="text-white fs-6"/> */}
                                            </div>
                                            </div>
                                        <p>{item?.message} <Link to={`${viewUrl}${item?.caseId?._id}`}>view...</Link></p>
                                        </div>
                                    </div>
                                    </div>)}
                                  
                                </div>
                            </div>
                        </div>
                    </div>         
            </div>}
    </>)
}