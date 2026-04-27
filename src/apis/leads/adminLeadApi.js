import { deleteRequest, getRequest, postRequest, putRequest } from "../axiosConfig"

export const adminGetLeadColumnApi = ({ }) => {
  return getRequest(`/admin/lead/all-lead-column`)
}

export const adminAddLeadColumnApi = (data) => {
  return postRequest(`/admin/lead/add-column`, data)
}

export const adminUpdateLeadColumnApi = (data) => {
  return putRequest(`/admin/lead/update-column`, data)
}

export const adminAddOrUpdateLeadApi = (data) => {
  return putRequest(`/admin/lead/add-or-update-lead`, data)
}

export const adminGetLeadRowsApi = ({ page = 1, limit = 10, isExport = false, filters = {}, sortConfig = {} }) => {
  const params = new URLSearchParams();

  params.append("pageNo", page);
  params.append("limit", limit);
  params.append("isExport", isExport)

  Object.keys(filters).forEach((key) => {
    const f = filters[key];

    if (f.type === "date") {
      if (f.from) params.append(`${key}_From`, f.from.toISOString());
      if (f.to) params.append(`${key}_To`, f.to.toISOString());
    } else {
      if (f.value) params.append(key, Array.isArray(f?.value) ? f?.value?.map(item => item?.value) : (f?.value?.value ?? f.value));
    }
  });
  sortConfig && Object.keys(sortConfig)?.forEach((key) => {
    if (key === "key") params.append("sortBy", sortConfig[key])
    if (key === "direction") params.append("orderBy", sortConfig[key])
  })
  return getRequest(`/admin/lead/all-leads?${params.toString()}`)
}

export const adminDeleteLeadRowsApi = ({ _id }) => {
  return deleteRequest(`/admin/lead/delete-lead-by-id?_id=${_id}`)
}

export const adminAddOrUpdateLeadFollowUpApi = (data) => {
  return postRequest(`/admin/lead/add-or-update-lead-follow-up`, data);
};

export const adminGetLeadFollowUpsApi = ({ leadId }) => {
  return getRequest(`/admin/lead/get-lead-follow-ups/${leadId}`);
};