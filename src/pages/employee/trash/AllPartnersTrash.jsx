import AllPartnerTrash from '../../../components/Common/trash/AllPartnerTrash'
import {  employeeAllPartner, empSetPartnerStatus } from '../../../apis'
import { empDeletePartnerById } from '../../../apis/partner/empPartnerApi'
import { useContext } from 'react'
import { AppContext } from '../../../App'

export default function EmpAllPartnersTrash() {
    const state = useContext(AppContext)
    const empType  = state?.myAppData?.details?.empType
  return (
    <div>
      <AllPartnerTrash
      allPartnerApi={employeeAllPartner}
      partnerStatusApi={empSetPartnerStatus}
      deletePartnerApi={empDeletePartnerById}
      removePartnerPermission={empType?.toLowerCase()=="operation"}
      viewPartnerpath={"/employee/partner details"}
      />
    </div>
  )
}
