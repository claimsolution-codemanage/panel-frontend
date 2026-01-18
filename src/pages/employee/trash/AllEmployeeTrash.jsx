import React, { useContext } from 'react'
import AllEmployee from '../../../components/Reuse/AllEmployee'
import { empGetAllEmployee, empSetEmployeeStatus } from '../../../apis'
import { AppContext } from '../../../App'
import { empDeleteTeamEmpAccountById } from '../../../apis/team/empTeamApi'

export default function EmpAllEmployeeTrash() {
    const state = useContext(AppContext)
    const empType = state?.myAppData?.details?.empType
  return (
    <div>
       <AllEmployee
        role={"employee"}
        getEmployee={empGetAllEmployee}
        isTrash={true}
        isDeletePermission={empType?.toLowerCase() == "operation"}
        isActive={empSetEmployeeStatus}
        deleteEmployeeId={empDeleteTeamEmpAccountById}
        updateEmployee={()=>{}}
        
       />
    </div>
  )
}
