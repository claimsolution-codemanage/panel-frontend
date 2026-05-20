import { deleteRequest, getRequest, postRequest, putRequest } from "../axiosConfig"

export const empCreateCasePaymentApi = (data) => {
    return postRequest(`/employee/case_payment/add`, data)
}

export const empCasePaymentListApi = ({ limit = 10, pageNo = 1, search = "", startDate = "", endDate = "" }) => {
    return getRequest(`/employee/case_payment/list?limit=${limit}&pageNo=${pageNo}&search=${search}&startDate=${startDate}&endDate=${endDate}`)
}

export const empCasePaymentDetailApi = (id) => {
    return getRequest(`/employee/case_payment/detail/${id}`)
}

export const empUpdateCasePaymentDetailApi = (id, data) => {
    return putRequest(`/employee/case_payment/update/detail/${id}`, data)
}

export const empCasePaymentSchedulePaymentApi = (data) => {
    return postRequest(`/employee/case_payment/schedule/payment`, data)
}

export const empCasePaymentAddSchedulePaymentApi = (id, data) => {
    return postRequest(`/employee/case_payment/schedule/add-payment/${id}`, data)
}