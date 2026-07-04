import { deleteRequest, getRequest, postRequest, putRequest, downloadRequest } from "../axiosConfig"


export const adminCreateOrUpdateStatmentApi = (data) => {
    return postRequest(`/admin/statement/createOrUpdate`, data)
}

export const adminAllStatmentApi = (pageItemLimit = "", pageNo = "", partnerId = "", empId = "", startDate = "", endDate = "", isPdf = false) => {
    return getRequest(`/admin/statement/all?limit=${pageItemLimit}&pageNo=${pageNo}&partnerId=${partnerId}&empId=${empId}&startDate=${startDate}&endDate=${endDate}&isPdf=${isPdf}`)
}

export const adminStatementsApi = (pageItemLimit = "", pageNo = "", startDate = "", endDate = "", search = "") => {
    return getRequest(`/admin/statement/getStatements?limit=${pageItemLimit}&pageNo=${pageNo}&search=${search}&startDate=${startDate}&endDate=${endDate}`)
}

export const adminAllStatementDownloadApi = (startDate = "", endDate = "", partnerId = "", empId = "") => {
    return downloadRequest(`/admin/statement/downloadAll?startDate=${startDate}&endDate=${endDate}&partnerId=${partnerId}&empId=${empId}`)
}

export const adminChangeStatementStatusApi = (data) => {
    return putRequest(`/admin/statement/changeStatus`, data)
}

export const adminDeleteStatementApi = (id) => {
    return deleteRequest(`/admin/statement/delete?_id=${id}`)
}