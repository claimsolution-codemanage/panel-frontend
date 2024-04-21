import {employeeGetClientById } from "../../apis"
import { useParams } from "react-router-dom"
import ViewClientComp from "../../components/Reuse/viewClientComp"

export default function EmployeeClientDetails() {

    const param = useParams()
    return (<>
     <ViewClientComp 
     id={param?._id} 
     getClient={employeeGetClientById} 
     link={`/employee/edit-client/${param?._id}`} 
     role="employee"/>
    </>)
}