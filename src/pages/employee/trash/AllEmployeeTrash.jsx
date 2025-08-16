import React from 'react'
import AllEmployee from '../../../components/Reuse/AllEmployee'
import { empGetAllEmployee, empSetEmployeeStatus } from '../../../apis'

export default function EmpAllEmployeeTrash() {
  return (
    <div>
       <AllEmployee
        role={"employee"}
        getEmployee={empGetAllEmployee}
        isTrash={true}
        isActive={empSetEmployeeStatus}
        deleteEmployeeId={()=>{}}
        updateEmployee={()=>{}}
       />
    </div>
  )
}
