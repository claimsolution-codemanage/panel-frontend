import React, { useContext, useEffect } from 'react'
import ViewAllNotification from '../../components/Common/notification/CaseNotification'
import {empAllNotificationApi, empUpdateNotificationApi } from '../../apis'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../App'

export default function EmpNotification() {
    const state = useContext(AppContext)
    const navigate = useNavigate()
    const userDetails = state?.myAppData?.details
    const isAccess = userDetails?.empType?.toLowerCase() =="operation"

    useEffect(() => {
        if (!isAccess) {
            navigate(-1)
        }
    }, [userDetails])

  return (
    <div>
        <ViewAllNotification
        getNotificationApi={empAllNotificationApi}
        updateNotificationApi={empUpdateNotificationApi}
        viewUrl="/employee/view case/"
        />
    </div>
  )
}
