import React, { useEffect } from 'react'
import { empGetAllEmployee,empDownloadAllEmp, empOprUpdateEmployee } from '../../apis'
import { AppContext } from '../../App'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AllEmployee from '../../components/Reuse/AllEmployee'

export default function EmpBranchTeam() {
    const state = useContext(AppContext)
    const navigate = useNavigate()
    const userDetails = state?.myAppData?.details
    const isAccess = ((userDetails?.empType?.toLowerCase() == "sales" || userDetails?.empType?.toLowerCase() == "branch" || userDetails?.empType?.toLowerCase() =="operation") )

    useEffect(() => {
        if (!isAccess) {
            navigate(-1)
        }
    }, [userDetails])

    return (
        <>
            {isAccess && <AllEmployee
                page={"Branch Team"}
                empId={""}
                role={"employee"}
                caseUrl={"/employee/all case/"}
                partnerUrl={"/employee/all partner/"}
                viewSathiUrl={"/employee/view-sathi/"}
                isedit={userDetails?.empType?.toLowerCase() == "operation"}
                isDownload={true}
                getDownload={empDownloadAllEmp}
                getEmployee={empGetAllEmployee}
                isTrash={false}
                isActive={() => { }}
                deleteEmployeeId={() => { }}
                updateEmployee={empOprUpdateEmployee}
                statement={userDetails?.empType?.toLowerCase() =="operation"}
                statementUrl={"/employee/statement/employee"}
            />}
        </>
    )
}
