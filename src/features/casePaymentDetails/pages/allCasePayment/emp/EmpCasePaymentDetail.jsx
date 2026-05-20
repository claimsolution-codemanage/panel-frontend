import React from 'react'
import CasePaymentDetails from '../../../components/CasePaymentDetails'
import { empFindCaseByFileNoApi } from '../../../../../apis/case/empCaseApi'
import { empCasePaymentAddSchedulePaymentApi, empCasePaymentDetailApi, empCasePaymentSchedulePaymentApi, empCreateCasePaymentApi, empUpdateCasePaymentDetailApi } from '../../../../../apis/casePayment/empCasePaymentApi'

export default function EmpCasePaymentDetail() {
    return (
        <div>
            <CasePaymentDetails
                fileDetailApi={empFindCaseByFileNoApi}
                addPaymentApi={empCreateCasePaymentApi}
                getDetailApi={empCasePaymentDetailApi}
                updatePaymentScheduleApi={empCasePaymentSchedulePaymentApi}
                addSchedulePaymentApi={empCasePaymentAddSchedulePaymentApi}
                updatePaymentDetailApi={empUpdateCasePaymentDetailApi}
                viewUrl={`/employee/case-payment/view/`}
            />
        </div>
    )
}
