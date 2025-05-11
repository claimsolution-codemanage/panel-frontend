import ViewAllClient from "../../../components/Reuse/ViewAllClient";
import { employeeAllClient, empClientDownload, empOpGetSaleEmp } from "../../../apis";
import { useContext } from "react";
import { AppContext } from "../../../App";
import { empOpShareClientToSaleEmp } from "../../../apis";
export default function EmployeeAllClient() {
  const state = useContext(AppContext)
  const { empType, designation } = state?.myAppData?.details

  return (<>
    <ViewAllClient
      getList={employeeAllClient}
      listDownload={empClientDownload}
      endableEdit={empType?.toLowerCase() == "operation"}
      editPath={`/employee/edit-client`}
      enableClientShare={empType?.toLowerCase() == "operation"}
      shareClient={empOpShareClientToSaleEmp}
      getSaleEmp={empOpGetSaleEmp}
      changeBranchApi={()=>{}}
      deleteClientByIdApi={()=>{}}
      setClientStatusApi={()=>{}}
      enableChangeBranch={false}
      enableDeleteClient={false}
      enableClientStatus={false}
      showTooltip={empType?.toLowerCase() == "operation"}
      role="employee"
    />
  </>)
}