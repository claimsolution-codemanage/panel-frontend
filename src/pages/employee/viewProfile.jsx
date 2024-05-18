import React, { useContext } from 'react'
import EmployeeProfile from '../../components/Reuse/EmployeeProfile'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../App'
import { getEmpProfile } from '../../apis'


export default function EmpViewProfile() {
    const state = useContext(AppContext)
    const param = useParams()
    const _id = param?._id  ? param?._id :state?.myAppData?.details?._id
    
  return (
    <EmployeeProfile _id={_id} getProfile={getEmpProfile}/>
  )
}
