import { deleteRequest } from "../axiosConfig"

export const empDeletePartnerById = (id) => {
  return deleteRequest(`/employee/partner/deletePartnerById?partnerId=${id}`)
}

