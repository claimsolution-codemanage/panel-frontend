import { deleteRequest } from "../axiosConfig"

export const empDeleteTeamEmpAccountById = (id) => {
  return deleteRequest(`/employee/team/deleteTeamEmpAccount?_id=${id}`)
}

