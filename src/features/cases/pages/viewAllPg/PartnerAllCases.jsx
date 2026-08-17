import { partnerAllCaseDownload } from "../../../../apis"
import { allCasePartnerApi } from "../../../../apis/case/partnerCaseApi"
import { partnerAttachementUpload } from "../../../../apis/upload"
import ViewAllCaseComp from "../../components/viewAllComp/ViewAllCaseComp"


export default function AllPartnerCase() {
  return (<>
    <ViewAllCaseComp
      isBack={false}
      getCases={allCasePartnerApi}
      downloadCase={partnerAllCaseDownload}
      role={"partner"}
      setStatus={() => { }}
      setCaseStatus={() => { }}
      viewUrl={"/partner/view case/"}
      caseShare={() => { }}
      isResolvedAmt={true}
      isDownload={true}
      attachementUpload={partnerAttachementUpload}
    />
  </>)
}