import React from 'react'
import CasePaymentList from '../../../components/CasePaymentDetailList'
import { adminCasePaymentListApi } from '../../../../../apis/casePayment/adminCasePaymentApi'

export default function AdminAllCasePaymentDetail() {
    return (
        <div>
            <CasePaymentList
                getListApi={adminCasePaymentListApi}
                viewUrl={`/admin/case-payment/view/`}
                addPaymentUrl={`/admin/case-payment/add`}
            />
        </div>
    )
}
