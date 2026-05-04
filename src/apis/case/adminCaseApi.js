import { putRequest } from "../axiosConfig"


export const adminRenameCaseDocFolderApi = (data) => {
    return putRequest(`/admin/case/renameCaseDocFolder`, data)
}