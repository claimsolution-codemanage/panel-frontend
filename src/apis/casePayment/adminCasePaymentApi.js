import { deleteRequest, getRequest, postRequest, putRequest } from "../axiosConfig"

export const adminCreateCasePaymentApi = (data) => {
    return postRequest(`/admin/case_payment/add`, data)
}

export const adminCasePaymentListApi = ({ limit = 10, pageNo = 1, search = "", startDate = "", endDate = "" }) => {
    return getRequest(`/admin/case_payment/list?limit=${limit}&pageNo=${pageNo}&search=${search}&startDate=${startDate}&endDate=${endDate}`)
}

export const adminCasePaymentDetailApi = (id) => {
    return getRequest(`/admin/case_payment/detail/${id}`)
}

export const adminUpdateCasePaymentDetailApi = (id, data) => {
    return putRequest(`/admin/case_payment/update/detail/${id}`, data)
}

export const adminCasePaymentSchedulePaymentApi = (data) => {
    return postRequest(`/admin/case_payment/schedule/payment`, data)
}

export const adminCasePaymentAddSchedulePaymentApi = (id, data) => {
    return postRequest(`/admin/case_payment/schedule/add-payment/${id}`, data)
}