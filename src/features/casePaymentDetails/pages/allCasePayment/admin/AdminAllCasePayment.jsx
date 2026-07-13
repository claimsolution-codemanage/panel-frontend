import React from 'react'
import CasePaymentList from '../../../components/CasePaymentDetailList'
import { adminCasePaymentDeleteApi, adminCasePaymentListApi } from '../../../../../apis/casePayment/adminCasePaymentApi'

export default function AdminAllCasePaymentDetail() {
    return (
        <div>
            <CasePaymentList
                getListApi={adminCasePaymentListApi}
                deleteApi={adminCasePaymentDeleteApi}
                hasDeleteAccess={true}
                viewUrl={`/admin/case-payment/view/`}
                addPaymentUrl={`/admin/case-payment/add`}
            />
        </div>
    )
}
