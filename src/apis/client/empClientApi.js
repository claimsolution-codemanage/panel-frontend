import { deleteRequest } from "../axiosConfig"

export const empDeleteClientById = (id) => {
  return deleteRequest(`/employee/client/deleteClientById?clientId=${id}`)
}

