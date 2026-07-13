import { putRequest } from "../axiosConfig"


export const adminRenameCaseDocFolderApi = (data) => {
    return putRequest(`/admin/case/renameCaseDocFolder`, data)
}

export const adminEditCaseProcessById = (data) => {
    return putRequest(`/admin/case/editCaseProcessById`, data)
}