import { deleteRequest, getRequest, postRequest, putRequest, downloadRequest } from "../axiosConfig"


export const empCreateOrUpdateStatmentApi = (data) => {
    return postRequest(`/employee/statement/createOrUpdate`, data)
}

export const empAllStatmentApi = (pageItemLimit = "", pageNo = "", partnerId = "", empId = "", startDate = "", endDate = "", isPdf = false) => {
    return getRequest(`/employee/statement/all?limit=${pageItemLimit}&pageNo=${pageNo}&partnerId=${partnerId}&empId=${empId}&startDate=${startDate}&endDate=${endDate}&isPdf=${isPdf}`)
}

export const empAllStatementDownloadApi = (startDate = "", endDate = "", partnerId = "", empId = "") => {
    return downloadRequest(`/employee/statement/downloadAll?startDate=${startDate}&endDate=${endDate}&partnerId=${partnerId}&empId=${empId}`)
}

export const empStatementApi = (pageItemLimit = "", pageNo = "", startDate = "", endDate = "", search = '') => {
    return getRequest(`/employee/statement/getStatements?limit=${pageItemLimit}&pageNo=${pageNo}&search=${search}&startDate=${startDate}&endDate=${endDate}`)
}

export const empStatementUpdateApi = (data) => {
    return putRequest(`/employee/statement/changeStatus`, data)
}

export const empDeleteStatementApi = (id) => {
    return deleteRequest(`/employee/statement/delete?_id=${id}`)
}