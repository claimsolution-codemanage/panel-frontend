import {adminShareClientToSaleEmp, adminSetClientStatus, allAdminClient,adminAllClientDownload,adminChangeBranch,adminGetSaleEmployee } from "../../../apis"
import ViewAllClient from "../../../components/Reuse/ViewAllClient"


export default function AllAdminClient() {
  return (<>
       <ViewAllClient
         getList={allAdminClient}
         listDownload={adminAllClientDownload}
         endableEdit={true}
         editPath={`/admin/edit-client`}
         viewPath={`/admin/client details`}
         enableClientShare={true}
         shareClient={adminShareClientToSaleEmp}
         getSaleEmp={adminGetSaleEmployee}
         changeBranchApi={adminChangeBranch}
         deleteClientByIdApi={()=>{}}
         setClientStatusApi={adminSetClientStatus}
         enableChangeBranch={true}
         enableDeleteClient={true}
         enableClientStatus={true}
         showTooltip={true}
         role="admin"
       />
  </>)
}