import { employeeUpdateClient,employeeGetClientById } from "../../apis"
import { useParams } from "react-router-dom"
import { employeeImageUpload } from '../../apis/upload'
import EditClient from '../../components/Reuse/EditClientComp'



export default function EmployeeEditClient() {
    const param = useParams()
    return (
        <>
          <EditClient 
          id={param?._id} 
          getClient={employeeGetClientById} 
          updateClient={employeeUpdateClient} 
          uploadImg={employeeImageUpload} 
          role="employee" />
        </>
    )
}