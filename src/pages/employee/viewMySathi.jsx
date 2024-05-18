import React, { useEffect } from 'react'
import { empGetAllEmployee,empGetSathiEmployee,empDownloadSathi } from '../../apis'
import { AppContext } from '../../App'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AllEmployee from '../../components/Reuse/AllEmployee'

export default function EmpViewMySathi() {
    const state = useContext(AppContext)
    const param = useParams()
    const navigate = useNavigate()
    const userDetails = state?.myAppData?.details
    const isAccess = ((userDetails?.empType?.toLowerCase() == "sales" || userDetails?.empType?.toLowerCase() == "branch"))

    useEffect(() => {
        if (!isAccess) {
            navigate(-1)
        }
    }, [userDetails])

    return (
        <>
            {isAccess && param?._id && <AllEmployee
                page={"Sathi Team"}
                empId={param?._id}
                isDownload={true}
                getDownload={empDownloadSathi}
                role={"employee"}
                caseUrl={"/employee/all case/"}
                partnerUrl={"/employee/all partner/"}
                isedit={false}
                getEmployee={empGetSathiEmployee}
                isTrash={false}
                isActive={() => { }}
                deleteEmployeeId={() => { }}
                updateEmployee={() => { }}
            />}
        </>
    )
}
