import React from 'react'
import CasePaymentList from '../../../components/CasePaymentDetailList'
import { clientCasePaymentListApi } from '../../../../../apis/casePayment/clientCasePaymentApi'

export default function ClientAllCasePaymentDetail() {
    return (
        <div>
            <CasePaymentList
                getListApi={clientCasePaymentListApi}
                role={"client"}
                viewUrl={`/client/case-payment/view/`}
            />
        </div>
    )
}
