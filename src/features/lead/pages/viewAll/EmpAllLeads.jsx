import { useContext } from "react";
import { AppContext } from "../../../../App";
import AllLeadComp from "../../components/allLeads/AllLeadComp";
import { empAddOrUpdateLeadApi, empDeleteLeadRowsApi, empGetLeadColumnApi, empGetLeadRowsApi } from "../../../../apis/leads/empLeadApi";
import { empOpGetSaleEmp } from "../../../../apis";


export default function EmployeeAllLeads() {
  const state = useContext(AppContext)
  const empType = state?.myAppData?.details?.empType
  return (<>
    <AllLeadComp
      getAllColumnApi={empGetLeadColumnApi}
      addOrUpdateLeadApi={empAddOrUpdateLeadApi}
      empGetLeadRowsApi={empGetLeadRowsApi}
      getSaleEmp={empOpGetSaleEmp}
      deleteLeadApi={empDeleteLeadRowsApi}
      hasDeleteAccess={empType?.toLowerCase()==="operation"}

    />
  </>)
}