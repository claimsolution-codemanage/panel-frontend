import React from 'react'
import CommonSendMail from '../../../features/massMail/CommonSendMail'
import { employeeAttachementUpload } from '../../../apis/upload'
import { empSendMassMailApi } from '../../../apis/mail/empMailApi'
import { AppContext } from '../../../App'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmpSendMail() {
    const { myAppData } = useContext(AppContext)
    const authDetails = myAppData?.authDetails
    const permissions = authDetails?.permissions || []
    const navigate = useNavigate()

    if (!permissions?.includes("send_emails")) {
        return navigate("/employee/dashboard")
    }

    return (
        <div>
            <CommonSendMail
                attachementUpload={employeeAttachementUpload}
                sendMailApi={empSendMassMailApi}
            />
        </div>
    )
}
