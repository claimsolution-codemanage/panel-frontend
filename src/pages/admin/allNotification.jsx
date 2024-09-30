import React from 'react'
import ViewAllNotification from '../../components/Common/notification/CaseNotification'
import { adminAllNotificationApi, adminUpdateNotificationApi } from '../../apis'

export default function AdminNotification() {
  return (
    <div>
        <ViewAllNotification
        getNotificationApi={adminAllNotificationApi}
        updateNotificationApi={adminUpdateNotificationApi}
        viewUrl="/admin/view case/"
        />
    </div>
  )
}
