import AllLeadComp from "../../components/allLeads/AllLeadComp";
import { adminGetSaleEmployee, } from "../../../../apis";
import { adminAddOrUpdateLeadApi, adminDeleteLeadRowsApi, adminGetLeadColumnApi, adminGetLeadRowsApi } from "../../../../apis/leads/adminLeadApi";


export default function AdminAllLeads() {
  return (<>
    <AllLeadComp
      getAllColumnApi={adminGetLeadColumnApi}
      addOrUpdateLeadApi={adminAddOrUpdateLeadApi}
      empGetLeadRowsApi={adminGetLeadRowsApi}
      getSaleEmp={adminGetSaleEmployee}
      deleteLeadApi={adminDeleteLeadRowsApi}
      hasDeleteAccess={true}

    />
  </>)
}