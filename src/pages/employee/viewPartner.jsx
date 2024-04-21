import {employeeGetPartnerById } from "../../apis"
import { useParams } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../../App"
import ViewPartnerComp from "../../components/Reuse/ViewPartnerComp"

export default function EmployeePartnerDetails() {
    const state = useContext(AppContext)
    const empType  = state?.myAppData?.details?.empType
    const param = useParams()

    return (<>
        <ViewPartnerComp id={param?._id} viewPartner={employeeGetPartnerById} role={"employee"} editUrl={"/employee/edit-partner/"}/>
    </>)
}