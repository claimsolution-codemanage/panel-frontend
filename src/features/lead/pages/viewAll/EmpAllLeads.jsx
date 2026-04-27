import { useContext } from "react";
import { AppContext } from "../../../../App";
import AllLeadComp from "../../components/allLeads/AllLeadComp";
import { empAddLeadColumnApi, empAddOrUpdateLeadApi, empAddOrUpdateLeadFollowUpApi, empDeleteLeadRowsApi, empGetLeadColumnApi, empGetLeadFollowUpsApi, empGetLeadRowsApi, empUpdateLeadColumnApi } from "../../../../apis/leads/empLeadApi";
import { empOpGetSaleEmp } from "../../../../apis";


export default function EmployeeAllLeads() {
  const state = useContext(AppContext)
  const empType = state?.myAppData?.details?.empType
  return (<>
    <AllLeadComp
      addLeadColumnApi={empAddLeadColumnApi}
      updateColumnApi={empUpdateLeadColumnApi}
      getAllColumnApi={empGetLeadColumnApi}
      addOrUpdateLeadApi={empAddOrUpdateLeadApi}
      empGetLeadRowsApi={empGetLeadRowsApi}
      getSaleEmp={empOpGetSaleEmp}
      deleteLeadApi={empDeleteLeadRowsApi}
      hasDeleteAccess={empType?.toLowerCase() === "operation"}
      hasUpdateColumnAccess={empType?.toLowerCase() === "operation"}
      hasAddColumnAccess={empType?.toLowerCase() === "operation"}
      addOrUpdateLeadFollowUpApi={empAddOrUpdateLeadFollowUpApi}
      getLeadFollowUpsApi={empGetLeadFollowUpsApi}

    />
  </>)
}