import { deleteRequest, getRequest, putRequest } from "../axiosConfig"



export const empGetLeadColumnApi = ({ }) => {
  return getRequest(`/employee/lead/all-lead-column`)
}

export const empAddOrUpdateLeadApi = (data) => {
  return putRequest(`/employee/lead/add-or-update-lead`, data)
}

export const empGetLeadRowsApi = ({ page = 1, limit = 10,isExport=false, filters = {},sortConfig={} }) => {
  const params = new URLSearchParams();

  params.append("pageNo", page);
  params.append("limit", limit);
  params.append("isExport",isExport)

  Object.keys(filters).forEach((key) => {
    const f = filters[key];

    if (f.type === "date") {
      if (f.from) params.append(`${key}_From`, f.from.toISOString());
      if (f.to) params.append(`${key}_To`, f.to.toISOString());
    } else {
      if (f.value) params.append(key, f?.value?.value ?? f.value);
    }
  });
  sortConfig && Object.keys(sortConfig)?.forEach((key)=>{
    if(key==="key") params.append("sortBy",sortConfig[key])
    if(key==="direction") params.append("orderBy",sortConfig[key])
})
  return getRequest(`/employee/lead/all-leads?${params.toString()}`)
}

export const empDeleteLeadRowsApi = ({ _id }) => {
  return deleteRequest(`/employee/lead/delete-lead-by-id?_id=${_id}`)
}