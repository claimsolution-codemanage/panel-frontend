import React, { useContext } from 'react'
import { empCasePaymentDeleteApi, empCasePaymentListApi, } from '../../../../../apis/casePayment/empCasePaymentApi'
import CasePaymentList from '../../../components/CasePaymentDetailList'
import { AppContext } from '../../../../../App'

export default function EmpAllCasePaymentDetail() {
    const state = useContext(AppContext)
    const empType = state?.myAppData?.details?.empType

    return (
        <div>
            <CasePaymentList
                getListApi={empCasePaymentListApi}
                deleteApi={empCasePaymentDeleteApi}
                hasDeleteAccess={empType?.toLowerCase() === "operation"}
                viewUrl={`/employee/case-payment/view/`}
                addPaymentUrl={`/employee/case-payment/add`}
            />
        </div>
    )
}
