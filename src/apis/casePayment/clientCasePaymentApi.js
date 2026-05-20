import { getRequest } from "../axiosConfig"

export const clientCasePaymentListApi = ({ limit = 10, pageNo = 1, search = "", startDate = "", endDate = "" }) => {
    return getRequest(`/client/case_payment/list?limit=${limit}&pageNo=${pageNo}&search=${search}&startDate=${startDate}&endDate=${endDate}`)
}

export const clientCasePaymentDetailApi = (id) => {
    return getRequest(`/client/case_payment/detail/${id}`)
}
