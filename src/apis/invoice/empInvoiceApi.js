import { deleteRequest } from "../axiosConfig"

export const empDeleteInvoiceById = (id) => {
  return deleteRequest(`/employee/invoice/deleteInvoiceById?_id=${id}`)
}

