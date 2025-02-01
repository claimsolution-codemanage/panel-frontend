import React, { useContext } from 'react'
import EmployeeProfile from '../../../components/Reuse/EmployeeProfile'
import { useParams } from 'react-router-dom'
import {adminGetEmpProfile} from '../../../apis'

export default function AdminViewEmployee() {
    const param = useParams()
  return (
    <EmployeeProfile _id={param?._id} getProfile={adminGetEmpProfile}/>
  )
}
