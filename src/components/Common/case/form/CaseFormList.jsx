import React, { useEffect, useState } from 'react'
import { Button, Card,  } from 'react-bootstrap';
import {  Eye, EyeOff } from "lucide-react";
import FormDetailViewer from './FormDetailViewer';
import { FORM_CONFIG } from './formConfig';

const FORM_TYPE = {
   gro:"gro",
   ombudsman:"ombudsman",
   irdai:"irdai_stage",
   reimbursment:"reimbursment_claim_filing",
}

export default function CaseFormList({id,caseFormDetailApi,role, empType, isCaseFormAccess, getCaseById, status,formList,createOrUpdateApi, attachementUpload}) {
  const [openFormId, setOpenFormId] = useState(null);
  const [listItem,setListItem] = useState(Array.isArray(formList) ? formList : [])

  useEffect(()=>{
    const isForm = Object.keys(FORM_TYPE)?.find(ele=>status?.toLowerCase()?.includes(ele))
    if(isForm){
       const formType = listItem?.find(ele=>ele?.formType==FORM_TYPE[isForm])
       if(!formType){
        setListItem([...listItem,{formType:FORM_TYPE[isForm],_id:undefined,caseId:id}])
       }
    }
  },[status])

  const toggleForm = (formId) => {
    setOpenFormId((prev) => (prev === formId ? null : formId));
  };

    return (
    <div className="space-y-4">
      {listItem.map((form) => (
        <Card key={form._id} className="bg-color-1 my-5 p-2 p-md-3 rounded-2 shadow">
          <Card.Header className="d-flex align-items-center justify-content-between bg-white">
            <div>
            <h5 className="">{FORM_CONFIG?.[form.formType]?.title}</h5>
            </div>
            <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleForm(form._id)}
            >
              {openFormId === form._id ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" /> Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" /> View
                </>
              )}
            </Button>
            </div>
          </Card.Header>
          <div>
            {openFormId === form._id ? (
              <FormDetailViewer
                caseId={form.caseId}
                formId={form._id}
                caseFormDetailApi={caseFormDetailApi}
                formType={form?.formType}
                createOrUpdateApi={createOrUpdateApi} 
                attachementUpload={attachementUpload}
                getCaseById={getCaseById}
                isCaseFormAccess={isCaseFormAccess}
              />
            ) : ""}
          </div>
        </Card>
      ))}
    </div>
  )
}
