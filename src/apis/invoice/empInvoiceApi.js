import { deleteRequest, downloadRequest, getRequest, postRequest, putRequest } from "../axiosConfig"

export const empDeleteInvoiceById = (id) => {
  return deleteRequest(`/employee/invoice/deleteInvoiceById?_id=${id}`)
}

export const employeeCreateInvoice = (data, clientId = '', caseId = '') => {
  return postRequest(`/employee/invoice/create?clientId=${clientId}&caseId=${caseId}`, data)
}

export const employeeViewAllInvoice = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "", type = "") => {
  return getRequest(`/employee/invoice/viewAll?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
}

export const employeeGetInvoiceById = (_id) => {
  return getRequest(`/employee/invoice/viewInvoiceById?_id=${_id}`)
}

export const employeeEditInvoice = (_id, data) => {
  return putRequest(`/employee/invoice/editInvoiceById?_id=${_id}`, data)
}

export const employeeEditInvoiceNoApi = (data) => {
  return putRequest(`/employee/invoice/editInvoiceNo`, data)
}

export const employeeOperationPaidInvoice = (data) => {
  return putRequest(`/employee/invoice/paidInvoiceById`, data)
}

export const employeeDownloadAllInvoiceApi = (searchQuery = "", startDate = "", endDate = "", type = true) => {
  return downloadRequest(`/employee/invoice/downloadAllInvoice?search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
}

export const employeeUnActiveInvoice = (_id, type) => {
  return putRequest(`/employee/invoice/unActiveInvoiceById?_id=${_id}&type=${type}`)
}

export const employeeDownloadInvoiceById = (_id) => {
  return downloadRequest(`/employee/invoice/downloadInvoiceById?_id=${_id}`)
}

export const employeeRemoveInvoice = (_id) => {
  return deleteRequest(`/employee/invoice/removeInvoiceById?_id=${_id}`)
}

export const empNextInvoiceNumber = () => {
  return getRequest(`/employee/invoice/nextInvoiceNumber`)
}