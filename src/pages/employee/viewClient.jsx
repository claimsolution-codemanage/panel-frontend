import {employeeGetClientById } from "../../apis"
import { useParams } from "react-router-dom"
import ViewClientComp from "../../components/Reuse/viewClientComp"
import { AppContext } from "../../App"
import { useContext } from "react"

export default function EmployeeClientDetails() {
    const state = useContext(AppContext)
    const {empType,designation}  = state?.myAppData?.details

    const param = useParams()
    return (<>
     <ViewClientComp 
     id={param?._id} 
     isEdit={empType?.toLowerCase()=="operation"}
     getClient={employeeGetClientById} 
     link={`/employee/edit-client/${param?._id}`} 
     role="employee"/>
    </>)
}