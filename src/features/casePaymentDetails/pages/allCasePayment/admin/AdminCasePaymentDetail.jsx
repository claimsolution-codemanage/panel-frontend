import React from 'react'
import CasePaymentDetails from '../../../components/CasePaymentDetails'
import { adminCasePaymentAddSchedulePaymentApi, adminCasePaymentDetailApi, adminCasePaymentSchedulePaymentApi, adminCreateCasePaymentApi, adminUpdateCasePaymentDetailApi } from '../../../../../apis/casePayment/adminCasePaymentApi'
import { adminFindCaseByFileNoApi } from '../../../../../apis'

export default function AdminCasePaymentDetail() {
    return (
        <div>
            <CasePaymentDetails
                fileDetailApi={adminFindCaseByFileNoApi}
                addPaymentApi={adminCreateCasePaymentApi}
                getDetailApi={adminCasePaymentDetailApi}
                updatePaymentScheduleApi={adminCasePaymentSchedulePaymentApi}
                addSchedulePaymentApi={adminCasePaymentAddSchedulePaymentApi}
                updatePaymentDetailApi={adminUpdateCasePaymentDetailApi}
                viewUrl={`/admin/case-payment/view/`}
            />
        </div>
    )
}
