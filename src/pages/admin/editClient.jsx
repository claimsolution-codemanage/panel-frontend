import {adminGetClientById,adminUpdateClient } from "../../apis"
import { useParams } from "react-router-dom"
import { employeeImageUpload,adminImageUpload } from '../../apis/upload'
import EditClient from '../../components/Reuse/EditClientComp'



export default function AdminEditClient() {
    const param = useParams()
    return (
        <>
         <EditClient id={param?._id} getClient={adminGetClientById} updateClient={adminUpdateClient} uploadImg={adminImageUpload} role="admin" />
        </>
    )
}