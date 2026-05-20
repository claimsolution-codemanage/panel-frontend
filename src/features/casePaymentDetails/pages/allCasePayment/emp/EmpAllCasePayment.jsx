import React from 'react'
import { empCasePaymentListApi, } from '../../../../../apis/casePayment/empCasePaymentApi'
import CasePaymentList from '../../../components/CasePaymentDetailList'

export default function EmpAllCasePaymentDetail() {
    return (
        <div>
            <CasePaymentList
                getListApi={empCasePaymentListApi}
                viewUrl={`/employee/case-payment/view/`}
                addPaymentUrl={`/employee/case-payment/add`}
            />
        </div>
    )
}
