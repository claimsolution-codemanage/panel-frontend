import { deleteRequest, downloadRequest, getRequest, postRequest, putRequest } from "../axiosConfig"


export const adminCreateInvoiceApi = (data, clientId = '', caseId = '') => {
    return postRequest(`/admin/invoice/create?clientId=${clientId}&caseId=${caseId}`, data)
}

export const adminViewAllInvoiceApi = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
    return getRequest(`/admin/invoice/viewAll?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${true}`)
}

export const adminViewAllTrashInvoiceApi = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
    return getRequest(`/admin/invoice/viewAll?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${false}`)
}


export const adminDownloadAllInvoiceApi = (searchQuery = "", startDate = "", endDate = "", type = true) => {
    return getRequest(`/admin/invoice/downloadAllInvoice?search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
}

export const adminGetInvoiceByIdApi = (_id) => {
    return getRequest(`/admin/invoice/viewInvoiceById?_id=${_id}`)
}

export const adminEditInvoiceApi = (_id, data) => {
    return putRequest(`/admin/invoice/editInvoiceById?_id=${_id}`, data)
}

export const adminEditInvoiceNoApi = (data) => {
    return putRequest(`/admin/invoice/editInvoiceNo`, data)
}

export const adminPaidInvoiceApi = (data) => {
    return putRequest(`/admin/invoice/paidInvoiceById`, data)
}

export const adminUnactiveInvoiceApi = (_id, type) => {
    return putRequest(`/admin/invoice/unActiveInvoiceById?_id=${_id}&type=${type}`)
}

export const adminDeleteInvoiceApi = (_id, type) => {
    return deleteRequest(`/admin/invoice/deleteInvoice?_id=${_id}`)
}


export const adminNextInvoiceNumberApi = () => {
    return getRequest(`/admin/invoice/nextInvoiceNumber`)
}